import jwt from 'jsonwebtoken'
import { JWTPayload } from '../types/types';
import { cookies } from 'next/headers';
export function generateJWT(payload: JWTPayload): string {
    const privetKey = process.env.JWT_PRIVET_KEY as string
    const token = jwt.sign(payload, privetKey, { expiresIn: '5d' });
    return token
}


export function jwtToken(){
    const cookieStore = cookies();
    const jwt = cookieStore.get('jwtToken');
    const token = jwt?.value as string
    return token
}