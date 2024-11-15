import React, { useContext, useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/index";
import Profile from "./pages/profile/index.jsx";
import Chat from "./pages/chat";
import { AuthContext } from "./context/Auth.jsx";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const isAuntheticated = !!auth?.user;
  return isAuntheticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const isAuntheticated = !!auth?.user;
  return isAuntheticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [ loading, setLoading ] = useState(true);
  
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/auth/profile`,
          { withCredentials: true }
        );
        console.log(response);
  
        setAuth({
          ...auth,
          user: {
            ...response?.data?.user,
            image:
              response?.data?.user?.image?.mimeType &&
              response?.data?.user?.image?.imageData
                ? `data:${response.data.user.image.mimeType};base64,${response.data.user.image.imageData}`
                : "",
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        const timer = setTimeout(() => setLoading(false), 1000);
      }
    };
    getProfile();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
  </div>
  
  }

  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
};

export default App;
