const express=require('express');
const connectDB=require('./config/database');
const {User}=require('./model/user');
/*

app.use -> matches all the HTTP method API calls to /test
app.get -> matches only the GET HTTP method API call to /test

*/ 

const app=express();

app.post('/signup',async (req,res)=>{
    const userObj={
        firstName:"Rajneesh",
        lastName:"yadav",
        emailId:"rajneesh65@gmail.com",
        password:"Password",
        age:18,
        gender:"Male",
    }
    
    const user=new User(userObj);
    try{ 
        await user.save();
        res.status(200).send(user);
    }
    catch(err){
        res.status(400).send("Error in creating user!!!");
    }
})

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


