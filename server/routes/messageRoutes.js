import { Router } from "express";
import { requireSignin } from "../middlewares/authMiddleware.js";
import { getPrevMessages, uploadFileController } from "../controllers/messagesController.js";

import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const messageRoutes = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const random = uuidv4();
      cb(null, random+""+file.originalname);
    }
  })

const upload = multer({ storage: storage })

messageRoutes.post('/get-prev-messages', requireSignin, getPrevMessages);
messageRoutes.post('/file-upload', requireSignin, upload.single('file'), uploadFileController)

export default messageRoutes;