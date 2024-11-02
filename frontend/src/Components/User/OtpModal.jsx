import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { verifyOTP } from '../../features/User/userActions'
import { toast } from 'sonner'
import { reset } from '../../features/User/userSlice'

function OtpModal({from,setOTP,email}) {
    const [otpValue,setOtpValue] = useState(new Array())
    const [showInp,setShowInp] = useState(new Array(4).fill(false))
    const [time,setTime] = useState(60);

    const oneRef = useRef()
    const twoRef = useRef()
    const threeRef = useRef()
    const fourRef = useRef()

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const {success,loading,message,error} = useSelector(state=>state.user);

    useEffect(()=>{
        if(message){ 
            toast.success(message)
            setTimeout(()=>{
                setOTP(false)
                if(from === "SIGNUP"){
                    navigate("/login")
                }else if(from === "LOGIN"){
                    navigate("/",{replace:true})
                }
                dispatch(reset())
            },1000)
            return
        }
        if(error){
            toast.error(error)
            return
        }
    },[error,message])

    useEffect(()=>{
        if(otpValue?.length === 0){
            oneRef.current.focus()
        }
        if(otpValue?.length === 1){
            twoRef.current.focus()
        }
        if(otpValue?.length === 2){
            threeRef.current.focus()
        }
        if(otpValue?.length === 3){
            fourRef.current.focus()
        }
    },[otpValue])

    useEffect(()=>{
        let inter
        const storedTime = localStorage.getItem('otpTime');
            if(storedTime){
              setTime(parseInt(storedTime))
            }else{
              localStorage.setItem('otpTime',60);
            }
        
             inter = setInterval(()=>{
              setTime((prev)=>{
                if(prev > 0){
                  let newtime = prev - 1;
                  localStorage.setItem('otpTime',newtime)
                  return newtime
                }else{
                  clearInterval(inter)
                  localStorage.removeItem('otpTime')
                //   setOTP(true)
                  return 0
                }
              })
            },1000)
            return ()=>{
                clearInterval(inter)
            }
    },[])
    
    const handleInsert = (e,index)=>{
        const target = e.target.value;
        let valueToInsert = target.split("")[target.length - 1];
        if(valueToInsert){
            
            setShowInp(prev=>{
                let inpNew = [...prev];
                inpNew[index] = true
                return inpNew
            })
            setOtpValue(prev=>{
                let newOTP = [...prev]
                if(newOTP[index] === ""){
                    newOTP[index] = valueToInsert
                }else{
                    newOTP.push(valueToInsert)
                }
                return newOTP
            })
        }else{
            setOtpValue(prev=>{
                let newOTP = [...prev]
                newOTP[index] = ""
                return newOTP
            })
        }
    }

    const handleShowInp = (index)=>{
        setShowInp(prev=>{
            let newInp = [...prev]
            newInp[index] = false
            return newInp
        })
    }

    const handleVerifyOTP = ()=>{
        localStorage.removeItem('otpTime')
        const otp = otpValue.join("");
        console.log(success,from)
        dispatch(verifyOTP({otp,success,from,email}))
        // setTimeout(()=>{ 
        //     dispatch(reset())
        // },1000)
    }

  return createPortal(
    <div className='fixed h-screen w-screen z-20 top-0 bg-[#0000007e]  flex justify-center items-center'>
        <div className='shadow-xl shadow-black dark:text-white bg-white dark:bg-black  dark:shadow-[#ffffff09] rounded-md w-[80%] sm:w-[70%] md:w-[55%] lg:w-[40%] xl:w-[30%] p-8 relative'>
            <div className='text-black dark:text-white cursor-pointer absolute right-5 top-5' onClick={()=>{setOTP(false);dispatch(reset())}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </div>
            <h2 className='text-2xl font-bold text-center'>Enter your OTP</h2>
            <h6 className="text-xs  text-center opacity-65">An OTP was sent to your Email</h6>
            <div className='flex justify-evenly my-6 otpInputs'>
                {otpValue[0] && showInp[0]? <p className='font-bold text-2xl'  onClick={()=>handleShowInp(0)}>{otpValue[0]}</p> :<input ref={oneRef} type="number" value={otpValue[0]} onChange={(e)=>handleInsert(e,0)} className='bg-[#EEEEEE] w-[2rem] h-[2rem] px-3 rounded-full' />}
                {otpValue[1] && showInp[1]? <p className='font-bold text-2xl'  onClick={()=>handleShowInp(1)}>{otpValue[1]}</p> :<input ref={twoRef} type="number" value={otpValue[1]} onChange={(e)=>handleInsert(e,1)} className='bg-[#EEEEEE] w-[2rem] h-[2rem] px-3 rounded-full' />}
                {otpValue[2] && showInp[2]? <p className='font-bold text-2xl'  onClick={()=>handleShowInp(2)}>{otpValue[2]}</p> :<input ref={threeRef} type="number" value={otpValue[2]} onChange={(e)=>handleInsert(e,2)} className='bg-[#EEEEEE] w-[2rem] h-[2rem] px-3 rounded-full' />}
                {otpValue[3] && showInp[3]? <p className='font-bold text-2xl'  onClick={()=>handleShowInp(3)}>{otpValue[3]}</p> :<input ref={fourRef} type="number" value={otpValue[3]} onChange={(e)=>handleInsert(e,3)} className='bg-[#EEEEEE] w-[2rem] h-[2rem] px-3  rounded-full' />}
            </div>
            <button onClick={handleVerifyOTP} className="bg-black dark:bg-white border-2 border-black text-white dark:text-black py-2 rounded-md w-full tracking-wider font-semibold">Verify</button>
            <div className='my-4 flex justify-between'>
                <h3 className='text-xs sm:text-sm'>00 : {time < 10 ? `0${time}` : time}</h3>
                <h2 className="text-xs  text-[#36393F] ">Don't get the code ? <Link  className="text-blue-700">Send again</Link></h2>
            </div>
        </div>
    </div>,
    document.getElementById("modal")
  )
}

export default OtpModal
