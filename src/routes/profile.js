const express=require('express');
const {User}=require('../model/user');
const {userAuth}=require("../middlewares/auth");
const {validateEdit,hashThePassword}=require("../utils/validate");
const bcrypt=require("bcrypt");
const validator=require("validator");

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

profileRouter.patch("/profile/edit",userAuth, async (req,res)=>{

    try{

        if(!validateEdit(req)){
            throw new Error("You are trying to change a field that cannot be changed");
        }

        const loggedInUser=req.user;

        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);

        await loggedInUser.save();

        res.json({message:`${loggedInUser.firstName} your profile is updated successfully!!!`,
            data:loggedInUser
        });

    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});

profileRouter.patch('/profile/password',userAuth, async (req,res)=>{
    try{

        const user=req.user;
        
        const newPassword=req.body.password;
        
        
        const isSame=await user.passwordValidate(newPassword);
        if(isSame){
            throw new Error ("New password cannot be same as old password");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error ("The password is not strong, make a strong password");        
        }
        
        user.password=await hashThePassword(newPassword);
        user.save();

        res.send(`${user.firstName} your password has been updated. `)


    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }


});

module.exports=profileRouter;