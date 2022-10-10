import express from "express"
import { 
  createUser, 
  login, 
  getMe, 
  forgetPassword, 
  resetPassword, 
  updateDetails, 
  UpdatePassword,
  logout
} from "../controllers/auth.js" 
import { protect } from "../middleware/auth.js"

const router = express.Router();

router.get('/me', protect, getMe)
router.get('/logout', logout)
router.post('/register',createUser)
router.post('/login',login)
router.post('/forgetpassword', forgetPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, UpdatePassword)

export default router;