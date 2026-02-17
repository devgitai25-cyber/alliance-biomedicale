import { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Helper to map backend product to frontend Product type
function mapProduct(p: any): Product {
    return {
        id: p.id,
        slug: p.slug,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
        images: p.images || [], // Ensure array
        categoryId: p.categoryId,
        stock: p.stock,
        isFeatured: p.featured,
        name: p.name || 'Sans nom',
        description: p.description || '',
        shortDescription: p.shortDescription || '',
        ingredients: p.ingredients,
        usage: p.usage,
        tags: p.tags,
        // Defaults/Placeholders
        rating: 4.5,
        reviewCount: 0,
        category: p.category ? p.category.name : '',
    };
}

export async function getProducts(category?: string): Promise<Product[]> {
    try {
        const query = new URLSearchParams();
        if (category) query.append('categoryId', category);

        const res = await fetch(`${API_URL}/products?${query.toString()}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();
        return data.map(mapProduct);
    } catch (error) {
        console.error('getProducts error:', error);
        return [];
    }
}

export async function getAdminProducts(): Promise<Product[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/products`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to fetch products');

    const data = await res.json();
    return data.map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
    try {
        const res = await fetch(`${API_URL}/products/slug/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return undefined;

        const data = await res.json();
        return mapProduct(data);
    } catch (error) {
        console.error('getProduct error:', error);
        return undefined;
    }
}

// Admin helper to get full product data
export async function getProductById(id: string): Promise<any> {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${API_URL}/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        return mapProduct(data);
    } catch (error) {
        console.error('getProductById error:', error);
        throw error;
    }
}

export async function getFeaturedProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/products?featured=true`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) throw new Error('Failed to fetch featured products');

        const data = await res.json();
        return data.map(mapProduct);
    } catch (error) {
        console.error('getFeaturedProducts error:', error);
        return [];
    }
}

export async function createOrder(orderData: import('@/types').Order): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create order');
    }

    return res.json();
}

export async function createProduct(productData: FormData): Promise<Product> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: productData,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create product');
    }

    const data = await res.json();
    return mapProduct(data);
}

export async function updateProduct(id: string, productData: FormData): Promise<Product> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: productData,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update product');
    }

    const data = await res.json();
    return mapProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to delete product');
    }
}

// Wishlist
export async function getWishlist(): Promise<Product[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return [];

    try {
        const res = await fetch(`${API_URL}/wishlist`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch wishlist');
        const data = await res.json();
        // Backend now returns array of products directly or similar structure
        return data.map(mapProduct);
    } catch (error) {
        console.error('getWishlist error:', error);
        return [];
    }
}

export async function addToWishlist(productId: string): Promise<boolean> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/wishlist/${productId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.ok;
    } catch (error) {
        return false;
    }
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.ok;
    } catch (error) {
        return false;
    }
}

export async function checkInWishlist(productId: string): Promise<boolean> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return false;

    try {
        const res = await fetch(`${API_URL}/wishlist/check/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        return data.isInWishlist;
    } catch (error) {
        return false;
    }
}

// Categories
function mapCategory(c: any): import('@/types').Category {
    return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
        displayOrder: c.displayOrder,
        products: c.products ? c.products.map(mapProduct) : [],
        _count: c._count,
    };
}

export async function getCategories(): Promise<import('@/types').Category[]> {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.map((c: any) => mapCategory(c));
}

export async function getAdminCategories(): Promise<import('@/types').Category[]> {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.map((c: any) => mapCategory(c));
}

export async function getCategory(id: string): Promise<any> {
    const res = await fetch(`${API_URL}/categories/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
}

export async function createCategory(data: FormData | any): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${token}`,
        },
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create category');
    }
    return res.json();
}

export async function updateCategory(id: string, data: FormData | any): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${token}`,
        },
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update category');
    }
    return res.json();
}

export async function deleteCategory(id: string, cascade: boolean = false): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const url = `${API_URL}/categories/${id}${cascade ? '?cascade=true' : ''}`;

    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete category');
    }
}

// Users (Admin)
export async function getUsers(): Promise<any[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/auth/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

export async function validatePromoCode(code: string, subtotal: number): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/promotions/validate?code=${code}&subtotal=${subtotal}`, {
            cache: 'no-store'
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Code promo invalide');
        }
        return res.json();
    } catch (error: any) {
        throw new Error(error.message || 'Erreur lors de la validation du code promo');
    }
}
// Dashboard
export async function getDashboardStats(): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
}

// Orders Management
export async function getMyOrders(): Promise<any[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch orders');
    }

    return res.json();
}

export async function getAllOrders(): Promise<any[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch orders');
    }

    return res.json();
}

export async function getOrder(orderId: string): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch order');
    }

    return res.json();
}

export async function updateOrderStatus(
    orderId: string,
    status: string,
    notes?: string
): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update order status');
    }

    return res.json();
}

// Settings
export async function getPublicSettings(): Promise<Record<string, any>> {
    try {
        const res = await fetch(`${API_URL}/settings/public`, { next: { revalidate: 300 } }); // 5 minutes
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
    } catch (error) {
        console.error('getPublicSettings error:', error);
        return {};
    }
}

export async function getAllSettings(): Promise<any[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/settings`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
}

export async function updateSetting(key: string, value: any): Promise<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/settings/${key}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return res.json();
}
