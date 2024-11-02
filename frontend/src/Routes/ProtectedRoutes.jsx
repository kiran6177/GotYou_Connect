import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setIsAuthenticated } from '../features/User/userSlice';

function ProtectedRoutes({children}) {
    const navigate = useNavigate();
    const {token} = useSelector(state=>state.user)
    const dispatch = useDispatch();

    useEffect(()=>{
        console.log(token)
        if(!token){
            navigate("/login",{replace:true})
        }
    },[token])


    
    if(token){
        return children
    }
}

export default ProtectedRoutes
