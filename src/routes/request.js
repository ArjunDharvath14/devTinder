const express=require('express');
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/Auth");
const User=require("../models/user");
const connectionRequest = require('../models/connectionRequest');
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status))
        {
            return res.status(400).json({message:"Invalid Status Type "+status});
        }
        const toUser= await User.findById(toUserId);
        if(!toUser)
        {
            return res.status(400).json({message:"User not Found"});
        }
        const existingConnectionRequest=await connectionRequest.findOne({
             $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
             ]
        });
        if(existingConnectionRequest){
           return  res.status(400).send({message:"Connection request already sent!"});
        }
        const ConnectionRequest=new connectionRequest({
            fromUserId,toUserId,status
        });
        const data= await ConnectionRequest.save();
        res.json({message:"Connection Saved SuccessFully",data});

    }
    
   catch(err){
        res.status(404).send("Error:"+err.message);
     }
});
requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res) => {
    try{
    const loggedInUser=req.user;
    const {status,requestId}=req.params;
    const statusAllowed=["accepted","rejected"];
    if(!statusAllowed.includes(status))
    {
        res.status(400).json({message:"Status not Allowed!"});
    }
    const connectionRequests= await connectionRequest.findOne({
        _id:requestId,
        status:"interested",
        toUserId:loggedInUser._id,
    });
    if(!connectionRequests)
    {
        res.status(404).json({message:"Connection request not found!"});
    }
    connectionRequests.status=status;
    const data=await connectionRequests.save();
    res.json({message:"Connection Request "+status,data});
     }
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
    
})

module.exports=requestRouter;
