import { Article } from '@/utils/types/types'
import React from 'react'
interface PostProps {
    post: Article
}
export default function Post({ post }: PostProps) {
    return (
        <div className='flex flex-col justify-start  mt-20 px-3 py-4 rounded-md bg-gray-300 gap-4'>
            <h1 className='text-blue-500 text-xl '>{post.title}</h1>
            <p className='text-sm text-white text-left'>2024/12/3  UserId:{post.userId}</p>
            <p>{post.description}</p>
        </div>
    )
}
