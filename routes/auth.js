import express from "express"
import { createUser, login, getMe, forgetPassword, resetPassword, updateDetails, UpdatePassword } from "../controllers/auth.js" 
import { protect } from "../middleware/auth.js"

const router = express.Router();

router
  .route('/register').post(createUser)

router
  .route('/login').post(login)

router
  .route('/me').get(protect, getMe)

router
  .route('/forgetpassword').post(forgetPassword)

router 
  .route('/resetpassword/:resettoken').put(resetPassword)

router
  .route('/updatedetails').put(protect, updateDetails)

router.put('/updatepassword', protect, UpdatePassword)

export default router;