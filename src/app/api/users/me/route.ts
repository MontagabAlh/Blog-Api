import prisma from "@/utils/db/db"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { JWTPayload } from "@/utils/types/types"
import { jwtToken } from "@/utils/token/toke"

/** 
* @method GET
* @route  ~/api/users/me
* @description Get User Account
* @access private (only user himself and Admins can Get his account)
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
            return NextResponse.json(user, { status: 200 })
        }

        return NextResponse.json({ message: "only user himself can get his Account Info, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get User Account Information
 *     description: Fetch the account information of the logged-in user. Accessible by the user themselves and admins.
 *     tags: [Users]
 *     security:
 *       - authToken: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user account information.
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
 *                 email:
 *                   type: string
 *                   example: john_doe@example.com
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T12:00:00Z"
 *       401:
 *         description: No token provided or invalid token, access denied.
 *       403:
 *         description: Only the user or admins can access the account information.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
