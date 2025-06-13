import express from 'express';
import { registerUser,loginUser } from '../controllers/userController.js';

const userRouter=express.Router();

//API endpoint to register user
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


export default userRouter;