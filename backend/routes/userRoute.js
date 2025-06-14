import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
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

export default userRouter;
