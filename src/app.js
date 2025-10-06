const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user");
const app=express();
app.use(express.json());
app.post("/signup", async(req,res)=>{
    try{
        const user=new User(req.body);
        await user.save();
        res.send("User Added SuccessFully");

     }
     catch(err){
        res.status(404).send("something went wrong");
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
app.patch("/user",async(req,res)=>{
    try{
        const userId=req.body.userId;
        const data=req.body;
        await User.findByIdAndUpdate(userId,data,{runValidators:true});
        res.send("user updated successfully")

    }
    catch(err){
        res.status(404).send("something went wrong");
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
