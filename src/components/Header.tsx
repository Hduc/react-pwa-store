import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { UserSwitcher } from './UserSwitcher';
import { InstallPWA } from './InstallPWA';
import './Header.css';

export function Header() {
    const products = useAppStore(state => state.products);
    const getCartItemCount = useAppStore(state => state.getCartItemCount);
    const orders = useAppStore(state => state.orders);

    const productCount = products.length;
    const cartCount = getCartItemCount();
    const orderCount = orders.length;

    // Track previous cart count to animate on change
    const prevCartCount = useRef(cartCount);
    const [cartBounce, setCartBounce] = useState(false);

    useEffect(() => {
        if (cartCount > prevCartCount.current) {
            setCartBounce(true);
            const timer = setTimeout(() => setCartBounce(false), 500);
            return () => clearTimeout(timer);
        }
        prevCartCount.current = cartCount;
    }, [cartCount]);

    // Track order count changes
    const prevOrderCount = useRef(orderCount);
    const [orderBounce, setOrderBounce] = useState(false);

    useEffect(() => {
        if (orderCount > prevOrderCount.current) {
            setOrderBounce(true);
            const timer = setTimeout(() => setOrderBounce(false), 500);
            return () => clearTimeout(timer);
        }
        prevOrderCount.current = orderCount;
    }, [orderCount]);

    return (
        <header className="app-header">
            <div className="header-top">
                <div className="logo">
                    <span>🛍️</span>
                    <span className="logo-text">PWA Store</span>
                </div>
                <div className="header-actions">
                    <InstallPWA />
                    <UserSwitcher />
                </div>
            </div>

            <nav className="nav-bar">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className="nav-icon">
                        🏠
                        {productCount > 0 && <span className="nav-badge product-badge">{productCount}</span>}
                    </span>
                    <span>Sản phẩm</span>
                </NavLink>
                <NavLink to="/scan" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span>📷</span>
                    <span>Quét QR</span>
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className={`nav-icon ${cartBounce ? 'bounce' : ''}`}>
                        🛒
                        {cartCount > 0 && (
                            <span className={`nav-badge cart-badge ${cartBounce ? 'badge-bounce' : ''}`}>
                                {cartCount}
                            </span>
                        )}
                    </span>
                    <span>Giỏ hàng</span>
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <span className={`nav-icon ${orderBounce ? 'bounce' : ''}`}>
                        📦
                        {orderCount > 0 && (
                            <span className={`nav-badge order-badge ${orderBounce ? 'badge-bounce' : ''}`}>
                                {orderCount}
                            </span>
                        )}
                    </span>
                    <span>Đơn hàng</span>
                </NavLink>
            </nav>
        </header>
    );
}
