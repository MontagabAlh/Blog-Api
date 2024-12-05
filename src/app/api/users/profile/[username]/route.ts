import prisma from "@/utils/db/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { JWTPayload, UpdateUser } from "@/utils/types/types";
import { updateUserSchema } from "@/utils/validation/validationScheme";
import editUser from "@/utils/email/editUser";
import { jwtToken } from "@/utils/token/toke";

interface GetSingleArticleProps {
    params: { username: string }
}


/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Get User Account
 *     description: Retrieve user account information (accessible only by the user or Admins).
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved user account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized access, no valid token provided.
 *       403:
 *         description: Forbidden, only the user himself or Admins can access this resource.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */


export async function GET(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const user = await prisma.user.findUnique({
            where: { username: params.username },
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

        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload

        if (userFromToken.username === user.username || userFromToken.isAdmin == true) {
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
 * /api/users/{username}:
 *   put:
 *     summary: Update isAdmin Info
 *     description: Update the "isAdmin" status of a user (only Admins can perform this operation).
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAdmin:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated the isAdmin status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *       400:
 *         description: Validation error in the request body.
 *       401:
 *         description: Unauthorized access, no valid token provided.
 *       403:
 *         description: Forbidden, only Admins can perform this action.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */


export async function PUT(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const user = await prisma.user.findUnique({ where: { username: params.username } })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }

        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const body = (await request.json()) as UpdateUser
        const validation = updateUserSchema.safeParse(body)
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

        if (userFromToken.isAdmin == true) {
            const updatedUser = await prisma.user.update({
                where: { username: params.username },
                data: {
                    isAdmin: body.isAdmin
                }
            })
            editUser(user.email, body.isAdmin)
            return NextResponse.json(updatedUser, { status: 200 })
        }

        return NextResponse.json({ message: "only Admins can update isAdmin Status, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}




/**
 * @swagger
 * /api/users/{username}:
 *   delete:
 *     summary: Delete User Account
 *     description: Delete a user's account (accessible only by the user or Admins).
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user.
 *     responses:
 *       200:
 *         description: Successfully deleted the user account.
 *       401:
 *         description: Unauthorized access, no valid token provided.
 *       403:
 *         description: Forbidden, only the user himself or Admins can delete this account.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */


export async function DELETE(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const user = await prisma.user.findUnique({ where: { username: params.username } })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }

        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload

        if (userFromToken.username === user.username || userFromToken.isAdmin == true) {
            await prisma.user.delete({ where: { username: params.username } })
            return NextResponse.json({ message: "your account has been deleted" }, { status: 200 })
        }

        return NextResponse.json({ message: "only user himself can delet his profile, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}