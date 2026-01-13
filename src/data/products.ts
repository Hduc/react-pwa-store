import type { Product } from '../types';

const categories = ['Điện tử', 'Thời trang', 'Gia dụng', 'Thực phẩm', 'Sách'];

const productNames: Record<string, string[]> = {
    'Điện tử': [
        'Tai nghe Bluetooth', 'Chuột không dây', 'Bàn phím cơ', 'Loa mini', 'USB 32GB',
        'Sạc dự phòng', 'Đèn LED bàn', 'Hub USB-C', 'Webcam HD', 'Ốp điện thoại',
        'Cáp sạc nhanh', 'Giá đỡ điện thoại', 'Màn hình kẹp', 'Quạt USB', 'Đồng hồ thông minh',
        'Tai nghe gaming', 'Bộ phát wifi', 'Ổ cứng di động', 'Thẻ nhớ 64GB', 'Kính VR'
    ],
    'Thời trang': [
        'Áo thun nam', 'Áo sơ mi nữ', 'Quần jean', 'Váy đầm', 'Túi xách',
        'Giày thể thao', 'Mũ lưỡi trai', 'Kính mát', 'Đồng hồ đeo tay', 'Thắt lưng da',
        'Áo khoác', 'Quần short', 'Sandal', 'Balo thời trang', 'Khăn quàng cổ',
        'Vòng tay', 'Dây chuyền', 'Bông tai', 'Nhẫn bạc', 'Ví da'
    ],
    'Gia dụng': [
        'Nồi cơm điện', 'Ấm siêu tốc', 'Máy xay sinh tố', 'Bình giữ nhiệt', 'Hộp đựng thức ăn',
        'Dao nhà bếp', 'Chảo chống dính', 'Bộ ly thủy tinh', 'Thớt gỗ', 'Kệ gia vị',
        'Máy ép trái cây', 'Nồi chiên không dầu', 'Lò vi sóng mini', 'Máy pha cà phê', 'Bộ nồi inox',
        'Rổ nhựa', 'Khay đựng đồ', 'Đèn ngủ', 'Quạt điện', 'Máy hút bụi mini'
    ],
    'Thực phẩm': [
        'Cà phê hạt', 'Trà xanh', 'Mật ong nguyên chất', 'Hạt điều rang', 'Bánh quy bơ',
        'Socola đen', 'Nước mắm', 'Dầu olive', 'Gạo ST25', 'Mì ý',
        'Tương ớt', 'Đường phèn', 'Bột ngọt', 'Hạt tiêu', 'Muối hồng',
        'Ngũ cốc ăn sáng', 'Sữa hạt', 'Nước dừa', 'Trà sữa', 'Bánh tráng'
    ],
    'Sách': [
        'Đắc Nhân Tâm', 'Nhà Giả Kim', 'Tư duy nhanh và chậm', 'Sapiens', 'Atomic Habits',
        'Rich Dad Poor Dad', 'The 7 Habits', 'Deep Work', 'Mindset', 'Start With Why',
        'Lean Startup', 'Zero to One', 'Good to Great', 'The One Thing', 'Essentialism',
        'Think Again', 'The Psychology of Money', 'Outliers', 'Blink', 'Drive'
    ]
};

const generateProducts = (): Product[] => {
    const products: Product[] = [];
    let id = 1;

    for (const category of categories) {
        const names = productNames[category];
        for (const name of names) {
            const price = Math.floor(Math.random() * 900000) + 50000; // 50k - 950k
            products.push({
                id: `product-${id}`,
                name,
                price,
                image: `https://picsum.photos/seed/${id}/300/300`,
                description: `${name} chất lượng cao, giá tốt nhất thị trường.`,
                category
            });
            id++;
        }
    }

    return products;
};

export const products: Product[] = generateProducts();
