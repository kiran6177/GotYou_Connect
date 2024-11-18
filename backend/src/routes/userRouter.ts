import express from "express";
import authRouter from "./authRouter.js";

const userRouter = express.Router();

userRouter.use("/auth",authRouter)


export default userRouter;
