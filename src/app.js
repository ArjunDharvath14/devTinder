const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require('bcrypt');
const CookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const app=express();
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
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid)
        {
            throw new Error("Invalid Credentials");
        }
        const token=jwt.sign({_id:user._id},"DEV@TINDER14");
        res.cookie("token",token);
        res.send("Login SuccessFul");
    }
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
})
app.get("/profile",async(req,res)=>{
    try{const cookie=req.cookies;
    const {token}=cookie;
    if(!token)
    {
        throw new Error("Token is not valid");
    }
    const decodedMessage=await jwt.verify(token,"DEV@TINDER14");
    const {_id}=decodedMessage;
    const user= await User.findById(_id);
    if(!user)
    {
        throw new Error("User does not exist");
    }
    res.send(user);}
    catch(err){
        res.status(404).send("Error:"+err.message);
     }
})
app.delete("/user", async(req,res)=>{
    try{
        const userId=req.body.userId;
        const user=await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully")

    }
    catch(err){
        res.status(404).send("something went wrong");
     }
})
app.patch("/user/:userId",async(req,res)=>{
    try{
        const userId=req.params?.userId;
        const data=req.body;
        const Allowed_Updates=["skills","age","about","gender","photoUrl"];
        const isAllowed=Object.keys(data).every((k)=>Allowed_Updates.includes(k));
        if(!isAllowed)
        {
            throw new Error("Update is not Allowed");
        }
        if(data.skills.length>10)
        {
            throw new Error("Skills Can't be more than 10");
        }
        await User.findByIdAndUpdate(userId,data,{runValidators:true});
        res.send("user updated successfully")

    }
    catch(err){
        res.status(404).send("Update Failed:"+err.message);
     }
})
app.get("/user", async(req,res)=>{
    try{const userEmail=req.body.emailId;
    const users=await User.find({emailId:userEmail});
    if(users.length===0)
    {
        res.status(404).send("User Not Found");
    }
    else{
        res.send(users);
    }
    }
    catch(err){
        res.status(404).send("something went wrong");
     }
});
app.get("/feed",async(req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(404).send("something went wrong");
     }
})

connectDB()
.then(()=>{console.log("DataBase Connection Established");
    app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");})})
.catch((err)=>{console.error("Database is not connected")});
