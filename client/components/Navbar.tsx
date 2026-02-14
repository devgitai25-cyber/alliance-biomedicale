'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { openCart, totalItems } = useCart();
    const { user, logout } = useAuth();
    const { count: wishlistCount } = useWishlist();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auto-close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Helper for handleLogout is now just logout from context
    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false); // Close mobile menu if open
    };

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/products', label: 'Produits' },
        { href: '/about', label: 'À propos' },
        { href: '/contact', label: 'Contact' },
    ];



    return (
        <nav className="glass-effect sticky top-0 z-50 border-b border-gray-light/50">
            <Container>
                <div className="flex items-center justify-between h-24">
                    {/* Logo - Premium presentation */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-14 h-14 md:w-16 md:h-16">
                            <Image
                                src="/logo.png"
                                alt="Alliance Biomédicale"
                                fill
                                className="object-contain transform group-hover:scale-105 transition-transform duration-400"
                                priority
                            />
                        </div>
                        <span className="font-display font-light text-xl md:text-2xl text-teal-dark hidden sm:block tracking-tight">
                            Alliance Biomédicale
                        </span>
                    </Link>

                    {/* Desktop Navigation - Minimalist */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative font-display font-light text-gray-text hover:text-teal-main transition-colors duration-300 text-[15px] tracking-wide py-2"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-teal-main group-hover:w-full transition-all duration-400 ease-out" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions - Refined */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Wishlist Link - Subtle icon */}
                        <Link
                            href="/wishlist"
                            className="relative p-2.5 hover:bg-teal-soft/50 rounded-lg transition-colors duration-300 text-gray-text hover:text-teal-main"
                            aria-label="Wishlist"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {isMounted && wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-teal-main text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart Icon - Elegant with badge */}
                        <button
                            onClick={openCart}
                            className="relative p-2.5 hover:bg-teal-soft/50 rounded-lg transition-colors duration-300"
                            aria-label="Shopping Cart"
                        >
                            <svg className="w-5 h-5 text-gray-text" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {isMounted && totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-teal-main text-white text-xs font-display font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-soft">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* User Menu / Login - Premium buttons */}
                        {isMounted && user ? (
                            <div className="hidden md:flex items-center gap-3">
                                {user.isAdmin ? (
                                    <Link href="/admin">
                                        <Button size="sm" variant="outline">
                                            Admin
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/profile">
                                        <Button size="sm" variant="outline">
                                            Profil
                                        </Button>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-gray-medium hover:text-error transition-colors duration-300"
                                    title="Déconnexion"
                                    aria-label="Logout"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : isMounted ? (
                            <Link href="/login" className="hidden md:block">
                                <Button size="sm" variant="primary">
                                    Connexion
                                </Button>
                            </Link>
                        ) : null}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-lg hover:bg-teal-soft/50 transition-colors"
                            aria-label="Menu"
                        >
                            <svg className="w-6 h-6 text-gray-text" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Full Screen Luxury Overlay (Portal) */}
                {isMounted && mobileMenuOpen && createPortal(
                    <div className="fixed inset-0 z-[100] bg-white animate-fade-in-up flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-light/50">
                            <span className="font-display font-medium text-xl text-teal-dark">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
                            {navLinks.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-3xl font-display font-light text-teal-dark py-4 border-b border-gray-light/30 hover:text-teal-main transition-colors"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* User Section */}
                            <div className="mt-8 pt-8 border-t border-gray-light/50">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-teal-soft flex items-center justify-center text-teal-dark font-medium">
                                                {user.firstName ? user.firstName[0] : 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-dark">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={user.isAdmin ? '/admin' : '/profile'}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 border border-gray-light rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            {user.isAdmin ? 'Tableau de bord' : 'Mon Profil'}
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="block w-full py-3 bg-gray-50 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 bg-teal-main text-white rounded-lg font-medium hover:bg-teal-dark shadow-soft transition-all"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 border border-teal-main text-teal-dark rounded-lg font-medium hover:bg-teal-soft transition-colors"
                                        >
                                            Créer un compte
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </Container>
        </nav>
    );
}
