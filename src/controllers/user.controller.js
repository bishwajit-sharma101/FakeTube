import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async(userId)=>{
    
    try {
        const user = await User.findById(userId);
        
        const accessToken = user.generateAccessToken();
        const refreshToken =  user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
       await user.save({validateBeforeSave:false});

       return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token")    
    }
}


export const resgisterUser = asyncHandler(async (req,res)=>{

    const{fullName , username , password , email } = req.body;

    if([
        fullName,username,password,email
    ].some((field)=> field?.trim() === "")){
        throw new ApiError(400,"all fields are required");
    }

    const userExits  = await User.findOne({
        $or:[{ email }, { username }]
    })


    if(userExits) throw new ApiError(409,"user already exits");

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath) throw new ApiError(400,"avatarLocalPath required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(400,"avatar required");

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        userName:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) throw new ApiError(500,"something went wrong");

    return res.status(201).json(
        new ApiResponse(200,user,"user created")
    )

})

export const userLogIn = asyncHandler(async(req,res)=>{

    const {userName , email ,password} = req.body;

    if((!userName && !email) || !password) throw new ApiError(400,"email or password is required");

    const userFound = await User.findOne({
        $or:[{email},{userName}]
    })

    if(!userFound) throw new ApiError(404,"user does not exits");

    const isPasswordValid = await userFound.isPasswordCorrect(password);

    if(!isPasswordValid) throw new ApiError(401,"invalid user credentials");
    
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(userFound._id);

    const loggedInUser = await User.findById(userFound._id).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true,
        sameSite:"lax"
    }

    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "logged in succesfully"
        )
    )


})

export const logOut = asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )


    
    const options = {
        httpOnly:true,
        secure:true,
        sameSite:"lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,{},"user LoggedOut"
        )
    )

})