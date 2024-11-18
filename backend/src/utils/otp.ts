import crypto from 'crypto';

export const generateSecretKey = () : string => {
    return crypto.randomInt(1000, 10000).toString(); 
};
