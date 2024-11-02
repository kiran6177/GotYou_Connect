import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../axios";
import { setIsAuthenticated } from "./userSlice";

const rejectToken = (thunkApi,error)=>{
    if(error.response.status === 403 || error.response.status === 401){
        thunkApi.dispatch(setIsAuthenticated(false))
    }
}

export const signup = createAsyncThunk("user/signup",async (data,thunkApi)=>{
    try {
        const response = await axiosInstance.post("/auth/signup",data)
        return response.data
    } catch (error) {
        rejectToken(thunkApi,error)
        return thunkApi.rejectWithValue(error.response.data.error)
    }
})

export const verifyOTP = createAsyncThunk("user/verifyOTP",async ({otp,success,from,email},thunkApi)=>{
    try {
        const response = await axiosInstance.post("/auth/verifyotp",{otp,id:success,from,email})
        return response.data 
    } catch (error) { 
        rejectToken(thunkApi,error)
        return thunkApi.rejectWithValue(error.response.data.error)
    }
})

export const login = createAsyncThunk("user/login",async (data,thunkApi)=>{
    try {
        const response = await axiosInstance.post("/auth/login",data)
        return response.data
    } catch (error) {
        rejectToken(thunkApi,error)
        return thunkApi.rejectWithValue(error.response.data.error)
    }
})

export const logout = createAsyncThunk("user/logout",async (data,thunkApi)=>{
    try {
        const response = await axiosInstance.get("/auth/logout")
        return response.data
    } catch (error) {
        rejectToken(thunkApi,error)
        return thunkApi.rejectWithValue(error.response.data.error)
    }
})

export const manageMFA = createAsyncThunk("user/manageMFA",async (data,thunkApi)=>{
    try {
        const response = await axiosInstance.get("/auth/manageMFA")
        return response.data
    } catch (error) {
        rejectToken(thunkApi,error)
        return thunkApi.rejectWithValue(error.response.data.error)
    }
})

export const editProfile = createAsyncThunk("user/editProfile",async (data,thunkApi)=>{
    try {
        const response = await axiosInstance.put("/auth/profile",data)
        return response.data
    } catch (error) {
        rejectToken(thunkApi,error)
        return thunkApi.rejectWithValue(error.response.data.error)
    }
})

export const changePassword = createAsyncThunk("user/changePassword",async (data,thunkApi)=>{
    try {
        const response = await axiosInstance.put("/auth/changepassword",data)
        return response.data
    } catch (error) {
        rejectToken(thunkApi,error)
        return thunkApi.rejectWithValue(error.response.data.error)
    }
})