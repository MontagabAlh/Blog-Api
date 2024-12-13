import prisma from "@/utils/db/db"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { JWTPayload } from "@/utils/types/types"
import generateOTP from "@/utils/OTPCode/generateOTP"
import bcrypt from 'bcryptjs'
import sendOtpEmail from "@/utils/email/emailSeander"
import { jwtToken } from "@/utils/token/toke"
import hashing from "@/utils/hashing/hashing"
export const dynamic = 'force-dynamic';

export async function GET() {
    try {


        const token = jwtToken()
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload

        const user = await prisma.user.findUnique({
            where: { username: userFromToken.username },
            select: {
                id: true,
                username: true,
                email: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true
            }
        })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }

        if (userFromToken.username === user.username) {
            const otpCode = generateOTP(6)
            const salt = await bcrypt.genSalt(10)
            const hashOTP = hashing(otpCode)
            const hashedPassword = await bcrypt.hash(hashOTP, salt)
            const otp = await prisma.oTP.findUnique({ where: { email: user.email } });
            if (!otp) {
                await prisma.oTP.create({
                    data: {
                        email: user.email,
                        otpCode: hashedPassword,
                        userId: user.id,
                        isUsed: false
                    },
                })
                sendOtpEmail(otpCode, user.email)
                return NextResponse.json({ message: 'OTP Code has been sent' }, { status: 200 });
            }
            await prisma.oTP.update({
                where: { email: user.email },
                data: {
                    otpCode: hashedPassword,
                    isUsed: false
                }
            })
            sendOtpEmail(otpCode, user.email)
            return NextResponse.json({ message: 'OTP Code has been sent' }, { status: 200 });
        }

        return NextResponse.json({ message: "only user himself can Order the code, forbidden" }, { status: 403 })
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching article:', error.message); 
        } else {
            console.error('Unexpected error:', error); 
        }
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/users/me/orderOtp:
 *   get:
 *     summary: Request OTP code for the authenticated user.
 *     description: This endpoint allows the authenticated user to request an OTP code. Only the user themselves can request the OTP code.
 *     tags:
 *       - OTP
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully requested OTP code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "OTP code sent successfully"
 *       403:
 *         description: Only the user themselves can request the OTP code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "only user himself can Order the code, forbidden"
 *       404:
 *         description: The requested user was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "user not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "internal server error"
 */