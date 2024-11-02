import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthBanner from './AuthBanner'
import { toast, Toaster } from 'sonner';
import { emailRegex, mobileRegex, passwordRegex } from '../../Config/config';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../features/User/userActions';
import { reset } from '../../features/User/userSlice';
import OtpModal from './OtpModal';

function Register() {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [mobile,setMobile] = useState("");
    const [password,setPassword] = useState("");
    const [cPassword,setCPassword] = useState("");
    const [imageFile,setImageFile] = useState(null);
    const [OTP,setOTP] = useState(false);

    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading,success,error,token} = useSelector(state=>state.user);

    useLayoutEffect(()=>{
        if(token){
            navigate("/",{replace:true})
            return
        }
    },[token])

    useEffect(()=>{
        if(success){
            setOTP(true)
            return
        }
        if(error){
            toast.error(error)
            dispatch(reset())
            return
        }
    },[success,error])

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(name?.trim() === "" && email.trim() === "" && mobile.trim() === "" && password.trim() === "" && cPassword.trim() === ""){
            toast.error("Please fill all the details")
            return
        }
        if(!imageFile){
            toast.error("Select your Profile Picture")
            return
        }
        if(!imageFile.type.startsWith("image/")){
            toast.error("Selected file is not an Image!!")
            return
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
        console.log(name,email ,mobile ,password ,cPassword, imageFile)
        const formData = new FormData();
        formData.append("name",name)
        formData.append("email",email)
        formData.append("mobile",mobile)
        formData.append("password",password)
        formData.append("cPassword",cPassword)
        formData.append("profile",imageFile)
        dispatch(signup(formData))
    }

  return (
<div className="flex flex-col-reverse md:flex-row md:h-screen justify-between w-screen">
    <Toaster richColors/>
    <AuthBanner />
    <div className="w-[100%] md:w-[50%]  flex flex-col items-center justify-between  ">
        <div className="flex flex-col gap-5 w-[80%] sm:w-[55%] overflow-hidden mt-[2rem] md:my-auto">
            <div className="flex flex-col gap-2 w-[100%]">
                <h2 className="text-xl font-medium">Connect With Your Friends!!</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
                <div className='border-2 border-black rounded-full w-[7rem] h-[7rem] flex items-center justify-center overflow-hidden relative'>
                    <img src={imageFile ? URL.createObjectURL(imageFile) :"/assets/unknown_avatar.jpg"} alt="" className='object-cover h-full absolute' />
                </div>
                    <button type='button' onClick={()=>inputRef.current.click()} className='hover:scale-[1.02] transition-all duration-100 ease-linear'>Add Profile Picture</button>
                <input type="file" ref={inputRef} onChange={(e)=>setImageFile(e.target.files[0])} className='hidden' />
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <input type="number" value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <input type="password" value={cPassword} onChange={(e)=>setCPassword(e.target.value)} placeholder="Password" className="bg-[#EEEEEE] text-xs p-3 rounded-sm w-[100%]" />
                <button disabled={loading} className={`${loading ? "bg-[#0000009f]" :"bg-[#000000]"} text-white py-2 rounded-sm tracking-wider font-bold w-full`}>{loading ? "SIGNING UP..." :"SIGNUP"}</button>
            </form>
            <h2 className="text-xs text-[#36393F] ">Already have an account ?
                <Link to={"/login"} className="text-blue-700"> SIGN IN</Link>
            </h2>
        </div>
    </div>
    {OTP && <OtpModal from="SIGNUP" setOTP={setOTP} email={email} />}
</div>
  )
}

export default Register
