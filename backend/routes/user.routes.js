import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import upload from "../middlewares/multer.js";

import { 
    handleGetSuggestedUser,
    handlePostUserEditProfile, 
    handlePostUserFollowAndUnfollow, 
    handleGetUserGetProfile, 
    handleGetUserLogout, 
    handlePostUserLogin, 
    handlePostUserRegister, 
} from "../controllers/user.controller.js";


const router = express.Router();

router.route('/register').post(handlePostUserRegister);
router.route('/login').post(handlePostUserLogin);
router.route('/logout').get(handleGetUserLogout);
router.route('/:id/profile').get(isAuthenticated, handleGetUserGetProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), handlePostUserEditProfile);
router.route('/suggestion').get(isAuthenticated, handleGetSuggestedUser);
router.route('/followorunfollow/:id').post(isAuthenticated, handlePostUserFollowAndUnfollow);
 

export default router;