import mongoose from "mongoose";
const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/healthaxis`);
        console.log("Database Connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1); // Optional: stop app on failure
    }
};

export default connectDB