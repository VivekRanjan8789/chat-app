import mongoose from "mongoose";
import Channel from "../models/channelModel.js";
import User from "../models/userModel.js";

export const createChannelController = async (req, res) => {
     try {
        const { userId } = req.user;
        const { name, members } = req.body;

        const admin = await User.findById(userId)
        if(!admin){
            return res.status(400).send({
                success: false,
                message: "Admin user not found",
            })
        }

        const isValidMembers = await User.find({_id: {$in : members}});
        if(isValidMembers.length != members.length ){
            return res.status(400).send({
                success: false,
                message: "Some users not found",
            })
        }

        const channel = await Channel.create({ name, members, admin: userId, });
        if(channel){
            return res.status(201).send({
                success: true,
                message: "channel created successfully",
                channel
            })
        }
        
     } catch (error) {
        return res.status(500).send({
            success: false,
            message: "error while creating channel",
            error
        })
     }
}


export const getUserChannelsController = async (req, res) => {
     try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const channels = await Channel.find({
            $or : [{admin: userId}, { members: userId}]
        }).sort({ updatedAt: -1 })
        return res.status(200).send({
            success: true,
            message: "user channel fetched successfully",
            channels
        })
        
     } catch (error) {
        return res.status(500).send({
            success: false,
            message: "error while getting user Channel",
            error
        })
     }
}