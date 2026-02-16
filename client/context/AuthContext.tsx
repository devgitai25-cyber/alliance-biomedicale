'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    isAdmin: boolean;
}

interface JwtPayload {
    sub: string;
    email: string;
    isAdmin: boolean;
    exp: number;
    iat: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decode user data from JWT token
 */
function getUserFromToken(token: string): User | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            console.warn('Token expired');
            return null;
        }

        return {
            id: decoded.sub,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
            // firstName and lastName are not in JWT, will be undefined
            // These could be added to JWT payload if needed
        };
    } catch (e) {
        console.error('Failed to decode token', e);
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const userData = getUserFromToken(token);
            if (userData) {
                setUser(userData);
            } else {
                // Token is invalid or expired, clean up
                localStorage.removeItem('token');
            }
        }

        setIsLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        // Only store the token in localStorage
        localStorage.setItem('token', token);
        // Store user data in React state only
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
