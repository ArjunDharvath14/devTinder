const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user");
const app=express();
app.post("/signup", async(req,res)=>{
    const user=new User({
        firstName:"Virat",
        lastName:"kohli",
        emailId:"viratKohli@gmail.com",
        password:"virat@123"
    });
     await user.save();
     res.send("User Added SuccessFully");
})

connectDB()
.then(()=>{console.log("DataBase Connection Established");
    app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");})})
.catch((err)=>{console.error("Database is not connected")});
