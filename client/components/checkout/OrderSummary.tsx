'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useState } from 'react';
import { validatePromoCode } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';
import { resolveImageUrl } from '@/lib/image';


export function OrderSummary() {
    const { items, subtotal, promoCode, promoDiscount, setPromo, clearPromo } = useCart();
    const { settings } = useSettings();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApplyPromo = async () => {
        if (!code) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await validatePromoCode(code, subtotal);
            setPromo(result.code, result.discountAmount);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic shipping cost
    const shippingCost = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
    const total = subtotal + shippingCost - promoDiscount;

    return (
        <div className="bg-white p-8 rounded-2xl border border-teal-light/20 shadow-sm space-y-8 sticky top-8">
            <h2 className="text-xl font-serif font-bold text-dark tracking-wide border-b border-gray-light pb-4">
                Résumé de la commande
            </h2>

            {/* Items */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start group">
                        <div className="relative w-20 h-20 bg-gray-ultra-light rounded-lg overflow-hidden border border-gray-light shadow-sm group-hover:shadow-md transition-shadow duration-300">
                            <Image
                                src={resolveImageUrl(item.product.images?.[0])}
                                alt={item.product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                            <span className="absolute -top-1 -right-1 bg-dark text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="font-medium text-dark text-sm font-serif line-clamp-2 leading-relaxed">
                                {item.product.name}
                            </p>
                            <p className="text-gray-medium text-xs tracking-wide uppercase">
                                {item.price.toFixed(2)} TND
                            </p>
                        </div>
                        <div className="font-semibold text-dark text-sm font-serif">
                            {(item.price * item.quantity).toFixed(2)} TND
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-light pt-6 space-y-3">
                <div className="flex justify-between text-gray-medium text-sm tracking-wide">
                    <span>Sous-total</span>
                    <span className="font-medium text-dark">{subtotal.toFixed(2)} TND</span>
                </div>

                {promoDiscount > 0 && (
                    <div className="flex justify-between text-primary text-sm tracking-wide">
                        <span>Réduction ({promoCode})</span>
                        <span className="font-medium">-{promoDiscount.toFixed(2)} TND</span>
                    </div>
                )}

                <div className="flex justify-between text-gray-medium text-sm tracking-wide">
                    <span>Livraison</span>
                    <span className="font-medium text-dark">
                        {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} TND`}
                    </span>
                </div>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Code promo"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={!!promoCode || isLoading}
                        className="flex-1 px-4 py-3 bg-gray-ultra-light rounded-lg border-0 focus:ring-1 focus:ring-dark placeholder:text-gray-medium text-sm transition-all outline-none text-gray-text"
                    />
                    {promoCode ? (
                        <button
                            onClick={() => {
                                clearPromo();
                                setCode('');
                            }}
                            className="px-4 py-2 text-xs font-medium text-error hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-wider"
                        >
                            Retirer
                        </button>
                    ) : (
                        <button
                            onClick={handleApplyPromo}
                            disabled={!code || isLoading}
                            className="px-6 py-2 bg-dark text-white text-xs font-medium rounded-lg hover:bg-teal-dark disabled:opacity-50 transition-all uppercase tracking-wider shadow-sm hover:shadow-md"
                        >
                            {isLoading ? '...' : 'Appliquer'}
                        </button>
                    )}
                </div>
                {error && <p className="text-xs text-error mt-1">{error}</p>}
                {promoCode && !error && <p className="text-xs text-primary mt-1 font-medium">Code promo appliqué avec succès !</p>}
            </div>

            <div className="border-t border-gray-200 pt-6 flex justify-between items-baseline">
                <span className="text-base text-gray-medium uppercase tracking-widest font-medium">Total</span>
                <span className="text-2xl font-serif font-bold text-dark">
                    {total.toFixed(2)} <span className="text-sm font-sans font-normal text-gray-medium ml-1">TND</span>
                </span>
            </div>

            {shippingCost === 0 && (
                <div className="bg-teal-soft text-dark px-4 py-3 rounded-xl text-sm font-medium text-center border border-teal-light/50 flex items-center justify-center gap-2">
                    <span>✨</span> Livraison offerte !
                </div>
            )}
        </div>
    );
}
