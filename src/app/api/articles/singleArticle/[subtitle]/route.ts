import { NextRequest, NextResponse } from "next/server";
import { JWTPayload, UpdatePostArticle } from "@/utils/types/types";
import prisma from "@/utils/db/db";
import { updateArticleScheme } from "@/utils/validation/validationScheme";
import { jwtToken } from "@/utils/token/toke";
import jwt from "jsonwebtoken"

interface GetSingleArticleProps {
    params: { subtitle: string }
}

/** 
* @method PUT
* @route  ~/api/articles/:id
* @description Update Article
* @access public
*/

export async function PUT(request: NextRequest, { params }: GetSingleArticleProps) {
    const { subtitle } = await params;
    try {
        const token = jwtToken();
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload;
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } });
        if (!user) {
            return NextResponse.json({ message: 'User Not Found' }, { status: 404 });
        }
        if (!user.isAdmin) {
            return NextResponse.json({ message: "Only admins can update article info, forbidden" }, { status: 403 });
        }

        const article = await prisma.article.findUnique({ where: { subtitle } });
        if (!article) {
            return NextResponse.json({ message: 'Article Not Found' }, { status: 404 });
        }

        const body = (await request.json()) as UpdatePostArticle;
        const validation = updateArticleScheme.safeParse(body);
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

        if (body.subtitle && body.subtitle !== article.subtitle) {
            const existingArticle = await prisma.article.findUnique({
                where: { subtitle: body.subtitle },
            });
            if (existingArticle) {
                return NextResponse.json(
                    { message: "This subtitle currently exists in another article" },
                    { status: 400 }
                );
            }
        }

        const updatedArticle = await prisma.article.update({
            where: { subtitle },
            data: {
                title: body.title,
                subtitle: body.subtitle,
                metaDescription: body.metaDescription,
                image: body.image,
                description: body.description,
                categoryId: body.categoryId,
            },
        });
        return NextResponse.json(updatedArticle, { status: 201 });

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
 * /api/articles/singleArticle/{subtitle}:
 *   put:
 *     summary: Update an article by subtitle
 *     description: Allows an admin user to update specific details of an article. Authentication is required, and only users with admin privileges can access this endpoint. The body can contain one or more fields to update.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subtitle
 *         required: true
 *         schema:
 *           type: string
 *         description: The subtitle of the article to update.
 *         example: "mmsd"
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
 *                 description: The new subtitle of the article.
 *                 example: "new-subtitle"
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
 *         description: The article was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier of the updated article.
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
 *                   description: ID of the user who updated the article (if applicable).
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
 *         description: Access forbidden. Only admins are allowed to update articles.
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
 *         description: The article was not found.
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




/** 
* @method DELETE
* @route  ~/api/articles/:id
* @description Delete Article
* @access public
*/

export async function DELETE(request: NextRequest, { params }: GetSingleArticleProps) {
    const { subtitle } = await params;
    try {
        const token = jwtToken()
        const userFromToken = jwt.verify(token, process.env.JWT_PRIVET_KEY as string) as JWTPayload
        const user = await prisma.user.findUnique({ where: { username: userFromToken.username } })
        if (!user) {
            return NextResponse.json({ message: 'User Not Found' }, { status: 404 })
        }

        if (!user.isAdmin) {
            return NextResponse.json({ message: "only Admins can update article info, forbidden" }, { status: 403 })
        }

        const article = await prisma.article.findUnique({ where: { subtitle } })
        if (!article) {
            return NextResponse.json({ message: 'Article Not Found' }, { status: 404 })
        }

        await prisma.article.delete({ where: { subtitle } })
        return NextResponse.json({ message: 'Article Deleted' }, { status: 200 })

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
 * /api/articles/singleArticle/{subtitle}:
 *   delete:
 *     summary: Delete an article by subtitle
 *     description: Allows an admin user to delete an article by providing its subtitle. Authentication is required, and only users with admin privileges can access this endpoint.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subtitle
 *         required: true
 *         schema:
 *           type: string
 *         description: The subtitle of the article to delete.
 *         example: "mmsd"
 *     responses:
 *       200:
 *         description: The article was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                   example: "Article Deleted"
 *       403:
 *         description: Access forbidden. Only admins are allowed to delete articles.
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
 *         description: The article was not found.
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
