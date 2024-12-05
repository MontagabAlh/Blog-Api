import prisma from "@/utils/db/db"
import { CreateUser, JWTPayload } from "@/utils/types/types"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createUserSchema } from "@/utils/validation/validationScheme"
import bcrypt from 'bcryptjs'
import createUser from "@/utils/email/createUser"
import { jwtToken } from "@/utils/token/toke"

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
        if (userFromToken.isAdmin == true) {
            const users = await prisma.user.findMany()
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
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Only admins can retrieve the list of all users.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: User ID.
 *                   username:
 *                     type: string
 *                     description: Username of the user.
 *                   email:
 *                     type: string
 *                     description: Email of the user.
 *                   isAdmin:
 *                     type: boolean
 *                     description: Whether the user has admin privileges.
 *       401:
 *         description: Unauthorized - No token provided.
 *       403:
 *         description: Forbidden - Only admins can get users.
 *       500:
 *         description: Internal server error.
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
        if (userFromToken.isAdmin == true) {
            const userEmail = await prisma.user.findUnique({ where: { email: body.email } })
            const userUsername = await prisma.user.findUnique({ where: { username: body.username } })
            if (userUsername || userEmail) {
                return NextResponse.json({ message: "This user is currently existing" }, { status: 500 })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(body.password, salt)
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
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Only admins can create a new user. Requires username, email, and password.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
 *                 example: "new_user"
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *                 example: "new_user@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *                 example: "password123"
 *               isAdmin:
 *                 type: boolean
 *                 description: Whether the new user should have admin privileges.
 *                 example: false
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Validation error, invalid input data.
 *       403:
 *         description: Forbidden - Only admins can create new users.
 *       500:
 *         description: Internal server error or user already exists.
 */
