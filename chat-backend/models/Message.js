const mongoose = require('mongoose');
const validator = require('validator');



const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "No message provided"],
        validate: [!validator.isEmpty, "Message cannot be empty"],
        maxLength: 500
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});



module.exports = mongoose.model("Message", messageSchema);