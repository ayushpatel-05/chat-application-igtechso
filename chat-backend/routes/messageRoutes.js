const express = require("express");
// const { registerUser, loginUser, logoutUser } = require('../controllers/UserController');
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const { getUserChatsList, getChatHistory, initiateNewChat } = require('../controllers/MessageController');


const router = express.Router();

router.get('/chats', isAuthenticatedUser, getUserChatsList);
router.get('/chats/:conversationID', isAuthenticatedUser, getChatHistory);
router.post('/chats/create/:userID', isAuthenticatedUser, initiateNewChat)
// router.post('/authenticate', isAuthenticatedUser, (req, res) => {
//     res.status(200).send({userId: req.user._id});
// });
// router.post('/logout', isAuthenticatedUser, logoutUser);

module.exports = router;