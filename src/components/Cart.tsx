import { useAppStore } from '../stores/useAppStore';
import { useToastStore } from '../stores/useToastStore';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export function Cart() {
    const cart = useAppStore(state => state.cart);
    const updateQuantity = useAppStore(state => state.updateQuantity);
    const removeFromCart = useAppStore(state => state.removeFromCart);
    const checkout = useAppStore(state => state.checkout);
    const getCartTotal = useAppStore(state => state.getCartTotal);
    const addToast = useToastStore(state => state.addToast);
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleUpdateQuantity = (productId: string, productName: string, newQty: number) => {
        updateQuantity(productId, newQty);
        if (newQty > 0) {
            addToast(`Đã cập nhật số lượng "${productName}" thành ${newQty}`, 'info');
        }
    };

    const handleRemove = (productId: string, productName: string) => {
        removeFromCart(productId);
        addToast(`Đã xóa "${productName}" khỏi giỏ hàng`, 'info');
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        await checkout();
        addToast('🎉 Đặt hàng thành công!', 'success');
        navigate('/orders');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <span className="empty-icon">🛒</span>
                <h2>Giỏ hàng trống</h2>
                <p>Hãy thêm sản phẩm vào giỏ hàng</p>
                <button className="shop-now-btn" onClick={() => navigate('/')}>
                    Mua sắm ngay
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Giỏ hàng ({cart.length} sản phẩm)</h1>

            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.product.id} className="cart-item">
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="cart-item-info">
                            <h3>{item.product.name}</h3>
                            <p className="item-price">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="quantity-controls">
                            <button
                                className="qty-btn"
                                onClick={() => handleUpdateQuantity(item.product.id, item.product.name, item.quantity - 1)}
                            >
                                −
                            </button>
                            <span className="qty">{item.quantity}</span>
                            <button
                                className="qty-btn"
                                onClick={() => handleUpdateQuantity(item.product.id, item.product.name, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <div className="item-total">
                            {formatPrice(item.product.price * item.quantity)}
                        </div>
                        <button
                            className="remove-btn"
                            onClick={() => handleRemove(item.product.id, item.product.name)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>Tổng cộng:</span>
                    <span className="total-price">{formatPrice(getCartTotal())}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                    <span>🚀</span> Đặt hàng
                </button>
            </div>
        </div>
    );
}
