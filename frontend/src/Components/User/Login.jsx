import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthBanner from './AuthBanner'
import { emailRegex, passwordRegex } from '../../Config/config'
import { toast, Toaster } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { removeError, reset } from '../../features/User/userSlice';
import { login } from '../../features/User/userActions';
import OtpModal from './OtpModal';

function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [OTP,setOTP] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading,success,error,userData,token} = useSelector(state=>state.user);

    useLayoutEffect(()=>{
        if(token){
            navigate("/",{replace:true})
            return
        }
    },[token])

    useEffect(()=>{
        if(error && !OTP){
            toast.error(error)
            dispatch(removeError())
            return
        }
        if(success && userData){
            toast.success("Logged In Successfully")
            setTimeout(()=>{
                dispatch(reset())
                navigate("/",{replace:true})
            },1000)
            return
        }else if(success && !userData && !OTP){
            toast.success("Verify your Account")
            setOTP(true)
            return
        }

    },[userData,success,error])


    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(email,password)
        if(email.trim() === "" && password.trim() === ""){
            toast.error("Please fill all the details")
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
        dispatch(login({email,password}))
    }  
  return (
<div className="flex flex-col-reverse md:flex-row md:h-screen justify-between w-screen">
    <Toaster richColors />
      <div className="w-[100%] md:w-[50%]  flex flex-col items-center justify-between  ">
        <div className="flex flex-col gap-5 w-[80%] sm:w-[55%] overflow-hidden mt-[2rem] md:my-auto">
            <div className="flex flex-col gap-2 w-[75%]">
                <h2 className="text-3xl font-medium">Welcome Back!</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="bg-[#EEEEEE] text-xs p-3 rounded-sm"  />
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="bg-[#EEEEEE] text-xs p-3 rounded-sm"  />
                <button disabled={loading} className={`${loading ? "bg-[#00000098]" :"bg-[#000000]"} text-white py-2 rounded-sm tracking-wider font-bold`}>{loading ? "LOGGING IN..." :'LOGIN'}</button>
            </form>
            <h2 className="text-xs text-[#36393F] ">Don't have an account ? <Link to={"/signup"} className="text-blue-700">SIGNUP</Link></h2>
        </div>
      </div>
      <AuthBanner/>
      {OTP && <OtpModal from="LOGIN" setOTP={setOTP} email={email} />}

    </div>
  )
}

export default Login
