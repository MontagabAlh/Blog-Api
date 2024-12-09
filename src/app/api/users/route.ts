import prisma from "@/utils/db/db"
import { CreateUser, JWTPayload } from "@/utils/types/types"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createUserSchema } from "@/utils/validation/validationScheme"
import bcrypt from 'bcryptjs'
import createUser from "@/utils/email/createUser"
import { jwtToken } from "@/utils/token/toke"
import hashing from "@/utils/hashing/hashing"

/** 
* @method GET
* @route  ~/api/users
* @description Get All Users
* @access private (only Admins can Get All users)
*/


export async function GET(request: NextRequest) {
    try {
        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }
        if (user.isAdmin) {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    isAdmin: true,
                    articles:true
                }
            })
            return NextResponse.json(users, { status: 200 })
        }

        return NextResponse.json({ message: "only Admins can get users, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Retrieve all users.
 *     description: Allows admins to fetch a list of all registered users along with their articles. Only users with admin privileges can access this endpoint.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the user.
 *                     example: 8
 *                   username:
 *                     type: string
 *                     description: The username of the user.
 *                     example: "montagab"
 *                   email:
 *                     type: string
 *                     description: The email of the user.
 *                     example: "montagabalh@gmail.com"
 *                   isAdmin:
 *                     type: boolean
 *                     description: Whether the user has admin privileges.
 *                     example: true
 *                   articles:
 *                     type: array
 *                     description: A list of articles authored by the user.
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The ID of the article.
 *                           example: 2
 *                         title:
 *                           type: string
 *                           description: The title of the article.
 *                           example: "fff"
 *                         subtitle:
 *                           type: string
 *                           description: The subtitle of the article.
 *                           example: "hhh"
 *                         metaDescription:
 *                           type: string
 *                           description: The meta description of the article.
 *                           example: "next-js"
 *                         image:
 *                           type: string
 *                           description: The URL of the article's image.
 *                           example: "http://montagab.com"
 *                         description:
 *                           type: string
 *                           description: The content of the article.
 *                           example: "sdfkm ;ldfgm ;lwe lmwem wenwrtkwem"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the article was created.
 *                           example: "2024-12-06T05:36:17.610Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The date and time the article was last updated.
 *                           example: "2024-12-07T06:48:36.586Z"
 *                         categoryId:
 *                           type: integer
 *                           description: The ID of the category the article belongs to.
 *                           example: 1
 *                         userId:
 *                           type: integer
 *                           description: The ID of the user who authored the article.
 *                           example: 8
 *       403:
 *         description: Only admins are authorized to access this endpoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "only Admins can get users, forbidden"
 *       404:
 *         description: No users found.
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





/** 
* @method POST
* @route  ~/api/users
* @description Create New User
* @access private (only Admins can Create new users)
*/
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as CreateUser
        const validation = createUserSchema.safeParse(body)
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
        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!user) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }
        if (user.isAdmin) {
            const userEmail = await prisma.user.findUnique({ where: { email: body.email } })
            const userUsername = await prisma.user.findUnique({ where: { username: body.username } })
            if (userUsername || userEmail) {
                return NextResponse.json({ message: "This user is currently existing" }, { status: 40 })
            }

            const salt = await bcrypt.genSalt(10)
            const addPassKey = hashing(body.password)
            const hashedPassword = await bcrypt.hash(addPassKey, salt)
            await prisma.user.create({
                data: {
                    username: body.username,
                    email: body.email,
                    password: hashedPassword,
                    isAdmin: body.isAdmin
                }
            });
            createUser(body.username, body.email, body.password)
            return NextResponse.json({ message: "User successfully created" }, { status: 201 })
        }
        return NextResponse.json({ message: "only Admins can Create new user, forbidden" }, { status: 403 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/users/:
 *   post:
 *     summary: Add a new user.
 *     description: Allows admins to create a new user account. Only users with admin privileges can perform this action.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the new user.
 *                 example: "ma052260@gmail.com"
 *               username:
 *                 type: string
 *                 description: The username of the new user.
 *                 example: "mohammad"
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: "Montagab12..mm"
 *               isAdmin:
 *                 type: boolean
 *                 description: Whether the new user should have admin privileges.
 *                 example: false
 *     responses:
 *       201:
 *         description: Successfully created the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "User successfully created"
 *       401:
 *         description: The user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "This user is currently existing"
 *       403:
 *         description: Only admins are authorized to create new users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "only Admins can Create new user, forbidden"
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
