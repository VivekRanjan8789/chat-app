import React, { useContext, useEffect } from "react";
import { Button } from "./components/ui/button";
import {  Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/index";
import Profile from "./pages/profile/index.jsx";
import Chat from "./pages/chat";
import { AuthContext } from "./context/Auth.jsx";
import axios from "axios";

const App = () => {
  
  // adding user to our global variable auth
  const { auth, setAuth} = useContext(AuthContext);

    const getProfile = async()=> {
      try {
        const user = await axios.get(`${import.meta.env.VITE_SERVER_API}/auth/profile`, { withCredentials: true });
        console.log(user);
        setAuth({user: user.data.user});             
      } catch (error) {
        console.log(error);        
      }
  }

  useEffect(()=>{
      getProfile();      
  },[])

  return (
    <>
      <Routes>
          <Route  path='/auth' element= { <Auth /> } />
          <Route  path='/profile' element= { <Profile /> } />
          <Route path='/chat' element= { <Chat /> } />
          <Route path='*' element = { <Navigate to="/auth" />}/>
      </Routes>
    </>
  );
};

export default App;
