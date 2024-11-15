// contact is nothing but selectedChatData that contains contact or channel data on which it is clicked in contact list
// message conatins the response sent when received to the user the created message for contacts and channel

import { useContext } from "react";
import { AuthContext } from "@/context/Auth";

export const createChatSlice = (set, get) => {
  return {
    selectedChatType: undefined,
    selectedChatData: undefined, // it is for the data of user whith whom i am going to chat  ooooorrrr channel information on which we click
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownlodProgress: 0,
    channels: [],

    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) =>
      set({ fileDownloadProgress }),

    setSelectedChatType: (type) => set({ selectedChatType: type }),
    setSelectedChatData: (data) => set({ selectedChatData: data }),
    setSelectedChatMessages: (message) =>
      set({ selectedChatMessages: message }),
    setDirectMessagesContacts: (contacts) =>
      set({ directMessagesContacts: contacts }),
    setChannels: (channels) => set({ channels }),

    closeChat: () =>
      set({
        selectedChatData: undefined,
        selectedChatType: undefined,
        selectedChatMessages: [],
      }),

    addMessage: (message) => {
      const selectedChatMessages = get().selectedChatMessages;
      const selectedChatType = get().selectedChatType;

      set({
        selectedChatMessages: [
          ...selectedChatMessages,
          {
            ...message,
            recipient:
              selectedChatType === "channel"
                ? message.recipient
                : message.recipient._id,
            sender:
              selectedChatType === "channel"
                ? message.sender
                : message.sender._id,
          },
        ],
      });
    },

    addChannel: (channel) => {
      const channels = get().channels;
      set({ channels: [channel, ...channels] });
    },

    addChannelInChannelList: (message) => {
      const channels = get().channels;
      const data = channels.find(
        (channel) => channel._id === message.channelId
      );
      const index = channels.findIndex(
        (channel) => channel._id === message.channelId
      );

      if (index !== -1 && index !== undefined) {
        channels.splice(index, 1); // Remove the existing channel from its position
        channels.unshift(data); // Add the channel to the beginning of the list
      }
    },

    addContactInContactList: (message, auth) => {
      const fromId =
        auth.user._id === message.sender._id
          ? message.recipient._id
          : message.sender._id;
      const fromData =
        auth.user._id === message.sender._id
          ? message.recipient
          : message.sender;

      const dmContacts = get().directMessagesContacts;
      const index = dmContacts.findIndex((contact) => contact._id === fromId);
      const data = dmContacts.find((contact) => contact._id === fromId);

      if (index !== -1) {
        dmContacts.splice(index, 1);
        dmContacts.unshift(data);
      } else {
        dmContacts.unshift(fromData);
      }
      set({ directMessagesContacts: dmContacts });
    },
  };
};
