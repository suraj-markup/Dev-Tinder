const express=require('express');
const connectDB=require('./config/database');
const bcrypt = require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const req = require('express/lib/request');
const cors=require('cors');

const app=express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }));

app.use(express.json());
app.use(cookieParser());

/*

app.use -> matches all the HTTP method API calls to /test
app.get -> matches only the GET HTTP method API call to /test

*/ 


const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/request');
const userRouter=require('./routes/user');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);


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


