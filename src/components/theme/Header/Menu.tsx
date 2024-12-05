import { NavMnue } from '@/utils/routes/routes';
import Link from 'next/link'
import React from 'react'

interface MenuProps {
    setOpen: (value: boolean) => void;
}


export default function Menu({ setOpen }: MenuProps) {
    return (
        <div className='w-full py-4 px-5 flex flex-col justify-start items-start gap-5 bg-slate-200 md:hidden absolute top-[60px]'>
            <nav className='flex flex-col justify-start items-start gap-5 w-full'>
                {
                    NavMnue.map((nav, index) => {
                        return (
                            <Link key={index} onClick={() => { setOpen(false) }} className='text-blue-600 rounded-md text-lg hover:bg-slate-100 w-full p-2' href={nav.link}>{nav.name}</Link>
                        )
                    })
                }
            </nav>
            <nav className='flex justify-center items-center gap-10 w-full'>
                <Link onClick={() => { setOpen(false) }} className='text-white text-lg  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 text-center' href={'/login'}>Login</Link>
                <Link onClick={() => { setOpen(false) }} className='text-white text-lg  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 text-center' href={'/register'}>Register</Link>
            </nav>
        </div>
    )
}
