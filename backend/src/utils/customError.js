class CustomError extends Error {
  constructor(message, httpCode = 500) {
    super(message);
    this.statusCode = httpCode;
  }
}

export default CustomError;
