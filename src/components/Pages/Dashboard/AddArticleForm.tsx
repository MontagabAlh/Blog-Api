'use client'

import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function AddArticleForm() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('')

    const formSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (title === '') return toast.error('Title is Required', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        if (body === '') return toast.error('Description is Required', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        console.log({ title, body });
        toast.success('Article Add Successfully', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
    }
    return (
        <form onSubmit={formSubmitHandler} className='flex flex-col gap-5'>
            <input type='text' onChange={(e) => setTitle(e.target.value)} value={title} placeholder='Enter Article Title' className='py-1 px-2 rounded-md outline-none hover:outline-blue-500 text-blue-600 placeholder:text-blue-300' />
            <textarea className='mb-4 p-2 rounded-md  resize-none outline-none placeholder:text-blue-300 hover:outline-blue-500 text-blue-600 '
                rows={7}
                placeholder='Enter Article Description'
                value={body}
                onChange={(e) => setBody(e.target.value)}
            >

            </textarea>
            <button type='submit' className='text-white text-lg w-max  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 text-center'>
                Save 
            </button>
            <Toaster
                position="bottom-left"
                reverseOrder={false}
            />
        </form>
    )
}
