dotenv.config({
    path:"./.env"
});

import dbConnect from "./db/index.js";
import dotenv from 'dotenv'
import app from "./app.js";



dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server connect on ${process.env.PORT}`);
        
    })
}).catch((err)=>{
    console.log("error in index.js",err);
    
})