import mongoose from "mongoose";
import { dbName } from "../constants.js";
import app from "../app.js";

const dbConnect = async()=>{
    try {
        const connectionInstance = mongoose.connect(`${process.env.MONGO_URL}/${dbName}`);
        console.log(`mongodb connected ${(await connectionInstance).Connection}`);
        app.on("error",(error)=>{
            console.log("Express failed to communicate with the DB",error);
            throw error;
        })
    } catch (error) {
        console.log("error",error);
        process.exit(1);
    }
}

export default dbConnect;