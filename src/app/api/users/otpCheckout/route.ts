import prisma from "@/utils/db/db";
import { JWTPayload, OTPCheckoutUser } from "@/utils/types/types";
import { otpCheckoutSchema } from "@/utils/validation/validationScheme";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import { generateJWT } from "@/utils/token/toke";
import hashing from "@/utils/hashing/hashing";
import { serialize } from "cookie";

/** 
* @method POST
* @route  ~/api/users/otpCheckout
* @description Verify the OTP code to login
* @access public
*/



export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as OTPCheckoutUser
        const validation = otpCheckoutSchema.safeParse(body)
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

        const user = await prisma.user.findUnique({
            where: { email: body.email }, select: {
                id: true,
                username: true,
                email: true,
                isAdmin: true,
            }
        });
        if (!user) {
            return NextResponse.json({ message: `This user is not registered` }, { status: 404 });
        }

        const otp = await prisma.oTP.findUnique({ where: { email: user.email } });
        if (!otp) {
            return NextResponse.json({ message: "No OTP Code was sent to this email" }, { status: 404 })
        }
        const hashOTP = hashing(body.otpCode)
        const isOTPMatch = await bcrypt.compare(hashOTP, otp.otpCode);
        if (!isOTPMatch) {
            return NextResponse.json({ message: `Invalid OTP Code` }, { status: 401 });
        }

        const currentTime = new Date();
        const otpCreationTime = new Date(otp.createdAt);
        const timeDifference = (currentTime.getTime() - otpCreationTime.getTime()) / (1000 * 60);
        if (timeDifference > 5) {
            return NextResponse.json({ message: `This OTP code has expired` }, { status: 401 });
        }
        if (otp.isUsed) {
            return NextResponse.json({ message: `This OTP code has been used` }, { status: 401 });
        }
        const jwtPayload: JWTPayload = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        }
        const token = generateJWT(jwtPayload)
        const cookie = serialize("jwtToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 10
        })
        await prisma.oTP.update({
            where: {
                email: user.email
            },
            data: {
                isUsed: true
            }
        })
        return NextResponse.json({ ...user }, {
            status: 201,
            headers: { "Set-Cookie": cookie }
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/** 
 * @method POST
 * @route  ~/api/users/otpCheckout
 * @description Verify the OTP code to login
 * @access public
 * 
 * This endpoint verifies the OTP code sent to the user's email. If the OTP is valid 
 * and hasn't expired (expires in 5 minutes), the server generates a JWT token for the user.
 * 
 * Request body:
 * - email: User's email to verify.
 * - otpCode: The OTP code entered by the user for verification.
 * 
 * Responses:
 * - 200: Success - Returns user details and JWT token.
 * - 400: Validation error - If request body doesn't match the expected schema.
 * - 401: Unauthorized - If OTP code is incorrect or expired.
 * - 404: Not Found - If user is not found or OTP code is not sent.
 * - 500: Internal Server Error - If an unexpected error occurs.
 */


/**
 * @swagger
 * /api/users/otpCheckout:
 *   post:
 *     summary: Verify the OTP code to login
 *     description: Fetch the account information of the logged-in user. Accessible by the user themselves and admins.
 *     tags: [OTP]
 *     responses:
 *       200:
 *         description: Success Returns user details and JWT token.
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
 *                   example: john_doe
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *                 token:
 *                   type: string
 *                   format: to
 *                   example: "erfsdfsdgfmtt4434584754$3255.2352354523524542525-2452341.23513414"
 *         400: Validation error - If request body doesn't match the expected schema.
 *         401: Unauthorized - If OTP code is incorrect or expired.
 *         404: Not Found - If user is not found or OTP code is not sent.
 *       500: Internal Server Error - If an unexpected error occurs.
 */

