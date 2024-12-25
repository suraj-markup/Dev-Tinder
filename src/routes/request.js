const express=require('express');
const {User}=require('../model/user');
const {ConnectionRequest}=require('../model/connectionRequest');
const {userAuth}=require("../middlewares/auth");


const requestRouter=express.Router();

requestRouter.post("/request/send/:status/:userId",userAuth,async (req,res)=>{
    try{
        const user=req.user;
        const fromUserId=user._id;
        const toUserId=req.params.userId;
        const status=req.params.status;
        
        const toUser=await User.findById(toUserId);
        if(!toUser){
            throw new Error("The user you are trying to send request does not exist!!!");
        }

        const allowedStatus=["ignored","interested"];

        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status: " + status);
        }

        const duplicate=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(duplicate){
            throw new Error("The request cannot be sent as you might have already sent or you might have received a request from the user.");
        }


        const request=new ConnectionRequest({
            fromUserId,toUserId,status
        });


        const data=await request.save();
        if(status==='ignored'){
            res.send({message:`${user.firstName} you ignored ${toUser.firstName}`,
                data:data});

        }
        else{
            res.send({message:`${user.firstName} you are interested in  ${toUser.firstName}`,
                data:data});

        }
    }

    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});


requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try{

        const loggedInUser=req.user;

        const {status,requestId}=req.params;

        const isPresent=await ConnectionRequest.findById(requestId);
        if(!isPresent) {
            throw new Error("The request you are trying to access is not present");
        }

        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error ("Invalid status");
        }

        const request = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });
        if(!request){
            throw new Error("Invalid connection Request");
        }

        request.status=status;

        const data=await request.save();

        res.send({message:`${loggedInUser.firstName}, you ${status} the connection request.`,data:data});

    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});

module.exports=requestRouter;