import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js"


/**
 * @desc Regsiter user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const createUser = asyncHandler( async (req, res, next) => {

    const { name, email, password, role } = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    // Create JWT Token 
    const token = user.getSignedJwtToken()

    res.status(200).json({
        success: true,
        msg: "User has been registered",
        token
    })
})


/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
 export const login = asyncHandler( async (req, res, next) => {

    const { email, password } = req.body

    // Validate the user
    if (!email || !password) {
      return next(new ErrorResponse('Please add email and password', 400))
    }

    //Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credientials', 400))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credientials', 400))
    }

    // Create JWT Token 
    const token = user.getSignedJwtToken()

    res.status(200).json({
        success: true,
        msg: "User has been logged in",
        token
    })
})