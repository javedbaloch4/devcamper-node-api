import express from "express"

import { 
    getCourses,
    showCourse,
    createCourse,
    updateCourse,
    deleteCourse
} from "../controllers/courses.js"

const router = express.Router({ mergeParams: true })

router
    .route('/').get(getCourses).post(createCourse)

router
    .route('/:id').get(showCourse).put(updateCourse).delete(deleteCourse)

export default router