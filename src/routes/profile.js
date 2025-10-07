const express=require('express');
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/Auth");
const { validateEditProfileData } = require('../utils/validation');
const bcrypt=require('bcrypt');
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
    const user=req.user;
    res.send(user);}
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
});
profileRouter.patch("/profile/edit",userAuth,async (req,res) => {
    try{
        if(!validateEditProfileData(req))
        {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
        await loggedInUser.save();
        res.json({message:`${loggedInUser.firstName}, your profile updated SuccessFully`,data:loggedInUser,});
    }
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
});
profileRouter.patch("/profile/password",userAuth,async (req,res) => {
    try{const user=req.user;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(req.body.oldPassword,passwordHash);
    if(!isPasswordValid)
    {
        throw new Error("invalid Old password");
    }
    user.password=await bcrypt.hash(req.body.newPassword,10);
    await user.save();
    res.send("password changed successfully");}
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
})

module.exports=profileRouter;