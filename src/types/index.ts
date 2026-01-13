export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    createdAt: string;
    status: 'pending' | 'completed';
}

export interface Cart {
    userId: string;
    items: CartItem[];
}
