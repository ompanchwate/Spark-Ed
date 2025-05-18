import express from "express";
import { addProject } from "../controllers/studentController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();


// Student Routes
router.post("/addproject", verifyToken,  addProject)


export default router;
