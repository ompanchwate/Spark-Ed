import express from "express";
import { addProject, myProjects, getProjectById, editProjectById, editProfile, fundingRequests } from "../controllers/studentController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();


// Student Routes
router.post("/addproject", verifyToken, addProject)
router.post("/myproject", verifyToken, myProjects)
router.get("/myproject/:id", verifyToken, getProjectById)
router.put("/editproject/:id", verifyToken, editProjectById)
router.put("/editprofile", verifyToken, editProfile)
router.get("/fundingrequests", verifyToken, fundingRequests)


export default router;
