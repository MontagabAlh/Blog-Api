import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db/db";

/** 
 * @method GET
 * @route  ~/api/articles/:subtitle
 * @description Get Single Article by subtitle
 * @access public
 */

type GetSingleArticleProps = {
    params: { subtitle: string };
};

export async function GET(request: NextRequest, context: GetSingleArticleProps) {
    const { params } = context; // الحصول على المعاملات
    try {
        const article = await prisma.article.findUnique({
            where: { subtitle: params.subtitle },
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
                Category: true,
            },
        });

        if (!article) {
            return NextResponse.json({ message: "Article Not Found" }, { status: 404 });
        }
        return NextResponse.json(article, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/articles/{subtitle}:
 *   get:
 *     summary: Retrieve a single article by subname
 *     description: Fetches a single article and its category details by the provided subname. This endpoint is public and does not require authentication.
 *     tags:
 *       - Articles
 *     parameters:
 *       - in: path
 *         name: subname
 *         required: true
 *         schema:
 *           type: string
 *         description: The subname of the article to retrieve.
 *         example: "new"
 *     responses:
 *       200:
 *         description: The requested article with its details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier for the article.
 *                   example: 2
 *                 title:
 *                   type: string
 *                   description: Title of the article.
 *                   example: "fff"
 *                 subtitle:
 *                   type: string
 *                   description: Subtitle of the article.
 *                   example: "fff"
 *                 metaDescription:
 *                   type: string
 *                   description: Meta description for SEO purposes.
 *                   example: "next-js"
 *                 image:
 *                   type: string
 *                   description: URL of the article's image.
 *                   example: "http://dddd.ccc/fffmff.png"
 *                 description:
 *                   type: string
 *                   description: Full content of the article.
 *                   example: "sdfkm ;ldfgm ;lwe lmwem wenwrtkwem"
 *                 categoryId:
 *                   type: integer
 *                   description: ID of the category the article belongs to.
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the article was created.
 *                   example: "2024-12-06T05:36:17.610Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the article was last updated.
 *                   example: "2024-12-06T15:20:09.752Z"
 *                 Category:
 *                   type: object
 *                   description: The category information.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the category.
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: Name of the category.
 *                       example: "new"
 *                     subname:
 *                       type: string
 *                       description: Subname of the category.
 *                       example: "new"
 *                     metaDescription:
 *                       type: string
 *                       description: Meta description for the category.
 *                       example: ""
 *       404:
 *         description: The requested article was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Article Not Found"
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
