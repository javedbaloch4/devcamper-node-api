import Course from "../models/Course.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Bootcamp from "../models/Bootcamp.js";


/**
 * @desc Get all courses
 * @route GET /api/v1/courses
 * @access Public
 */
export const getCourses = asyncHandler( async (req, res, next) => {
   
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    } 

    const courses = await query;

    return res.status(200).json({
        success: true, 
        count: courses.length, 
        data: courses
    })
})


/**
 * @desc Show single course
 * @route GET /api/v1/courses/:id
 * @access Public
 */
export const showCourse = asyncHandler( async (req, res, next) => {
    const { id } = req.params

    const course = await Course.findById(id);

    return res.status(200).json({
        success: true,
        data: course
    })
})


/**
 * @desc Add course
 * @route POST /api/v1/courses
 * @access Private
 */
export const createCourse = asyncHandler ( async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(
            new ErrorResponse(`The Bootcamp not found wiht id ${req.params.id}`, 404)
        ); 
    }

    const course = await Course.create(req.body)

    return res.status(200).json({
        success: true,
        data: course
    })
})


/**
 * @desc Update Course
 * @route PUT /api/v1/courses/:id
 * @access Private
 */
export const updateCourse = asyncHandler( async(req, res, next) => {

    /** One wa by using findById
        const patient = await Patient.findById(id)
        Object.assign(patient, body)
        await patient.save()
     */

    const course = await Course.updateOne({ _id: req.params.id }, { $set: req.body });
    
    if (!course) {
        return next(
            new ErrorResponse(`The course not found wiht id ${req.params.id}`)
        ); 
    }

    res.status(200).json({
        success: true,
        data: course
    })
})

/**
 * @desc Delete Course
 * @route DELETE /api/v1/courses/:id
 * @access Private
 */
export const deleteCourse = asyncHandler ( async (req, res, next) => {
    
    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(
            new ErrorResponse(`No course with id of ${req.params.id}`)
        )
    }

    // await Course.deleteOne({_id: req.params.id})

    await course.remove()
    
    res.status(200).json({
        success: true,
        msg: "Course has been deleted"
    })
})