import express from "express";
// import { deleteUsers, getAllUsers, GetUserLogin, LoginUsers, logoutUsers, storeUsers, UpdatePassword } from "../controller/userController.js";
import { destroyProduct, getSkinType, registerUser, storeProduct, storeSkinType, loginUser, getUserLogin, updatePassword, logoutUser, deleteUser, addHistory } from "../controller/skinTypeController.js";
import { Auth } from "../middleware/auth.js";
import { refreshToken } from "../controller/refreshToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import multer from "multer";


const upload = multer({
    storage:multer.memoryStorage()
  })

const router = express.Router();
router.get('/users', Auth, getUserLogin);
router.post('/users', registerUser);
router.post('/login', loginUser);
router.put('/users', Auth, updatePassword);
router.delete('/logout', Auth, logoutUser);
router.delete('/users', Auth, deleteUser);
router.get('/token', refreshToken);
// router.get('/allusers', Auth, isAdmin, getAllUsers);

router.get('/skintype', getSkinType);
router.post('/skintype', upload.single('file'), storeSkinType);
router.post('/product', upload.single('file'), storeProduct);
router.delete('/product/:skinTypeName/:idProduct', destroyProduct);
router.post('/predict', Auth, addHistory);


export default router;