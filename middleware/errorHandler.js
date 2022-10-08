import ErrorResponse from "../utils/ErrorResponse.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  // for development show errors in console.

  // Mongoose not found 
  if (err.name === "CastError") {
    const message = `Resource not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate entry
  if (err.code === 11000) {
    const message = `Duplicate field entered`;
    error = new ErrorResponse(message, 400  )
  }

  // Validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false, 
    error: error.message || "Server error",
  });
};