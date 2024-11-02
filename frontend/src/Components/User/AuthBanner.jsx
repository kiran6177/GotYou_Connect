import React from 'react'

function AuthBanner() {
  return (
    <div className='w-[50%] flex flex-col justify-center items-center bg-black'>
        <div className='w-[40%] bg-white px-5 py-1 flex  justify-center items-center'>
            <img src="/assets/GotYouLogo.png" alt="" className='object-cover h-full' />
        </div>
        <p className='text-white py-2'>Connect with your friends</p>
        
    </div>
  )
}

export default AuthBanner
