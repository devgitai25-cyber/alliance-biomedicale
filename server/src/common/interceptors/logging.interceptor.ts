import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging interceptor to log all incoming requests and their execution time
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const now = Date.now();

        // Log incoming request
        this.logger.log(`→ ${method} ${url}`);

        // Log request body in development (excluding sensitive data)
        if (process.env.NODE_ENV !== 'production') {
            const sanitizedBody = this.sanitizeBody(body);
            if (Object.keys(sanitizedBody).length > 0) {
                this.logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
            }
        }

        return next.handle().pipe(
            tap({
                next: () => {
                    const responseTime = Date.now() - now;
                    this.logger.log(`← ${method} ${url} - ${responseTime}ms`);
                },
                error: (error) => {
                    const responseTime = Date.now() - now;
                    this.logger.error(
                        `← ${method} ${url} - ${error.status || 500} - ${responseTime}ms`
                    );
                },
            })
        );
    }

    /**
     * Remove sensitive fields from request body for logging
     */
    private sanitizeBody(body: any): any {
        if (!body || typeof body !== 'object') {
            return {};
        }

        const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];
        const sanitized = { ...body };

        for (const field of sensitiveFields) {
            if (field in sanitized) {
                sanitized[field] = '***';
            }
        }

        return sanitized;
    }
}
