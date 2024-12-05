const pages = [1, 2, 3, 4, 5]

export default function Pagination() {
    return (
        <div className='flex justify-center items-center mt-3 mb-2 gap-5'>
            <button className="flex items-center justify-center rounded-md h-[40px] w-[80px] bg-blue-700 hover:bg-blue-600 text-white text-xl">
                Prev
            </button>
            <div className="flex justify-center items-center gap-3 ">
                {
                    pages.map((page, index) => {
                        return (
                            <button key={index} className="flex items-center justify-center rounded-md size-10 bg-blue-700 hover:bg-blue-600 text-white text-xl">
                                {page}
                            </button>
                        )
                    })
                }
            </div>
            <button className="flex items-center justify-center rounded-md h-[40px] w-[80px] bg-blue-700 hover:bg-blue-600 text-white text-xl">
                Next
            </button>
        </div>
    )
}
