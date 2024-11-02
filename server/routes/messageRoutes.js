import { Router } from "express";
import { requireSignin } from "../middlewares/authMiddleware.js";
import { getPrevMessages, uploadFileController } from "../controllers/messagesController.js";
import multer from "multer";

const messageRoutes = Router();
const upload = multer({dest: "uploads/files"});


messageRoutes.post('/get-prev-messages', requireSignin, getPrevMessages);
messageRoutes.post('/file-upload', requireSignin, upload.single('file'), uploadFileController)

export default messageRoutes;