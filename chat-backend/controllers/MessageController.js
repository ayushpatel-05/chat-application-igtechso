const User = require("../models/User");
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorMessage = require('../utils/errorMessage');
// const sendToken = require("../utils/sendToken");

exports.getUserChatsList = catchAsyncError(async function registerUser(req, res, next) {
    const { _id: userId } = req.user;
    const conversationList = await Conversation.find({participants: userId}).exec();
    res.send(conversationList);
});


exports.getChatHistory = catchAsyncError(async(req, res, next) => {
    const { email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorMessage('Please enter email and password', 400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user) {
        return next(new ErrorMessage("Invalid Email or Password", 401));
    }

    const isPasswordCorrect = user.comparePassword(password);

    if(!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    await sendToken(user, 200, res);
});


// exports.logoutUser = catchAsyncError(async(req, res, next) => {
//     res.clearCookie('token');
//     res.status(200).send("Logout Successful");
// })