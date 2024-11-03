import { useEffect, createContext, useContext, useRef } from "react";

import { io } from "socket.io-client";
import { AuthContext } from "./Auth.jsx";
import { useAppStore } from "@/store/index.jsx";
import { Contact, Type } from "lucide-react";

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

      // for contact messages
      const handleReceiveMessage = (message) => {
        console.log("message received from contact is : ", message);

        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();
        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          console.log("message rcvd: ", message);
          addMessage(message);
        }
      };

      // for channel messages
      const handleReceiveChannelMessages = (message) => {
        console.log("messages received in channel is: ", message);
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();
        console.log("is equal: ", selectedChatData?._id, message?.channelId);
        console.log("selected chat type is: ", selectedChatType);
        console.log(typeof selectedChatData?._id);
        console.log(typeof message?.channelId);

        if (selectedChatData?._id === message?.channelId) {
          console.log("message in add message  is: ", message);
          addMessage(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage); // for contact(DM) messages
      socket.current.on(
        "receive-channel-message",
        handleReceiveChannelMessages
      ); // for channel messages event

      return () => {
        socket.current.disconnect();
      };
    }
  }, [auth]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
