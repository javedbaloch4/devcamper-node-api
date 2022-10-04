import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js"

/**
 * @desc Create user
 * @route GET /api/v1/user
 * @access Public
 */
export const createUser = asyncHandler( async (req, res, next) => {

    const user = await User.find();

    res.status(200).json({
        success: true,
        user: user
    })
})