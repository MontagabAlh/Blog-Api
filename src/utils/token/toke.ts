import jwt from 'jsonwebtoken'
import { JWTPayload } from '../types/types';
import { NextRequest } from 'next/server';

export function generateJWT(payload: JWTPayload): string {
    const privetKey = process.env.JWT_PRIVET_KEY as string
    const token = jwt.sign(payload, privetKey, { expiresIn: '5d' });
    return token
}


export function jwtToken(request:NextRequest){
    const jwt = request.cookies.get('jwtToken');
    const token = jwt?.value as string
    return token
}