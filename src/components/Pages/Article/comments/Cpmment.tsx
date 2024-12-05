import { Comment } from '@/utils/types/types'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa6'

interface CommentProps {
    comment: Comment
}
export default function Cpmment({ comment }: CommentProps) {
    return (
        <div className='flex flex-col justify-start items-start gap-3 rounded-md border-2 border-blue-600 bg-slate-200 p-2'>
            <div className='flex justify-between items-center w-full'>
                <h1 className='text-xl text-blue-600'>{comment.name}</h1>
                <p className='text-white bg-blue-600 rounded-md px-2 py-1'>2024/9/12</p>
            </div>
            <p className='text-slate-700'>{comment.body}</p>
            <div className='flex justify-end items-center gap-3 w-full'>
                <FaEdit className='text-green-500 cursor-pointer' size={20}/>
                <FaTrash className='text-red-600 cursor-pointer' size={20}/>
            </div>
        </div>
    )
}
