import Message from "../models/messageModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  });

export const getPrevMessages = async (req, res)=>{
     try {
        const  user1  = req.user.userId;
        const user2 = req.body.id

        if(!user1 || !user2){
            return res.status(400).send({
                success: false,
                message: "Both user ID's are required",
            })
        }

        const messages = await Message.find({
            $or: [
                {sender: user1, recipient: user2}, 
                { sender: user2, recipient: user1}
            ]
        }).sort({ timeStamp: 1})

        return res.status(200).send({
            success: true,
            message: "chats fetched successfully",
            messages
        })

     } catch (error) {
        return res.status(500).send({
            success: false,
            message: "error while fetching prev chats",
            error
         })
     }
}



export const uploadFileController = async (req, res)=>{
    try {
       if(!req.file){
           return res.status(400).send({
               success: false,
               message: "file is missing. Not sent"
           })
       }
               
       const uploadResult = await cloudinary.uploader.upload(req.file.path);
       fs.unlink(req.file.path,
           (err => {
               if (err) console.log(err);
               else {
                   console.log("\nDeleted file: example_file.txt");
               }
           }));

       return res.status(200).send({
           success: true,
           filePath: uploadResult.secure_url
       })

    } catch (error) {
       return res.status(500).send({
           success: false,
           message: "can't upload this file",
           error
        })
    }
}