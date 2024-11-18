import { NextFunction, Request, Response } from "express";
import { CustomError } from "../interfaces/customError.js";

export const errorHandler = async (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("ERROR HANDLER :", err);
  res
    .status(err.statusCode || 500)
    .json({ error: err.reasons || err.message || "Something Went Wrong!!" });
};
