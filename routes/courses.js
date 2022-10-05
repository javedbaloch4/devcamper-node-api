import express from "express"
import { 
    getCourses,
    showCourse,
    createCourse,
    updateCourse,
    deleteCourse
} from "../controllers/courses.js"
import { protect } from "../middleware/auth.js"
import advancedResults from "../middleware/advancedResults.js"
import Course from "../models/Course.js"

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description averageCost'
        }), getCourses)
    .post(protect, createCourse)

router.route('/:id')
    .get(showCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse)

export default router