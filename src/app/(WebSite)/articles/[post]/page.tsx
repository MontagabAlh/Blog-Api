import AddCommentForm from '@/components/Pages/Article/comments/AddCommentForm'
// import Cpmment from '@/components/Pages/Article/comments/Cpmment'
import Post from '@/components/Pages/Article/Post/Post'
import { Article } from '@/utils/types/types'
import React from 'react'

interface SingleArticleProps {
  params: { post: string }
}

export default async function page({ params }: SingleArticleProps) {
  const respons = await fetch(`${process.env.NEXT_SERVER_API}/articles/${params.post}`)
  if (!respons.ok) {
    throw new Error('Faild to Fetch Article')
  }
  // const res = await fetch(`${process.env.NEXT_SERVER_API}/comments/`)
  const data: Article = await respons.json()
  // const comment: Comment[] = await res.json()
  return (
    <div className='mx-10 md:mx-[150px] xl:mx-[300px]'>
      <Post post={data} />
      <div className=' my-5 flex flex-col justify-start items-center gap-2'>
        <div className='flex justify-start items-center w-full'>
          <AddCommentForm />
        </div>
        {/* {
          comment.map(com => {
            if (Number(params.post) === com.postId) {
              return (
                <div key={com.id}>
                  <Cpmment comment={com} />
                </div>
              )
            }
          })
        } */}
      </div>

    </div>
  )
}
