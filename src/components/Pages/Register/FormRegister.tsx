'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx'

export default function FormRegister() {
    const [pass, setPass] = useState(false)
    const [pass2, setPass2] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const router = useRouter()

    const formSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (email === '') return toast.error('Email is Required', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        if (password === '') return toast.error('PassWord is Required', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        if (confPassword === '') return toast.error('Confirm Password is Required', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        if (password !== confPassword) return toast.error('Chick the Password', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        console.log({ email, password });
        toast.success('Successfully Register', {
            style: {
                background: '#333',
                color: '#fff',
            }
        })
        router.replace('/')
    }
    return (
        <form onSubmit={formSubmitHandler} className='flex flex-col gap-5'>
            <input type='email' onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Email' className='py-1 px-2 rounded-md outline-none hover:outline-blue-500 text-blue-600 placeholder:text-blue-300' />
            <div className='relative'>
                <input type={`${pass ? 'text' : 'password'}`} onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Password' className='py-1 px-2 rounded-md outline-none hover:outline-blue-500 text-blue-600 placeholder:text-blue-300' />
                <div onClick={() => setPass(!pass)} className='cursor-pointer absolute top-[6px] right-2 text-blue-600'>
                    {pass ? <RxEyeClosed size={20} /> : <RxEyeOpen size={20} />}
                </div>
            </div>
            <div className='relative'>
                <input type={`${pass2 ? 'text' : 'password'}`} onChange={(e) => setConfPassword(e.target.value)} value={confPassword} placeholder='Confirm Password' className='py-1 px-2 rounded-md outline-none hover:outline-blue-500 text-blue-600 placeholder:text-blue-300' />
                <div onClick={() => setPass2(!pass2)} className='cursor-pointer absolute top-[6px] right-2 text-blue-600'>
                    {pass2 ? <RxEyeClosed size={20} /> : <RxEyeOpen size={20} />}
                </div>
            </div>
            <button type='submit' className='text-white text-lg w-full  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 text-center'>Register</button>
            <Toaster
                position="bottom-left"
                reverseOrder={false}
            />
        </form>
    )
}
