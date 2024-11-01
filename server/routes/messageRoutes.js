import { Router } from "express";
import { requireSignin } from "../middlewares/authMiddleware.js";
import { getPrevMessages } from "../controllers/messagesController.js";

const messageRoutes = Router();

messageRoutes.post('/get-prev-messages', requireSignin, getPrevMessages);

export default messageRoutes;