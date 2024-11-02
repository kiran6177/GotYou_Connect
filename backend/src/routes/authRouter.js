import express from "express";
import { changePassword, editProfile, login, logout, manageMFA, resendOtp, signup, verifyOtp } from "../controllers/authController.js";
import { isUserLogin } from "../middleware/authHandler.js";
import upload from "../utils/multer.js";

const authRouter = express.Router();

authRouter.route("/login")
.post(login)

authRouter.route("/signup")
.post(upload.single("profile"),signup)

authRouter.route("/logout")
.get(isUserLogin,logout)

authRouter.route("/profile")
.put(isUserLogin,upload.single("profile"),editProfile)

authRouter.route("/manageMFA")
.get(isUserLogin,manageMFA)

authRouter.route("/verifyotp")
.post(verifyOtp)

authRouter.route("/resendotp")
.post(resendOtp)

authRouter.route("/changepassword")
.put(isUserLogin,changePassword)

export default authRouter;
