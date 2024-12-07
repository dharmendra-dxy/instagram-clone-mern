import dotenv from "dotenv";

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./utils/db.js";

dotenv.config();

const app = express();
const PORT=process.env.PORT || 3000;


// middlewares:

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));

const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
}

app.use(cors(corsOption));


// route:
app.get("/", (req,res)=>{
    return res.status(200).json({
        message: "Hi, from backend",
        success: true,
    });
});


app.listen(PORT, ()=> {
    // database connection:
    connectDB();
    console.log(`Server is running at: ${PORT}`);
});



