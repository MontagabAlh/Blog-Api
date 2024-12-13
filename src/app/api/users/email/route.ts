import prisma from "@/utils/db/db"
import { JWTPayload, UpdateUserEmail } from "@/utils/types/types"
import { updateUserEmailSchema } from "@/utils/validation/validationScheme"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import { jwtToken } from "@/utils/token/toke"

/**
 * @swagger
 * /api/users/email:
 *   put:
 *     summary: Update user email
 *     description: Allows a user to update their email address using an OTP for verification.
 *     tags: [Users]
 *     security:
 *       - authToken: []
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
 *                 example: newemail@example.com
 *                 description: The new email address to update.
 *               otpCode:
 *                 type: string
 *                 example: "123456"
 *                 description: The OTP code sent to the user's current email.
 *     responses:
 *       200:
 *         description: Successfully updated the email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID.
 *                 username:
 *                   type: string
 *                   description: User's username.
 *                 email:
 *                   type: string
 *                   description: Updated email address.
 *                 isAdmin:
 *                   type: boolean
 *                   description: Indicates if the user is an admin.
 *       400:
 *         description: Validation error in the request body.
 *       401:
 *         description: Unauthorized or invalid OTP code.
 *       403:
 *         description: Forbidden, only the user can update their own email.
 *       404:
 *         description: User not found or OTP code not sent.
 *       500:
 *         description: Internal server error.
 */

/** 
* @method PUT
* @route  ~/api/users/email
* @description update user email
* @access private (only user himself can update his email)
*/


export async function PUT(request: NextRequest) {
    try {
        const token = jwtToken()
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }

        const body = (await request.json()) as UpdateUserEmail
        const validation = updateUserEmailSchema.safeParse(body)
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

        if (userFromToken.username === user.username) {
            const userEmail = await prisma.user.findUnique({ where: { email: body.email } })
            if (userEmail) {
                return NextResponse.json({ message: "This email is currentil in use" }, { status: 500 })
            }
            const otp = await prisma.oTP.findUnique({ where: { email: user.email } });
            if (!otp) {
                return NextResponse.json({ message: "No OTP Code was sent to this email" }, { status: 404 })
            }

            const isOTPMatch = await bcrypt.compare(body.otpCode, otp.otpCode);
            if (!isOTPMatch) {
                return NextResponse.json({ message: `Invalid OTP Code` }, { status: 401 });
            }

            const currentTime = new Date();
            const otpCreationTime = new Date(otp.createdAt);
            const timeDifference = (currentTime.getTime() - otpCreationTime.getTime()) / (1000 * 60);
            if (timeDifference > 5) {
                return NextResponse.json({ message: `This OTP code has expired` }, { status: 401 });
            }

            const updatedUser = await prisma.user.update({
                where: { username: userFromToken.username },
                data: {
                    email: body.email
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    isAdmin: true
                }
            })
            return NextResponse.json(updatedUser, { status: 200 })
        }

        return NextResponse.json({ message: "only user himself can update his Email, forbidden" }, { status: 403 })
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