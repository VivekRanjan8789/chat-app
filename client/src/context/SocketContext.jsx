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
  const { selectedChatType, selectedChatData } = useAppStore.getState();

  useEffect(() => {
    if (auth?.user) {
      socket.current = io("https://chat-app-s1c6.onrender.com", {
        withCredentials: true,
        query: { userId: auth.user._id },
      });

      socket.current.on("connect", () => {
      });

      // for contact messages
      const handleReceiveMessage = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addContactInContactList,
        } = useAppStore.getState();

        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          addMessage(message);
        }
        // Pass auth to addContactInContactList
        addContactInContactList(message, auth);
      };

      // for channel messages
      const handleReceiveChannelMessages = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData?._id === message?.channelId
        ) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      socket.current.on("receiveMessage", handleReceiveMessage); // for contact (DM) messages
      socket.current.on(
        "receive-channel-message",
        handleReceiveChannelMessages
      ); // for channel messages event

      return () => {
        socket.current.disconnect();
      };
    }
  }, [auth, selectedChatType, selectedChatData]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
