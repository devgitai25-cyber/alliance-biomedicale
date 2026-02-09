export interface ApiError {
    message: string;
    statusCode?: number;
    error?: string;
}

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export function isApiError(error: any): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
    );
}

export function logError(error: unknown, context: string): void {
    console.error(`Error in ${context}:`, error);
}

export function getUserFriendlyMessage(error: unknown): string {
    if (isApiError(error)) {
        return error.message;
    }

    if (error instanceof AuthError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'Une erreur inattendue est survenue. Veuillez réessayer.';
}
