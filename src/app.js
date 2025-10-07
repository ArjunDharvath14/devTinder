const express=require('express');
const connectDB=require("./config/database");

const CookieParser=require('cookie-parser');
const app=express();

app.use(express.json());
app.use(CookieParser());
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDB()
.then(()=>{console.log("DataBase Connection Established");
    app.listen(1814,()=>{
    console.log("Server is Successfully listening on port 1814");})})
.catch((err)=>{console.error("Database is not connected")});
