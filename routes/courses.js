import express from "express"

import { 
    getCourses,
    showCourse,
    createCourse,
    updateCourse,
    deleteCourse
} from "../controllers/courses.js"

import advancedResults from "../middleware/advancedResults.js"
import Course from "../models/Course.js"

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description averageCost'
        }), getCourses)
    .post(createCourse)

router.route('/:id')
    .get(showCourse)
    .put(updateCourse)
    .delete(deleteCourse)

export default router