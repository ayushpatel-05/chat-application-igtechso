const mongoose = require('mongoose');



const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isArchived: {
        type: Boolean,
        default: false
    }
});



module.exports = mongoose.model("Conversation", conversationSchema);