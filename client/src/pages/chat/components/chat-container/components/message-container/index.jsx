import { useAppStore } from "@/store";
import React, { useRef, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/Auth";
import moment from "moment";
import axios from "axios";
import { toast  } from "sonner";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { auth } = useContext(AuthContext);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    // fetching messages of contacts when clicked on contacts
    const getMessages = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/message/get-prev-messages`,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response?.data?.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        toast.error("Failed to load messages!")
      }
    };

    // fetching channel messagess when clicked on channel
    const getChannelMessages = async () => {
      try {   
        const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/channel/get-channel-messages/${selectedChatData._id}`, { withCredentials: true});
        if (response.status === 200) {      
          setSelectedChatMessages(response?.data?.messages);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "something went wrong");
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      } m-3`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80  border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80  border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileURL) ? (
            <div
              className=" cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileURL);
              }}
            >
              <img
                src={message.fileURL}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full  p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileURL.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 te2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileURL)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) => {
    const isCurrentUser = message.sender._id === auth?.user?._id;

    return (
      <div
        className={`mt-5  ${!isCurrentUser ? "text-left" : "text-right"}`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              isCurrentUser
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              isCurrentUser
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80  border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileURL) ? (
              <div
                className=" cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileURL);
                }}
              >
                <img
                  src={message.fileURL}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full  p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileURL.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 te2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileURL)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        {!isCurrentUser ? (
          // Display avatar, name, and timestamp for other users
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message?.sender?.image?.imageData ? (
                <AvatarImage
                  src={`data:${message.sender.image.mimeType};base64,${message.sender.image.imageData}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              ) : (
                <AvatarFallback
                  className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message?.sender?.firstName
                    ? message?.sender?.firstName[0]
                    : message?.sender?.email?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-white/60">
              {moment(message.timeStamp).format("LT")}
            </span>
          </div>
        ) : (
          // Display only timestamp for the current user
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timeStamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  const downloadFile = async (fileURL) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const response = await axios.get(
        `${fileURL}`,
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentCompleted = Math.round((loaded * 100) / total);
            setFileDownloadProgress(percentCompleted);
          },
        }
      );
      const urlBlob = window.URL.createObjectURL(
        new Blob([response.data], { type: response.data.type })
      );
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileURL.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className=" flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className=" fixed z-1000 top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={imageURL}
              alt="image"
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-4 fixed top-0 mt-5">
            <button className="bg-black/20 p-3 te2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300">
              <IoMdArrowRoundDown
                onClick={() => {
                  downloadFile(imageURL);
                }}
              />
            </button>
            <button className="bg-black/20 p-3 te2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300">
              <IoCloseSharp
                onClick={() => {
                  setImageURL(null);
                  setShowImage(false);
                }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
