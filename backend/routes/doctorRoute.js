import express from "express";
import {
  doctorList,
  loginDoctor,
  doctorAppointments,
  appointmentCancelled,
  appointmentCompleted
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
const doctorRouter = express.Router();
doctorRouter.get("/doctors", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments", authDoctor,doctorAppointments);
doctorRouter.post("/complete-appointment", authDoctor,appointmentCompleted);
doctorRouter.post("/cancel-appointment", authDoctor,appointmentCancelled);
export default doctorRouter;
