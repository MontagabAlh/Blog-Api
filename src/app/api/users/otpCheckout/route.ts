import prisma from "@/utils/db/db";
import { JWTPayload, OTPCheckoutUser } from "@/utils/types/types";
import { otpCheckoutSchema } from "@/utils/validation/validationScheme";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { generateJWT } from "@/utils/token/toke";
import hashing from "@/utils/hashing/hashing";
import { ZodIssue } from "zod";
/**
 * @method POST
 * @route  ~/api/users/otpCheckout
 * @description Verify the OTP code to login
 * @access public
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as OTPCheckoutUser;

        // Validate input
        const validation = otpCheckoutSchema.safeParse(body);
        if (!validation.success) {
            return createErrorResponse(400, "Validation failed", validation.error.errors);
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: body.email },
            select: { id: true, username: true, email: true, isAdmin: true },
        });
        if (!user) {
            return createErrorResponse(404, "This user is not registered");
        }

        // Check if OTP exists
        const otp = await prisma.oTP.findUnique({ where: { email: user.email } });
        if (!otp) {
            return createErrorResponse(404, "No OTP Code was sent to this email");
        }

        // Verify OTP
        const hashOTP = hashing(body.otpCode);
        const isOTPMatch = await bcrypt.compare(hashOTP, otp.otpCode);
        if (!isOTPMatch) {
            return createErrorResponse(401, "Invalid OTP Code");
        }

        // Check OTP expiration
        if (isOTPExpired(otp.createdAt)) {
            return createErrorResponse(401, "This OTP code has expired");
        }

        // Check if OTP is already used
        if (otp.isUsed) {
            return createErrorResponse(401, "This OTP code has been used");
        }

        // Generate JWT
        const jwtPayload: JWTPayload = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        };
        const token = generateJWT(jwtPayload);

        // Update OTP status
        await prisma.oTP.update({
            where: { email: user.email },
            data: { isUsed: true },
        });

        // Set cookie and return response
        const response = NextResponse.json({ ...user, token: token, message: "Auth successful" });
        response.cookies.set("jwtToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 10, // 10 days
        });
        return response;

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

// Helper: Check if OTP is expired
function isOTPExpired(createdAt: Date): boolean {
    const currentTime = new Date();
    const otpCreationTime = new Date(createdAt);
    const timeDifference = (currentTime.getTime() - otpCreationTime.getTime()) / (1000 * 60); // Minutes
    return timeDifference > 5;
}

// Helper: Create error response
function createErrorResponse(status: number, message: string, errors?: ZodIssue[]) {
    return NextResponse.json(
        { message, errors },
        { status }
    );
}

/**
 * @swagger
 * /api/users/otpCheckout:
 *   post:
 *     summary: Verify OTP code for a user
 *     description: >
 *       This endpoint allows anyone to verify an OTP code sent to a user's email. 
 *       No authentication is required.
 *     tags:
 *       - OTP
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
 *                 description: The email address of the user.
 *                 example: "montagabalh@gmail.com"
 *               otpCode:
 *                 type: string
 *                 description: The OTP code sent to the user's email.
 *                 example: "93502C"
 *     responses:
 *       200:
 *         description: OTP verified successfully and user authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier for the user.
 *                   example: 2
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: "montagab"
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user.
 *                   example: "montagabalh@gmail.com"
 *                 isAdmin:
 *                   type: boolean
 *                   description: Indicates if the user is an admin.
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user sessions.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Auth successful"
 *       401:
 *         description: OTP verification failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Error message.
 *               examples:
 *                 invalid:
 *                   value: "Invalid OTP Code"
 *                 expired:
 *                   value: "This OTP code has expired"
 *                 used:
 *                   value: "This OTP code has been used"
 *       404:
 *         description: User or OTP not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Error message.
 *               examples:
 *                 notRegistered:
 *                   value: "This user is not registered"
 *                 noOtp:
 *                   value: "No OTP Code was sent to this email"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Internal Server Error"
 */
