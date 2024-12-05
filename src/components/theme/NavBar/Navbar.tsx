import { DashbordMnue } from '@/utils/routes/routes'
import Link from 'next/link'
import React from 'react'
import { BsShieldLockFill } from 'react-icons/bs'

export default function Navbar() {
    return (
        <div className='w-full bg-slate-300 min-h-screen py-[14px] px-4 hidden md:block'>
            <Link href={'/'} className='flex justify-start items-center font-bold text-2xl'>
                <p className='text-blue-600 '>NB</p>
                <BsShieldLockFill size={20} className='text-blue-600 ' />
                <p className='text-blue-600 '>TECH</p>
            </Link>
            <nav className='flex flex-col justify-start items-start gap-5 w-full px-1 pt-7'>
                {
                    DashbordMnue.map((nav, index) => {
                        return (
                            <Link key={index} className='text-blue-600 text-lg hover:bg-slate-100 w-full p-2' href={nav.link}>{nav.name}</Link>
                        )
                    })
                }
            </nav>
        </div>
    )
}
