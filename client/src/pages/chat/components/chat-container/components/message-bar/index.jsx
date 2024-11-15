import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "@/context/Auth";
import EmojiPicker from "emoji-picker-react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import axios from "axios";
import { data } from "autoprefixer";

const MessageBar = () => {
  const fileInputRef = useRef(); // for managing upload file click
  const { auth } = useContext(AuthContext);
  const socket = useSocket();
  const emojiRef = useRef(); // this useref for close the emoji picker when clicked on oyher part of screen
  const {
    selectedChatType,
    selectedChatData,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
        socket.current.emit("sendMessage", {
          sender: auth?.user?._id,
          content: message,
          recipient: selectedChatData._id,
          messageType: "text",
          fileURL: undefined,
        });
    } else if (selectedChatType === "channel") {
      socket.current.emit("send-channel-message", {
        sender: auth?.user?._id,
        content: message,
        messageType: "text",
        fileURL: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/message/file-upload`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        }
      );

      if (response.status === 200 && response.data) {
        setIsUploading(false);
        if (selectedChatType === "contact") {
          socket.current.emit("sendMessage", {
            sender: auth?.user?._id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileURL: response.data.filePath,
          });
        } else if (selectedChatType === "channel") {
          socket.current.emit("send-channel-message", {
            sender: auth?.user?._id,
            content: undefined,
            messageType: "file",
            fileURL: response.data.filePath,
            channelId: selectedChatData._id,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setIsUploading(false);
      toast.error(error?.response?.data?.message || "file haven't sent");
    }
  };

  return (
    // <>
    //   <h1>hello from chat</h1>
    // </>
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
          />{" "}
          {/*will handle file upload*/}
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => {
              setEmojiPickerOpen(true);
            }}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-5 -right-20" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
