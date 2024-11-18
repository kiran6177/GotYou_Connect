import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv'
import { User } from '../interfaces/appCustom.js';

dotenv.config();

const JWT_AUTHSECRET : Secret  = process.env.JWT_AUTHSECRET as Secret;
const JWT_REFRESH_SECRET : Secret  = process.env.JWT_REFRESH_SECRET as Secret;

export const createToken = (data : User)=>{
    // console.log(JWT_AUTHSECRET);
    return jwt.sign(data,JWT_AUTHSECRET,{expiresIn:'15m'})
} 

export const createRefreshToken = (data : User)=>{
    // console.log(JWT_REFRESH_SECRET);
    return jwt.sign(data,JWT_REFRESH_SECRET,{expiresIn:'30d'});
}

export const verifyAccessToken = async (token : string) : Promise<boolean | User> =>{
    try {
        const decoded = await jwt.verify(token, JWT_AUTHSECRET) as User;
        console.log(decoded);
        return decoded;
    } catch (err) {
        console.error(err);
        return false; 
    }
}

export const verifyRefreshToken = async(token : string) : Promise<boolean | User>=>{
    try {
        const decoded = await jwt.verify(token,JWT_REFRESH_SECRET) as User
        console.log(decoded);
        return decoded;
    } catch (err) {
        console.error(err);
        return false; 
    }
}