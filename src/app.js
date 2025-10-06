const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require('bcrypt');
const CookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const app=express();
const {userAuth}=require("./middlewares/Auth");
app.use(express.json());
app.use(CookieParser());
app.post("/signup", async(req,res)=>{
    try{
        validateSignUpData(req);
        const {firstName,lastName,password,emailId}=req.body;
        const passwordHash= await bcrypt.hash(password,10);
        const user=new User({
            firstName,lastName,emailId,password:passwordHash,
        });
        await user.save();
        res.send("User Added SuccessFully");

     }
     catch(err){
        res.status(404).send("Error:"+err.message);
     }
});
app.post("/login",async (req,res) => {
    try{
        const {emailId,password}=req.body;
        const user= await User.findOne({emailId:emailId});
        if(!user)
        {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid=await user.validatePassword(password);
        if(!isPasswordValid)
        {
            throw new Error("Invalid Credentials");
        }
        const token= await user.getJWT(); 
        res.cookie("token",token);
        res.send("Login SuccessFul");
    }
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
});
app.get("/profile",userAuth,async(req,res)=>{
    try{
    const user=req.user;
    res.send(user);}
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
});
app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user=req.user;
    res.send(user.firstName+" sent connection request");
})
connectDB()
.then(()=>{console.log("DataBase Connection Established");
    app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");})})
.catch((err)=>{console.error("Database is not connected")});
