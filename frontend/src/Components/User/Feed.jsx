import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Feed() {
  const {userData} = useSelector(state=>state.user)
  return (
    <div className='pt-[6rem] px-[2rem] bg-gray-200 dark:bg-[#2f2f2f] min-h-screen flex justify-center gap-8'>
      <div className='w-[20%]'>
        <div className='bg-white dark:bg-black dark:text-white rounded-md p-8 mt-4 flex flex-col gap-3 shadow-2xl'>
              <div className='border-2 border-black dark:border-white rounded-full w-[7rem] h-[7rem] flex items-center justify-center overflow-hidden relative'>
                    <img src={userData?.image} alt="" className='object-cover h-full absolute' />
                </div>
              <h2 className='font-bold text-xl'>{userData?.name}</h2>  
              <h2 className='font-bold text-sm'>{userData?.email}</h2>
              <Link to={"/find-friends"} className='text-blue-600 mt-8'>Find Friends</Link>  
        </div>
      </div>
      <div className='w-[45%] bg-white dark:bg-black dark:text-white shadow-2xl p-[2rem] '>
        <h1 className='text-2xl font-bold'>Hi, {userData?.name}</h1>
      </div>
      <div className='w-[20%]'>

      </div>
    </div>
  )
}

export default Feed
