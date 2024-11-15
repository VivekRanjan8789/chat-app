import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messageModel.js";
import Channel from './models/channelModel.js'

export const setupSocket = (server) => {
  // connecting socket to http server
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:5173", "https://chat-app-frontend-o40f.onrender.com"],
      methods: ["POST", "GET"],
      credentials: true,
    },
  });

  // disconnect function
  const disconnect = (socket) => {
    console.log("user disconnected socket id: ", socket.id);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  // sendMessage Function  (DM)
  const sendMessage = async (message) => {


    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);
    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  // send channel message
  const sendChannelMessages = async (message) => {
    const { sender, content, messageType, fileURL, channelId } = message;

    const createdMessage = await Message.create({
      // message created in Message modal
      sender,
      recipient: null,
      messageType,
      content,
      fileURL,
      timeStamp: Date.now(),
    });

    const messageData = await Message.findById(createdMessage._id)     // message data is fetched in order to emit to frontend
      .populate("sender", "id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {        // message id is pushed to channel -> message array
      $push: { messages: createdMessage._id}
    });

    const channel = await Channel.findById(channelId).populate("members");  // find out members for emit the message receive to all the users

    const finalData = {...messageData._doc, channelId: channel._id }

    if(channel && channel.members) {                  // emitting message sto all members of channel when they will connect 
        channel.members.forEach((member) => {
           const memberSocketId = userSocketMap.get(member._id.toString());
           if(memberSocketId){
             io.to(memberSocketId).emit("receive-channel-message", finalData);
           }
        })

        const adminSocketId = userSocketMap.get(channel.admin._id.toString());   // emitting message to the sender
        if(adminSocketId){
          io.to(adminSocketId).emit("receive-channel-message", finalData);
        }
    }
  };

  // map to store userId and socketId
  const userSocketMap = new Map(); // this will store key value pair of userId from frontend and socket connection id

  // activating server side so that the different user can connect to it
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with Socket id: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }

    // sending personal message
    socket.on("sendMessage", (message) => {
      sendMessage(message);
    });

    // sending channel messages
    socket.on("send-channel-message", (message) => {
      sendChannelMessages(message);
    });

    // on disconnect this function will be implemented
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
};
