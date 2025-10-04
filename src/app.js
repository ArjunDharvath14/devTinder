const express=require('express');
const app=express();
const {adminAuth}=require("./middlewares/Auth");
app.use("/userData",(req,res)=>{
    throw new Error;

})
app.use("/",(err,req,res,next)=>{
    if(err)
    {
        res.status(500).send("Something went wrong");
    }
})

app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");
})