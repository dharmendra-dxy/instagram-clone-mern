import mongoose from "mongoose";

// scehma:
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
});

// model:
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;