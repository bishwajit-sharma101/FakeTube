import dbConnect from "./db/index.js";
import dotenv from 'dotenv'
import app from "./app.js";

dotenv.config();

dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server connect on ${process.env.PORT}`);
        
    })
}).catch((err)=>{
    console.log(err);
    
})