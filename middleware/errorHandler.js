// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error(err.stack);

    // Set the response status code based on the error type
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is set

    // Create a response object
    const response = {
        status: 'error',
        statusCode: statusCode,
        message: err.message || 'Internal Server Error',
    };

    // Send the response
    res.status(statusCode).json(response);
};

module.exports = errorHandler;