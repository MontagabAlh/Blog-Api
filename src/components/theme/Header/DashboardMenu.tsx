import { DashbordMnue } from '@/utils/routes/routes';
import Link from 'next/link'
import React from 'react'

interface DashboardMenuProps {
    setOpen: (value: boolean) => void;
}


export default function DashboardMenu({ setOpen }: DashboardMenuProps) {
    return (
        <div className='w-full py-4 px-5 flex flex-col justify-start items-start gap-5 bg-slate-200 md:hidden absolute top-[60px]'>
            <nav className='flex flex-col justify-start items-start gap-5 w-full'>
                {
                    DashbordMnue.map((dash, index) => {
                        return (
                            <Link key={index} onClick={() => { setOpen(false) }} className='text-blue-600 rounded-md text-lg hover:bg-slate-100 w-full p-2' href={dash.link}>{dash.name}</Link>
                        )
                    })
                }
            </nav>
        </div>
    )
}
