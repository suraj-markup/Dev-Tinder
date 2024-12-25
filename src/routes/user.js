const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middlewares/auth');
const {ConnectionRequest}=require('../model/connectionRequest');
const { User } = require('../model/user');

const safe_label=["firstName","lastName","photoUrl","age","about","skills"];

userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
    try{

        const loggedInUser=req.user;
        const connection=await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","about","skills"]);

        if(connection.length===0){
            return res.send({message:"Currently you don't have any connection requests."});
        }
        // console.log(connection);

        res.send({message:"Data fetched successfully",
            data:connection
        })
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }

});

userRouter.get("/user/connection",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user;
        const allConnections=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
            ]
        })
        .populate("fromUserId",safe_label)
        .populate("toUserId",safe_label);

        if(allConnections.length===0){
            return res.send("You don't have any connections yet!!!");
        }

        const data= allConnections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            else{
                return row.fromUserId;
            }

        });

        

        res.send({
            message:`${loggedInUser.firstName} you have ${allConnections.length} connections`,
            data:data
        });

    }
    catch(err){
        res.status(400).send("ERROR: "+err.messsage);
    }
});

userRouter.get("/feed",userAuth,async (req,res)=>{

    try{
        const loggedInUser=req.user;
        const page=req.query.page|| 1;
        let limit = req.query.limit||10;
        limit>50?50:limit;
        const skip=(page-1)*limit;
        const allConnections=await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsers=new Set();
        allConnections.forEach((connection)=>{
            hideUsers.add(connection.fromUserId.toString());
            hideUsers.add(connection.toUserId.toString());
        });
        // console.log(hideUsers);

        const feedUsers=await User.find({
            $and:[
                {_id : { $nin : Array.from(hideUsers) } },
                {_id : { $ne : loggedInUser._id } }
            ]
        }).select(safe_label).skip(skip).limit(limit);


        res.send(feedUsers);

    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }

});




module.exports = userRouter;
