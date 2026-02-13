import Link from 'next/link';
import Image from 'next/image';
import { getPublicSettings } from '@/lib/api';

export async function Footer() {
    const settings = await getPublicSettings();
    const siteEmail = settings.site_email || 'contact@alliance-bio.tn';
    const sitePhone = settings.site_phone || '+216 71 123 456';

    return (
        <footer className="bg-white border-t border-gray-light/50 mt-auto">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand - Premium presentation */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/logo.png"
                                    alt="Alliance Biomédicale"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="font-display font-medium text-lg text-teal-dark">
                                Alliance Biomédicale
                            </h2>
                        </div>
                        <p className="text-gray-text text-sm leading-relaxed mb-6 font-body">
                            Votre destination pour des soins cosmétiques biologiques et naturels de qualité supérieure.
                        </p>
                        <div className="space-y-3 text-sm text-gray-text font-body">
                            <p className="flex items-center gap-2.5 hover:text-teal-main transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <a href={`mailto:${siteEmail}`} className="hover:text-teal-main transition-colors">
                                    {siteEmail}
                                </a>
                            </p>
                            <p className="flex items-center gap-2.5 hover:text-teal-main transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <a href={`tel:${sitePhone.replace(/\s/g, '')}`} className="hover:text-teal-main transition-colors">
                                    {sitePhone}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-display font-semibold text-teal-dark mb-5 text-sm uppercase tracking-luxury">
                            Navigation
                        </h3>
                        <ul className="space-y-3 text-gray-text text-sm font-body">
                            <li>
                                <Link href="/products" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Nos Produits
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=soins-visage" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Soins Visage
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=soins-corps" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Soins Corps
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=anti-age" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Anti-Âge
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-display font-semibold text-teal-dark mb-5 text-sm uppercase tracking-luxury">
                            Service Client
                        </h3>
                        <ul className="space-y-3 text-gray-text text-sm font-body">
                            <li>
                                <Link href="/profile" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Mon Compte
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Ma Wishlist
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Livraison & Retours
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Social */}
                    <div>
                        <h3 className="font-display font-semibold text-teal-dark mb-5 text-sm uppercase tracking-luxury">
                            Suivez-nous
                        </h3>

                        {/* Modern SVG Social Icons */}
                        <div className="flex gap-3 mb-8">
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-gray-light hover:border-teal-main flex items-center justify-center text-gray-text hover:text-teal-main hover:bg-teal-soft/30 transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-gray-light hover:border-teal-main flex items-center justify-center text-gray-text hover:text-teal-main hover:bg-teal-soft/30 transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>

                        <h4 className="font-display font-semibold text-teal-dark mb-4 text-sm">
                            Informations
                        </h4>
                        <ul className="space-y-3 text-gray-text text-sm font-body">
                            <li>
                                <a href="#" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Mentions légales
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    Confidentialité
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-teal-main transition-colors duration-300 inline-block">
                                    CGV
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar - Refined */}
                <div className="border-t border-gray-light/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-medium">
                    <p className="text-sm font-body">
                        © {new Date().getFullYear()} Alliance Biomédicale. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-6 text-xs font-body">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Produits certifiés bio
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Made in Tunisia
                        </span>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-teal-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Developed by <a href="#" className="hover:text-teal-main transition-colors">HK</a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
