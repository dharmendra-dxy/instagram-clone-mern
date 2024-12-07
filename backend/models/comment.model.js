import mongoose from "mongoose";

// schema:
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required:true, 
    },

}, {timeseries: true});

// model:
const Comment = mongoose.model('Comment', commentSchema);

export default Comment;


