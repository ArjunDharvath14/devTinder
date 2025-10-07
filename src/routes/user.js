const express=require('express');
const userRouter=express.Router();
const {userAuth}=require("../middlewares/Auth");
const connectionRequest = require('../models/connectionRequest');

userRouter.get("/user/requests/received",userAuth,async (req,res) => {
    try{const loggedInUser=req.user;
    const data= await connectionRequest.find({toUserId:loggedInUser._id,status:"interested"}).populate("fromUserId", ["firstName","lastName"]);;
    res.json({message:"all the requests",data});}
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
    
});
module.exports=userRouter;