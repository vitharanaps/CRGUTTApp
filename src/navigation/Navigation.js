import React, { useContext, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../screens/homeScreen/Home';
import Lines from '../screens/lines/Lines';
import Login from '../screens/login/Login';
import NewUser from '../screens/newUser/NewUser';
import NotFound from '../screens/notFound/notFound';
import Signals from '../screens/signals/Signals';
import Stns from '../screens/stn/Stns';
import Trains from '../screens/trains/Trains';
import User from '../screens/user/User';
import ViewLine from '../screens/viewLine/ViewLine';
import ViewSignals from '../screens/viewSignals/ViewSignals';
import ViewStns from '../screens/viewStns/ViewStns';
import ViewTrain from '../screens/viewTrain/ViewTrain';
import ViewUserDetails from '../screens/viewUserDetails/ViewUserDetails';
import { AuthContext } from '../context/AuthContext';
import HomeStation from '../screens/homeStation/HomeStation';

const Navigation = () => {

    const {currentUser} = useContext(AuthContext);
   
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
                    <Route index element={<RequireAuth ><Stns /></RequireAuth>} />
                    <Route path=":my" element={<RequireAuth><ViewStns /></RequireAuth>} />

                    <Route path='*' element={<NotFound />} />

                </Route>
                <Route path='user' >
                    <Route index element={<RequireAuth><User /></RequireAuth>} />
                    <Route path=":my" element={<RequireAuth><ViewUserDetails /></RequireAuth>} />
                    <Route path="newuser" element={<RequireAuth><NewUser /></RequireAuth>} />

                     {/* <Route path='*' element={<NotFound />} /> */}
                </Route>
                <Route path='trains' >
                    <Route index element={<RequireAuth><Trains /></RequireAuth>} />
                    <Route path=":my" element={<RequireAuth><ViewTrain /></RequireAuth>} />
                    {/* <Route path="newuser" element={<RequireAuth><NewUser /></RequireAuth>} /> */}

                     {/* <Route path='*' element={<NotFound />} /> */}
                </Route>
                <Route path='lines' >
                    <Route index element={<RequireAuth><Lines /></RequireAuth>} />
                    <Route path=":my" element={<RequireAuth><ViewLine /></RequireAuth>} />
                    {/* <Route path="newuser" element={<RequireAuth><NewUser /></RequireAuth>} /> */}

                     {/* <Route path='*' element={<NotFound />} /> */}
                </Route>
                <Route path='homeStation' >
                    <Route index element={<RequireAuth><HomeStation /></RequireAuth>} />
                    <Route path=":my" element={<RequireAuth><ViewLine /></RequireAuth>} />
                    {/* <Route path="newuser" element={<RequireAuth><NewUser /></RequireAuth>} /> */}

                     {/* <Route path='*' element={<NotFound />} /> */}
                </Route>
                <Route path='signals' >
                    <Route index element={<RequireAuth><Signals /></RequireAuth>} />
                    <Route path=":my" element={<RequireAuth><ViewSignals /></RequireAuth>} />
                    <Route path="newuser" element={<RequireAuth><NewUser /></RequireAuth>} />

                     {/* <Route path='*' element={<NotFound />} /> */}
                </Route>


                <Route path="/login" element={<Login />} />


            </Routes>
        </BrowserRouter>
    )
}

export default Navigation