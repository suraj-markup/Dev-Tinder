const express=require('express');
const connectDB=require('./config/database');
const {User}=require('./model/user');
const {validateSignup}=require('./utils/validate');
const bcrypt = require("bcrypt");
const app=express();

app.use(express.json());


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
      const user=await findOne({emailId:emailId});
      if(!user){
        throw new Error("Invalid Credentials!!!");
      }
      const isPasswordValid=await bcrypt.compare(password,user.password);

      if(!isPasswordValid){
        throw new Error("Invalid Credentials!!!");
      }
      res.send("Login Successfull!!!");
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }

});



app.get("/feed",async (req,res)=>{
    const data=await User.findOne({});
    try{
        if(data.length===0){
            res.status(400).send("No data found!!!");
        }
        else{
            console.log(data);
            res.status(200).send(data);
        }
    }
    catch(err){
        res.status(400).send("Error in fetching data!!!");
    }

});

app.delete('/deleteUser', async (req,res)=>{
    console.log(req.body.firstName);
    try{

        const deleting=await User.deleteOne({firstName:req.body.firstName});
        console.log(deleting);
        res.send("deleted successfully!!!")
    }
    catch(err){
        res.status(500).send("Something went worng while deleting data of user");
    }
})

app.patch('/user', async (req,res)=>{
 
    const data=req.body;
    const userId=req.body.userId;
    try{
        const Allowed_updates=["age","about","photoUrl","skills","password","gender"];
        const isUpdateAllowed=Object.keys(data).every((k)=>Allowed_updates.includes(k));

        const update=await User.findByIdAndUpdate(userId,data,{returnDocument:'before',runValidators:true});
        if(data?.skills.length>100){
         throw new Error("No more than 10 skills can be added!!!!");
        }
        console.log(update);
        res.send(update);

    }
    catch(err){
        res.status(400).send("Something went wrong while updating the data." + err.message);
    }

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


