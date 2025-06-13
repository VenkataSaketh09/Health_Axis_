import express from 'express';
import { doctorList } from '../controllers/doctorController.js';

const doctorRouter = express.Router();
doctorRouter.get('/doctors', doctorList);
export default doctorRouter;