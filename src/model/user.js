const mongoose=require('mongoose');
const validator=require('validator');



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
        validate(value){
            if(!["male", "female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
           
        },
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
        default:"This is a default description of user."
    },
    skills:{
        type:[String],
    }


},
{
    timestamps: true 
});

const User=mongoose.model('User',userSchema);

module.exports={User};
