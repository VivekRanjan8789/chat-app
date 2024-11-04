import   { Router } from 'express'
import   { requireSignin } from "../middlewares/authMiddleware.js"
import { createChannelController, getChannelMessagesController, getUserChannelsController } from '../controllers/channelController.js';

const channelRoutes = Router();

channelRoutes.post('/create-channel', requireSignin ,createChannelController)
channelRoutes.get('/get-user-channel', requireSignin, getUserChannelsController);
channelRoutes.get("/get-channel-messages/:channelId", requireSignin, getChannelMessagesController);

export default channelRoutes;