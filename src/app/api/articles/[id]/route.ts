import { NextRequest, NextResponse } from "next/server";
import { UpdatePostArticle } from "@/utils/types/types";
import prisma from "@/utils/db/db";
import { updateArticleScheme } from "@/utils/validation/validationScheme";

/** 
* @method GET
* @route  ~/api/articles/:id
* @description Get Single Article by ID
* @access public
*/

interface GetSingleArticleProps {
    params: { id: string }
}
export async function GET(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const article = await prisma.article.findUnique({ where: { id: parseInt(params.id) } })
        if (!article) {
            return NextResponse.json({ message: 'Article Not Found' }, { status: 404 })
        }
        return NextResponse.json(article, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

/** 
* @method PUT
* @route  ~/api/articles/:id
* @description Update Article
* @access public
*/

export async function PUT(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const article = prisma.article.findUnique({ where: { id: parseInt(params.id) } })
        if (!article) {
            return NextResponse.json({ message: 'Article Not Found' }, { status: 404 })
        }
        const body = (await request.json()) as UpdatePostArticle
        const validation = updateArticleScheme.safeParse(body)
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

        const updatedArticle = await prisma.article.update({
            where: { id: parseInt(params.id) },
            data: {
                title: body.title,
                description: body.description
            }
        })
        return NextResponse.json(updatedArticle, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}



/** 
* @method DELETE
* @route  ~/api/articles/:id
* @description Delete Article
* @access public
*/

export async function DELETE(request: NextRequest, { params }: GetSingleArticleProps) {
    try {
        const article = await prisma.article.findUnique({ where: { id: parseInt(params.id) } })
        if (!article) {
            return NextResponse.json({ message: 'Article Not Found' }, { status: 404 })
        }
        await prisma.article.delete({ where: { id: parseInt(params.id) } })
        return NextResponse.json({ message: 'Article Deleted' }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}