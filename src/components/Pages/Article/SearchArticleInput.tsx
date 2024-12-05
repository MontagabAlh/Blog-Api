'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function SearchArticleInput() {
    const [search, setSearch] = useState('');
    const router = useRouter()

    const formSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (search === '') return toast.error('Search Text is Required', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        console.log({ search });
        router.replace(`/articles/search?searchText=${search}`)
    }
    return (
        <form onSubmit={formSubmitHandler} className='flex justify-center items-center gap-5'>
            <input type='search' onChange={(e) => setSearch(e.target.value)} value={search} placeholder='search for article' className='py-2 px-2 rounded-md md:w-[400px] outline-none hover:outline-blue-500 text-blue-600 placeholder:text-blue-300 ' />
            <button type='submit' className='text-white text-lg w-max  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-[6px] text-center outline-none'>
                Search
            </button>
            <Toaster
                position="bottom-left"
                reverseOrder={false}
            />
        </form>
    )
}
