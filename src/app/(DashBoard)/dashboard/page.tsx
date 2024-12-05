import AddArticleForm from '@/components/Pages/Dashboard/AddArticleForm'
import React from 'react'

export default function page() {
  return (
    <div className='py-5 px-10'>
      <h1 className='text-xl text-blue-600 pb-3 font-bold'>DashBoard</h1>
      <div className='bg-slate-300 rounded-md p-4 '>
        <h1 className='text-xl font-bold text-blue-500 pb-2'>Add New Article </h1>
        <AddArticleForm />
      </div>
    </div>
  )
}
