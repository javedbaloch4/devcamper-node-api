import express from "express";
import {
  getBootcamps,
  createBootcamp,
  showBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from "./../controllers/bootcamp.js";

const router = express.Router();

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(showBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;