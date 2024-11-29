const mongoose=require('mongoose');

const connectDB=async ()=>{
    await mongoose.connect(
        
        "mongodb+srv://surajmarkup:Qazwsxedc123@cluster0.lwsst.mongodb.net/DevTinder?retryWrites=true&w=majority&appName=Cluster0"        
        
    );
};

module.exports=connectDB;
