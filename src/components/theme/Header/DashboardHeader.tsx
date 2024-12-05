'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { BsShieldLockFill } from 'react-icons/bs'
import DashboardMenu from './DashboardMenu'

export default function DashboardHeader() {
    const [open, setOpen] = useState(false)
    return (
        <div className='w-full '>
            <div className='w-full min-h-[60px] flex justify-between items-center px-4 py-2 bg-slate-300'>
                <div className='flex justify-start items-center gap-6 md:hidden'>
                    <Link href={'/'} className='flex justify-start items-center font-bold text-2xl'>
                        <p className='text-blue-600 '>NB</p>
                        <BsShieldLockFill size={20} className='text-blue-600 ' />
                        <p className='text-blue-600 '>TECH</p>
                    </Link>
                </div>
                <nav className='block md:hidden'>
                    <AiOutlineMenu onClick={() => { setOpen(!open) }} className='cursor-pointer text-blue-600' size={20} />
                </nav>
            </div>
            <div className={`${open ? 'block' : 'hidden'}`}>
                <DashboardMenu setOpen={setOpen} />
            </div>
        </div>
    )
}
