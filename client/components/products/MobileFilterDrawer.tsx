'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
}

interface MobileFilterDrawerProps {
    categories: Category[];
    currentCategory?: string;
    currentSearch?: string;
}

export function MobileFilterDrawer({ categories, currentCategory, currentSearch }: MobileFilterDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Trigger Button - Visible only on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-light rounded-lg text-gray-text font-medium shadow-sm hover:shadow-md transition-all mb-6"
            >
                <svg className="w-5 h-5 text-teal-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtrer & Rechercher
            </button>

            {/* Overlay Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-xs h-full bg-white shadow-2xl animate-soft-slide overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-display font-semibold text-xl text-teal-dark">Filtres</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-8">
                                <h4 className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-4">Recherche</h4>
                                <form action="/products" method="get">
                                    {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="search"
                                            placeholder="Produit..."
                                            defaultValue={currentSearch}
                                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-teal-main"
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-2 bg-teal-main text-white rounded-lg hover:bg-teal-dark transition-colors"
                                        >
                                            Go
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Categories */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-4">Catégories</h4>
                                <div className="space-y-2">
                                    <Link
                                        href="/products"
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-lg text-sm transition-colors ${!currentCategory
                                            ? 'bg-teal-soft text-teal-dark font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Tous les produits
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${cat.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-4 py-3 rounded-lg text-sm transition-colors ${currentCategory === cat.id
                                                ? 'bg-teal-soft text-teal-dark font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
