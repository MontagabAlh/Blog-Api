'use client'

import Link from "next/link"

interface ErrorProps {
    error: Error;
    reset: () => void;

}

export default function Error({ error, reset }: ErrorProps) {
    return (

        <div className="flex justify-center items-center flex-col min-h-screen gap-7">
            <p className="text-3xl text-blue-600 ">
                Somthing Wint Wrong
            </p>
            <p className="text-3xl text-red-600 ">
                {error.message}
            </p>
            <div className="flex justify-center items-center gap-5">
                <div onClick={() => { reset() }} className="cursor-pointer text-white text-center  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 ">
                    Trye Again
                </div>
                <Link href={'/'} className="text-white text-center  bg-blue-600 hover:bg-blue-400 rounded-lg px-3 py-2 min-w-32 ">
                    Go to Home
                </Link>
            </div>
        </div>
    )
}
