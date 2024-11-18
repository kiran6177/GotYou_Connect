import { emailRegex, mobileRegex, passwordRegex, USER_PROFILE_FOLDER, } from "../common/constants.js";
// import { CustomError } from "../common/CustomError.js";
import { compare, hash } from "bcrypt";
import UserModel from "../models/userModel.js";
import { createRefreshToken, createToken } from "../utils/jwt.js";
import cloudinaryV2, { destroyFromCloudinary } from "../utils/cloudinary.js";
import { generateSecretKey } from "../utils/otp.js";
import sendmail from "../utils/nodemailer.js";
import { CustomError } from "../interfaces/customError.js";
const SALT_ROUNDS = 10;
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email?.trim() === "" && password?.trim() === "") {
            throw new CustomError(400, ["Please fill up the fields!!"]);
        }
        if (email?.trim() === "") {
            throw new CustomError(400, ["Please enter a email!!"]);
        }
        if (!emailRegex.test(email)) {
            throw new CustomError(400, ["Please enter a valid email!!"]);
        }
        if (password?.trim() === "") {
            throw new CustomError(400, ["Please enter a password!!"]);
        }
        if (password?.trim().length < 8) {
            throw new CustomError(400, [
                "Password should contain minimum 8 digits!!"
            ]);
        }
        if (!passwordRegex.test(password)) {
            throw new CustomError(400, [
                "Password should contain alphabets and digits!!"
            ]);
        }
        const findUser = await UserModel.findOne({ email });
        if (!findUser) {
            throw new CustomError(400, ["User Not Found!!"]);
        }
        const isUser = await compare(password, findUser.password);
        if (!isUser) {
            throw new CustomError(400, ["Invalid Password!!"]);
        }
        const userData = {
            _id: findUser._id.toString(),
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
                const error = new CustomError(500, ["Ooops. Error sending email!!"]);
                // error.statusCode = 500;
                // error.reasons = ["Ooops. Error sending email!!"];
                throw error;
            }
            await UserModel.findByIdAndUpdate({ _id: findUser?._id }, { $set: { mfaSecret: hashedOTP } });
            setTimeout(async () => {
                await UserModel.findByIdAndUpdate({ _id: findUser._id }, { $set: { mfaSecret: null } });
            }, 60 * 1000);
            res.status(200).json({ success: findUser?._id });
        }
        else {
            const access_token = await createToken({ _id: userData._id });
            const refresh_token = await createRefreshToken({ _id: userData._id });
            res.cookie("token", access_token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 60 * 1000, //1 min
            });
            res.cookie("refresh", refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
            });
            const newData = await UserModel.findByIdAndUpdate({ _id: userData._id }, { $set: { lastLoginTime: new Date() } }, { new: true });
            userData.lastLoginTime = newData?.lastLoginTime;
            res.status(200).json({ user: userData });
        }
    }
    catch (error) {
        next(error);
    }
};
export const signup = async (req, res, next) => {
    try {
        const { name, email, mobile, password, cPassword } = req.body;
        if (name?.trim() === "" &&
            email?.trim() === "" &&
            mobile?.trim() === "" &&
            password?.trim() === "" &&
            cPassword?.trim() === "" &&
            !req.file) {
            throw new CustomError(400, ["Please fill up the fields!!"]);
        }
        if (!req.file?.mimetype.startsWith("image/")) {
            throw new CustomError(400, ["Selected file is not an Image!!"]);
        }
        if (email?.trim() === "") {
            throw new CustomError(400, ["Please enter a email!!"]);
        }
        if (!emailRegex.test(email)) {
            throw new CustomError(400, ["Please enter a valid email!!"]);
        }
        if (mobile?.trim() === "") {
            throw new CustomError(400, ["Please enter your Mobile Number!!"]);
            return;
        }
        if (mobile?.length !== 10) {
            throw new CustomError(400, ["Mobile Number should be 10 Digits!!"]);
            return;
        }
        if (!mobileRegex.test(mobile)) {
            throw new CustomError(400, ["Invalid Mobile Number"]);
            return;
        }
        if (password?.trim() === "") {
            throw new CustomError(400, ["Please enter a password!!"]);
        }
        if (password?.trim().length < 8) {
            throw new CustomError(400, [
                "Password should contain minimum 8 digits!!"
            ]);
        }
        if (!passwordRegex.test(password)) {
            throw new CustomError(400, [
                "Password should contain alphabets and digits!!"
            ]);
        }
        if (cPassword?.trim() === "") {
            throw new CustomError(400, ["Please Confirm your password!!"]);
        }
        if (password?.trim() !== cPassword?.trim()) {
            throw new CustomError(400, ["Password Mismatch!!"]);
        }
        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            throw new CustomError(400, ["Account Exists!!"]);
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
            const error = new CustomError(500, ["Ooops. Error sending email!!"]);
            // error.statusCode = 500;
            // error.reasons = ["Ooops. Error sending email!!"];
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
            await UserModel.findByIdAndUpdate({ _id: createdUser._id }, { $set: { mfaSecret: null } });
        }, 60 * 1000);
        res.json({ success: createdUser?._id });
    }
    catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        res.cookie("token", null, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000, //1 min
        });
        res.cookie("refresh", null, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000, //30 days
        });
        res.status(200).json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
