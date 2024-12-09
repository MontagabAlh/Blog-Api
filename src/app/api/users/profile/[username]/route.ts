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
                updatedAt: true,
                articles: true
            }
        })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }

        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const Admin = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!Admin) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }
        if (userFromToken.username === user.username || Admin.isAdmin) {
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
 * /api/users/profile/{username}:
 *   get:
 *     summary: Retrieve user profile information.
 *     description: Allows admins to fetch profile information of a user. A user can also fetch their own profile info. Only authorized users (admins or the user themselves) can access this endpoint.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: username
 *         in: path
 *         description: The username of the user whose profile is to be fetched.
 *         required: true
 *         schema:
 *           type: string
 *           example: "montagab"
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
 *                   example: 8
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: "montagab"
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *                   example: "montagabalh@gmail.com"
 *                 isAdmin:
 *                   type: boolean
 *                   description: Whether the user has admin privileges.
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time the user was created.
 *                   example: "2024-12-06T02:38:52.934Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time the user profile was last updated.
 *                   example: "2024-12-06T02:40:09.683Z"
 *                 articles:
 *                   type: array
 *                   description: A list of articles authored by the user.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the article.
 *                         example: 2
 *                       title:
 *                         type: string
 *                         description: The title of the article.
 *                         example: "fff"
 *                       subtitle:
 *                         type: string
 *                         description: The subtitle of the article.
 *                         example: "hhh"
 *                       metaDescription:
 *                         type: string
 *                         description: The meta description of the article.
 *                         example: "next-js"
 *                       image:
 *                         type: string
 *                         description: The URL of the article's image.
 *                         example: "http://montagab.com"
 *                       description:
 *                         type: string
 *                         description: The content of the article.
 *                         example: "sdfkm ;ldfgm ;lwe lmwem wenwrtkwem"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the article was created.
 *                         example: "2024-12-06T05:36:17.610Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time the article was last updated.
 *                         example: "2024-12-07T06:48:36.586Z"
 *                       categoryId:
 *                         type: integer
 *                         description: The ID of the category the article belongs to.
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         description: The ID of the user who authored the article.
 *                         example: 8
 *       403:
 *         description: Only the user himself or admins can access the account info.
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
ن


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
        const Admin = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!Admin) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }
        if (Admin.isAdmin) {
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
        const Admin = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!Admin) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }
        if (userFromToken.username === user.username || Admin.isAdmin) {
            await prisma.user.delete({ where: { username: params.username } })
            return NextResponse.json({ message: "your account has been deleted" }, { status: 200 })
        }

        return NextResponse.json({ message: "only user himself can delet his profile, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}