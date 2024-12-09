import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, PostArticle } from "@/utils/types/types";
import { createArticleScheme } from "@/utils/validation/validationScheme";
import jwt from "jsonwebtoken"
import { Article } from "@prisma/client";
import prisma from "@/utils/db/db";
import { jwtToken } from "@/utils/token/toke";



/** 
* @method POST
* @route  ~/api/articles/add
* @description Create New Article
* @access public
*/
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as PostArticle

        const validation = createArticleScheme.safeParse(body)
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
        
        const article = await prisma.article.findUnique({ where: { subtitle: body.subtitle } })
        if (article) {
            return NextResponse.json({ message: "This subtitle currently exists" }, { status: 401 })
        }

        const newArticle: Article = await prisma.article.create({
            data: {
                title: body.title,
                subtitle: body.subtitle,
                metaDescription: body.metaDescription,
                image: body.image,
                description: body.description,
                categoryId: body.categoryId,
            }
        });
        return NextResponse.json(newArticle, { status: 201 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/**
 * @swagger
 * /api/articles/add:
 *   post:
 *     summary: Create a new article
 *     description: Allows an admin user to create a new article. Authentication is required, and only users with admin privileges can access this endpoint.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the article.
 *                 example: "next.js"
 *               subtitle:
 *                 type: string
 *                 description: The subtitle of the article.
 *                 example: "mmsd"
 *               metaDescription:
 *                 type: string
 *                 description: The meta description for SEO purposes.
 *                 example: "next-js"
 *               image:
 *                 type: string
 *                 description: The URL of the article's image.
 *                 example: "http://dddd.ccc/fffmff.png"
 *               description:
 *                 type: string
 *                 description: The full content of the article.
 *                 example: "loream loream"
 *               categoryId:
 *                 type: integer
 *                 description: The ID of the category the article belongs to.
 *                 example: 1
 *     responses:
 *       201:
 *         description: The article was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier of the newly created article.
 *                   example: 7
 *                 title:
 *                   type: string
 *                   description: Title of the article.
 *                   example: "next.js"
 *                 subtitle:
 *                   type: string
 *                   description: Subtitle of the article.
 *                   example: "mmsd"
 *                 metaDescription:
 *                   type: string
 *                   description: Meta description of the article.
 *                   example: "next-js"
 *                 image:
 *                   type: string
 *                   description: URL of the article's image.
 *                   example: "http://dddd.ccc/fffmff.png"
 *                 description:
 *                   type: string
 *                   description: Full content of the article.
 *                   example: "loream loream"
 *                 categoryId:
 *                   type: integer
 *                   description: ID of the category the article belongs to.
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of article creation.
 *                   example: "2024-12-07T06:24:55.564Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of last article update.
 *                   example: "2024-12-07T06:24:55.564Z"
 *                 userId:
 *                   type: integer
 *                   description: ID of the user who created the article (if applicable).
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: A conflict occurred due to a duplicate subtitle.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "This subtitle currently exists"
 *       403:
 *         description: Access forbidden. Only admins are allowed to create articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "only Admins can Create Article, forbidden"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
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
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "internal server error"
 */
