'use client';

import { useCart } from '@/context/CartContext';
import { useSettings } from '@/hooks/useSettings';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
    const { items: cart, updateQuantity, removeItem: removeFromCart, subtotal: total } = useCart();
    const { settings } = useSettings();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                {/* Empty Cart Hero */}
                <section className="bg-gradient-to-b from-teal-soft via-white to-white py-16">
                    <Container>
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-display font-light text-teal-dark mb-4">
                                Mon Panier
                            </h1>
                        </div>
                    </Container>
                </section>

                <Container className="py-20">
                    <div className="max-w-2xl mx-auto text-center bg-gray-ultra-light rounded-luxury border border-gray-light/30 py-20">
                        {/* SVG Shopping Bag Icon */}
                        <svg className="w-20 h-20 mx-auto mb-6 text-teal-light/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <h2 className="text-2xl font-display font-medium text-teal-dark mb-3">Votre panier est vide</h2>
                        <p className="text-gray-text font-body text-lg mb-8 max-w-md mx-auto">
                            Découvrez nos produits et ajoutez vos favoris au panier
                        </p>
                        <Button href="/products" variant="primary" size="lg">
                            Découvrir nos produits
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    const shippingCost = total >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
    const grandTotal = total + shippingCost;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero - Premium Clean */}
            <section className="bg-gradient-to-b from-teal-soft via-white to-white py-16">
                <Container>
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-display font-light text-teal-dark mb-3">
                            Mon Panier
                        </h1>
                        <p className="text-lg text-gray-text font-body">
                            {cart.length} article{cart.length > 1 ? 's' : ''} dans votre panier
                        </p>
                    </div>
                </Container>
            </section>

            <Container className="py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items - Elegant */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-light/50 rounded-luxury p-6 shadow-whisper hover:shadow-soft transition-all duration-300 flex gap-6"
                            >
                                {/* Product Image */}
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-ultra-light rounded-lg overflow-hidden flex-shrink-0"
                                >
                                    {item.product.images?.length ? (
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-4xl text-teal-light/30">
                                            🌿
                                        </div>
                                    )}
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/products/${item.product.slug}`}
                                        className="block mb-2 hover:text-teal-main transition-colors"
                                    >
                                        <h3 className="text-lg font-display font-semibold text-teal-dark truncate">
                                            {item.product.name}
                                        </h3>
                                    </Link>

                                    <p className="text-2xl font-display font-medium text-teal-main mb-4">
                                        {item.price.toFixed(2)} TND
                                    </p>

                                    {/* Quantity Controls - Refined */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-gray-light rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                className="px-4 py-2 hover:bg-teal-soft transition-colors font-body text-gray-text"
                                                aria-label="Diminuer la quantité"
                                            >
                                                −
                                            </button>
                                            <span className="px-4 py-2 font-body font-medium min-w-[3rem] text-center text-teal-dark">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="px-4 py-2 hover:bg-teal-soft transition-colors font-body text-gray-text"
                                                aria-label="Augmenter la quantité"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-gray-medium hover:text-teal-main font-body font-medium transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>

                                {/* Item Subtotal */}
                                <div className="hidden md:block text-right">
                                    <p className="text-sm text-gray-medium font-body mb-1">Sous-total</p>
                                    <p className="text-xl font-display font-semibold text-teal-dark">
                                        {(item.price * item.quantity).toFixed(2)} TND
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary - Premium */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-light/50 rounded-luxury p-8 shadow-whisper sticky top-28">
                            <h2 className="text-2xl font-display font-light text-teal-dark mb-8">Récapitulatif</h2>

                            <div className="space-y-5 mb-8">
                                <div className="flex justify-between text-gray-text font-body">
                                    <span>Sous-total</span>
                                    <span className="font-medium text-teal-dark">{total.toFixed(2)} TND</span>
                                </div>

                                <div className="flex justify-between text-gray-text font-body">
                                    <span>Livraison</span>
                                    <span className="font-medium">
                                        {shippingCost === 0 ? (
                                            <span className="text-teal-main">Gratuite</span>
                                        ) : (
                                            `${shippingCost.toFixed(2)} TND`
                                        )}
                                    </span>
                                </div>

                                {total < settings.freeShippingThreshold && (
                                    <div className="bg-teal-soft/40 border border-teal-light/50 p-4 rounded-lg text-sm text-teal-dark font-body">
                                        <p className="font-medium">
                                            Ajoutez {(settings.freeShippingThreshold - total).toFixed(2)} TND pour la livraison gratuite !
                                        </p>
                                    </div>
                                )}

                                <div className="border-t border-gray-light/50 pt-5">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xl font-display font-medium text-teal-dark">Total</span>
                                        <span className="text-3xl font-display font-semibold text-teal-main">
                                            {grandTotal.toFixed(2)} TND
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button href="/checkout" variant="primary" size="lg" className="w-full mb-4">
                                Procéder au paiement
                            </Button>

                            <Button href="/products" variant="outline" size="lg" className="w-full">
                                Continuer mes achats
                            </Button>

                            {/* Trust Badges - SVG Icons */}
                            <div className="mt-8 pt-8 border-t border-gray-light/50 space-y-4 text-sm text-gray-text font-body">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-teal-main flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Paiement 100% sécurisé</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-teal-main flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Livraison rapide 24-48h</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-teal-main flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Retour gratuit sous 14 jours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