export const editProfile = async (req, res, next) => {
    try {
        const { name, email, mobile } = req.body;
        const { _id } = req.user;
        if (name?.trim() === "" && email?.trim() === "" && mobile?.trim() === "") {
            throw new CustomError(400, ["Please fill up the fields!!"]);
        }
        if (email?.trim() === "") {
            throw new CustomError(400, ["Please enter a email!!"]);
        }
        if (!emailRegex.test(email)) {
            throw new CustomError(400, ["Please enter a valid email!!"]);
        }
        if (mobile?.trim() === "") {
            throw new CustomError(400, ["Please enter your Mobile Number!!"]);
        }
        if (mobile?.length !== 10) {
            throw new CustomError(400, ["Mobile Number should be 10 Digits!!"]);
        }
        if (!mobileRegex.test(mobile)) {
            throw new CustomError(400, ["Invalid Mobile Number"]);
        }
        const userExist = await UserModel.findOne({ _id });
        if (!userExist) {
            throw new CustomError(400, ["Invalid Request!!"]);
        }
        let image;
        if (req.file) {
            if (!req.file?.mimetype.startsWith("image/")) {
                throw new CustomError(400, ["Selected file is not an Image!!"]);
            }
            if (userExist?.image) {
                await destroyFromCloudinary(userExist?.image, USER_PROFILE_FOLDER);
            }
            const base64EncodedImage = Buffer.from(req.file.buffer).toString("base64");
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
                const error = new CustomError(500, ["Ooops. Error sending email!!"]);
                // error.statusCode = 500;
                // error.reasons = ["Ooops. Error sending email!!"];
                throw error;
            }
            await UserModel.findByIdAndUpdate({ _id }, { $set: { ...updatable, mfaSecret: hashedOTP } }, { new: true });
            setTimeout(async () => {
                await UserModel.findByIdAndUpdate({ _id: userExist._id }, { $set: { mfaSecret: null } });
            }, 60 * 1000);
            res.status(200).json({ success: userExist?._id, email: email });
        }
        else {
            console.log(name, email, mobile);
            const userData = {
                name,
                email,
                mobile,
            };
            if (image) {
                userData.image = image;
            }
            const updatedUser = await UserModel.findByIdAndUpdate({ _id }, { $set: userData }, { new: true });
            console.log(updatedUser);
            const { password, ...rest } = updatedUser?.toObject();
            res.status(200).json({ success: rest });
        }
    }
    catch (error) {
        next(error);
    }
};
export const changePassword = async (req, res, next) => {
    try {
        const { oPassword, password, cPassword } = req.body;
        const { _id } = req.user;
        if (oPassword?.trim() === "" &&
            password?.trim() === "" &&
            cPassword?.trim() === "") {
            throw new CustomError(400, ["Please fill up the fields!!"]);
        }
        if (password?.trim() === "") {
            throw new CustomError(400, ["Please enter new password!!"]);
        }
        if (password?.trim().length < 8) {
            throw new CustomError(400, [
                "Password should contain minimum 8 digits!!"
            ]);
        }
        if (!passwordRegex.test(password)) {
            throw new CustomError(400, [
                "Password should contain alphabets and digits!!"
            ]);
        }
        if (cPassword?.trim() === "") {
            throw new CustomError(400, ["Please Confirm your Password!!"]);
        }
        if (password?.trim() !== cPassword?.trim()) {
            throw new CustomError(400, ["Password mismatch!!"]);
        }
        const userExist = await UserModel.findOne({ _id });
        if (!userExist) {
            throw new CustomError(400, ["Invalid User!!"]);
        }
        const isValidPass = await compare(oPassword, userExist.password);
        if (!isValidPass) {
            throw new CustomError(400, ["Invalid Old Password!!"]);
        }
        const hashed = await hash(password, SALT_ROUNDS);
        const userData = {
            password: hashed,
        };
        await UserModel.findByIdAndUpdate({ _id }, { $set: userData });
        res.status(200).json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
export const manageMFA = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const userPreference = await UserModel.findById({ _id });
        await UserModel.findByIdAndUpdate({ _id }, { $set: { mfaEnabled: !userPreference?.mfaEnabled } });
        res
            .status(200)
            .json({ success: true, status: !userPreference?.mfaEnabled });
    }
    catch (error) {
        next(error);
    }
};
export const verifyOtp = async (req, res, next) => {
    try {
        const { id, otp, from, email } = req.body;
        console.log("VERIFY : ", id, otp, from, email);
        const userExist = await UserModel.findById({ _id: id });
        if (!userExist?.mfaSecret) {
            throw new CustomError(400, ["OTP timed out!!"]);
        }
        const isVerified = await compare(otp, userExist.mfaSecret);
        if (isVerified) {
            if (!userExist?.isVerified) {
                await UserModel.findByIdAndUpdate({ _id: id }, { $set: { isVerified: true } });
            }
        }
        else {
            throw new CustomError(400, ["Invalid OTP!!"]);
        }
        if (from === "SIGNUP") {
            res.status(202).json({ success: true });
        }
        else if (from === "LOGIN") {
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
            const access_token = await createToken({ _id: userData._id.toString() });
            const refresh_token = await createRefreshToken({ _id: userData._id.toString() });
            await UserModel.findByIdAndUpdate({ _id: userData._id }, { $set: { lastLoginTime: new Date() } });
            res.cookie("token", access_token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 60 * 1000, //1 min
            });
            res.cookie("refresh", refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
            });
            res.status(200).json({ user: userData });
        }
        else {
            await UserModel.findByIdAndUpdate({ _id: id }, { $set: { email: email } });
            res
                .status(202)
                .json({
                success: true,
                message: "Email Updated Successfully",
                email: email,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = generateSecretKey();
        const hashedOTP = await hash(otp, SALT_ROUNDS);
        const mailSend = await sendmail(email, otp);
        console.log(otp);
        if (!mailSend) {
            const error = new CustomError(500, ["Ooops. Error sending email!!"]);
            // error.statusCode = 500;
            // error.reasons = ["Ooops. Error sending email!!"];
            throw error;
        }
        await UserModel.findOneAndUpdate({ email: email }, { $set: { mfaSecret: hashedOTP } });
        setTimeout(async () => {
            await UserModel.findOneAndUpdate({ email: email }, { $set: { mfaSecret: null } });
        }, 60 * 1000);
        res.status(200).json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
