import { Router } from "express";
import { loginUser, registerUser, userLogout,refreshAccessToken } from '../controllers/user.controller.js'
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, userLogout)
router.route('/token').post(refreshAccessToken)


export default router;