import express from "express";
import { getCompanies, signUpCompany } from "../controllers/companyController.js";
import { getStudents, signUpStudent } from "../controllers/studentController.js";

const router = express.Router();

// SignUp 
router.post("/signup/company", signUpCompany)
router.post("/signup/student", signUpStudent)

// Get all users 
router.get("/getcompanies", getCompanies)
router.get("/getstudents", getStudents)







export default router;
