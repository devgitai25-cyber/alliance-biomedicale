'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Simple client-side auth check
        const { getUser } = require('@/lib/auth');
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/admin/login');
            return;
        }

        const userData = getUser();
        if (!userData || !userData.isAdmin) {
            router.push('/'); // Not admin or invalid token
            return;
        }

        setUser(userData);
    }, [router]);

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const navItems = [
        { label: 'Tableau de bord', href: '/admin', icon: '📊' },
        { label: 'Commandes', href: '/admin/orders', icon: '📦' },
        { label: 'Produits', href: '/admin/products', icon: '🏷️' },
        { label: 'Catégories', href: '/admin/categories', icon: '📁' },
        { label: 'Clients', href: '/admin/customers', icon: '👥' },
        { label: 'Paramètres', href: '/admin/settings', icon: '⚙️' },
    ];

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/admin/login');
    };


    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo & Desktop Nav */}
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-main rounded-lg flex items-center justify-center text-white font-bold">A</div>
                                <span className="font-display font-bold text-dark text-lg hidden md:block">BioEco Admin</span>
                            </div>

                            {/* Desktop Links */}
                            <div className="hidden md:ml-10 md:flex md:space-x-1 lg:space-x-4">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${isActive
                                                ? 'border-teal-main text-dark'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="mr-2 text-lg">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4">
                            <Button href="/" variant="outline" size="sm" target="_blank" className="hidden md:flex">
                                Voir le site ↗
                            </Button>

                            {/* User Profile Dropdown (simplified) */}
                            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium text-dark">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Déconnexion"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                                >
                                    <span className="sr-only">Ouvrir le menu</span>
                                    {mobileMenuOpen ? (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu (Portal Slide-over) */}
                {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
                    <div className="relative z-[100]">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col animate-slide-in-right">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <span className="font-display font-bold text-lg text-dark">Menu</span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                ? 'bg-teal-main text-white shadow-md'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-dark'
                                                }`}
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-teal-soft rounded-full flex items-center justify-center text-teal-dark font-bold">
                                        {user.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-dark">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors font-medium text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
