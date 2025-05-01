
// Global error handling middleware
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response - with full error details
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  
  // Production error response - without error details
  // Handle specific error types
  let error = { ...err };
  error.message = err.message;

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists. Please use another value.`;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    error.message = `Invalid input data: ${errors.join('. ')}`;
    error.statusCode = 400;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Your token has expired. Please log in again.';
    error.statusCode = 401;
  }

  return res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Something went wrong'
  });
};
