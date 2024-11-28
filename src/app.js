const express=require('express');

/*

app.use -> matches all the HTTP method API calls to /test
app.get -> matches only the GET HTTP method API call to /test

*/ 

const app=express();

const {adminAuth}=require('./middlewares/auth')
const {userAuth}=require('./middlewares/auth')

app.use('/admin',adminAuth);


app.get('/user',userAuth,(req,res)=>{

    res.send("Welcome to the user page!!!");

});

app.get('/admin/dashboard',(req,res)=>{
    res.send("Welcome to the dashboard Admin!!!");
})

app.post('/admin/addUser',(req,res)=>{
    res.send("User added successfully!!!");
});

app.delete('/admin/deleteUser',(req,res)=>{
    res.send("User deleted successfully!!!");
});

app.listen(8000,()=>{
    console.log("listening on port",8000);
})