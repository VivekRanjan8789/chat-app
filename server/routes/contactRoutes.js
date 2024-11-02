import { Router } from "express";
import { requireSignin } from '../middlewares/authMiddleware.js'
import { getContactsForDMList, searchContactsController, getAllContactsController } from "../controllers/contactController.js";

const contactRoutes = Router();

contactRoutes.post('/searchContacts', requireSignin, searchContactsController);
contactRoutes.get('/get-contacts-for-dm',  requireSignin ,getContactsForDMList);
contactRoutes.get('/get-all-contacts', requireSignin, getAllContactsController);

export default contactRoutes;