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

  // return token
  sendTokenResponse(user, 200, res);
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

    // return token
    sendTokenResponse(user, 200, res);
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
  };

/**
 * @desc Get Register user
 * @route POST /api/v1/auth/me
 * @access Private
*/
export const getMe = asyncHandler( async(req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  })

})
