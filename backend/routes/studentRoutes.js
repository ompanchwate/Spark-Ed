import express from "express";
import { addProject, myProjects, getProjectById, editProjectById } from "../controllers/studentController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();


// Student Routes
router.post("/addproject", verifyToken, addProject)
router.post("/myproject", verifyToken, myProjects)
router.get("/myproject/:id", verifyToken, getProjectById)
router.put("/editproject/:id", verifyToken, editProjectById)


export default router;
