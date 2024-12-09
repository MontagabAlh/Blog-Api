import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, PostCategory } from "@/utils/types/types";
import { createCategoryScheme } from "@/utils/validation/validationScheme";
import jwt from "jsonwebtoken"
import prisma from "@/utils/db/db";
import { jwtToken } from "@/utils/token/toke";



/** 
* @method POST
* @route  ~/api/categories/add
* @description Create New Category
* @access public
*/
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as PostCategory

        const validation = createCategoryScheme.safeParse(body)
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
        if (!user.isAdmin) {
            return NextResponse.json({ message: "only Admins can Create Article, forbidden" }, { status: 403 })
        }

        const category = await prisma.category.findUnique({ where: { subname: body.subname } })
        if (category) {
            return NextResponse.json({ message: "This subname currently exists" }, { status: 401 })
        }

        const newCategory = await prisma.category.create({
            data: {
                name: body.name,
                subname: body.subname,
                metaDescription: body.metaDescription,
            }
        });
        return NextResponse.json(newCategory, { status: 201 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/categories/add:
 *   post:
 *     summary: Add a new category.
 *     description: Allows admins to create a new category with the provided details. Only users with admin privileges are authorized to perform this action.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subname:
 *                 type: string
 *                 description: The subname for the new category.
 *                 example: "newd"
 *               title:
 *                 type: string
 *                 description: The title of the new category.
 *                 example: "ddd"
 *               metaDescription:
 *                 type: string
 *                 description: The meta description for the new category.
 *                 example: "ffd"
 *     responses:
 *       201:
 *         description: Successfully created the category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the newly created category.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Name of the new category.
 *                   example: "new"
 *                 subname:
 *                   type: string
 *                   description: Subname of the new category.
 *                   example: "newd"
 *                 metaDescription:
 *                   type: string
 *                   description: Meta description of the new category.
 *                   example: ""
 *       401:
 *         description: The subname already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "This subname currently exists"
 *       403:
 *         description: Only admins are authorized to create categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "only Admins can Create Category, forbidden"
 *       404:
 *         description: User not found.
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
