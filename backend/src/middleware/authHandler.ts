import { NextFunction, Request, Response } from "express";
import {
  createToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { CustomError } from "../interfaces/customError.js";

export const isUserLogin = async (req : Request, res : Response, next : NextFunction) => {
  try {
    
    if (req.headers && req.headers["authorization"]) {
      const access_token = req.headers["authorization"].split(" ")[1];
      const decoded  = await verifyAccessToken(access_token);
      if (decoded && typeof decoded !== "boolean") {
        const userWOP = {
          _id: decoded._id,
        };
        req.user = userWOP;
        next();
      } else {
        if (req.cookies && req.cookies["refresh"]) {
          const refreshToken = req.cookies["refresh"];
          if (refreshToken) {
            const decoded = await verifyRefreshToken(refreshToken);
            if (decoded && typeof decoded !== "boolean") {
              const userWOP = {
                _id: decoded._id,
              };
              const newAccessToken = await createToken({
                ...userWOP,
              });
              req.user = userWOP;


              res.cookie("token", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite:"none",
                maxAge: 60 * 1000,
              });
              next();
            } else {
              const error  = new CustomError(403,["Invalid Refresh!!"]);
              // error.statusCode = 403;
              // error.reasons = ["Invalid Refresh!!"];
              throw error;
            }
          } else {
            const error = new CustomError(403,["Invalid Token!!"]);
            // error.statusCode = 403;
            // error.reasons = ["Invalid Token!!"];
            throw error;
          }
        } else {
          const error = new CustomError(403,["UnAuthorized User!!"]);
          // error.statusCode = 403;
          // error.reasons = ;
          throw error;
        }
      }
    } else {
      if (req.cookies && req.cookies["refresh"]) {
        const refreshToken = req.cookies["refresh"];
        if (refreshToken) {
          const decoded = await verifyRefreshToken(refreshToken);
          if (decoded && typeof decoded !== "boolean") {
            const userWOP = {
              _id: decoded._id,
            };
            const newAccessToken = await createToken({
              ...userWOP,
            });
            req.user = userWOP;

            res.cookie("token", newAccessToken, {
              httpOnly: true,
              secure: true,
              sameSite:"none",
              maxAge: 60 * 1000,
            });
            next();
          } else {
            const error = new CustomError(403,["Invalid Refresh!!"]);
            // error.statusCode = 403;
            // error.reasons = ["Invalid Refresh!!"];
            throw error;
          }
        } else {
          const error = new CustomError(403,["Invalid Token!!"]);
          // error.statusCode = 403;
          // error.reasons = ["Invalid Token!!"];
          throw error;
        }
      } else {
        const error = new CustomError(403,["UnAuthorized User!!"]);
        // error.statusCode = 403;
        // error.reasons = ["UnAuthorized User!!"];
        throw error;
      }
    }
  } catch (err) {
    next(err);
  }
};
