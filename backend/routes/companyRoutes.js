import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { allProjects } from "../controllers/companyController.js";

const router = express.Router();


// Company Routes
router.get("/allprojects", verifyToken, allProjects)


export default router;
