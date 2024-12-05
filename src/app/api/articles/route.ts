import { NextRequest, NextResponse } from "next/server";
import { PostArticle } from "@/utils/types/types";
import { createArticleScheme } from "@/utils/validation/validationScheme";
import { Article} from "@prisma/client";
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
        const articles = await prisma.article.findMany()
        return NextResponse.json(articles, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}


/** 
* @method POST
* @route  ~/api/articles
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

        const newArticle: Article = await prisma.article.create({
            data: {
                title: body.title,
                description: body.description
            }
        });

        return NextResponse.json(newArticle, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}