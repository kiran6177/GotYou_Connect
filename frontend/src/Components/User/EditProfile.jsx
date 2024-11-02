import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { removeData, reset } from '../../features/User/userSlice';
import { emailRegex, mobileRegex, passwordRegex } from '../../Config/config';
import { editProfile } from '../../features/User/userActions';
import OtpModal from './OtpModal';
import ChangePasswordModal from './ChangePasswordModal';

function EditProfile() {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [mobile,setMobile] = useState("");
    const [imageFile,setImageFile] = useState(null);
    const [imageSrc,setImageSrc] = useState(null);
    const [OTP,setOTP] = useState(false);
    const [change,setChange] = useState(false);

    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading,success,data,error,userData} = useSelector(state=>state.user);

    useEffect(()=>{
        if(userData){
            setName(userData?.name)
            setEmail(userData?.email)
            setMobile(userData?.mobile?.toString())
            setImageSrc(userData?.image)
        }
    },[userData])

    useEffect(()=>{
        if(success && data){
            setOTP(true)
            dispatch(removeData())
        }
        if(error){
            toast.error(error)
            dispatch(reset())
            return
        }
    },[success,data,error])

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(name?.trim() === "" && email.trim() === "" && mobile.trim() === "" ){
            toast.error("Please fill all the details")
            return
        }
        if(imageFile){
            if(!imageFile.type.startsWith("image/")){
                toast.error("Selected file is not an Image!!")
                return
            }
        }
        if(name?.trim() === ""){
            toast.error("Enter your Name")
            return
        }
        
        if(email?.trim() === ""){
            toast.error("Enter your email")
            return
        }
        
    
        if(!emailRegex.test(email)){
            toast.error("Invalid Email Format!!")
            return
        }
    
        if(mobile?.trim() === ""){
            toast.error("Please enter your Mobile Number!!")
            return
        }
    
        if(mobile?.length !== 10){
            toast.error("Mobile Number should be 10 Digits!!")
            return
        }
    
        if(!mobileRegex.test(mobile)){
            toast.error("Invalid Mobile Number")
            return
        }
        console.log(name,email ,mobile, imageFile)
        const formData = new FormData();
        formData.append("name",name)
        formData.append("email",email)
        formData.append("mobile",mobile)
        imageFile && formData.append("profile",imageFile)
        dispatch(editProfile(formData))
    }
  return (
    <div className='w-[65%] mx-auto'>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
                <div className='border-2 border-black rounded-full w-[7rem] h-[7rem] flex items-center justify-center overflow-hidden relative'>
                    <img src={imageFile ? URL.createObjectURL(imageFile) :imageSrc ? imageSrc :"/assets/unknown_avatar.jpg"} alt="" className='object-cover h-full absolute' />
                </div>
                    <button type='button' onClick={()=>inputRef.current.click()} className='hover:scale-[1.02] transition-all duration-100 ease-linear'>Change Profile Picture</button>
                <input type="file" ref={inputRef} onChange={(e)=>setImageFile(e.target.files[0])} className='hidden' />
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="bg-[#EEEEEE] text-sm p-3 rounded-sm w-[100%]" />
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="bg-[#EEEEEE] text-sm p-3 rounded-sm w-[100%]" />
                <input type="number" value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile" className="bg-[#EEEEEE] text-sm p-3 rounded-sm w-[100%]" />
                <button disabled={loading} className={`${loading ? "bg-[#0000009f]" :"bg-[#000000]"} text-white py-2 rounded-sm tracking-wider font-bold w-full`}>{loading ? "UPDATING..." :"UPDATE"}</button>
                <button type='button'onClick={()=>setChange(true)} className={`text-center bg-[#d82525] text-white py-2 rounded-sm tracking-wider font-bold w-full`}>CHANGE PASSWORD</button>
            </form>
        {OTP && <OtpModal from="EMAIL" setOTP={setOTP} email={data}/>}
        {change && <ChangePasswordModal  setChange={setChange} />}
    </div>
  )
}

export default EditProfile
