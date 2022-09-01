import ErrorResponse from "../utils/ErrorResponse.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  // for development show errors in console.
  console.log(err.stack.red);

  if (err.name === "CastError") {
    const message = `Bootcamp not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error.message || "Server error",
  });
};
