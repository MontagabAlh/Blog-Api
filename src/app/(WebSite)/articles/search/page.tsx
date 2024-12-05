import NotFound from '@/app/not-found'
import React from 'react'

interface SearchProps {
    searchParams: { searchText: string }
}

export default function page({ searchParams }: SearchProps) {
    if (searchParams.searchText === undefined) return NotFound()
    else {
        return (
            <div>{searchParams.searchText}</div>
        )
    }
}
