export const errorHandler = (err, req, res, next) => {
  // for development show errors in console.
  console.log(err.stack.red);

  res.status(500).json({
    success: false,
    error: err.message,
  });
};
