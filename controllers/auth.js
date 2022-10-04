import bcrypt from "bcryptjs"
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

    res.status(200).json({
        success: true,
        msg: "User has been registered",
        user: user
    })
})