import React from 'react'

const Home = () => {
  return (
    <div className='w-screen flex-col px-6 lg:p-0 min-h-screen flex items-center'>
        <h1 className='text-3xl mb-16 mt-60'>Upišite ime knjige ili autora</h1>
        <input type="text"  
        className='input search-input pb-3 text-gray-700 w-full lg:w-1/3 box-content rounded-none border-b border-x-0 border-t-0 border-gray-500 text-xl text-center lg:text-2xl '/>
    </div>
  )
}

export default Home