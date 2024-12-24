const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");


const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxLength:50,
        minLength:3,
        trim:true
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        lowercase:true,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid emailId '+value);
            }
        },
        trim:true
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Not a strong password '+value);
            }
        },
    },
    age:{
        type:Number,
        min:16,
        max:60
    },
    gender:{
        type:String,
        enum:{
            values:['male','female','other'],
            message:`{VALUE} is not a valid gender.`
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid photo url '+value);
            }
        },
    },
    about:{
        type:String,
        default:"This is a default description of user.",
        validate(value){
            if(value.lenght>200){
                throw new Error("Write your description in less than 200 characters.")
            }
        }
    },
    skills:{
        type:[String],
        validate(value){
            if(value.lengt>5){
                throw new Error("You can add upto 10 skills only.")
            }
        }
    }


},
{
    timestamps: true 
});

userSchema.methods.getJWT=async function(){

    const user =this;
    // console.log(user);
    const token = await jwt.sign({_id:user._id},"secret",{expiresIn:"7d"});
    // console.log(token);
    return token;

}

userSchema.methods.passwordValidate=async function(passwordByUser){
    const user=this;
    const hashPassword=user.password;
    // console.log(passwordByUser);
    //     console.log(user.password);
    const ispasswordValid=await bcrypt.compare(passwordByUser,hashPassword);

    return ispasswordValid;
}

const User=mongoose.model('User',userSchema);

module.exports={User};
