const sendToken = async (user, statusCode, res) => {
    const token = user.getJWTToken();

    const cookieOptions = {
        expires: new Date(Date.now() + 1*24*60*60*1000),
        httpOnly: false
    }

    const userInfo = user.toObject();
    if(userInfo.password) {
        delete userInfo.password;
    }
    delete userInfo._id;
    delete userInfo.__v;

    res.status(statusCode).cookie('token', token, cookieOptions).json({
        success: true,
        userInfo
    });
}

module.exports = sendToken;