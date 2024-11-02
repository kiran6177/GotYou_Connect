import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { manageMFA } from '../../features/User/userActions';

function Settings() {
    const {userData} = useSelector(state=>state.user);
    const dispatch = useDispatch();

    const handleMFA = ()=>{
        dispatch(manageMFA())
    }
  return (
    <div>
        <div className='border-2 shadow-2xl py-4 px-8 rounded-md bg-white flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="M420-360h120l-23-129q20-10 31.5-29t11.5-42q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 23 11.5 42t31.5 29l-23 129Zm60 280q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z"/></svg>
                </div>
            <div className='flex flex-col gap-1 '>
            <h2 className='font-bold text-xl'>Two - Factor Authentication</h2>
            <p className='text-[#555555] text-xs'>Enable Two - factor authentication</p>
            </div>
            </div>
            <button onClick={handleMFA} className='tracking-wider bg-black border-2 border-black text-white px-8 py-2 rounded-md hover:text-black hover:bg-white transition-all duration-150 ease-in-out'>
                {userData?.mfaEnabled ? "DISABLE" :"ENABLE"}
            </button>
        </div>
    </div>
  )
}

export default Settings