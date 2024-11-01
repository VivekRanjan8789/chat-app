import { useEffect, createContext, useContext, useRef } from "react";

import { io } from "socket.io-client";
import { AuthContext } from "./Auth.jsx";
import { useAppStore } from "@/store/index.jsx";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const socket = useRef();

  useEffect(() => {
    if (auth?.user) {
      socket.current = io("http://localhost:3000", {
        withCredentials: true,
        query: { userId: auth?.user?._id },
      });

      socket.current.on("connect", () => {
        console.log("user connected: ", socket.current.id);
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();

        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
            selectedChatData._id === message.recipient._id
        ) {
            console.log("message rcvd: ", message);
            
            addMessage(message)
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [auth]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
