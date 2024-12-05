import prisma from "@/utils/db/db"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { JWTPayload } from "@/utils/types/types"
import generateOTP from "@/utils/OTPCode/generateOTP"
import bcrypt from 'bcryptjs'
import sendOtpEmail from "@/utils/email/emailSeander"
import { jwtToken } from "@/utils/token/toke"
import hashing from "@/utils/hashing/hashing"

/** 
* @method GET
* @route  ~/api/users/me/orderOtp
* @description Order an OTP code
* @access private (only user himself can Order the code)
*/

export async function GET(request: NextRequest) {
    try {


        const token = jwtToken(request)
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
                        userId: user.id
                    },
                })
                sendOtpEmail(otpCode, user.email)
                return NextResponse.json({ message: 'OTP Code has been sent' }, { status: 200 });
            }
            await prisma.oTP.update({
                where: { email: user.email },
                data: {
                    otpCode: hashedPassword
                }
            })
            sendOtpEmail(otpCode, user.email)
            return NextResponse.json({ message: 'OTP Code has been sent' }, { status: 200 });
        }

        return NextResponse.json({ message: "only user himself can Order the code, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/users/me/orderOtp:
 *   get:
 *     summary: Order an OTP code for the user
 *     description: Allows a user to order an OTP code for verification purposes. The request is only accessible by the user themselves.
 *     tags: [OTP]
 *     security:
 *       - authToken: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: OTP code has been sent to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP Code has been sent
 *       401:
 *         description: No token provided or invalid token, access denied.
 *       403:
 *         description: Only the user themselves can order the OTP code.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
