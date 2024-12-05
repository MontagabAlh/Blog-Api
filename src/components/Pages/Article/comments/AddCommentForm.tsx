'use client'

import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function AddCommentForm() {
    const [text, setText] = useState('');

    const formSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (text === '') return toast.error('Please write something', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        console.log({ text });
        toast.success('Successfully Login', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        setText('')
    }
    return (
        <form onSubmit={formSubmitHandler} className='flex flex-col justify-center items-start gap-2 w-full'>
            <textarea  onChange={(e) => setText(e.target.value)} value={text} placeholder='Add a Comment...' className='py-2 px-2 rounded-md outline-none hover:outline-blue-500 text-blue-600 placeholder:text-blue-300 w-full resize-none' rows={3} />
            <button type='submit' className='text-white text-lg w-max  bg-blue-600 hover:bg-blue-400 rounded-md px-3 py-[6px] min-w-32 text-center'>
                Comment
            </button>
            <Toaster
                position="bottom-left"
                reverseOrder={false}
            />
        </form>
    )
}
