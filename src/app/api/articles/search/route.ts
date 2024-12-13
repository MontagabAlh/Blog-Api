import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db/db";
export const dynamic = 'force-dynamic';

/** 
 * @method GET
 * @route  ~/api/articles/search/?searchText=value
 * @description Get  Article by search text
 * @access public
 */

export async function GET(request: NextRequest) {
    try {
        const searchText = request.nextUrl.searchParams.get("searchText")
        if (searchText) {
            const articles = await prisma.article.findMany({
                where: {
                    OR: [
                        { title: { contains: searchText, mode: 'insensitive' } }, // البحث الجزئي في العنوان
                        { description: { contains: searchText, mode: 'insensitive' } } // البحث الجزئي في الوصف
                    ]
                },
                select: {
                    subtitle: true,
                    title: true,
                    description: true,
                    metaDescription: true,
                    createdAt: true
                }
            })
            if (articles.length === 0) {
                return NextResponse.json({ message: "No article found" }, { status: 404 });
            }
            return NextResponse.json(
                articles,
                { status: 200 }
            );
        }
        const articles = await prisma.article.findMany()


        return NextResponse.json(articles, { status: 200 });


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
 * /api/articles/search?searchText=value:
 *   get:
 *     summary: Search for articles by text
 *     description: >
 *       This endpoint allows anyone to search for articles by a specific text in the title or description. 
 *       No authentication is required.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: query
 *         name: searchText
 *         required: false
 *         schema:
 *           type: string
 *         description: The text to search for in the articles.
 *         example: "next.js"
 *     responses:
 *       200:
 *         description: List of articles matching the search text.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subtitle:
 *                     type: string
 *                     description: Subtitle of the article.
 *                     example: "next-jsd"
 *                   title:
 *                     type: string
 *                     description: Title of the article.
 *                     example: "next.js"
 *                   description:
 *                     type: string
 *                     description: Content of the article.
 *                     example: "sdfkm ;ldfgm ;lwe lmwem wenwrtkwem"
 *                   metaDescription:
 *                     type: string
 *                     description: Meta description for SEO purposes.
 *                     example: "next-js"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of when the article was created.
 *                     example: "2024-12-13T08:38:18.297Z"
 *       404:
 *         description: No articles were found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "No article found"
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
 *                   example: "Internal Server Error"
 */
