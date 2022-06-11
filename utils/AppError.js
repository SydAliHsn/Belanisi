class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = (this.statusCode + '').startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Using captureStackTrace to not pollute the stack trace
    // See this: https://stackoverflow.com/questions/59625425/understanding-error-capturestacktrace-and-stack-trace-persistance#:~:text=captureStackTrace(error%2C%20constructorOpt),to%20the%20given%20error%20object.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
