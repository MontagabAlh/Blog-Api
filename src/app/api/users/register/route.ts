import prisma from "@/utils/db/db";
import { RegisterUser } from "@/utils/types/types";
import { registerSchema } from "@/utils/validation/validationScheme";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import generateOTP from "@/utils/OTPCode/generateOTP";
import sendOtpEmail from "@/utils/email/emailSeander";
import hashing from "@/utils/hashing/hashing";

/** 
* @method POST
* @route  ~/api/users/register
* @description Create User Account
* @access public
*/
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as RegisterUser
        const validation = registerSchema.safeParse(body)
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
        const userEmail = await prisma.user.findUnique({ where: { email: body.email } })
        const userUsername = await prisma.user.findUnique({ where: { username: body.username } })
        if (userUsername || userEmail) {
            return NextResponse.json({ message: "This user already registered" }, { status: 500 })
        }

        const salt = await bcrypt.genSalt(10)
        const addPassKey = hashing(body.password)
        const hashedPassword = await bcrypt.hash(addPassKey, salt)
        const newUser = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: hashedPassword
            }
        });
        const otpCode = generateOTP(6)
        const hashOtp = hashing(otpCode)
        const hashedOTPCode = await bcrypt.hash(hashOtp, salt)
        await prisma.oTP.findUnique({ where: { email: newUser.email } });
        await prisma.oTP.create({
            data: {
                email: newUser.email,
                otpCode: hashedOTPCode,
                userId: newUser.id,
                isUsed: false
            },
        })
        sendOtpEmail(otpCode, newUser.email)
        console.log("hashPassword: ",body.password , " ", addPassKey);
        
        return NextResponse.json({ message: 'User Registered Successfuly - OTP Code has been sent' }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/** 
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new user account
 *     description: Registers a new user account. The user must provide a unique username, email, and password. Password is hashed before being stored.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *                 example: "john_doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the new user.
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Successfully created a new user account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Validation error, invalid input data.
 *       500:
 *         description: Internal server error or user already exists.
 */
