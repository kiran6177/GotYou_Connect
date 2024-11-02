import React from 'react'
import { useSelector } from 'react-redux'

function Activity() {
  const {userData} = useSelector(state=>state.user);

  return (
    <div>
        <h2 className='text-2xl font-bold tracking-wider dark:text-white'>ACTIVITY</h2>
        <div className='my-6'>
          <div className='border-2 border-black dark:border-white rounded-md bg-white dark:bg-black dark:text-white p-4 flex items-center gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor"><path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg>
          <div className='flex flex-col gap-1'>
          <h2 className='text-lg font-semibold'>Last Activity</h2>
          <p className='text-xs text-[#555555]'>{new Date(userData?.lastLoginTime).toLocaleString('en-US',{hour: 'numeric',minute: 'numeric',month:'long',day:'numeric',year:'numeric'})}</p>
          </div>
          </div>
        </div>
    </div>
  )
}

export default Activity
