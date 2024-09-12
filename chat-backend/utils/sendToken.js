const sendToken = async (user, statusCode, res) => {
    const token = user.getJWTToken();

    const cookieOptions = {
        expires: new Date(Date.now() + 1*24*60*60*1000),
        httpOnly: false,
        sameSite: 'lax'
    }

    const userInfo = user.toObject();
    if(userInfo.password) {
        delete userInfo.password;
    }
    userInfo.id = userInfo._id;
    // delete userInfo._id;
    delete userInfo.__v;
    delete userInfo._id;
    res.status(statusCode).cookie('token', token, cookieOptions).json(userInfo);
}

module.exports = sendToken;