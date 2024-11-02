import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { reset } from '../../features/User/userSlice';
import { passwordRegex } from '../../Config/config';
import { changePassword } from '../../features/User/userActions';

function ChangePasswordModal({setChange}) {
    const [oPassword,setOPassword] = useState("");
    const [password,setPassword] = useState("");
    const [cPassword,setCPassword] = useState("");

    const {loading,error,success} = useSelector(state=>state.user);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(success){
            toast.success("Password Updated")
            setChange(false)
            setTimeout(()=>{
                dispatch(reset())
            },1000)
            return
        }
        if(error){
            toast.error(error)
            dispatch(reset())
            return
        }
    },[success,error])

    const handleChangePassword = ()=>{
        if(oPassword?.trim() === ""){
            toast.error("Please Enter your old Password!!")
            return
        }
    
        if(oPassword?.trim().length < 8){
            toast.error("invalid Old Password!!")
            return
        }
        if(password?.trim() === ""){
            toast.error("Please Enter your password!!")
            return
        }
    
        if(password?.trim().length < 8){
            toast.error("Password needs atleast 8 charcters!!")
            return
        }
    
        if(!passwordRegex.test(password)){
            toast.error("Password should contain alphabets and digits!!")
            return
        }
    
        if(cPassword?.trim() === ""){
            toast.error("Please Confirm your Password!!")
            return
        }
    
        if(password?.trim() !== cPassword?.trim()){
            toast.error("Password mismatch!!")
            return
        }
        dispatch(changePassword({password,oPassword,cPassword}))
    }
    return createPortal(
        <div className='fixed h-screen w-screen z-20 top-0 bg-[#0000007e] flex justify-center items-center'>
            <div className='bg-white rounded-md w-[80%] sm:w-[70%] md:w-[55%] lg:w-[40%] xl:w-[30%] p-8 relative flex flex-col gap-5'>
                <div className='text-black absolute right-5 top-5' onClick={()=>{setChange(false);}}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                </div>
                <h2 className='text-2xl font-bold text-center'>Change Password</h2>
                <input type="password" value={oPassword} onChange={(e)=>setOPassword(e.target.value)} placeholder="Old Password" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="New Password" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <input type="password" value={cPassword} onChange={(e)=>setCPassword(e.target.value)} placeholder="Confirm Password" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <button onClick={handleChangePassword} className="bg-black text-white py-2 rounded-sm w-full tracking-wider font-semibold">Verify</button>
            </div>
        </div>,
        document.getElementById("modal")
      )
}

export default ChangePasswordModal
