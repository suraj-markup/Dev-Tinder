const validator=require('validator');
const bcrypt=require('bcrypt');


const validateSignup=(req)=>{

    const {firstName,lastName,emailId,password,age,gender,photoUrl}=req.body;

    if(!firstName){
        throw new Error("First name must be provided!!!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Please enter a valid email address!!!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!!!");   
    }

}

const validateEdit=(req)=>{
    
    const editableFields =["firstName","lastName","age","skills","gender","about","photoUrl"];

    const isAllowed= Object.keys(req.body).every((field)=>editableFields.includes(field));

    return isAllowed;
}

const hashThePassword = async (password)=>{
    const hashedPassword=await bcrypt.hash(password,10);
    return hashedPassword;
}

module.exports={validateSignup,
    validateEdit,
    hashThePassword
};