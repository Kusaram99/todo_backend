// Define a custom error class named ApiError that extends the built-in Error class
class ApiError extends Error {
    // The constructor method is called when a new instance of ApiError is created
    constructor(
        statusCode, // HTTP status code associated with the error
        message = "Something went wrong", // default error message
        errors = [], // Additional error details, defaulting to an empty array if not provided
        stack = "" // Stack trace, defaulting to an empty string if not provided
    ){
        // Call the constructor of the parent Error class with the provided message
        super(message);
        
        // Set the HTTP status code property
        this.statusCode = statusCode;
        
        // Set the data property to null (can be used to hold additional data if needed)
        this.data = null;
        
        // Set the error message property
        this.message = message;
        
        // Indicate that the operation was not successful
        this.success = false;
        
        // Store additional error details
        this.errors = errors;

        // If a stack trace is provided, use it
        if (stack) {
            this.stack = stack;
        } else {
            // Otherwise, capture the stack trace for the current error
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
 
export {ApiError};
