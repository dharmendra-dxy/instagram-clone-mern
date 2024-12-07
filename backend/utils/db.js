import mongoose  from "mongoose";

const connectDB = async()=>{
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected succesfully");
    }
    catch(error){
        console.log("MongoDB error: ", error);
    }
}

export default connectDB;