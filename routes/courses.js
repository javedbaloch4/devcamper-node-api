import express from "express"
import { 
    getCourses,
    showCourse,
    createCourse,
    updateCourse,
    deleteCourse
} from "../controllers/courses.js"
import { protect, authorize } from "../middleware/auth.js"
import advancedResults from "../middleware/advancedResults.js"
import Course from "../models/Course.js"

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description averageCost'
        }), getCourses)
    .post(protect, authorize('admin','publisher') , createCourse)

router.route('/:id')
    .get(showCourse)
    .put(protect, authorize('admin','publisher'), updateCourse)
    .delete(protect, authorize('admin','publisher'), deleteCourse)

export default router