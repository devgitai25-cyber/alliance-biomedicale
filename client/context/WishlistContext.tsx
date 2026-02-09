'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '@/lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    items: Product[];
    addToWishlist: (productId: string) => Promise<boolean>;
    removeFromWishlist: (productId: string) => Promise<boolean>;
    isInWishlist: (productId: string) => boolean;
    count: number;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [items, setItems] = useState<Product[]>([]);

    const refreshWishlist = async () => {
        if (!user) {
            setItems([]);
            return;
        }
        try {
            const wishlistItems = await getWishlist();
            setItems(wishlistItems);
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        }
    };

    useEffect(() => {
        refreshWishlist();
    }, [user]);

    const addToWishlist = async (productId: string) => {
        if (!user) return false;
        const success = await apiAddToWishlist(productId);
        if (success) {
            await refreshWishlist();
        }
        return success;
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return false;
        const success = await apiRemoveFromWishlist(productId);
        if (success) {
            await refreshWishlist();
        }
        return success;
    };

    const isInWishlist = (productId: string) => {
        return items.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                items,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                count: items.length,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
