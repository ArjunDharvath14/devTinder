const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user");
const app=express();
app.use(express.json());
app.post("/signup", async(req,res)=>{
    const user=new User(req.body);
     await user.save();
     res.send("User Added SuccessFully");
})

connectDB()
.then(()=>{console.log("DataBase Connection Established");
    app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");})})
.catch((err)=>{console.error("Database is not connected")});
