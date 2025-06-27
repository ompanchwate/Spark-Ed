import express from "express";
import { signIn, signUp, validateToken } from "../controllers/authContoller.js";

const router = express.Router();


// Register Routes
router.post("/signup", signUp)
router.post("/signin", signIn)


router.get('/validate-token', validateToken);

export default router;
