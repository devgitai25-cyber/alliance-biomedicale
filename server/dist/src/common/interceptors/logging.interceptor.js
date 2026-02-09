"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let LoggingInterceptor = class LoggingInterceptor {
    logger = new common_1.Logger('HTTP');
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const now = Date.now();
        this.logger.log(`→ ${method} ${url}`);
        if (process.env.NODE_ENV !== 'production') {
            const sanitizedBody = this.sanitizeBody(body);
            if (Object.keys(sanitizedBody).length > 0) {
                this.logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
            }
        }
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const responseTime = Date.now() - now;
                this.logger.log(`← ${method} ${url} - ${responseTime}ms`);
            },
            error: (error) => {
                const responseTime = Date.now() - now;
                this.logger.error(`← ${method} ${url} - ${error.status || 500} - ${responseTime}ms`);
            },
        }));
    }
    sanitizeBody(body) {
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
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map