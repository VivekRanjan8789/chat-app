import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '@/context/Auth'
import { useNavigate } from 'react-router-dom'
import ContactsContainer from './components/contacts-container'
import EmptyChatContainer from './components/empty-chat-container'
import ChatContainer from './components/chat-container'


const  Chat = () => {

   const { auth } = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(()=>{
    console.log("auth is", auth);
    
      if(!(auth?.user?.profileSetup)){
        console.log((auth?.user?.profileSetup));
        
          navigate('/profile')
      }
   },[])

  return (
    <div className='flex h-[100vh] text-white overflow-hidden'> 
         <ContactsContainer />
         <EmptyChatContainer />
         <ChatContainer />
    </div>
  )
}

export default  Chat