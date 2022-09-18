import Course from "../models/Course.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";


/**
 * @desc Get all courses
 * @route /api/v1/courses
 * @access Public
 */
export const getCourses = asyncHandler( async (req, res, next) => {
   
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find()
    }

    const courses = await query;

    return res.status(200).json({
        success: true, 
        count: courses.length, 
        data: courses
    })
})
