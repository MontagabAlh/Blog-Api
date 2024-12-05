import Pagination from '@/components/Pages/Article/Pagination'
import SearchArticleInput from '@/components/Pages/Article/SearchArticleInput'
import SingleArticle from '@/components/Pages/Article/SingleArticle'
import { Article } from '@/utils/types/types'
import React from 'react'

export default async function page() {
  const respons = await fetch(`${process.env.NEXT_SERVER_API}/articles`)
  if (!respons.ok) {
    throw new Error('Failed to fetch Articles')
  }
  const data: Article[] = await respons.json()
  return (
    <div className=''>
      <div className='text-2xl font-bold text-blue-400 text-center py-3'>Article</div>
      <div className='mb-3'>
        <SearchArticleInput />
      </div>
      <div className='flex flex-wrap gap-4 md:gap-7 md:px-5 justify-center items-start'>
        {
          data.slice(0, 10).map((post) => {
            return (
              <div key={post.id}>
                <SingleArticle post={post} />
              </div>
            )
          })
        }
      </div>
      <div>
        <Pagination /> 
      </div>
    </div>
  )
}
