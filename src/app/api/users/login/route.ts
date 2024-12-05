import prisma from "@/utils/db/db";
import { LoginUser } from "@/utils/types/types";
import { loginSchema } from "@/utils/validation/validationScheme";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import sendOtpEmail from "@/utils/email/emailSeander";
import generateOTP from "@/utils/OTPCode/generateOTP";
import hashing from "@/utils/hashing/hashing";

/** 
* @method POST
* @route  ~/api/users/login
* @description Order An OTP Code to Login
* @access public
*/


export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as LoginUser
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: validation.error.errors.map((error) => {
                        return { [`${error.path[0]}`]: `${error.message}` };
                    }),
                },
                { status: 400 }
            );
        }

        const queryField = body.email ? { email: body.email } : { username: body.username };

        const user = await prisma.user.findUnique({ where: queryField });
        if (!user) {
            return NextResponse.json({ message: `Invalid ${body.email ? "email" : "username"} or password` }, { status: 404 });
        }
        const addPassKey = hashing(body.password)
        const isPasswordMatch = await bcrypt.compare(addPassKey, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ message: `Invalid ${body.email ? "email" : "username"} or password` }, { status: 401 });
        }
        const otpCode = generateOTP(6)
        const salt = await bcrypt.genSalt(10)
        const hashOTP = hashing(otpCode)
        const hashedOTPCode = await bcrypt.hash(hashOTP, salt)
        const otp = await prisma.oTP.findUnique({ where: { email: user.email } });
        if (!otp) {
            await prisma.oTP.create({
                data: {
                    email: user.email,
                    otpCode: hashedOTPCode,
                    userId: user.id
                },
            })
            sendOtpEmail(otpCode, user.email)
            return NextResponse.json({ message: 'Login Successfuly - OTP Code has been sent' }, { status: 200 });
        }
        await prisma.oTP.update({
            where: { email: user.email },
            data: {
                otpCode: hashedOTPCode
            }
        })
        sendOtpEmail(otpCode, user.email)
        return NextResponse.json({ message: 'Login Successfuly - OTP Code has been sent' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Request an OTP code for login
 *     description: Allows a user to request an OTP code for logging in using their email or username and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The email of the user (optional if username is provided).
 *               username:
 *                 type: string
 *                 example: johndoe
 *                 description: The username of the user (optional if email is provided).
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *                 description: The user's password.
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
 *       400:
 *         description: Validation error in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties:
 *                       type: string
 *       401:
 *         description: Invalid email/username or password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
