import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

export const resgisterUser = asyncHandler(async (req,res)=>{

    const{fullName , username , password , email } = req.body;

    if([
        fullName,username,password,email
    ].some((field)=> field?.trim() === "")){
        throw new ApiError(400,"all fields are required");
    }

    const userExits  = await User.find({
        $or:[{ email }, { username }]
    })


    if(userExits) throw new ApiError(409,"user already exits");

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) throw new ApiError(400,"coverImage required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(400,"coverImage required");

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) throw new ApiError(500,"something went wrong");

    return res.status(201).json(
        new ApiResponse(200,user,"user created")
    )

})