import { useAppStore } from "@/store";
import React, { useRef, useContext, useEffect } from "react";
import { AuthContext } from "@/context/Auth";
import moment from "moment";
import axios from "axios";
import { toast } from "sonner";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { auth } = useContext(AuthContext);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/message/get-prev-messages`,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        console.log("message ares: ", response.data.messages);

        if (response?.data?.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log("error while fetching messages", error);
        // toast.error(error?.data?.response?.message);
      }
    };
    console.log(selectedChatData._id, selectedChatType._id);

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
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
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (fileURL) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_IMAGE_URL}/${fileURL}`,
        { responseType: "blob" }
      );
      console.log(response);
      const urlBlob = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileURL.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Download failed", error);
    }
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
            <div className=" cursor-pointer">
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${message.fileURL}`}
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
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className=" flex-1 overflow-y-auto scrollbar-hidden p-4px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
