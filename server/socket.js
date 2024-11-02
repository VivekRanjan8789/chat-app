import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messageModel.js";



export const setupSocket = (server) => {
  // connecting socket to http server 
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["POST", "GET"],
      credentials: true,
    },
  });

  // disconnect function
  const disconnect = (socket) => {
     console.log("user disconnected socket id: ", socket.id);
     
     for ( const [ userId, socketId] of userSocketMap.entries()) {
         if(socketId === socket.id){
             userSocketMap.delete(userId);
             break;
         }
     }
  }

  // sendMessage Function
  const sendMessage = async (message) => {
    console.log("message received to server side", message);
    
       const senderSocketId = userSocketMap.get(message.sender);
       const recipientSocketId = userSocketMap.get(message.recipient);

       console.log("sender: ", senderSocketId);
    console.log("receiver: ", recipientSocketId);

       const createMessage = await Message.create(message)
       const messageData = await Message.findById(createMessage._id)
       .populate("sender", "id email firstName lastName image color")
       .populate("recipient", "id email firstName lastName image color");

       if(recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData);
       }
       if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage", messageData);
       }
  }

  // map to store userId and socketId 
  const userSocketMap = new Map(); // this will store key value pair of userId from frontend and socket connection id

  // activating server side so that the different user can connect to it 
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap.set(userId, socket.id);
        console.log(`User connected: ${userId} with Socket id: ${socket.id}`);        
    }else{
        console.log("User ID not provided during connection.");
        
    }

    // sending personal message 
    socket.on("sendMessage", (message)=>{sendMessage(message)})

    // on disconnect this function will be implemented
    socket.on("disconnect", ()=>{disconnect(socket)});
    });

};
