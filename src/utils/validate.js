const validator=require('validator');

const validateSignup=(req)=>{

    const {firstName,lastName,emailId,password,age,gender}=req.body;

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

module.exports={validateSignup};