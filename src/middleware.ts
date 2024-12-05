import { NextRequest, NextResponse } from "next/server";
import { jwtToken } from "./utils/token/toke";


export function middleware(request: NextRequest) {
    const token = jwtToken(request)
    if (!token) {
        return NextResponse.json({ message: "no token provided , access denied " }, { status: 401 })
    }
}

export const config = {
    matcher: ['/api/users', '/api/users/email', '/api/users/profile/:path*', '/api/users/me/:path*', '/api/users/password']
}