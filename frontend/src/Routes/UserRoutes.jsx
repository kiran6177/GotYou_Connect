import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/User/HomePage'
import LoginPage from '../Pages/User/LoginPage'
import ProtectedRoutes from './ProtectedRoutes'
import RegisterPage from '../Pages/User/RegisterPage'
import ProfilePage from '../Pages/User/ProfilePage'
import Settings from '../Components/User/Settings'
import EditProfile from '../Components/User/EditProfile'
import MyProfile from '../Components/User/MyProfile'
import Activity from '../Components/User/Activity'

function UserRoutes() {
  return (
    <Routes>
        <Route path='/' element={ <ProtectedRoutes>
            <HomePage />
            </ProtectedRoutes>
            } />
            <Route path='/profile' element={ <ProtectedRoutes>
                <ProfilePage />
                </ProtectedRoutes>
                } >
                <Route index element={ <MyProfile />
                } />
                <Route path='/profile/settings' element={ <Settings />
                } />
                <Route path='/profile/edit' element={ <EditProfile />
                } />
                <Route path='/profile/activity' element={ <Activity />
                } />
            </Route>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<RegisterPage />} />
    </Routes>
  )
}

export default UserRoutes
