import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Cart, Order, Product } from '../types';
import { products as initialProducts } from '../data/products';

interface PWAStoreDB extends DBSchema {
    products: {
        key: string;
        value: Product;
        indexes: { 'by-category': string };
    };
    carts: {
        key: string;
        value: Cart;
    };
    orders: {
        key: string;
        value: Order;
        indexes: { 'by-user': string };
    };
}

const DB_NAME = 'pwa-store-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<PWAStoreDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<PWAStoreDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<PWAStoreDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Products store
            if (!db.objectStoreNames.contains('products')) {
                const productStore = db.createObjectStore('products', { keyPath: 'id' });
                productStore.createIndex('by-category', 'category');
            }

            // Carts store
            if (!db.objectStoreNames.contains('carts')) {
                db.createObjectStore('carts', { keyPath: 'userId' });
            }

            // Orders store
            if (!db.objectStoreNames.contains('orders')) {
                const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
                orderStore.createIndex('by-user', 'userId');
            }
        }
    });

    return dbInstance;
}

// Initialize products in IndexedDB
export async function initializeProducts(): Promise<void> {
    const db = await getDB();
    const existingProducts = await db.getAll('products');

    if (existingProducts.length === 0) {
        const tx = db.transaction('products', 'readwrite');
        for (const product of initialProducts) {
            await tx.store.put(product);
        }
        await tx.done;
    }
}

// Products
export async function getAllProducts(): Promise<Product[]> {
    const db = await getDB();
    return db.getAll('products');
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const db = await getDB();
    return db.get('products', id);
}

// Carts
export async function getCart(userId: string): Promise<Cart> {
    const db = await getDB();
    const cart = await db.get('carts', userId);
    return cart || { userId, items: [] };
}

export async function saveCart(cart: Cart): Promise<void> {
    const db = await getDB();
    await db.put('carts', cart);
}

// Orders
export async function getOrdersByUser(userId: string): Promise<Order[]> {
    const db = await getDB();
    const tx = db.transaction('orders', 'readonly');
    const index = tx.store.index('by-user');
    return index.getAll(userId);
}

export async function createOrder(order: Order): Promise<void> {
    const db = await getDB();
    await db.put('orders', order);
}
