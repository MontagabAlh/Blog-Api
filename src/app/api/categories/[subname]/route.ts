import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db/db";


/** 
* @method GET
* @route  ~/api/categorise/:subname
* @description Get Single Category by subname
* @access public
*/

interface GetSingleArticleProps {
    params: { subname: string }
}
export async function GET(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const category = await prisma.category.findUnique({
            where: { subname: params.subname },
            select: {
                id: true,
                name: true,
                subname: true,
                metaDescription: true,
                article: true,
            }
        })
        if (!category) {
            return NextResponse.json({ message: 'Category Not Found' }, { status: 404 })
        }
        return NextResponse.json(category, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/categories/{subname}:
 *   get:
 *     summary: Retrieve a category by its subname and its related articles.
 *     description: Returns a specific category identified by the subname, along with its associated articles. Each article includes details such as title, subtitle, meta description, image, and creation/update timestamps.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: subname
 *         required: true
 *         schema:
 *           type: string
 *         description: The subname of the category to retrieve.
 *         example: "new"
 *     responses:
 *       200:
 *         description: Successfully retrieved the category and its articles.
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
 *                   description: Category subname.
 *                   example: "new"
 *                 metaDescription:
 *                   type: string
 *                   description: Meta description for the category.
 *                   example: ""
 *                 article:
 *                   type: array
 *                   description: List of articles in the category.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Article ID.
 *                         example: 6
 *                       title:
 *                         type: string
 *                         description: Article title.
 *                         example: "next.js"
 *                       subtitle:
 *                         type: string
 *                         description: Article subtitle.
 *                         example: "fffd"
 *                       metaDescription:
 *                         type: string
 *                         description: Meta description for the article.
 *                         example: "next-js"
 *                       image:
 *                         type: string
 *                         description: URL of the article's image.
 *                         example: "http://dddd.ccc/fffmff.png"
 *                       description:
 *                         type: string
 *                         description: Article content.
 *                         example: "sdfkm ;ldfgm ;lwe lmwem wenwrtkwem"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of article creation.
 *                         example: "2024-12-06T15:27:27.344Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of the last update to the article.
 *                         example: "2024-12-07T06:24:55.564Z"
 *                       categoryId:
 *                         type: integer
 *                         description: ID of the category the article belongs to.
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         description: ID of the user who created the article (if applicable).
 *                         example: null
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Category Not Found"
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
