import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./User/userSlice";

const rootReducer = combineReducers({
    user:userReducer
})

export default rootReducer