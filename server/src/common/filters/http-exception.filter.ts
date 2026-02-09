import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter to handle all HTTP exceptions consistently
 * and provide better error logging
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Determine status code
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Get error message
        let message: string | string[] = 'Internal server error';
        let errorDetails: any = undefined;

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = (exceptionResponse as any).message || message;
                errorDetails = (exceptionResponse as any).error;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        // Log the error
        const errorLog = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            statusCode: status,
            message,
            ...(exception instanceof Error && { stack: exception.stack }),
        };

        if (status >= 500) {
            this.logger.error('Server error occurred', JSON.stringify(errorLog));
        } else {
            this.logger.warn('Client error occurred', JSON.stringify(errorLog));
        }

        // Prepare response body
        const responseBody: any = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        };

        // Only include error details in development
        if (process.env.NODE_ENV !== 'production' && errorDetails) {
            responseBody.error = errorDetails;
        }

        // Don't expose stack traces in production
        if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
            responseBody.stack = exception.stack;
        }

        response.status(status).json(responseBody);
    }
}
