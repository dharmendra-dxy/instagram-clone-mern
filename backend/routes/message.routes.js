import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";

import { 
    handleGetMessage,
    handleSendMessage,
} from "../controllers/message.controller.js";


const router = express.Router();

// routes:
router.route('/send/:id').post(isAuthenticated,handleSendMessage);
router.route('/all/:id').get(isAuthenticated,handleGetMessage);


export default router;