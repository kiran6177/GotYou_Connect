export class CustomError{
    static createError(message,statusCode){
        const error = new Error(message);
        error.statusCode = statusCode
        return error
    }
}