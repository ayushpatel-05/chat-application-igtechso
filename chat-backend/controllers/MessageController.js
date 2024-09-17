const User = require("../models/User");
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorMessage = require('../utils/errorMessage');
const mongoose = require('mongoose');
const validator = require('validator');
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
    // const messages = await Message.find({ conversationId:conversationID }).select('-__v -conversationId').exec();
    const messages = await Message.find({ conversationId: conversationID })
    .select('-__v -conversationId')
    .sort({ createdAt: 1 })
    .exec();
    return res.status(200).json(messages);
});

//With User MongoID
// exports.initiateNewChat = catchAsyncError(async(req, res, next) => {
//     const userID = req.params.userID;
//     if(!mongoose.Types.ObjectId.isValid(userID)) {
//         return next(new ErrorMessage("Invalid User ID", 422));
//     }

//     const userDocument = await User.exists({_id: userID});
//     console.log(userID);
//     if(!userDocument) {
//         return next(new ErrorMessage("User does not exists", 404));
//     }

//     const existingConversation = await Conversation.findOne({
//         participants: { $all: [userID, req.user._id] }
//     });

//     if (existingConversation) {
//         return next(new ErrorMessage("Conversation already exists", 409));
//     }

//     const newConversation = new Conversation({participants: [userID, req.user._id]});
//     await newConversation.save();
//     res.status(200).send(newConversation);
// });

//With Email
exports.initiateNewChat = catchAsyncError(async(req, res, next) => {
  const emailID = req.params.emailID;
  console.log("Email id is: " ,emailID);
  if(!emailID || !validator.isEmail(emailID)) return next(new ErrorMessage("Please provide vaild email ID", 400));

  const userDocument = await User.findOne({ email: emailID });
  console.log(userDocument);
  if (!userDocument) {
    return next(new ErrorMessage("User does not exist", 404));
  }

  const userID = userDocument._id;

  // Check if a conversation between the current user and the target user exists
  const existingConversation = await Conversation.findOne({
    participants: { $all: [userID, req.user._id] }
  });

  if (existingConversation) {
    return next(new ErrorMessage("Conversation already exists", 409));
  }

  // Create a new conversation
  const newConversation = new Conversation({ participants: [userID, req.user._id] });
  await newConversation.save();

  res.status(200).send(newConversation);
});


exports.deleteMessage = catchAsyncError(async(req, res, next) => {
    const {chatID, conversationID} = req.params;
    if(!mongoose.Types.ObjectId.isValid(chatID) ||!mongoose.Types.ObjectId.isValid(conversationID)) {
        res.state(400).json({
            success: false,
            message: "Wrong Conversation ID or Chat ID provided"
        })
    }

    const message = await Message.findById(chatID);
    if(!message.senderId.equals(req.user._id)) {
        res.state(401).json({
            sucess: false,
            message: "Unauthorized Access"
        })
    }

    await Message.deleteOne(message);
    res.status(200).json({
        success: true,
        message: "Chat Deleted"
    })
});


exports.deleteMultipleMessages = catchAsyncError(async (req, res, next) => {
    const { conversationID } = req.params;
    const { chatIDs } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Conversation ID provided",
      });
    }
  

    if (!Array.isArray(chatIDs) || chatIDs.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Chat IDs provided",
      });
    }
  
    // Find all messages by their IDs and verify the sender is the user
    const messages = await Message.find({ _id: { $in: chatIDs }, conversationId: conversationID });
    if (!messages.length) {
      return res.status(404).json({
        success: false,
        message: "No messages found",
      });
    }
  
    // Check if the user is authorized to delete these messages
    const unauthorizedMessage = messages.find((message) => !message.senderId.equals(req.user._id));
    if (unauthorizedMessage) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access to one or more messages",
      });
    }
  
    // Delete all the messages
    await Message.deleteMany({ _id: { $in: chatIDs } });
  
    res.status(200).json({
      success: true,
      message: `${messages.length} messages deleted`,
    });
});


exports.archiveChat = catchAsyncError(async (req, res, next) => {
  const { conversationID } = req.params;

  if (!conversationID) {
    return res.status(400).json({
        success: false,
        message: "Conversation ID is required"
    });
  }

  const conversationDocument = await Conversation.findById(conversationID);
  conversationDocument.isArchived = true;
  conversationDocument.save();

  res.status(200).send("Chat Archived");
})