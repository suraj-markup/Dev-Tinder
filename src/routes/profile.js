const express=require('express');
const {User}=require('../model/user');
const {userAuth}=require("../middlewares/auth");


const profileRouter=express.Router();


profileRouter.get("/profile/view",userAuth, async (req,res)=>{
    try{

        // console.log("logged in user is : " + user.firstName + " " + user.lastName);
        const user=req.user;
        // console.log(decodedValue);
        res.send(user);
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
});

module.exports=profileRouter;