import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import getDataUri from "../utils/datauri.utils.js";
import cloudinary from "../utils/coudinary.js";


// handleUserRegister:
export const handleUserRegister = async (req,res)=>{
    try {
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(401).json({
                message: "Something is missing, please check",
                success : false,
            });
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({
                message: "Try different e-mail",
                success : false,
            });
        }

        // hash password:
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password : hashedPassword,
        });

        return res.status(201).json({
            message: "Account created succefully",
            success : true,
        });


    } catch (error) {
        console.log("Error: ", error);
    }
}


// handleUserLogin:
export const handleUserLogin = async (req,res) => {
    try {
        
        const {email, password} =  req.body;

        if(!email || !password){
            return res.status(401).json({
                message: "Something is missing, please check",
                success : false,
            });
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "incorrect email or password",
                success : false,
            });
        }

        // match password:
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            return res.status(401).json({
                message: "incorrect email or password",
                success : false,
            });
        }

        // user object to be handled in front-end:
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio ,
            followers: user.followers,
            following: user.following,
            posts: user.posts,

        }


        // if user has correct email and pass:
        // create token:
        const token = await jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1d'});

        // set cookies and return:
        return res.cookie('token', token, {httpOnly: true, sameSite:'strict', maxAge:1*24*60*60*1000}).json({
            message: `welcome back ${user.username}`,
            success: true,
            user,
        });

    } catch (error) {
        console.log("Error: ", error);
        
    }
}


// handleUserLogout:
export const handleUserLogout = async (req,res) => {
    try {
        return res.cookie('token', "", {maxAge: 0}).json({
            message: "Logged Out Successfully",
            success: true, 
        })
    } catch (error) {
        console.log("Error: ", error);
    }
}

// handleUserGetProfile:
export const handleUserGetProfile = async (req,res) => {
    try {
        const userId = req.params.id;
        let user = User.findById(userId);

        return res.status(201).json({
            user,
            success: true,
        });

    } catch (error) {
        console.log("error : ", error);
    }
}

// handleUserEditProfile:
export const handleUserEditProfile = async (req,res) => {
    try {

        // get user through token: -> middleware - isAuthenticated
        const userId = req.id;

        const {bio, gender}= req.body;
        const profilePicture = req.file;

        // setup cloudinary:
        let cloudResponse;

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = User.findById(userId);
        if(!user){
            return res.status(401).json({
                message: "user not found",
                status: false,
            });
        }
        
        // update bio,gender:
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "profile updated",
            status: true,
            user,
        });
        

    } catch (error) {
        console.log("error: ", error);
    }
}

// handleGetSuggestedUser:
export const handleGetSuggestedUser = async (req,res) => {
    try {
        
        const suggestedUser = await User.find({_id:{$ne: req.id}}).select('-password');
        if(!suggestedUser){
            return res.status(400).json({
                message: "Currently do not have any user",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            suggestedUser,
        });

    } catch (error) {
        console.log("error: ", error);
    }
}


// handleUserFollowAndUnfollow:
export const handleUserFollowAndUnfollow = async(req,res)=>{
    try {
        
        const myId = req.id; // my id -> user id
        const targetUserId = req.params.id;  // other user id-> user will follow

        if(myId == targetUserId){
            return res.status(400).json({
                message: "You can't follow/unfollow yourself",
                success: false,
            });
        }

        const user = User.findById(myId);
        const targetUser = User.findById(targetUserId);

        if(!user || !targetUser){
            return res.status(400).json({
                message: "user not found",
                success: false,
            });
        }

        // check to be followed or unfollowed:
        const isFollowing = user.following.includes(targetUserId);
        if(isFollowing){
            // unfollow targetUser:
            await Promise.all([
                User.updateOne({_id:myId}, {$pull: {following: targetUserId}}),
                User.updateOne({_id:targetUserId}, {$pull: {followers: myId}}),
            ]);

            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true,
            });
        }
        else{
            // follow targetUser:
            await Promise.all([
                User.updateOne({_id:myId}, {$push: {following: targetUserId}}),
                User.updateOne({_id:targetUserId}, {$push: {followers: myId}}),
            ]);

            return res.status(200).json({
                message: "followed successfully",
                success: true,
            });
        }

        

    } catch (error) {
        console.log("error: ", error);
    }
}