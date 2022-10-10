import Bootcamp from "../models/Bootcamp.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js"
import Review from "../models/Reivew.js"

/**
 * @desc Get all reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @route GET /api/v1/reviews/:id
 * @access Public
*/
export const getReviews = asyncHandler( async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
});

/**
 * @desc Get a single reviews
 * @route GET /api/v1/reviews/:id
 * @access Public
*/
export const getReview = asyncHandler( async (req, res, next) => {
    const {id} = req.params

    const review = await Review.findById(id).populate({
        path: 'bootcamp',
        select: 'name description'
    }).populate({
        path: 'user',
        select: 'name email role'
    })

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        review
    })

});

/**
 * @desc Create review
 * @route POST /api/v1/bootcamps/:id/reviews
 * @access Public
*/
export const createReview = asyncHandler( async (req, res, next) => {
    // Add bootcamp & user in req.body
    req.body.user = req.user.id
    req.body.bootcamp = req.params.bootcampId

    // Check if bootcamp exsists
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp ${req.params.bootcampId} not found`, 404))
    }

    const review = await Review.create(req.body)

    res.status(200).json({
        success: true,
        data: review
    })
});

/**
 * @desc Update the review
 * @route PUT /api/v1/reviews/:id
 * @access Private
*/
export const updateReview = asyncHandler(async(req, res, next) => {
    // Check if the review exists
    let review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`Review with id ${req.params.id} not found.`, 404))
    }

    // Check if the review belongs to user
    if (!review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401))
    }

    // Update the review
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: review
    })
})

/**
 * @desc Delete review belongs to user
 * @route DELETE /api/v1/:id
 * @access Private/admin
 */
export const deleteReview = asyncHandler(async (req, res, next) => {

    // Find the review
    const review = await Review.findById(req.params.id)

    if (!review) {
        return next(new ErrorResponse(`Review not found id ${req.params.id}`, 404))
    }

    // Check if the review is belongs to user
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Unauthorized to delete the review`, 401))
    }

    res.status(200).json({
        success: true,
        data: {}
    })

})