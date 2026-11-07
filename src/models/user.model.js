import mongoose, {Schema,model, mongo} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        maxlength:40,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        minlength:12,
        maxlength:30
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:30,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    
    refreshToken:{
        type:String
    }

},{timestamps:true})

userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            userName,
            email,
            fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User",userSchema);