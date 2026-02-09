'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types'; // Updated import

interface ProductStickyBarProps {
    product: any; // Using any for simplicity now, preferably Product type
}

export function ProductStickyBar({ product }: ProductStickyBarProps) {
    const { addItem } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        addItem(product, 1);
        setIsLoading(false);
    };

    if (product.stock === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-light p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50 animate-slide-up">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-medium font-body uppercase tracking-wide">Total</span>
                    <span className="text-xl font-display font-bold text-teal-dark">
                        {product.price.toFixed(2)} TND
                    </span>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className="flex-1 bg-dark text-white py-3 px-6 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Ajouter</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
