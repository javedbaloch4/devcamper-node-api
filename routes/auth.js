import express from "express"
import { createUser, login, getMe, forgetPassword } from "../controllers/auth.js" 
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


export default router;