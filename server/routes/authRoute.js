import { Router } from "express";
import { deleteProfileImageController, getProfilePhotoController, getUserInfoController, loginController, logout, signupController, updateProfileController, uploadImageController } from "../controllers/authController.js";
import { requireSignin } from "../middlewares/authMiddleware.js";
import multer from "multer";

const authRoutes = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

authRoutes.post('/signup', signupController);
authRoutes.post('/login', loginController);
authRoutes.get('/profile', requireSignin, getUserInfoController);
authRoutes.post('/update-profile', requireSignin, updateProfileController);
authRoutes.post('/update-profile-image', requireSignin, upload.single('image'), uploadImageController);
authRoutes.get('/get-profile-photo', requireSignin, getProfilePhotoController);
authRoutes.patch('/delete-profile-image', requireSignin, deleteProfileImageController);
authRoutes.post('/logout', logout);

export default authRoutes;