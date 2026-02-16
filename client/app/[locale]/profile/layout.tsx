'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ProfileLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>
}) {
    const router = useRouter();
    const [locale, setLocale] = useState('fr');
    const [isAuthorized, setIsAuthorized] = useState(false);

    const searchParams = useSearchParams();
    const currentView = searchParams.get('view') || 'orders';

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const { locale: l } = await params;
            setLocale(l);

            if (!token) {
                router.push(`/${l}/login`);
                return;
            }
            setIsAuthorized(true);
        };
        checkAuth();
    }, [router, params]);

    if (!isAuthorized) {
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <nav className="space-y-2">
                                <Link
                                    href={`/${locale}/profile?view=orders`}
                                    className={`block px-4 py-2 font-medium rounded-lg ${currentView === 'orders' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Mes Commandes
                                </Link>
                                <Link
                                    href={`/${locale}/profile?view=account`}
                                    className={`block px-4 py-2 font-medium rounded-lg ${currentView === 'account' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Mon Profil
                                </Link>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        window.location.href = `/${locale}/login`;
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg mt-4 border-t pt-4"
                                >
                                    Déconnexion
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="md:col-span-3">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
