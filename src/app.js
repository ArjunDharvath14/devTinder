const express=require('express');
const app=express();
app.get("/user",(req,res)=>{
    res.send({firstName:"Arjun",lastName:"Nayak"});
});
app.post("/user",(req,res)=>{
    res.send("Sent to DataBase Successfully");
});
app.delete("/user",(req,res)=>{
    res.send("Deleted from Database Successfully");
});
app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");
})