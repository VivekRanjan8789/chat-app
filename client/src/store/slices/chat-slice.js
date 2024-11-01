export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,   // it is for the data of user whith whom i am going to chat
  selectedChatMessages: [],
  directMessagesContacts: [],
  setSelectedChatType: (type) => set({ selectedChatType: type }),
  setSelectedChatData: (data) => set({ selectedChatData: data }),
  setSelectedChatMessages: (message) => set({ selectedChatMessages: message }),
  setDirectMessagesContacts: (contacts) => set({ directMessagesContacts: contacts}),

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
            recipient: selectedChatType === 'channel' ? message.recipient : message.recipient._id,
            sender: selectedChatType === 'channel' ? message.sender : message.sender._id
          }
       ]
     })
  }
});
