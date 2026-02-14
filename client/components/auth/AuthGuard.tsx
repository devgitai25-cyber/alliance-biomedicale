'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            if (!authenticated) {
                // Detect current locale from pathname (e.g., /fr/checkout -> fr)
                const pathParts = pathname.split('/');
                const locale = pathParts[1] || 'fr';

                // Redirect to login with callback URL
                const callbackUrl = encodeURIComponent(pathname);
                router.push(`/${locale}/login?callbackUrl=${callbackUrl}`);
            } else {
                setIsAuthorized(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [router, pathname]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-light border-t-dark rounded-full animate-spin"></div>
                    <p className="text-dark font-serif text-lg animate-pulse">Vérification...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
