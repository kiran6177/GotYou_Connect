import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_AUTHSECRET = process.env.JWT_AUTHSECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const createToken = (data) => {
    // console.log(JWT_AUTHSECRET);
    return jwt.sign(data, JWT_AUTHSECRET, { expiresIn: '15m' });
};
export const createRefreshToken = (data) => {
    // console.log(JWT_REFRESH_SECRET);
    return jwt.sign(data, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};
export const verifyAccessToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, JWT_AUTHSECRET);
        console.log(decoded);
        return decoded;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
export const verifyRefreshToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, JWT_REFRESH_SECRET);
        console.log(decoded);
        return decoded;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
