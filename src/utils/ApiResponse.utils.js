class ApiResponse {
    constructor(success, message, data = null, statusCode = 200) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }

    static success(res, message = 'success', data = null, statusCode = 200) {
        return res.status(statusCode).json(new ApiResponse(true, message, data, statusCode));
    }
    static error(res, message = 'Something went wrong', statusCode = 500, errors = null) {
        return res.status(statusCode).json(new ApiResponse(false, message, errors, statusCode));
    }
}

export default ApiResponse;
