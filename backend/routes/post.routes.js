import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import upload from "../middlewares/multer.js";

import { 
    handleAddComment,
    handleAddNewPost,
    handleBookmarkPost,
    handleDeletePost,
    handleDisikePosts,
    handleGetAllCommentsOfPost,
    handleGetAllPost,
    handleGetUserAllPost,
    handleLikePosts,
} from "../controllers/post.controller.js";


const router = express.Router();


// routes:
router.route('/addpost').post(isAuthenticated,upload.single('image'),handleAddNewPost);
router.route('/all').get(isAuthenticated,handleGetAllPost);
router.route('/userpost/all').get(isAuthenticated,handleGetUserAllPost);
router.route('/:id/likes').get(isAuthenticated,handleLikePosts);
router.route('/:id/dislikes').get(isAuthenticated,handleDisikePosts);
router.route('/:id/comment').post(isAuthenticated,handleAddComment);
router.route('/:id/comment/all').post(isAuthenticated,handleGetAllCommentsOfPost);
router.route('/delete/:id').post(isAuthenticated,handleDeletePost);
router.route('/:id/bookmark').post(isAuthenticated,handleBookmarkPost);



export default router;