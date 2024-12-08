import multer from "multer";

// multer to handle user profile picture:

const upload = multer({
    storage: multer.memoryStorage(),
});

export default upload;