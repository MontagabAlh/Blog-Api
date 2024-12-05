import Footer from '@/components/theme/Footer/Footer'
import Header from '@/components/theme/Header/Header'
import React from 'react'

export default function Loading() {
    return (
        <div className="w-full flex flex-col justify-between min-h-screen">
            <div>
                <Header />
                <div className="flex justify-center items-center flex-col min-h-screen gap-7">
                    <p className="text-3xl text-blue-600 ">
                        Loading...
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
