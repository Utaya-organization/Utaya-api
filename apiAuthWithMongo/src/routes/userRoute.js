import express from "express";
import { deleteUsers, getAllUsers, getUserLogin, loginUsers, logoutUsers, storeUsers, updatePassword } from "../controller/userController.js";
import { destroyProduct, getSkinType, storeProduct, storeSkinType } from "../controller/skinTypeController.js";
import { Auth } from "../middleware/auth.js";
import { refreshToken } from "../controller/refreshToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();
router.get('/users', Auth, getUserLogin);
router.post('/users', storeUsers);
router.post('/login', loginUsers);
router.put('/users', Auth, updatePassword);
router.delete('/logout', Auth, logoutUsers);
router.delete('/users', Auth, deleteUsers);
router.get('/token', refreshToken);
router.get('/allusers', Auth, isAdmin, getAllUsers);

router.get('/skintype', getSkinType);
router.post('/skintype', storeSkinType);
router.post('/product', storeProduct);
router.delete('/product/:skinTypeName/:idProduct', destroyProduct);


export default router;