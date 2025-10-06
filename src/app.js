const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require('bcrypt');
const app=express();
app.use(express.json());
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
