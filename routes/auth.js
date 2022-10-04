import e from "express";
import express from "express"

import { createUser } from "../controllers/auth.js" 

const router = express.Router();


router
  .route('/').post(createUser)



export default router;