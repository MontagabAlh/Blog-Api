import prisma from "@/utils/db/db"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { JWTPayload } from "@/utils/types/types"
import { jwtToken } from "@/utils/token/toke"

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
 *     summary: Retrieve the authenticated user's profile information.
 *     description: This endpoint allows the user to fetch their own profile information. Only the authenticated user can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the user.
 *                   example: 10
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: "mohammad"
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *                   example: "ma0152260@gmail.com"
 *                 isAdmin:
 *                   type: boolean
 *                   description: Whether the user has admin privileges.
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time the user was created.
 *                   example: "2024-12-06T06:05:57.440Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time the user profile was last updated.
 *                   example: "2024-12-06T06:11:02.542Z"
 *       403:
 *         description: Only the user himself can access his account info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "only user himself can get his Account Info, forbidden"
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
