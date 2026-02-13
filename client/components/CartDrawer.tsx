'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/image';

export function CartDrawer() {
    const {
        isCartOpen,
        closeCart,
        items,
        removeItem,
        updateQuantity,
        subtotal,
        totalItems
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                    <h2 className="text-xl font-bold text-dark">Mon Panier ({totalItems})</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">🛒</div>
                            <h3 className="text-lg font-medium text-gray-900">Votre panier est vide</h3>
                            <p className="text-gray-500 mt-1 mb-6">Ajoutez quelques produits pour commencer !</p>
                            <Button onClick={closeCart} variant="outline">
                                Continuer mes achats
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                {/* Image */}
                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={resolveImageUrl(item.product.images?.[0])}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-dark line-clamp-1 pr-2">
                                                <Link href={`/products/${item.product.slug}`} onClick={closeCart} className="hover:text-primary transition-colors">
                                                    {item.product.name}
                                                </Link>
                                            </h4>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        <p className="text-primary font-bold">{item.price.toFixed(2)} TND</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center border rounded-lg h-8">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="px-2 text-gray-500 hover:text-dark disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="px-2 text-gray-500 hover:text-dark disabled:opacity-50"
                                                disabled={item.quantity >= item.product.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t bg-gray-50 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{subtotal.toFixed(2)} TND</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-dark">
                                <span>Total</span>
                                <span>{subtotal.toFixed(2)} TND</span>
                            </div>
                            <p className="text-xs text-gray-500 text-center">Frais de livraison calculés à l'étape suivante</p>
                        </div>
                        <Button className="w-full text-lg py-4" href="/checkout">
                            Passer la commande
                        </Button>
                        <Button variant="ghost" className="w-full text-sm" onClick={closeCart}>
                            Continuer mes achats
                        </Button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
