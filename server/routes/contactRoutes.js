import { Router } from "express";
import { requireSignin } from '../middlewares/authMiddleware.js'
import { getContactsForDMList, searchContactsController } from "../controllers/contactController.js";

const contactRoutes = Router();

contactRoutes.post('/searchContacts', requireSignin, searchContactsController);
contactRoutes.get('/get-contacts-for-dm',  requireSignin ,getContactsForDMList);

export default contactRoutes;