import React, { useState, useContext } from "react";
import { AuthContext } from "@/context/Auth";
import axios from "axios";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // validating signup
  const validateSignup = () => {
      if(!email.length){
        toast.error("Email is required");
        return false;
      }
      if(!password.length){
        toast.error("password is required");
        return false;
      }
      if(password!==confirmPassword){
        toast.error("password and confirm password must be same");
        return false;
      }
      return true;
  }

  //validating login
  const validateLogin = () => {
    if(!email.length){
      toast.error("Email is required");
      return false;
    }
    if(!password.length){
      toast.error("password is required");
      return false;
    }
    return true;
}
  
   // handle signup
  const handleSignup = async () => {
      try {
        if(!validateSignup()){
          return;
        };
        const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/auth/signup`,{email, password}, {withCredentials: true});
        console.log(response?.data);
        
        if(response?.data?.success){
          toast.success("signup successful. Now, Please Login to use our chat application")
          navigate('/login') 
        }        
      } catch (error) {
        toast.error("error while signup")
      }    
  };

  // handle Login
  const handleLogin = async () => {
     try {
       if(!validateLogin()){
        return;
       };
       const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/auth/login`, {email, password}, {withCredentials: true}); 
       console.log("login user is: ", response);

       setAuth({
         ...auth,
         user: {
            ... response?.data?.user,
            image: (response?.data?.user?.image?.mimeType && response?.data?.user?.image?.imageData)
             ? `data:${response.data.user.image.mimeType};base64,${response.data.user.image.imageData}`
             : ""
         } 
       })

      //  if(response?.status === 200){
      //     if(response?.data?.user?.profileSetup){    
      //       navigate('/chat')
      //     }
      //     else{
            navigate('/profile')
      //     }
      //  }
       toast.success("logged in");   
     } catch (error) {
        toast.error(error.response.data.message)
     } 
  };

  return (
    <>
      <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
          <div className="flex flex-col gap-10 items-center justify-center">
            {/* input heading */}
            <div className="flex items-center justify-center flex-col">
              <div className="flex items-center justify-center">
                <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                <img src={Victory} alt="victory-img" className="h-[100px]" />
              </div>
              <p className="font-medium text-center">
                fill in the blanks to get started with the best chat app
              </p>
            </div>

            {/* input form */}
            <div className="flex justify-center items-center w-full"></div>
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent
                  text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent
                  text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <Input
                  placeholder="password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col gap-5">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <Input
                  placeholder="password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
           <div className="hidden xl:flex  justify-center items-center">
               <img src={Background} alt="background login" className="h-[600px]"/>
           </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
