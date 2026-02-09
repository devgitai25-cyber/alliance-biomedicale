'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            handleLogin(token);
        } else {
            router.push('/login?error=NoToken');
        }
    }, [searchParams]);

    const handleLogin = async (token: string) => {
        try {
            // Fetch user profile using the token
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const user = await res.json();
                login(token, user);
                // Redirect logic: check for returnUrl or default to profile/home
                // Assuming locale 'fr' for now as params are not easily accessible here without Page props, 
                // but we are in [locale].
                // Better to let Router handle relative path or specific path.
                // We'll redirect to /profile.
                router.push('/profile');
            } else {
                throw new Error('Failed to fetch profile');
            }
        } catch (err) {
            console.error(err);
            setError('Authentication failed. Please try again.');
            setTimeout(() => {
                router.push('/login?error=GoogleAuthFailed');
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-lg shadow-sm">
                {error ? (
                    <>
                        <div className="text-red-500">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-800 font-medium">{error}</p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 border-4 border-teal-main/30 border-t-teal-main rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-body">Authentification en cours...</p>
                    </>
                )}
            </div>
        </div>
    );
}
