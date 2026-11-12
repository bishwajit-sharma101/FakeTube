import { Router } from "express";
import { resgisterUser,userLogIn,logOut } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.post("/register",upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),resgisterUser)

authRouter.post("/login", userLogIn);
authRouter.post("/logout",verifyJwt,logOut)

export default authRouter;