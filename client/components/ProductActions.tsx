'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { addToWishlist, removeFromWishlist, checkInWishlist } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const { addItem } = useCart();
    const router = useRouter();

    useEffect(() => {
        const checkWishlist = async () => {
            const inList = await checkInWishlist(product.id);
            setIsInWishlist(inList);
        };
        checkWishlist();
    }, [product.id]);

    const handleAddToCart = async () => {
        setIsLoading(true);
        // Simulate a small delay for better UX feeling
        await new Promise(resolve => setTimeout(resolve, 300));
        addItem(product, quantity);
        setIsLoading(false);
    };

    const handleToggleWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/fr/login');
            return;
        }

        setIsWishlistLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(product.id);
                setIsInWishlist(false);
            } else {
                await addToWishlist(product.id);
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Failed to toggle wishlist', error);
        } finally {
            setIsWishlistLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium font-body">Quantité:</span>
                <div className="flex items-center border border-gray-light rounded-lg bg-white shadow-sm">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-gray-500 hover:text-teal-main transition-colors disabled:opacity-50"
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span className="w-12 text-center font-semibold text-teal-dark">{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 text-gray-500 hover:text-teal-main transition-colors disabled:opacity-50"
                        disabled={quantity >= product.stock}
                    >
                        +
                    </button>
                </div>
                <span className={`text-sm font-medium ml-4 ${product.stock > 0 ? 'text-teal-main' : 'text-red-500'}`}>
                    {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
                </span>
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={handleAddToCart}
                    isLoading={isLoading}
                    className="flex-1 py-4 text-lg bg-teal-main hover:bg-teal-dark shadow-soft hover:shadow-elegant transition-all duration-300"
                    size="lg"
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
                </Button>

                <button
                    onClick={handleToggleWishlist}
                    disabled={isWishlistLoading}
                    className={`px-5 rounded-lg border transition-all duration-300 flex items-center justify-center ${isInWishlist
                        ? 'bg-red-50 border-red-200 text-red-500 shadow-inner'
                        : 'bg-white border-gray-light text-gray-400 hover:border-red-300 hover:text-red-400 hover:shadow-soft'
                        }`}
                    title={isInWishlist ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
                >
                    <svg
                        className={`w-6 h-6 transition-transform duration-300 ${isInWishlist ? 'scale-110 fill-current' : 'scale-100'}`}
                        fill={isInWishlist ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
