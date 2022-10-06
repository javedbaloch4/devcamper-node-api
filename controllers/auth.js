import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../middleware/asyncHandler.js"
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"

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

/**
 * @desc Update user details
 * @route POST /api/v1/updatedetails
 * @access Private
*/
export const updateDetails = asyncHandler( async(req, res, next) => {

  const fieldToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldToUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    user
  })
})

/**
 * @desc Update user password
 * @route POST /api/v1/updatepassword
 * @access Private
*/
export const UpdatePassword = asyncHandler( async(req, res, next) => {
  // Find the old passowrd
  const user = await User.findById(req.user.id).select('+password')

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword;

  await user.save()
  
   // return token
   sendTokenResponse(user, 200, res);
})



/**
 * @desc Reset Password
 * @route PUT /api/v1/auth/resetpassword/:resettoken
 * @access Public 
*/
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');


  console.log(resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log(user)

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/**
 * @desc Forget password
 * @route POST /api/v1/auth/forgetpassword
 * @access Public
*/
export const forgetPassword = asyncHandler( async(req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new Error('There is no user with that email', 404))
  }

  // Get reset token
  const resetToken = user.resetPasswordToken();

  console.log('Forget password', resetToken)

  // Reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n \n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset Token',
      message
    })
  } catch(err) {
    console.log(err)
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse(`Email could not be sent `, 500))
  }

  return res.status(200).json({
    success: true,
    data: 'Email sent.'
  })
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

