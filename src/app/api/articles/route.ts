import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db/db";




/** 
* @method GET
* @route  ~/api/articles
* @description Get All Articles
* @access public
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
    try {
        const articles = await prisma.article.findMany({
            select: {
                id: true,
                title: true,
                subtitle: true,
                metaDescription: true,
                image: true,
                description: true,
                categoryId: true,
                createdAt: true,
                updatedAt: true,
                Category: true
            }
        })
        return NextResponse.json(articles, { status: 200 },)
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching article:', error.message); 
        } else {
            console.error('Unexpected error:', error); 
        }
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}


/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Retrieve a list of articles
 *     description: Fetches all available articles along with their categories. This endpoint is public and does not require authentication.
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: A list of articles with their details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unique identifier for the article.
 *                     example: 2
 *                   title:
 *                     type: string
 *                     description: Title of the article.
 *                     example: "fff"
 *                   subtitle:
 *                     type: string
 *                     description: Subtitle of the article.
 *                     example: "fff"
 *                   metaDescription:
 *                     type: string
 *                     description: Meta description for SEO purposes.
 *                     example: "next-js"
 *                   image:
 *                     type: string
 *                     description: URL of the article's image.
 *                     example: "http://dddd.ccc/fffmff.png"
 *                   description:
 *                     type: string
 *                     description: Full content of the article.
 *                     example: "sdfkm ;ldfgm ;lwe lmwem wenwrtkwem"
 *                   categoryId:
 *                     type: integer
 *                     description: ID of the category the article belongs to.
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the article was created.
 *                     example: "2024-12-06T05:36:17.610Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the article was last updated.
 *                     example: "2024-12-06T15:20:09.752Z"
 *                   Category:
 *                     type: object
 *                     description: The category information.
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the category.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Name of the category.
 *                         example: "new"
 *                       subname:
 *                         type: string
 *                         description: Subname of the category.
 *                         example: "new"
 *                       metaDescription:
 *                         type: string
 *                         description: Meta description for the category.
 *                         example: ""
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "internal server error"
 */
