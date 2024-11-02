import mongoose from "mongoose";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const searchContactsController = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const { userId } = req.user;

    if (!searchTerm) {
      return res.status(400).send({
        success: false,
        message: "searchTerm required for searching contacts",
      });
    }

    if (!userId) {
      return res.status(404).send({
        success: false,
        message: "user not found, userId missing",
      });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await User.find({
      $and: [
        { _id: { $ne:  userId  } },

        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });
    return res.status(200).send({
      success: true,
      message: "contacts fetched successfully",
      contacts,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error while fetching  contacts",
      error,
    });
  }
};

export const getContactsForDMList = async (req, res) => {
  try {
    let { userId } = req.user;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timeStamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timeStamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMEssageTime: -1 },
      },
    ]);

    return res.status(200).send({
      success: true,
      contacts,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error while fetching  contacts",
      error,
    });
  }
};

export const getAllContactsController = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.userId } },
      "firstName lastName email _id"
    );

    const contacts = users.map((user) => ({
       label: user.firstName? `${user.firstName} ${user.lastName}` : user.email,
       value: user._id
    }))

    return res.status(200).send({
      success: true,
      message: "All contacts fetched successfully",
      contacts,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error while fetching All contacts",
      error,
    });
  }
};
