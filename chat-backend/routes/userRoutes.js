const express = require("express");
const { registerUser, loginUser, logoutUser } = require('../controllers/UserController');
const { isAuthenticatedUser } = require("../middleware/authMiddleware");



const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/authenticate', isAuthenticatedUser, (req, res) => {
    res.status(200).send({userId: req.user._id});
});
router.post('/logout', isAuthenticatedUser, logoutUser);

module.exports = router;