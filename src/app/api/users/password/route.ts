import prisma from "@/utils/db/db"
import { JWTPayload, UpdateUserPassword } from "@/utils/types/types"
import { updateUserPasswordSchema } from "@/utils/validation/validationScheme"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import { jwtToken } from "@/utils/token/toke"
import hashing from "@/utils/hashing/hashing"

/** 
* @method PUT
* @route  ~/api/users/password
* @description update user password
* @access private (only user himself can update his password)
*/


export async function PUT(request: NextRequest) {
    try {
        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }

        const body = (await request.json()) as UpdateUserPassword
        const validation = updateUserPasswordSchema.safeParse(body)
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
            const addPassKey = hashing(body.currentPassword)
            const isPasswordMatch = await bcrypt.compare(addPassKey, user.password);
            if (!isPasswordMatch) {
                return NextResponse.json({ message: `Current Password is not true` }, { status: 401 });
            }
            if (body.currentPassword === body.newPassword) {
                return NextResponse.json({ message: `You are using the same Current Password` }, { status: 401 });
            }
            const salt = await bcrypt.genSalt(10)
            const addNewPassKey = hashing(body.newPassword)
            const hashedPassword = await bcrypt.hash(addNewPassKey, salt)
            await prisma.user.update({
                where: { username: userFromToken.username },
                data: {
                    password: hashedPassword
                }
            })
            return NextResponse.json({ messsage: "Password Updated Successfuly" }, { status: 200 })
        }

        return NextResponse.json({ message: "only ser himself can update his Password, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/** 
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Update User Password
 *     description: Update the password for the authenticated user. The user must provide their current password and the new password.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Assumes token is passed in the Authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully"
 *       400:
 *         description: Validation error, invalid input data.
 *       401:
 *         description: Unauthorized, invalid token or incorrect current password.
 *       403:
 *         description: Forbidden, only the user can update their own password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
