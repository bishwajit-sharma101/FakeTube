import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async(req,_,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

    if(!token) throw new ApiError(401,"unauthorized request");

    const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select("-password -refreshToken");

    if(!user) throw new ApiError(401,"invalid accessToken");

    req.user = user;
    
    next();

})
