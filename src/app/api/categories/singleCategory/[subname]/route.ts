import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, UpdatePostCategory } from "@/utils/types/types";
import prisma from "@/utils/db/db";
import { updateCategoryScheme } from "@/utils/validation/validationScheme";
import { jwtToken } from "@/utils/token/toke";
import jwt from "jsonwebtoken"

interface GetSingleArticleProps {
    params: { subname: string }
}

/** 
* @method PUT
* @route  ~/api/category/singleCategory/:[subname]
* @description Update Article
* @access public
*/

export async function PUT(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!user) {
            return NextResponse.json({ message: 'User Not Found' }, { status: 404 })
        }
        const body = (await request.json()) as UpdatePostCategory
        const validation = updateCategoryScheme.safeParse(body)
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

        if (!user.isAdmin) {
            return NextResponse.json({ message: "only Admins can update Category info, forbidden" }, { status: 403 })
        }
        const category = await prisma.category.findUnique({ where: { subname: params.subname } })
        if (!category) {
            return NextResponse.json({ message: 'Category Not Found' }, { status: 404 })
        }

        const categoryBody = await prisma.category.findUnique({ where: { subname: body.subname } })
        if (categoryBody) {
            return NextResponse.json({ message: "This subname currently exists" }, { status: 401 })
        }

        const updatedCatygory = await prisma.category.update({
            where: { subname: params.subname },
            data: {
                name: body.name,
                subname: body.subname,
                metaDescription: body.metaDescription,
            }
        })
        return NextResponse.json(updatedCatygory, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/categories/singleCategory/{subname}:
 *   put:
 *     summary: Update a category by its subname.
 *     description: Allows admins to update the details of a specific category, including its subname, title, and meta description. Only users with admin privileges can perform this action.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subname
 *         required: true
 *         schema:
 *           type: string
 *         description: The current subname of the category to update.
 *         example: "new"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subname:
 *                 type: string
 *                 description: The new subname for the category.
 *                 example: "newd"
 *               title:
 *                 type: string
 *                 description: The new title for the category.
 *                 example: "ddd"
 *               metaDescription:
 *                 type: string
 *                 description: The new meta description for the category.
 *                 example: "ffd"
 *     responses:
 *       201:
 *         description: Successfully updated the category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Category ID.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Category name.
 *                   example: "new"
 *                 subname:
 *                   type: string
 *                   description: Updated subname of the category.
 *                   example: "newd"
 *                 metaDescription:
 *                   type: string
 *                   description: Meta description of the category.
 *                   example: ""
 *       401:
 *         description: The requested subname already exists.
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
 *         description: Only admins are authorized to update categories.
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
 *         description: The user was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Category not found"
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
* @method DELETE
* @route  ~/api/articles/:id
* @description Delete Article
* @access public
*/

export async function DELETE(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const token = jwtToken(request)
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!user) {
            return NextResponse.json({ message: 'User Not Found' }, { status: 404 })
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "only Admins can update Category info, forbidden" }, { status: 403 })
        }

        const category = await prisma.category.findUnique({ where: { subname: params.subname } })
        if (!category) {
            return NextResponse.json({ message: 'Category Not Found' }, { status: 404 })
        }

        await prisma.category.delete({ where: { subname: params.subname } })
        return NextResponse.json({ message: 'Category Deleted' }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/categories/singleCategory/{subname}:
 *   delete:
 *     summary: Delete a category by its subname.
 *     description: Allows admins to delete a specific category identified by its subname. Only users with admin privileges are authorized to perform this action.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subname
 *         required: true
 *         schema:
 *           type: string
 *         description: The subname of the category to delete.
 *         example: "new"
 *     responses:
 *       200:
 *         description: The category was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Category Deleted"
 *       401:
 *         description: The category was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Category Not Found"
 *       403:
 *         description: Only admins are authorized to delete categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "only Admins can update Category info, forbidden"
 *       404:
 *         description: The category was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Category not found"
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
