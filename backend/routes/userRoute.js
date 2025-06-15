import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  addBpReading,
  getBpReadings,
  getBpAnalytics,
  updateBpReading,
  deleteBpReading,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
const userRouter = express.Router();

//API endpoint to register user
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateUserProfile
);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments",authUser, listAppointment);
userRouter.post('/cancel-appointment',authUser,cancelAppointment);

userRouter.post("/bp-readings", authUser, addBpReading);
userRouter.get("/bp-readings", authUser, getBpReadings);
userRouter.get("/bp-analytics", authUser, getBpAnalytics);
userRouter.put("/bp-readings/:readingId", authUser, updateBpReading);
userRouter.delete("/bp-readings/:readingId", authUser, deleteBpReading);

export default userRouter;
