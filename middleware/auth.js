import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"
import User from "../models/User.js"

export const protect = asyncHandler( async(req, res, next) => {

    let token;

    // Get the authroziation
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new ErrorResponse('Not authorize to access this route', 401))
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch(err) {
        return next(new ErrorResponse('Not authorize to access this route', 401))
    }
})
