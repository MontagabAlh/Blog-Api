import Footer from '@/components/theme/Footer/Footer'
import Header from '@/components/theme/Header/Header'
import React from 'react'

export default function NotFound() {
    return (
        <div className="w-full flex flex-col justify-between min-h-screen">
            <div>
                <Header />
                <div>
                    NotFound
                </div>
            </div>
            <Footer />
        </div>
    )
}
