import { create } from 'zustand';
import type { Product, CartItem, User, Order } from '../types';
import { users } from '../data/users';
import { getCart, saveCart, getOrdersByUser, createOrder, getAllProducts, initializeProducts, getProductById } from '../lib/db';
import { getCurrentUserId, setCurrentUserId } from '../lib/storage';

interface AppState {
    // State
    currentUser: User;
    cart: CartItem[];
    products: Product[];
    orders: Order[];
    isLoading: boolean;

    // Actions
    initialize: () => Promise<void>;
    switchUser: (userId: string) => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    checkout: () => Promise<void>;
    loadOrders: () => Promise<void>;
    getCartTotal: () => number;
    getCartItemCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
    currentUser: users.find(u => u.id === getCurrentUserId()) || users[0],
    cart: [],
    products: [],
    orders: [],
    isLoading: true,

    initialize: async () => {
        try {
            await initializeProducts();
            const products = await getAllProducts();
            const userId = getCurrentUserId();
            const cartData = await getCart(userId);
            const orders = await getOrdersByUser(userId);

            set({
                products,
                cart: cartData.items,
                orders,
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to initialize:', error);
            set({ isLoading: false });
        }
    },

    switchUser: async (userId: string) => {
        const { cart, currentUser } = get();

        // Save current cart before switching
        await saveCart({ userId: currentUser.id, items: cart });

        // Switch user
        setCurrentUserId(userId);
        const newUser = users.find(u => u.id === userId) || users[0];

        // Load new user's cart and orders
        const newCart = await getCart(userId);
        const orders = await getOrdersByUser(userId);

        set({
            currentUser: newUser,
            cart: newCart.items,
            orders
        });
    },

    addToCart: async (productId: string, quantity = 1) => {
        const { cart, currentUser } = get();
        const product = await getProductById(productId);

        if (!product) return;

        const existingIndex = cart.findIndex(item => item.product.id === productId);
        let newCart: CartItem[];

        if (existingIndex >= 0) {
            newCart = cart.map((item, index) =>
                index === existingIndex
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...cart, { product, quantity }];
        }

        await saveCart({ userId: currentUser.id, items: newCart });
        set({ cart: newCart });
    },

    removeFromCart: async (productId: string) => {
        const { cart, currentUser } = get();
        const newCart = cart.filter(item => item.product.id !== productId);
        await saveCart({ userId: currentUser.id, items: newCart });
        set({ cart: newCart });
    },

    updateQuantity: async (productId: string, quantity: number) => {
        const { cart, currentUser } = get();

        if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
        }

        const newCart = cart.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        );

        await saveCart({ userId: currentUser.id, items: newCart });
        set({ cart: newCart });
    },

    clearCart: async () => {
        const { currentUser } = get();
        await saveCart({ userId: currentUser.id, items: [] });
        set({ cart: [] });
    },

    checkout: async () => {
        const { cart, currentUser, orders } = get();

        if (cart.length === 0) return;

        const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const order: Order = {
            id: `order-${Date.now()}`,
            userId: currentUser.id,
            items: [...cart],
            total,
            createdAt: new Date().toISOString(),
            status: 'completed'
        };

        await createOrder(order);
        await saveCart({ userId: currentUser.id, items: [] });

        set({
            cart: [],
            orders: [order, ...orders]
        });
    },

    loadOrders: async () => {
        const { currentUser } = get();
        const orders = await getOrdersByUser(currentUser.id);
        set({ orders });
    },

    getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },

    getCartItemCount: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}));
