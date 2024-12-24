const express=require('express');
const {User}=require('../model/user');
const {userAuth}=require("../middlewares/auth");


const requestRouter=express.Router();

requestRouter.post("/sendConnection",userAuth,(req,res)=>{

    const user=req.user;
    res.send(user.firstName+ " sent the connection request.");

});

module.exports=requestRouter;