const adminAuth=(req,res,next)=>{
    const token="abc";
    const isAuthorized=(token==='abc');
    if(!isAuthorized){
        res.status(401).send("You are not authorized as admin!!!");
    }
    else{
        next();
    }
}


const userAuth=(req,res,next)=>{
    const token="xyz";
    const isAuthorized=(token==='xyz');
    if(!isAuthorized){
        res.status(401).send("You are not authorized to acces this feature!!!");
    }
    else{
        next();
    }
}

module.exports={
    adminAuth,
    userAuth,
}