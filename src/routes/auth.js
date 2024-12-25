const express=require('express');
const {validateSignup,hashThePassword}=require('../utils/validate');
const {User}=require('../model/user');
const bcrypt = require("bcrypt");

const authRouter =express.Router();


authRouter.post('/signup',async (req,res)=>{
    try{ 
    // validation the data
    validateSignup(req);

    const {firstName,lastName,emailId,password,age,gender,skills,about}=req.body;

    //encrypt the password
    
    const hashpassword =await hashThePassword(password);    
    // console.log(hashpassword);

    // console.log(req.body);
    //creating a new instance of the user model
    
    
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:hashpassword,
        age,
        gender,
        skills,
        about

    });
        if(user.skills?.length>10){
            throw new Error("No more than 10 skills can be added!!!!");
        }
        if(user.about?.length>200){
          throw new Error("Write your description in less than 200 characters.!!!!");
      }

        await user.save();
        res.status(200).send("user Added successfully!!!");
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

authRouter.post('/signin',async (req,res)=>{
    try{
      const {emailId,password}=req.body;
      const user=await User.findOne({emailId:emailId});
      if(!user){
        throw new Error("Invalid Credentials!!!");
      }
      const isPasswordValid=await user.passwordValidate(password);
    //   console.log(isPasswordValid);

      if(isPasswordValid){

        const token=await user.getJWT();
        // console.log(token);

        res.cookie("Token",token,{expires: new Date(Date.now()+ 7*24*60*60*1000)});
       
        res.send(`${user.firstName} you are loggedin Successfully!!!`);
      }
      else{
        // console.log(user);
        throw new Error("Invalid Credentials!!!");
      }
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});

authRouter.post('/logout', async (req,res)=>{
  res
  .cookie("Token",null,{expires:new Date(Date.now())})
  .send("You are logged out successfully!!!")
  
})

module.exports=authRouter;
