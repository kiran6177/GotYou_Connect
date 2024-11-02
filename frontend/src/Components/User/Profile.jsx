import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/User/userActions';
import { toast, Toaster } from 'sonner';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logoutUser, reset } from '../../features/User/userSlice';

function Profile() {
  const {userData,message,loading,error} = useSelector(state=>state.user);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(()=>{
      if(message){
          if(message === 'Logout Successfully'){
            toast.success(message)
            setTimeout(()=>{
                dispatch(reset())
                dispatch(logoutUser())
                navigate("/login",{replace:true})
            },1000)
          }
          return
      }
      if(error){
          toast.error(error)
          dispatch(reset())
          return
      }
  },[userData,message,error])

  const handleLogout = ()=>{
    dispatch(logout())
  }
  return (
    <div className='pt-[6rem] flex'>
      <Toaster richColors />
      <div
        className='h-[88%] fixed shadow-2xl dark:shadow-[#ffffff5d] px-[2rem] w-[20rem] flex flex-col items-center justify-between pt-8 gap-5 bg-[#ffffff] dark:bg-black'>
        <div className='w-full flex flex-col items-center justify-center gap-4'>
                <div className='border-2 border-black dark:border-white rounded-full w-[7rem] h-[7rem] flex items-center justify-center overflow-hidden relative'>
                    <img src={userData?.image} alt="" className='object-cover h-full absolute' />
                </div>
                <h2 className='font-bold text-xl dark:text-white'>{userData?.name}</h2>
                <NavLink to={"/profile"} end className='fixed-height pl-8 pr-4 py-3 shadow-lg shadow-[#0000008b] dark:shadow-[#ffffff5d] dark:text-white w-full flex font-bold justify-start gap-2 items-center rounded-md text-sm'>
                <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor"><path d="M200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm69-80h422q-44-39-99.5-59.5T480-280q-56 0-112.5 20.5T269-200Zm211-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z"/></svg>
            PROFILE</NavLink>
                <NavLink to={"/profile/edit"} className='fixed-height pl-8 pr-4 py-3 shadow-lg shadow-[#0000008b] dark:shadow-[#ffffff5d] dark:text-white w-full flex font-bold justify-start gap-2 items-center rounded-md text-sm'>
                <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor"><path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm179-80h442L480-830 259-720ZM80-120v-80h482q2 21 5 40.5t9 39.5H80Zm600-310v-130h80v90l-80 40ZM800 0q-69-17-114.5-79.5T640-218v-102l160-80 160 80v102q0 76-45.5 138.5T800 0Zm-29-120 139-138-42-42-97 95-39-39-42 43 81 81ZM259-720h442-442Z"/></svg>
            EDIT PROFILE</NavLink>
        </div>
        <div className='w-full flex flex-col gap-4'>
        <NavLink to={'/profile/activity'} className='fixed-height pl-8 pr-4 py-3 shadow-lg shadow-[#0000008b] dark:shadow-[#ffffff5d] dark:text-white w-full flex font-bold justify-start gap-2 items-center rounded-md text-sm'>
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor"><path d="M600-120h240v-33q-25-23-56-35t-64-12q-33 0-64 12t-56 35v33Zm120-120q25 0 42.5-17.5T780-300q0-25-17.5-42.5T720-360q-25 0-42.5 17.5T660-300q0 25 17.5 42.5T720-240ZM480-480Zm2-140q-58 0-99 41t-41 99q0 48 27 84t71 50q0-23 .5-44t8.5-38q-14-8-20.5-22t-6.5-30q0-25 17.5-42.5T482-540q15 0 28.5 7.5T533-512q11-5 23-7t24-2h36q-13-43-49.5-71T482-620ZM370-80l-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-85 65H696q-1-5-2-10.5t-3-10.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q24 25 54 42t65 22v184h-70Zm210 40q-25 0-42.5-17.5T520-100v-280q0-25 17.5-42.5T580-440h280q25 0 42.5 17.5T920-380v280q0 25-17.5 42.5T860-40H580Z"/></svg>
            ACTIVITY</NavLink>
          <NavLink to={'/profile/settings'} className='fixed-height pl-8 pr-4 py-3 shadow-lg shadow-[#0000008b] dark:shadow-[#ffffff5d] dark:text-white w-full flex font-bold justify-start gap-2 items-center rounded-md text-sm'>
          <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor"><path d="M600-120h240v-33q-25-23-56-35t-64-12q-33 0-64 12t-56 35v33Zm120-120q25 0 42.5-17.5T780-300q0-25-17.5-42.5T720-360q-25 0-42.5 17.5T660-300q0 25 17.5 42.5T720-240ZM480-480Zm2-140q-58 0-99 41t-41 99q0 48 27 84t71 50q0-23 .5-44t8.5-38q-14-8-20.5-22t-6.5-30q0-25 17.5-42.5T482-540q15 0 28.5 7.5T533-512q11-5 23-7t24-2h36q-13-43-49.5-71T482-620ZM370-80l-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-85 65H696q-1-5-2-10.5t-3-10.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q24 25 54 42t65 22v184h-70Zm210 40q-25 0-42.5-17.5T520-100v-280q0-25 17.5-42.5T580-440h280q25 0 42.5 17.5T920-380v280q0 25-17.5 42.5T860-40H580Z"/></svg>
            SETTINGS</NavLink>
          <button onClick={handleLogout} type='button' className='bg-red-600 py-2 px-4 text-white shadow-lg dark:shadow-[#ffffff5d] rounded-md my-8 w-full hover:scale-[1.02] transition-all duration-200 ease-in-out tracking-widest font-bold'>LOGOUT</button>
        </div>
      </div>

    <div className='w-full pl-[22rem] pr-8 py-8 bg-[#e7e7e7] dark:bg-black min-h-[89vh]'>
        <Outlet/>
    </div>

    </div>
  )
}

export default Profile
