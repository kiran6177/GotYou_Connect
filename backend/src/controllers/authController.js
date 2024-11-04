import {
  emailRegex,
  mobileRegex,
  passwordRegex,
  USER_PROFILE_FOLDER,
} from "../common/constants.js";
import { CustomError } from "../common/CustomError.js";
import { compare, hash } from "bcrypt";
import UserModel from "../models/userModel.js";
import { createRefreshToken, createToken } from "../utils/jwt.js";
import cloudinaryV2, { destroyFromCloudinary } from "../utils/cloudinary.js";
import { generateSecretKey } from "../utils/otp.js";
import sendmail from "../utils/nodemailer.js";
const SALT_ROUNDS = 10;

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email?.trim() === "" && password?.trim() === "") {
      throw CustomError.createError("Please fill up the fields!!", 400);
    }

    if (email?.trim() === "") {
      throw CustomError.createError("Please enter a email!!", 400);
    }

    if (!emailRegex.test(email)) {
      throw CustomError.createError("Please enter a valid email!!", 400);
    }

    if (password?.trim() === "") {
      throw CustomError.createError("Please enter a password!!", 400);
    }

    if (password?.trim().length < 8) {
      throw CustomError.createError(
        "Password should contain minimum 8 digits!!",
        400
      );
    }

    if (!passwordRegex.test(password)) {
      throw CustomError.createError(
        "Password should contain alphabets and digits!!",
        400
      );
    }

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      throw CustomError.createError("User Not Found!!", 400);
    }
    const isUser = await compare(password, findUser.password);
    if (!isUser) {
      throw CustomError.createError("Invalid Password!!", 400);
    }

    const userData = {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      mobile: findUser.mobile,
      image: findUser.image,
      friends: findUser.friends,
      mfaEnabled: findUser.mfaEnabled,
      lastLoginTime: findUser.lastLoginTime,
      incomingRequests: findUser.incomingRequests,
      requestedUsers: findUser.requestedUsers,
    };
    if (!findUser?.isVerified || findUser?.mfaEnabled) {
      const otp = generateSecretKey();
      const hashedOTP = await hash(otp, SALT_ROUNDS);

      const mailSend = await sendmail(email, otp);
      console.log(otp);
      if (!mailSend) {
        const error = new Error();
        error.statusCode = 500;
        error.reasons = ["Ooops. Error sending email!!"];
        throw error;
      }
      await UserModel.findByIdAndUpdate(
        { _id: findUser?._id },
        { $set: { mfaSecret: hashedOTP } }
      );
      setTimeout(async () => {
        await UserModel.findByIdAndUpdate(
          { _id: findUser._id },
          { $set: { mfaSecret: null } }
        );
      }, 60 * 1000);

      res.status(200).json({ success: findUser?._id });
    } else {
      const access_token = await createToken({ _id: userData._id });
      const refresh_token = await createRefreshToken({ _id: userData._id });

      res.cookie("token", access_token, {
        domain:'got-you.vercel.app',
        httpOnly: true,
        secure: true,
        sameSite:"None",
        maxAge: 60 * 1000, //1 min
      });

      res.cookie("refresh", refresh_token, {
        domain:'got-you.vercel.app',
        httpOnly: true,
        secure: true,
        sameSite:"None",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      });
      const newData =  await UserModel.findByIdAndUpdate(
        { _id: userData._id },
        { $set: { lastLoginTime: new Date() } },
        {new : true}
      );

      userData.lastLoginTime = newData?.lastLoginTime;

      res.status(200).json({ user: userData });
    }
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, mobile, password, cPassword } = req.body;
    if (
      name?.trim() === "" &&
      email?.trim() === "" &&
      mobile?.trim() === "" &&
      password?.trim() === "" &&
      cPassword?.trim() === "" &&
      !req.file
    ) {
      throw CustomError.createError("Please fill up the fields!!", 400);
    }
    if (!req.file?.mimetype.startsWith("image/")) {
      throw CustomError.createError("Selected file is not an Image!!");
    }
    if (email?.trim() === "") {
      throw CustomError.createError("Please enter a email!!", 400);
    }

    if (!emailRegex.test(email)) {
      throw CustomError.createError("Please enter a valid email!!", 400);
    }

    if (mobile?.trim() === "") {
      throw CustomError.createError("Please enter your Mobile Number!!", 400);
      return;
    }

    if (mobile?.length !== 10) {
      throw CustomError.createError("Mobile Number should be 10 Digits!!", 400);
      return;
    }

    if (!mobileRegex.test(mobile)) {
      throw CustomError.createError("Invalid Mobile Number", 400);
      return;
    }

    if (password?.trim() === "") {
      throw CustomError.createError("Please enter a password!!", 400);
    }

    if (password?.trim().length < 8) {
      throw CustomError.createError(
        "Password should contain minimum 8 digits!!",
        400
      );
    }

    if (!passwordRegex.test(password)) {
      throw CustomError.createError(
        "Password should contain alphabets and digits!!",
        400
      );
    }

    if (cPassword?.trim() === "") {
      throw CustomError.createError("Please Confirm your password!!", 400);
    }

    if (password?.trim() !== cPassword?.trim()) {
      throw CustomError.createError("Password Mismatch!!", 400);
    }

    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      throw CustomError.createError("Account Exists!!", 400);
    }
    console.log(name, email, mobile, password, cPassword);
    const hashed = await hash(password, SALT_ROUNDS);
    const lastLoginTime = new Date();

    //Upload Image to Cloudinary
    const base64EncodedImage = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64EncodedImage}`;
    const result = await cloudinaryV2.uploader.upload(dataUri, {
      folder: USER_PROFILE_FOLDER,
    });

    let image = result.secure_url;

    const otp = generateSecretKey();
    const hashedOTP = await hash(otp, SALT_ROUNDS);

    const mailSend = await sendmail(email, otp);
    console.log(otp);
    if (!mailSend) {
      const error = new Error();
      error.statusCode = 500;
      error.reasons = ["Ooops. Error sending email!!"];
      throw error;
    }

    const userData = {
      name,
      email,
      mobile,
      image,
      lastLoginTime,
      mfaSecret: hashedOTP,
      password: hashed,
    };

    console.log("INSERTED : ", userData);

    const createdUser = await UserModel.create(userData);
    console.log(createdUser);

    //Removing OTP secret after 1-minute
    setTimeout(async () => {
      await UserModel.findByIdAndUpdate(
        { _id: createdUser._id },
        { $set: { mfaSecret: null } }
      );
    }, 60 * 1000);

    res.json({ success: createdUser?._id });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      domain:'got-you.vercel.app',
      httpOnly: true,
      secure: true,
      sameSite:"None",
      maxAge: 1000, //1 min
    });

    res.cookie("refresh", null, {
      domain:'got-you.vercel.app',
      httpOnly: true,
      secure: true,
      sameSite:"None",
      maxAge: 1000, //30 days
    });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (req, res, next) => {
  try {
    const { name, email, mobile } = req.body;
    const { _id } = req.user;
    if (name?.trim() === "" && email?.trim() === "" && mobile?.trim() === "") {
      throw CustomError.createError("Please fill up the fields!!", 400);
    }

    if (email?.trim() === "") {
      throw CustomError.createError("Please enter a email!!", 400);
    }

    if (!emailRegex.test(email)) {
      throw CustomError.createError("Please enter a valid email!!", 400);
    }
    if (mobile?.trim() === "") {
      throw CustomError.createError("Please enter your Mobile Number!!", 400);
      return;
    }

    if (mobile?.length !== 10) {
      throw CustomError.createError("Mobile Number should be 10 Digits!!", 400);
      return;
    }

    if (!mobileRegex.test(mobile)) {
      throw CustomError.createError("Invalid Mobile Number", 400);
      return;
    }

    const userExist = await UserModel.findOne({ _id });

    if (!userExist) {
      throw CustomError.createError("Invalid Request!!", 400);
    }
    let image;
    if (req.file) {
      if (!req.file?.mimetype.startsWith("image/")) {
        throw CustomError.createError("Selected file is not an Image!!");
      }
      if (userExist?.image) {
        await destroyFromCloudinary(userExist?.image, USER_PROFILE_FOLDER);
      }
      const base64EncodedImage = Buffer.from(req.file.buffer).toString(
        "base64"
      );
      const dataUri = `data:${req.file.mimetype};base64,${base64EncodedImage}`;
      const result = await cloudinaryV2.uploader.upload(dataUri, {
        folder: USER_PROFILE_FOLDER,
      });

      image = result.secure_url;
    }

    if (userExist?.email !== email) {
      const updatable = {
        name,
        mobile,
      };
      if (image) {
        updatable.image = image;
      }
      const otp = generateSecretKey();
      const hashedOTP = await hash(otp, SALT_ROUNDS);

      const mailSend = await sendmail(email, otp);
      console.log(otp);
      if (!mailSend) {
        const error = new Error();
        error.statusCode = 500;
        error.reasons = ["Ooops. Error sending email!!"];
        throw error;
      }
      await UserModel.findByIdAndUpdate(
        { _id },
        { $set: { ...updatable, mfaSecret: hashedOTP } },
        { new: true }
      );
      setTimeout(async () => {
        await UserModel.findByIdAndUpdate(
          { _id: userExist._id },
          { $set: { mfaSecret: null } }
        );
      }, 60 * 1000);

      return res.status(200).json({ success: userExist?._id, email: email });
    }
    console.log(name, email, mobile);

    const userData = {
      name,
      email,
      mobile,
    };
    if (image) {
      userData.image = image;
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id },
      { $set: userData },
      { new: true }
    );
    console.log(updatedUser);
    const { password, __v, ...rest } = updatedUser.toObject();
    res.status(200).json({ success: rest });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oPassword, password, cPassword } = req.body;
    const { _id } = req.user;
    if (
      oPassword?.trim() === "" &&
      password?.trim() === "" &&
      cPassword?.trim() === ""
    ) {
      throw CustomError.createError("Please fill up the fields!!", 400);
    }

    if (password?.trim() === "") {
      throw CustomError.createError("Please enter new password!!", 400);
    }

    if (password?.trim().length < 8) {
      throw CustomError.createError(
        "Password should contain minimum 8 digits!!",
        400
      );
    }

    if (!passwordRegex.test(password)) {
      throw CustomError.createError(
        "Password should contain alphabets and digits!!",
        400
      );
    }

    if (cPassword?.trim() === "") {
      throw CustomError.createError("Please Confirm your Password!!", 400);
    }

    if (password?.trim() !== cPassword?.trim()) {
      throw CustomError.createError("Password mismatch!!", 400);
    }

    const userExist = await UserModel.findOne({ _id });

    if (!userExist) {
      throw CustomError.createError("Invalid User!!", 400);
    }
    const isValidPass = await compare(oPassword, userExist.password);
    if (!isValidPass) {
      throw CustomError.createError("Invalid Old Password!!", 400);
    }
    const hashed = await hash(password, SALT_ROUNDS);
    const userData = {
      password: hashed,
    };
    await UserModel.findByIdAndUpdate({ _id }, { $set: userData });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const manageMFA = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const userPreference = await UserModel.findById({ _id });
    await UserModel.findByIdAndUpdate(
      { _id },
      { $set: { mfaEnabled: !userPreference?.mfaEnabled } }
    );
    res
      .status(200)
      .json({ success: true, status: !userPreference?.mfaEnabled });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { id, otp, from, email } = req.body;

    console.log("VERIFY : ", id, otp, from, email);

    const userExist = await UserModel.findById({ _id: id });
    if (!userExist?.mfaSecret) {
      throw CustomError.createError("OTP timed out!!", 400);
    }
    const isVerified = await compare(otp, userExist.mfaSecret);
    if (isVerified) {
      if (!userExist?.isVerified) {
        await UserModel.findByIdAndUpdate(
          { _id: id },
          { $set: { isVerified: true } }
        );
      }
    } else {
      throw CustomError.createError("Invalid OTP!!", 400);
    }
    if (from === "SIGNUP") {
      res.status(202).json({ success: true });
    } else if (from === "LOGIN") {
      const userData = {
        _id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        mobile: userExist.mobile,
        image: userExist.image,
        friends: userExist.friends,
        lastLoginTime: userExist.lastLoginTime,
        mfaEnabled: userExist.mfaEnabled,
        incomingRequests: userExist.incomingRequests,
        requestedUsers: userExist.requestedUsers,
      };
      const access_token = await createToken({ _id: userData._id });
      const refresh_token = await createRefreshToken({ _id: userData._id });
      await UserModel.findByIdAndUpdate(
        { _id: userData._id },
        { $set: { lastLoginTime: new Date() } }
      );

      res.cookie("token", access_token, {
        domain:'got-you.vercel.app',
        httpOnly: true,
        secure: true,
        sameSite:"None",
        maxAge: 60 * 1000, //1 min
      });

      res.cookie("refresh", refresh_token, {
        domain:'got-you.vercel.app',
        httpOnly: true,
        secure: true,
        sameSite:"None",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      });
      res.status(200).json({ user: userData });
    } else {
      await UserModel.findByIdAndUpdate(
        { _id: id },
        { $set: { email: email } }
      );
      res
        .status(202)
        .json({
          success: true,
          message: "Email Updated Successfully",
          email: email,
        });
    }
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req,res) =>{
  try {
    const { email } = req.body;
    const otp = generateSecretKey();
      const hashedOTP = await hash(otp, SALT_ROUNDS);

      const mailSend = await sendmail(email, otp);
      console.log(otp);
      if (!mailSend) {
        const error = new Error();
        error.statusCode = 500;
        error.reasons = ["Ooops. Error sending email!!"];
        throw error;
      }
      await UserModel.findOneAndUpdate(
        { email: email },
        { $set: { mfaSecret: hashedOTP } }
      );
      setTimeout(async () => {
        await UserModel.findOneAndUpdate(
          { email: email },
          { $set: { mfaSecret: null } }
        );
      }, 60 * 1000);
      res.status(200).json({success:true})
  } catch (error) {
    next(error)
  }
}