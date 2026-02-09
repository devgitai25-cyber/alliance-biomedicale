'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import {
    validateEmail,
    validatePhone,
    validatePostalCode,
    validateRequired
} from '@/lib/validation';
import { getUserFriendlyMessage } from '@/lib/errors';

interface FormErrors {
    [key: string]: string;
}

export function CheckoutForm() {
    const router = useRouter();
    const { items, subtotal, clearCart, promoCode, promoDiscount, refreshCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [errors, setErrors] = useState<FormErrors>({});
    const [globalError, setGlobalError] = useState<string>('');

    // Verify prices on mount
    useEffect(() => {
        const verifyPrices = async () => {
            await refreshCart();
            setIsVerifying(false);
        };
        verifyPrices();
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Tunisie'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Clear global error when user makes changes
        if (globalError) {
            setGlobalError('');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.error!;
        }

        // First name validation
        const firstNameValidation = validateRequired(formData.firstName, 'Prénom', 2, 50);
        if (!firstNameValidation.isValid) {
            newErrors.firstName = firstNameValidation.error!;
        }

        // Last name validation
        const lastNameValidation = validateRequired(formData.lastName, 'Nom', 2, 50);
        if (!lastNameValidation.isValid) {
            newErrors.lastName = lastNameValidation.error!;
        }

        // Phone validation
        const phoneValidation = validatePhone(formData.phone);
        if (!phoneValidation.isValid) {
            newErrors.phone = phoneValidation.error!;
        }

        // Address validation
        const addressValidation = validateRequired(formData.address, 'Adresse', 5, 200);
        if (!addressValidation.isValid) {
            newErrors.address = addressValidation.error!;
        }

        // City validation
        const cityValidation = validateRequired(formData.city, 'Ville', 2, 100);
        if (!cityValidation.isValid) {
            newErrors.city = cityValidation.error!;
        }

        // Postal code validation
        const postalCodeValidation = validatePostalCode(formData.postalCode);
        if (!postalCodeValidation.isValid) {
            newErrors.postalCode = postalCodeValidation.error!;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalError('');

        // Check if cart is empty
        if (items.length === 0) {
            setGlobalError('Votre panier est vide');
            return;
        }

        if (isVerifying) {
            setGlobalError('Veuillez patienter pendant la vérification des prix...');
            return;
        }

        // Validate form
        if (!validateForm()) {
            setGlobalError('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setIsLoading(true);

        try {
            // Calculate final total correctly with discount (matching server logic)
            const roundAmount = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

            const roundedSubtotal = roundAmount(subtotal);
            const shippingCost = roundedSubtotal > 100 ? 0 : 7;
            const finalTotal = roundAmount(roundedSubtotal + shippingCost - promoDiscount);

            const orderData = {
                ...formData,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: finalTotal,
                promoCode: promoCode || undefined
            };

            const { createOrder } = await import('@/lib/api');

            // Using createOrder from api.ts
            await createOrder(orderData);

            // Success!
            clearCart();
            router.push('/checkout/success');
        } catch (error) {
            console.error('Order failed:', error);

            // Handle different types of errors
            setGlobalError(getUserFriendlyMessage(error));

            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Global Error Message */}
            {globalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-start">
                        <span className="text-xl mr-2">⚠️</span>
                        <p className="font-medium">{globalError}</p>
                    </div>
                </div>
            )}

            {/* Contact Info */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md space-y-6">
                <h2 className="text-xl font-serif font-bold text-dark flex items-center gap-3 pb-2 border-b border-gray-50">
                    <span className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-sm font-sans font-medium shadow-sm">1</span>
                    Coordonnées
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text placeholder-gray-400 ${errors.email ? 'border-b-error bg-red-50' : ''}`}
                            placeholder="votre@email.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-error font-medium">{errors.email}</p>}
                    </div>
                    {/* First Name & Last Name */}
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Prénom</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text placeholder-gray-400 ${errors.firstName ? 'border-b-error bg-red-50' : ''}`}
                        />
                        {errors.firstName && <p className="mt-1 text-xs text-error font-medium">{errors.firstName}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Nom</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text placeholder-gray-400 ${errors.lastName ? 'border-b-error bg-red-50' : ''}`}
                        />
                        {errors.lastName && <p className="mt-1 text-xs text-error font-medium">{errors.lastName}</p>}
                    </div>
                    <div className="md:col-span-2 group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text placeholder-gray-400 ${errors.phone ? 'border-b-error bg-red-50' : ''}`}
                            placeholder="+216 00 000 000"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-error font-medium">{errors.phone}</p>}
                    </div>
                </div>
            </section>

            {/* Address */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md space-y-6">
                <h2 className="text-xl font-serif font-bold text-dark flex items-center gap-3 pb-2 border-b border-gray-50">
                    <span className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-sm font-sans font-medium shadow-sm">2</span>
                    Livraison
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text placeholder-gray-400 ${errors.address ? 'border-b-error bg-red-50' : ''}`}
                            placeholder="Rue, Appartement, etc."
                        />
                        {errors.address && <p className="mt-1 text-xs text-error font-medium">{errors.address}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Ville</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text placeholder-gray-400 ${errors.city ? 'border-b-error bg-red-50' : ''}`}
                        />
                        {errors.city && <p className="mt-1 text-xs text-error font-medium">{errors.city}</p>}
                    </div>
                    <div className="group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Code Postal</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text placeholder-gray-400 ${errors.postalCode ? 'border-b-error bg-red-50' : ''}`}
                        />
                        {errors.postalCode && <p className="mt-1 text-xs text-error font-medium">{errors.postalCode}</p>}
                    </div>
                    <div className="md:col-span-2 group">
                        <label className="block text-xs font-medium text-gray-medium uppercase tracking-widest mb-2 group-focus-within:text-dark transition-colors">Pays / Région</label>
                        <div className="relative">
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-ultra-light border-0 border-b-2 border-gray-light focus:border-dark focus:bg-white focus:ring-0 transition-all outline-none rounded-t-lg text-gray-text appearance-none cursor-pointer"
                            >
                                <option value="Tunisie">Tunisie</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-medium">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md space-y-6">
                <h2 className="text-xl font-serif font-bold text-dark flex items-center gap-3 pb-2 border-b border-gray-50">
                    <span className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-sm font-sans font-medium shadow-sm">3</span>
                    Mode de Livraison
                </h2>
                <div className="border border-teal-light/30 rounded-xl p-6 bg-teal-soft/20 flex items-center justify-between cursor-pointer hover:border-dark transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full border-2 border-dark flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-dark" />
                        </div>
                        <div>
                            <p className="font-bold text-dark font-serif tracking-wide">Livraison Standard</p>
                            <p className="text-xs text-gray-medium uppercase tracking-wide mt-1">Livraison à domicile (24h - 48h)</p>
                        </div>
                    </div>
                    <span className="font-bold text-dark">{subtotal > 100 ? 'Gratuite' : '7.00 TND'}</span>
                </div>
            </section>

            {/* Payment Method - Cash on Delivery (Premium Redesign) */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md space-y-6">
                <h2 className="text-xl font-serif font-bold text-dark flex items-center gap-3 pb-2 border-b border-gray-50">
                    <span className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-sm font-sans font-medium shadow-sm">4</span>
                    Mode de Paiement
                </h2>

                <div className="relative overflow-hidden border border-teal-light/50 rounded-xl bg-white">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Left: Payment Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-teal-soft rounded-lg text-dark">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg text-dark font-serif tracking-wide">
                                        Paiement à la Livraison
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-text leading-relaxed pl-1">
                                    Réglez votre commande en espèces directement auprès de notre transporteur lors de la livraison.
                                </p>
                            </div>

                            {/* Right: Verification Check */}
                            <div className="flex-1 w-full bg-teal-soft/30 rounded-lg p-5 border border-teal-light/30">
                                <div className="flex items-start gap-4">
                                    <div className="p-1.5 bg-white rounded-full shadow-sm text-dark mt-0.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-dark font-serif uppercase tracking-wider mb-2">
                                            Vérification de commande
                                        </h4>
                                        <p className="text-xs text-gray-text leading-relaxed">
                                            Une fois votre commande passée, notre service client vous contactera par téléphone pour confirmer les détails de l'expédition.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Button type="submit" isLoading={isLoading} disabled={items.length === 0} className="w-full py-5 text-lg font-bold tracking-[0.15em] uppercase bg-dark hover:bg-teal-dark text-white transition-all shadow-lg hover:shadow-xl rounded-xl">
                {items.length === 0 ? 'Panier vide' : 'Confirmer la commande'}
            </Button>
        </form>
    );
}
