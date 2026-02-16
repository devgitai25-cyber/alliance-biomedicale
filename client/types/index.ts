export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    comparePrice?: number;
    images: string[];
    stock: number;
    isFeatured?: boolean;
    categoryId: string;
    category: string; // Category name
    rating: number;
    reviewCount: number;
    tags?: string[];
    isNew?: boolean;
    discount?: number;
    ingredients?: string;
    usage?: string;
}

export interface Category {
    id: string;
    slug: string;
    name: string;
    description?: string;
    image?: string;
    displayOrder?: number;
    products?: Product[];
    _count?: {
        products: number;
    };
}

export interface CartItem {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin: boolean;
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}

export interface Order {
    id?: string;
    orderNumber?: string;
    status?: string;
    items: { productId: string; quantity: number; price: number }[]; // For creation
    total: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country?: string;
    paymentMethod?: string;
    promoCode?: string;
    discount?: number;
    shipping?: number;
    subtotal?: number;
    createdAt?: string; // For display
    orderItems?: OrderItem[]; // For display
}
