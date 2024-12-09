import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db/db";




/** 
* @method GET
* @route  ~/api/categories
* @description Get All Categories
* @access public
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.category.findMany({select: {
            id: true,
            name: true,
            subname: true,
            metaDescription: true,
            article: true,
        }
    })
        return NextResponse.json(categories, { status: 200 },)
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve all categories and their related articles.
 *     description: Returns a list of categories along with their associated articles. Each article includes details such as title, subtitle, meta description, image, and creation/update timestamps.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Successfully retrieved the categories and their articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Category ID.
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: Category name.
 *                     example: "new"
 *                   subname:
 *                     type: string
 *                     description: Category subname.
 *                     example: "new"
 *                   metaDescription:
 *                     type: string
 *                     description: Meta description for the category.
 *                     example: ""
 *                   article:
 *                     type: array
 *                     description: List of articles in the category.
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: Article ID.
 *                           example: 6
 *                         title:
 *                           type: string
 *                           description: Article title.
 *                           example: "next.js"
 *                         subtitle:
 *                           type: string
 *                           description: Article subtitle.
 *                           example: "fffd"
 *                         metaDescription:
 *                           type: string
 *                           description: Meta description for the article.
 *                           example: "next-js"
 *                         image:
 *                           type: string
 *                           description: URL of the article's image.
 *                           example: "http://dddd.ccc/fffmff.png"
 *                         description:
 *                           type: string
 *                           description: Article content.
 *                           example: "sdfkm ;ldfgm ;lwe lmwem wenwrtkwem"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp of article creation.
 *                           example: "2024-12-06T15:27:27.344Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: Timestamp of the last update to the article.
 *                           example: "2024-12-06T15:27:27.344Z"
 *                         categoryId:
 *                           type: integer
 *                           description: ID of the category the article belongs to.
 *                           example: 1
 *                         userId:
 *                           type: integer
 *                           description: ID of the user who created the article (if applicable).
 *                           example: null
 *       500:
 *         description: Internal server error.
 */

