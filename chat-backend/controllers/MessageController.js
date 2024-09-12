const User = require("../models/User");
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorMessage = require('../utils/errorMessage');
const mongoose = require('mongoose');
// const sendToken = require("../utils/sendToken");

exports.getUserChatsList = catchAsyncError(async function registerUser(req, res, next) {
    const { _id: userId } = req.user;
    const conversationList = await Conversation.find({participants: userId}).exec();
    res.send(conversationList);
});


exports.getChatHistory = catchAsyncError(async (req, res, next) => {
    const { conversationID } = req.params;
    
    if (!conversationID) {
        return res.status(400).json({
            success: false,
            message: "Conversation ID is required"
        });
    }
    const messages = await Message.find({ conversationId:conversationID }).select('-_id -__v -conversationId').exec();
    // const result = messages.map(message => ({
    //     content: message.content,
    //     // name: message.senderId ? message.senderId.name : undefined
    //     id: 
    //   }));
    return res.status(200).json(messages);
});


exports.initiateNewChat = catchAsyncError(async(req, res, next) => {
    const userID = req.params.userID;
    if(!mongoose.Types.ObjectId.isValid(userID)) {
        next(new ErrorMessage("Invalid User ID", 422));
    }

    const userDocument = await User.exists({_id: userID});
    if(!userDocument) {
        next(new ErrorMessage("User does not exists", 404));
    }

    const newConversation = new Conversation({participants: [userID, req.user._id]});
    await newConversation.save();
    res.status(200).send({message: "New Conversation Created",conversationID: newConversation._id});
});

