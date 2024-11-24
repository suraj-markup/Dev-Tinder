const express=require('express');

const app=express();

app.use("/home",(req,res)=>{
    res.status(200).send("welcome home");
})
app.use((req,res)=>{
    res.status(200).send("to go to home go to /home");
})

app.listen(8000,()=>{
    console.log("listening on port",8000);
})