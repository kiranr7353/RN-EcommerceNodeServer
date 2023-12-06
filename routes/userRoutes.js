import express from 'express';
import { getUserProfileController, loginController, logoutController, registerController, updateProfileController, udpatePasswordController, updateProfilePicController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from "../middlewares/multer.js";
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

const router = express.Router();

router.post("/register",limiter, registerController)
router.post("/login",limiter, loginController)
router.get("/profile", isAuth, getUserProfileController)
router.get("/logout", isAuth, logoutController)
router.post("/update-profile", isAuth, updateProfileController)
router.post("/update-password", isAuth, udpatePasswordController)
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

export default router