import express from "express";
import {
  getBootcamps,
  createBootcamp,
  showBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsByRadius,
  uploadBootcampPhoto
} from "./../controllers/bootcamp.js";
import Bootcamp from "../models/Bootcamp.js";
import { authorize, protect } from "../middleware/auth.js"


import advancedResults from "../middleware/advancedResults.js";

// Inlcude other route resources
import courseRouter from "./courses.js"

const router = express.Router();  

// Re-route into other resources routers
router.use('/:bootcampId/courses', courseRouter)

router
  .route('/radius/:zipcode/:distance').get(getBootcampsByRadius)

router.route('/:id/photo').put(protect, authorize('admin','publisher') , uploadBootcampPhoto)

router
  .route("/")
  .get(advancedResults(Bootcamp, 'courses'),getBootcamps)
  .post(protect, authorize('admin','publisher'), createBootcamp);

router
  .route("/:id")
  .get(showBootcamp)
  .put(protect, authorize('admin','publisher'), updateBootcamp)
  .delete(protect, authorize('admin','publisher'), deleteBootcamp); 

export default router;