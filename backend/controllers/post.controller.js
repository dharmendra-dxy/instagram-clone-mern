import sharp from "sharp";
import cloudinary from "../utils/coudinary.js";

import Post from "../models/post.model";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import { populate } from "dotenv";

// handleAddNewPost:
export const handleAddNewPost = async(req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id; // get author for - isAuthenticated middleware

        if(!image){
            return res.status(400).json({
                message : "Image is required",
                success : false,
            });
        }

        // image upload -> multer & sharp package for image optimization:
        const optimizeImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800, fit:'inside'})
        .toFormat('jpeg', {quality: 80})
        .toBuffer();

        // buffer to data uri:
        const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString('base64')}`;

        // coudinary:
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            authorId,
        });

        // now after the creation of post-> push post to posts in userSchema:
        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path: 'author', select:'-password'});

        return res.status(201).json({
            message: "new post created",
            success: true,
            post,
        })

    } catch (error) {
        console.log("error: ", error);
    }
    

}


// handleGetAllPost:
export const handleGetAllPost = async (req,res) => {
    try {
        
        const posts = await Post.find({}).sort({createdAt: -1})
        .populate({path: 'author', select:'username, profilePicture'})
        .populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {
                path: 'author',
                select:'username, profilePicture',
            }
        });

        return res.status(200).json({
            posts,
            success: true,
        });

    } catch (error) {
        console.log("error: ", error);
    }
}


// handleGetUserAllPost:
export const handleGetUserAllPost = async(req,res) => {
    try {
        
        const authorId = req.id;
        const posts  = await Post.find({author: authorId}).sort({createdAt: -1});

        posts.populate({
            path: 'author',
            select: 'username, profilePicture',
        })
        .populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate:{
                path: 'author',
                select: 'username, profilePicture',
            }
        });


        return res.status(200).json({
            posts,
            success: true,
        })
        

    } catch (error) {
        console.log("error: ", error);
    }
}


// handleLikePosts:
export const handleLikePosts = async(req,res) =>{
    try {
        
        const userId = req.id; // id of the user who will like the post
        const postId = req.params.id; // post to be liked
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({
            message: "No post found",
            success: false,
        });

        // like logic: ->  use set to count once if given multiple like by single user
        await post.updateOne({$addToSet: {likes: userId}});
        post.save();

        // implement socket io for real time notification:
        // to be implemented



        return res.status(200).json({
            message: "post liked",
            success: true,
        });


    } catch (error) {
        console.log("error: ", error);
    }
}


// handleDisikePosts:
export const handleDisikePosts = async(req,res) =>{
    try {
        
        const userId = req.id; // id of the user who will like the post
        const postId = req.params.id; // post to be liked
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({
            message: "No post found",
            success: false,
        });

        // like logic: ->  use set to count once if given multiple like by single user
        await post.updateOne({$pull: {likes: userId}});
        post.save();

        return res.status(200).json({
            message: "post disliked",
            success: true,
        });

    } catch (error) {
        console.log("error: ", error);
    }
}


// handleAddComment:
export const handleAddComment = async (req,res)=>{
    try {
        const postId = req.params.id;
        const userId= req.id; // user to comment in post

        const post = await Post.findById(postId);

        const {text} = req.body;
        if(!text) return res.status(400).json({
            message: "comment text is required",
            success: false,
        });

        const comment = await Comment.create({
            text,
            author: userId,
            post: postId,
        }).populate({
            path: 'author',
            select: 'username, profilePicture',
        });
        
        post.comments.push(comment._id);
        await post.save();
        
        return res.status(201).json({
            message: "comment added",
            success: true,
            comment,
        });

    } catch (error) {
        console.log("error: ",error);
    }
}


// handleGetAllCommentsOfPost:
export const handleGetAllCommentsOfPost = async (req,res) => {
    try {
        
        const postId = req.params.id;

        const allComments = await Comment.find({post: postId})
        .populate('author', 'username, profilePicture');

        if(!allComments) return res.status(401).json({
            message: "No comments found",
            success: false,
        });

        return res.status(201).json({
            success: true,
            allComments, 
        });

    } catch (error) {
        console.log("error: ",error);
    }
}


// handleDeletePost:
export const handleDeletePost = async (req,res) => {
    try {
        const postId  = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(401).json({
            message: "No post found",
            success: false,
        });

        // check if logged-in user is owner of post or not:
        if(post.author.toString() != authorId) return res.status(403).json({
            message: "You are not the author of post",
            success: false,
        });

        // delete post:
        await Post.findByIdAndDelete(postId);

        // remove post id from user schema:
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString()!= postId);
        await user.save();

        // delete associated comments of the post:
        await Comment.deleteMany({post: postId});

        return res.status(200).json({
            message: "post deleted",
            success: true,
        });

    } catch (error) {
        console.log("error: ", error);
    }
}


// handleBookmarkPost:
export const handleBookmarkPost = async (req, res) => {
    try {
        
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(201).json({
            message: "No post found",
            success: true,
        });

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // already bookmarked: -> then unbookmark the post:
            await user.updateOne({$pull: {bookmarks: post._id}});
            await user.save();

            return res.status(200).json({
                type: 'unsaved',
                message: "post removed from bookmark",
                success: true,
            });

        }else{
            // bookmark the post:
            await user.updateOne({$addToSet: {bookmarks: post._id}});
            await user.save();

            return res.status(200).json({
                type: 'saved',
                message: "post bookmarked",
                success: true,
            });
        }

    } catch (error) {
        console.log("error: ", error);
    }
}
