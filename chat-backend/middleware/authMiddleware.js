const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorMessage = require('../utils/errorMessage')


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorMessage("No token recieved", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedData.id).exec();
    req.user = user;
    if(!user) {
        return next(new ErrorMessage("Invalid Email or Password", 401));
    }
    next();
})