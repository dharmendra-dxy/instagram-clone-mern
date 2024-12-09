import dotenv from "dotenv";

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js";

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
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);



app.listen(PORT, ()=> {
    // database connection:
    connectDB();
    console.log(`Server is running at: ${PORT}`);
});



