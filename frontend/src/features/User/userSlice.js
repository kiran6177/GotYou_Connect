import { createSlice } from "@reduxjs/toolkit";
import { changePassword, editProfile, login, logout, manageMFA, signup, verifyOTP } from "./userActions";

const initialState = {
    userData : null,
    token : null,
    loading : false,
    data:null,
    error : "",
    success : false , 
    message : ""
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers : {
        reset : (state)=>{
            state.loading = false
            state.error = ""
            state.success = false 
            state.message = ""
        },
        removeError:(state,action)=>{
            state.error = ""
        },
        removeData:(state,action)=>{
            state.data = null
        },
        logoutUser : (state)=>{
            state.userData = null
            state.token = null
            state.loading = false
            state.data = null
            state.error = ""
            state.success = false 
            state.message = ""
        },
        setIsAuthenticated : (state,action) =>{
            console.log(action)
            state.token = action.payload
        }
    },
    extraReducers : (builder) =>{
            builder
            .addCase(signup.fulfilled,(state,action)=>{
                state.success = action.payload?.success
                state.loading = false
            })
            .addCase(signup.pending,(state)=>{
                state.loading = true
            })
            .addCase(signup.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload
            })
            .addCase(verifyOTP.fulfilled,(state,action)=>{
                if(action.payload?.success && action.payload?.message){
                    state.message = action.payload?.message 
                    state.userData = {
                        ...state.userData,
                        email: action.payload?.email ?? state.userData?.email
                    }             
                }else if(action.payload?.success && !action.payload?.message){
                    state.message = "Account Verified Succesfully"                
                }
                if(action.payload?.user){
                    state.message = "Login Succesfully"     
                    state.userData = action.payload.user 
                    state.token = true
                }
                state.loading = false   
            })
            .addCase(verifyOTP.pending,(state)=>{
                state.loading = true
            })
            .addCase(verifyOTP.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload
            })
            .addCase(login.fulfilled,(state,action)=>{
                console.log(action);
                if(action.payload?.user){
                    state.userData = action.payload?.user
                    state.token = true
                    state.success = true
                }
                if(action.payload?.success){
                    state.success = action.payload?.success
                }
                state.loading = false
            })
            .addCase(login.pending,(state)=>{
                state.loading = true
            })
            .addCase(login.rejected,(state,action)=>{
                console.log(action)
                state.loading = false
                state.error = action.payload
            })
            .addCase(logout.fulfilled,(state,action)=>{
                console.log(action);
                if(action.payload?.success){
                    state.message = "Logout Successfully"
                }
                state.loading = false
            })
            .addCase(logout.pending,(state)=>{
                state.loading = true
            })
            .addCase(logout.rejected,(state,action)=>{
                console.log(action)
                state.loading = false
                state.error = action.payload
            })
            .addCase(manageMFA.fulfilled,(state,action)=>{
                console.log(action);
                if(action.payload?.success){
                    state.userData = {
                        ...state.userData,
                        mfaEnabled: action.payload?.status ?? state.userData?.mfaEnabled
                    }
                }
                state.loading = false
            })
            .addCase(manageMFA.pending,(state)=>{
                state.loading = true
            })
            .addCase(manageMFA.rejected,(state,action)=>{
                console.log(action)
                state.loading = false
                state.error = action.payload
            })
            .addCase(editProfile.fulfilled,(state,action)=>{
                console.log(action);
                if(action.payload?.success && action.payload?.email ){
                    state.success = action.payload?.success
                    state.data = action.payload?.email
                }
                if(action.payload?.success && !action.payload?.email ){
                    state.userData = action.payload?.success
                    state.message = "Updated Successfully"
                }
                state.loading = false
            })
            .addCase(editProfile.pending,(state)=>{
                state.loading = true
            })
            .addCase(editProfile.rejected,(state,action)=>{
                console.log(action)
                state.loading = false
                state.error = action.payload
            })
            .addCase(changePassword.fulfilled,(state,action)=>{
                console.log(action);
                state.success = true
                state.loading = false
            })
            .addCase(changePassword.pending,(state)=>{
                state.loading = true
            })
            .addCase(changePassword.rejected,(state,action)=>{
                console.log(action)
                state.loading = false
                state.error = action.payload
            })
    }
})

export const userReducer = userSlice.reducer;

export const { reset , removeError, removeData, logoutUser, setIsAuthenticated } = userSlice.actions;

