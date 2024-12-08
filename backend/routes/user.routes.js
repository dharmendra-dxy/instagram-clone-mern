import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import upload from "../middlewares/multer.js";

import { 
    handleGetSuggestedUser,
    handleUserEditProfile, 
    handleUserFollowAndUnfollow, 
    handleUserGetProfile, 
    handleUserLogin, 
    handleUserLogout, 
    handleUserRegister, 
} from "../controllers/user.controller.js";


const router = express.Router();

router.route('/register').post(handleUserRegister);
router.route('/login').post(handleUserLogin);
router.route('/logout').get(handleUserLogout);
router.route(':id/profile').get(isAuthenticated, handleUserGetProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), handleUserEditProfile);
router.route('/suggestion').get(isAuthenticated, handleGetSuggestedUser);
router.route('/followorunfollow/:id').post(isAuthenticated, handleUserFollowAndUnfollow);
 

export default router;