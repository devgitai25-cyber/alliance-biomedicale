import { jwtDecode } from 'jwt-decode';
import { AuthError, logError, getUserFriendlyMessage } from './errors';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin: boolean;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

interface JwtPayload {
    sub: string;
    email: string;
    isAdmin: boolean;
    exp: number;
    iat: number;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({ message: 'Invalid credentials' }));
            throw new AuthError(error.message || 'Invalid credentials');
        }

        const data: AuthResponse = await res.json();

        // Validate response structure
        if (!data.accessToken || !data.user) {
            throw new AuthError('Invalid response from server');
        }

        return data;
    } catch (error) {
        logError(error, 'login');
        if (error instanceof AuthError) {
            throw error;
        }
        throw new AuthError(getUserFriendlyMessage(error));
    }
}

export function logout(): void {
    try {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    } catch (error) {
        logError(error, 'logout');
    }
}

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        return localStorage.getItem('token');
    } catch (error) {
        logError(error, 'getToken');
        return null;
    }
}

export function getUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        const user = JSON.parse(userStr);

        // Validate user object structure
        if (!user.id || !user.email || typeof user.isAdmin !== 'boolean') {
            logError('Invalid user data in localStorage', 'getUser');
            localStorage.removeItem('user');
            return null;
        }

        return user as User;
    } catch (error) {
        logError(error, 'getUser');
        localStorage.removeItem('user'); // Clear corrupted data
        return null;
    }
}

export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (!decoded.exp) {
            logError('Token missing expiration', 'isAuthenticated');
            return false;
        }

        if (decoded.exp < currentTime) {
            logError('Token expired', 'isAuthenticated');
            logout(); // Clean up expired token
            return false;
        }

        return true;
    } catch (error) {
        logError(error, 'isAuthenticated');
        logout(); // Clean up invalid token
        return false;
    }
}

export function isAdmin(): boolean {
    const user = getUser();
    return user?.isAdmin === true;
}

/**
 * Get decoded JWT payload
 */
export function getTokenPayload(): JwtPayload | null {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        logError(error, 'getTokenPayload');
        return null;
    }
}

/**
 * Check if token will expire soon (within 5 minutes)
 */
export function isTokenExpiringSoon(): boolean {
    const payload = getTokenPayload();
    if (!payload || !payload.exp) return true;

    const currentTime = Date.now() / 1000;
    const fiveMinutes = 5 * 60;

    return payload.exp - currentTime < fiveMinutes;
}

