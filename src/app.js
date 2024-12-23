const express=require('express');
const connectDB=require('./config/database');
const {User}=require('./model/user');
const {validateSignup}=require('./utils/validate');
const bcrypt = require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middlewares/auth");
const req = require('express/lib/request');

const app=express();

app.use(express.json());
app.use(cookieParser());


/*

app.use -> matches all the HTTP method API calls to /test
app.get -> matches only the GET HTTP method API call to /test

*/ 

app.post('/signup',async (req,res)=>{
    try{ 
    // validation the data
    validateSignup(req);

    const {firstName,lastName,emailId,password,age,gender}=req.body;

    //encrypt the password
    const hashpassword =await bcrypt.hash(req.body.password,10);
    console.log(hashpassword);

    console.log(req.body);
    //creating a new instance of the user model
    
    
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:hashpassword,
        age,
        gender

    });
        if(user.skills?.length>10){
            throw new Error("No more than 10 skills can be added!!!!");
        }

        await user.save();
        res.status(200).send("user Added successfully!!!");
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

app.post('/signin',async (req,res)=>{
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
       
        res.send("Login Successfull!!!");
      }
      else{
        console.log(user);
        throw new Error("Invalid Credentials!!!");
      }
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});

app.get("/profile",userAuth, async (req,res)=>{
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

app.post("/sendConnection",userAuth,(req,res)=>{

    const user=req.user;
    res.send(user.firstName+ " sent the connection request.");

});



connectDB()
    .then(()=>{
        app.listen(8000,()=>{
            console.log("listening on port",8000);
        })
         console.log("Database is connected Successfully!!!");
    })
    .catch((err)=>{
        console.log("Error in connecting to the Database!!!");
        console.log(err);
    });


