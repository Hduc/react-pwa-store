import { useState, useRef } from 'react';
import type { Product } from '../types';
import { useAppStore } from '../stores/useAppStore';
import { useToastStore } from '../stores/useToastStore';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addToCart = useAppStore(state => state.addToCart);
    const addToast = useToastStore(state => state.addToast);
    const [isAnimating, setIsAnimating] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = async () => {
        setIsAnimating(true);
        await addToCart(product.id);
        addToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');

        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <div className={`product-card ${isAnimating ? 'add-to-cart-animate' : ''}`}>
            <div className="product-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="product-category">{product.category}</span>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
                <p className="product-id">ID: {product.id}</p>
            </div>
            <button
                ref={buttonRef}
                className={`add-to-cart-btn ${isAnimating ? 'animate-pulse' : ''}`}
                onClick={handleAddToCart}
            >
                <span>🛒</span> Thêm vào giỏ
            </button>
        </div>
    );
}
