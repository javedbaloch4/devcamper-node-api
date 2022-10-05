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
   
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults)
    } 
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
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(
            new ErrorResponse(`The Bootcamp not found wiht id ${req.params.id}`, 404)
        ); 
    }

    // Make sure the user is course owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorzied to add in bootcamp ${bootcamp._id}`, 401))
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

    let course = await Course.findById(req.params.id)

    // Make sure the user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update the course ${course._id}`, 401))
    }

    if (!course) {
        return next(
            new ErrorResponse(`The course not found wiht id ${req.params.id}`)
        ); 
    }


    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

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

    // Make sure if the user is owner of the course
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete the delete ${course._id}`))
    }

    await course.remove()
    
    res.status(200).json({
        success: true,
        msg: "Course has been deleted"
    })
})