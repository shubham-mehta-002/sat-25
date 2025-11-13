import express from "express"
const router = express.Router()
import { verifyJWT } from "../middleware/auth.middleware.js";
import {registerUser , loginUser  ,logoutUser, resetPasswordRequest ,resetPassword } from '../controllers/auth.controller.js';

router.use(express.json())

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',verifyJWT,logoutUser)
router.post('/reset-password-request',resetPasswordRequest)
router.post('/reset-password',resetPassword)

export default router;