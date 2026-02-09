'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    promoCode: string | null;
    promoDiscount: number;
    setPromo: (code: string, discount: number) => void;
    clearPromo: () => void;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [promoCode, setPromoCode] = useState<string | null>(null);
    const [promoDiscount, setPromoDiscount] = useState<number>(0);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from localStorage:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addItem = (product: Product, quantity: number) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((item) => item.productId === product.id);

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Item doesn't exist, add new
                return [
                    ...prevItems,
                    {
                        id: `${product.id}-${Date.now()}`, // Simple unique ID for cart item
                        productId: product.id,
                        product,
                        quantity,
                        price: product.price,
                    },
                ];
            }
        });
        openCart(); // Open cart drawer when adding item
    };

    const removeItem = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        setPromoCode(null);
        setPromoDiscount(0);
    };

    const setPromo = (code: string, discount: number) => {
        setPromoCode(code);
        setPromoDiscount(discount);
    };

    const clearPromo = () => {
        setPromoCode(null);
        setPromoDiscount(0);
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const refreshCart = async () => {
        if (items.length === 0) return;

        try {
            // Import dynamically to avoid circular dependencies if any
            const { getProduct } = await import('@/lib/api');

            const updatedItems = await Promise.all(
                items.map(async (item) => {
                    const freshProduct = await getProduct(item.product.slug);
                    if (!freshProduct) return item; // Keep existing if fetch fails (handle separately?)

                    return {
                        ...item,
                        price: freshProduct.price,
                        product: {
                            ...item.product,
                            price: freshProduct.price,
                            stock: freshProduct.stock
                        }
                    };
                })
            );

            setItems(updatedItems);
        } catch (error) {
            console.error('Failed to refresh cart:', error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                refreshCart,
                totalItems,
                subtotal,
                isCartOpen,
                openCart,
                closeCart,
                promoCode,
                promoDiscount,
                setPromo,
                clearPromo
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
