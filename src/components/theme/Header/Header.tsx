'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { BsShieldLockFill } from 'react-icons/bs'
import Menu from './Menu'
import { NavMnue } from '@/utils/routes/routes'

export default function Header() {
    const [open, setOpen] = useState(false)
    return (
        <div className='w-full '>
            <div className='w-full min-h-[60px] flex justify-between items-center px-4 py-2 bg-slate-300'>
                <div className='flex justify-start items-center gap-6'>
                    <Link href={'/'} className='flex justify-start items-center font-bold text-2xl'>
                        <p className='text-blue-600 '>NB</p>
                        <BsShieldLockFill size={20} className='text-blue-600 ' />
                        <p className='text-blue-600 '>TECH</p>
                    </Link>
                    <nav className=' justify-center items-center gap-4 hidden md:flex'>
                        {
                            NavMnue.map((nav, index) => {
                                return (
                                    <Link key={index} className='text-blue-600 text-lg hover:text-white transition-all duration-150' href={nav.link}>{nav.name}</Link>
                                )
                            })
                        }
                    </nav>
                </div>
                <nav className='justify-center items-center gap-2 hidden md:flex'>
                    <Link className='text-white text-lg  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 text-center' href={'/login'}>Login</Link>
                    <Link className='text-white text-lg  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 text-center' href={'/register'}>Register</Link>
                </nav>
                <nav className='block md:hidden'>
                    <AiOutlineMenu onClick={() => { setOpen(!open) }} className='cursor-pointer text-blue-600' size={20} />
                </nav>
            </div>
            <div className={`${open ? 'block' : 'hidden'}`}>
                <Menu setOpen={setOpen} />
            </div>
        </div>
    )
}
