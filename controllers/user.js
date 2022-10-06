import asyncHandler from "../middleware/asyncHandler.js"
import User from "../models/User.js"

/**
 * @desc Get all users
 * @route /api/v1/users
 * @access Private/Admin
 */
export const getUsers = asyncHandler( async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

/**
 * @desc Get Create user
 * @route POST /api/v1/users
 * @access Private/Admin
 */
export const createUser = asyncHandler( async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(200).json({
        success: true,
        data: user
    })
})

/**l
 * @desc Get single user
 * @route POST /api/v1/users/:id
 * @access private/admin
 */
 export const getUser = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        user: user
    })
})

/**
 * @desc Update user
 * @route PUT /api/v1/users/:id
 * @access private/admin
 */
 export const updateUser = asyncHandler( async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * @desc Delete user
 * @route /api/v1/users/:id
 * @access private/admin
 */
 export const deleteUser = asyncHandler( async (req, res, next) => {

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    })
})