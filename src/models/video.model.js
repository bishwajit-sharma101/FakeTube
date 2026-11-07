import mongoose, {Schema,model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videSchema = new Schema({
    video:{
        type:String,
        required:true,    
    },
    thumnail:{
        type:String,
        required:true,    
    },
    title:{
        type:String,
        required:true,    
    },
    description:{
        type:String,
        required:true,    
    },
    duration:{
        type:Number,
        required:true,    
    },
    views:{
        type:Number,
        default:0  
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
})

videSchema.plugin(mongooseAggregatePaginate)


export const Video = model("Video", videSchema);