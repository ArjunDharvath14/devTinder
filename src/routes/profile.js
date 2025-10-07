const express=require('express');
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/Auth");
profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
    const user=req.user;
    res.send(user);}
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
});

module.exports=profileRouter;