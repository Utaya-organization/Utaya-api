import express from "express";
// import { deleteUsers, getAllUsers, GetUserLogin, LoginUsers, logoutUsers, storeUsers, UpdatePassword } from "../controller/userController.js";
import { destroyProduct, getSkinType, registerUser, storeProduct, storeSkinType, loginUser, getUserLogin, updatePassword, logoutUser, deleteUser, addHistory, getHistory, addHistorys, isAdmin } from "../controller/skinTypeController.js";
import { Auth } from "../middleware/auth.js";
import { refreshToken } from "../controller/refreshToken.js";
// import { isAdmin } from "../middleware/isAdmin.js";
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


router.get('/skintype', Auth, getSkinType);
router.post('/skintype', Auth, isAdmin, upload.single('file'), storeSkinType);
router.post('/product', Auth, isAdmin, upload.single('file'), storeProduct);
router.delete('/product/:skinTypeName/:idProduct', Auth, isAdmin, destroyProduct);
router.post('/predict', upload.single('image'), addHistorys);
// router.post('/history/:skinType', Auth,addHistory);
router.get('/history', Auth, getHistory);
// router.post('/predict', upload.single('image'),addHistorys);


export default router;