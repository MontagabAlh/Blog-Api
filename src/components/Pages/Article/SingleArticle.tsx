import { Article } from '@/utils/types/types'
import Link from 'next/link'
import React from 'react'

interface SingleArticleProps {
    post: Article
}

export default function SingleArticle({ post }: SingleArticleProps) {
    return (
        <div className='cursor-pointer group border-2 border-blue-300 rounded-lg py-3 px-2 overflow-hidden size-40  md:size-60 flex justify-between flex-col hover:border-blue-600'>
            <div>
                <h1 className='text-blue-800 text-lg font-bold line-clamp-2 md:line-clamp-4'>{post.title}</h1>
                <p className='text-slate-500  text-sm line-clamp-2'>{post.description}</p>
            </div>
            <Link href={`/articles/${post.id}`} className='text-white text-lg text-center  bg-blue-600 group-hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 '>
                Read More
            </Link>

        </div>
    )
}
