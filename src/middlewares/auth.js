
const jwt=require("jsonwebtoken");
const {User}=require("../model/user");
// module: A special object that represents the current module.
// exports: A property of the module object that is initially an empty object.
// module.exports: A reference to the exports object. You can assign a new value to module.exports directly to export a single value, or you can add properties to the exports object to export multiple values.
// require(): The function used to import a module. It returns the module.exports object of the imported module.




const userAuth= async (req,res,next)=>{
    try{
        const cookies=req.cookies;

        const token=cookies.Token;
        // console.log(token);
        if(!token){
            throw new Error("Invalid token please login first!!!");
        }
        const decodeValue=await jwt.verify(token,"secret");
        const {_id}=decodeValue;

        const user=await User.findById(_id);
        if(!user){
            throw new Error("You are not authorized to access this.");
        }

        req.user=user;
        next();
    }
    catch(err){
        res.status(400).send("Error: " + err.message);
    }
}

module.exports={

    userAuth,
}

