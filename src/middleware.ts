import { NextResponse } from "next/server";
import { jwtToken } from "./utils/token/toke";


export function middleware() {
    const token = jwtToken()
    if (!token) {
        return NextResponse.json({ message: "no token provided , access denied " }, { status: 401 })
    }
}

export const config = {
    matcher: ['/api/users', '/api/users/email', '/api/users/profile/:path*', '/api/users/me', '/api/users/password', '/api/articles/add', '/api/articles/singleArticle/:path*', '/api/category/add', '/api/category/singleCategory/:path*']
}