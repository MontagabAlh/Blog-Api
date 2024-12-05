import { randomBytes } from 'crypto';

const generateOTP = (length: number): string => {
    const bytes = randomBytes(length);
    const otp = bytes.toString('hex') 
        .toLowerCase() 
        .slice(0, length)
        .toUpperCase();
    return otp;
};

export default generateOTP;
