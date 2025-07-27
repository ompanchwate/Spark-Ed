import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { allProjects, editProfile, createScholarship, getScholarship, getProjectForCompany, fundProject, getNegotiationRequest, createMeet, markCompleted, updateOffer } from "../controllers/companyController.js";

const router = express.Router();


// Company Routes
router.get("/allprojects", verifyToken, allProjects)
router.put("/editprofile", verifyToken, editProfile)
router.post("/createscholarship", verifyToken, createScholarship)
router.get("/getscholarships", verifyToken, getScholarship)
router.get("/get-project/:id", verifyToken, getProjectForCompany)
router.post("/fund-project", verifyToken, fundProject)
router.get("/getnegotiation-requests", verifyToken, getNegotiationRequest)
router.post("/create-meet", verifyToken, createMeet)
router.post("/markcompleted", verifyToken, markCompleted)
router.post("/submit-updated-offer", verifyToken, updateOffer)



export default router;
