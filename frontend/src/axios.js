import axios from "axios";
import { BASE_URL } from "./Config/config";

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})

// axiosInstance.interceptors.response.use(
//     (response) => {
//         const isUserAuthenticated = response.headers['x-user-authenticated'];
//         console.log("XH",isUserAuthenticated)
//         if (isUserAuthenticated === 'true') {
//             console.log("Authenticated header found:", isUserAuthenticated);
//             localStorage.setItem("isUserAuthenticated",true)
//         }else if(isUserAuthenticated === 'false'){
//             localStorage.setItem("isUserAuthenticated",false)
//         }

//         return response;
//     },
//     (error) => {
//         console.log(error)
//         const isUserAuthenticated = error?.response.headers['x-user-authenticated'];
//         console.log("XH",isUserAuthenticated)
//         if (isUserAuthenticated === 'true') {
//             console.log("Authenticated header found:", isUserAuthenticated);
//             localStorage.setItem("isUserAuthenticated",true)
//         }else if(isUserAuthenticated === 'false'){
//             localStorage.setItem("isUserAuthenticated",false)
//         }
//         return Promise.reject(error);
//     }
// );

export {axiosInstance}