import { useAppStore } from '../stores/useAppStore';
import './OrderHistory.css';

export function OrderHistory() {
    const orders = useAppStore(state => state.orders);
    const currentUser = useAppStore(state => state.currentUser);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (orders.length === 0) {
        return (
            <div className="orders-empty">
                <span className="empty-icon">📦</span>
                <h2>Chưa có đơn hàng</h2>
                <p>Bạn chưa đặt đơn hàng nào</p>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h1 className="orders-title">
                📦 Lịch sử đơn hàng
                <span className="user-badge">{currentUser.avatar} {currentUser.name}</span>
            </h1>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <span className="order-id">#{order.id.split('-').pop()}</span>
                                <span className="order-date">{formatDate(order.createdAt)}</span>
                            </div>
                            <span className={`order-status ${order.status}`}>
                                {order.status === 'completed' ? '✅ Hoàn thành' : '⏳ Đang xử lý'}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item">
                                    <img src={item.product.image} alt={item.product.name} />
                                    <div className="order-item-info">
                                        <span className="item-name">{item.product.name}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                    </div>
                                    <span className="item-price">{formatPrice(item.product.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <span>Tổng cộng:</span>
                            <span className="order-total">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
