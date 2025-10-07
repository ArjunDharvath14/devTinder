const express=require('express');
const userRouter=express.Router();
const {userAuth}=require("../middlewares/Auth");
const connectionRequest = require('../models/connectionRequest');
const User=require("../models/user");
const SAFE_DATA="firstName lastName age gender about skills photoUrl"
userRouter.get("/user/requests/received",userAuth,async (req,res) => {
    try{const loggedInUser=req.user;
    const data= await connectionRequest.find({toUserId:loggedInUser._id,status:"interested"}).populate("fromUserId", ["firstName","lastName"]);;
    res.json({message:"all the requests",data});}
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
    
});
userRouter.get("/user/connections",userAuth,async (req,res) => {
    try{
        const loggedInUser=req.user;

        const connectionRequests= await connectionRequest.find({
           $or: [
            {toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"},
           ]
        }).populate("fromUserId",SAFE_DATA).populate("toUserId",SAFE_DATA);
        const data=connectionRequests.map((value)=>{
            if(value.fromUserId._id.toString()===loggedInUser._id.toString())
            {
                return value.toUserId;
            }
            return value.fromUserId;})
        res.json({data});

    }
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
    
});
userRouter.get("/feed",userAuth,async (req,res) => {
    try{
        const page=parseInt(req.query.page)|| 1;
        const limit=parseInt(req.query.limit)|| 10;
        limit=limit>50 ? 50 :limit;
        const skip=(page-1)*limit;
         const loggedInUser=req.user;
         const connectionRequests=await connectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
         }).select("fromUserId toUserId");
         const hiddenUsersFromFeed=new Set();
         connectionRequests.map((req)=>{
            hiddenUsersFromFeed.add(req.fromUserId.toString());
            hiddenUsersFromFeed.add(req.toUserId.toString());
         });
         const users= await User.find({
            $and:[{_id:{$nin: Array.from(hiddenUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}],   
         }).select(SAFE_DATA).skip(skip).limit(limit);
        res.send(users);
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
});

module.exports=userRouter;