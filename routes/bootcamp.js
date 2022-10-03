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

// Inlcude other route resources
import courseRouter from "./courses.js"

const router = express.Router();

// Re-route into other resources routers
router.use('/:bootcampId/courses', courseRouter)

router
  .route('/radius/:zipcode/:distance').get(getBootcampsByRadius)

router.route('/:id/photo').put(uploadBootcampPhoto)

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(showBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;