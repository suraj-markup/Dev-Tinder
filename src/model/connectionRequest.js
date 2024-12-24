const mongoose=require('mongoose');

const ConnectionRequestSchema= new mongoose.Schema({
    fromUserId: {
        type:mongoose.Types.ObjectId,
        required:true,
        index:true
    },
    toUserId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    status:{
        type:'String',
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            messsage:`{VALUE} is incorrect status type`
        }
    }

},
{
    timestamps:true,
})


ConnectionRequestSchema.pre("save", function(next){

    const connectionRequest= this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send request to yourself");
    }
    next();


})

const ConnectionRequest=mongoose.model("ConnectionRequestMode",ConnectionRequestSchema);

module.exports = {ConnectionRequest};