const express = require("express");
// const { registerUser, loginUser, logoutUser } = require('../controllers/UserController');
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const { getUserChatsList, getChatHistory, initiateNewChat, deleteMessage, deleteMultipleMessages } = require('../controllers/MessageController');


const router = express.Router();

router.get('/chats', isAuthenticatedUser, getUserChatsList);
router.get('/chats/:conversationID', isAuthenticatedUser, getChatHistory);
router.post('/chats/create/:emailID', isAuthenticatedUser, initiateNewChat)
router.delete('/chats/:conversationID/:chatID', isAuthenticatedUser, deleteMessage);
router.delete('/chats/:conversationID', isAuthenticatedUser, deleteMultipleMessages)
// router.post('/authenticate', isAuthenticatedUser, (req, res) => {
//     res.status(200).send({userId: req.user._id});
// });
// router.post('/logout', isAuthenticatedUser, logoutUser);

module.exports = router;