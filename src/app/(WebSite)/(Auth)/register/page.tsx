import FormRegister from '@/components/Pages/Register/FormRegister'
import Link from 'next/link'

export default function Page() {

  return (
    <div className='flex w-full justify-center items-center h-[80vh]'>
      <div className='flex flex-col justify-start items-start gap-5 bg-slate-200 px-5 pt-10 pb-5 rounded-md'>
        <p className='text-2xl font-bold text-blue-600'>Register</p>
        <FormRegister />
        <div className='text-center w-full my-[-10px]'>
          <p className='text-sm text-slate-700 '>or <Link href={'/login'} className='text-blue-400 underline'>Login</Link></p>
        </div>
      </div>
    </div>
  )
}
