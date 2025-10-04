const express=require('express');
const app=express();
app.use("/test",(req,res)=>{
    res.send("Hello from Dashboard");
})
app.use("/",(req,res)=>{
    res.send("Hello from Server");
})
app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");
})