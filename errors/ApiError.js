class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static BadRequest(msg) {
    return new ApiError(400, msg);
  }

  static Internal(msg) {
    return new ApiError(500, msg);
  }

  static NotFound(msg) {
    return new ApiError(404, msg);
  }

  static Unauthorized(msg) {
    return new APIError(401, msg);
  }

  static Forbidden(msg) {
    return new APIError(403, msg);
  }
}

module.exports = ApiError;
