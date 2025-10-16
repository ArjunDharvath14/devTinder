const express=require('express');
const connectDB=require("./config/database");

const CookieParser=require('cookie-parser');
const cors=require('cors');
const app=express();
app.use(cors({origin:"http://localhost:5173",credentials:true,}));
app.use(express.json());
app.use(CookieParser());
require('dotenv').config();
const port = process.env.PORT;
const dbUrl = process.env.DB_URL;
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB()
.then(()=>{console.log("DataBase Connection Established");
    app.listen(port,()=>{
    console.log("Server is Successfully listening on port "+port);})})
.catch((err)=>{console.error("Database is not connected")});
