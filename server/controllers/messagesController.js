import Message from "../models/messageModel.js";
import { mkdirSync, renameSync } from 'fs'

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

        const date =  Date.now();
        const fileDir = `uploads/files/${date}`;
        const fileName = `${fileDir}/${req.file.originalname}`

        mkdirSync(fileDir, { recursive: true})
        renameSync(req.file.path, fileName);
        return res.status(200).send({
            success: true,
            filePath: fileName
        })

     } catch (error) {
        return res.status(500).send({
            success: false,
            message: "error while fetching prev chats",
            error
         })
     }
}