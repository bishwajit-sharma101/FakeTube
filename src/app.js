import 'dotenv/config';

import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin:process.env.Cors_Origin,
    Credential:true
}))


app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//basic route

app.get("/",(req,res)=>{
    res.send("hello")
})

//importing routers

import authRouter from "./routes/user.routes.js";

//route declaratiom

app.use("/api/v1/users",authRouter)


export default app;