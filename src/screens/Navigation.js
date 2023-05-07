import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Home from '../pages/home/Home'
import Login from '../pages/login/Login';
import NewUser from '../pages/newUser/NewUser';
import NotFound from '../pages/notFound/notFound';
import Stn from '../pages/stn/Stn';
import User from '../pages/user/User';
import UserDetails from '../userComponent/user/userDetails';
const Navigation = () => {


    const { currentUser } = useContext(AuthContext);



    const RequireAuth = ({ children }) => {
        return currentUser ? (children) : <Navigate to="/login" />
    }

    return (
        <BrowserRouter>
            <Routes >
                <Route path='/'>
                    <Route index element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path='*' element={<NotFound />} />
                </Route>
                <Route path='stn' >
                    <Route index element={<RequireAuth ><Stn /></RequireAuth>} />
                    <Route path='*' element={<NotFound />} />

                </Route>
                <Route path='user' >
                    <Route index element={<User />} />
                    <Route path=":my" element={<RequireAuth><UserDetails /></RequireAuth>} />
                    <Route path="newuser" element={<RequireAuth><NewUser /></RequireAuth>} />

                     {/* <Route path='*' element={<NotFound />} /> */}
                </Route>


                <Route path="/login" element={<Login />} />


            </Routes>
        </BrowserRouter>
    )
}

export default Navigation