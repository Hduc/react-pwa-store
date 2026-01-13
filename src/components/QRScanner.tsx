import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAppStore } from '../stores/useAppStore';
import { useToastStore } from '../stores/useToastStore';
import './QRScanner.css';

export function QRScanner() {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const addToCart = useAppStore(state => state.addToCart);
    const products = useAppStore(state => state.products);
    const addToast = useToastStore(state => state.addToast);

    const startScanner = async () => {
        setError(null);

        try {
            const scanner = new Html5Qrcode('qr-reader');
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    handleScan(decodedText);
                },
                () => {
                    // QR code not detected
                }
            );

            setIsScanning(true);
            addToast('Đã bật camera, sẵn sàng quét', 'info');
        } catch (err) {
            console.error('Camera error:', err);
            setError('Không thể truy cập camera. Vui lòng cấp quyền camera.');
            addToast('Không thể truy cập camera', 'error');
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current = null;
            } catch (err) {
                console.error('Stop scanner error:', err);
            }
        }
        setIsScanning(false);
    };

    const handleScan = async (scannedText: string) => {
        // Check if scanned text matches a product ID
        const product = products.find(p =>
            p.id === scannedText ||
            p.id === `product-${scannedText}` ||
            scannedText.includes(p.id)
        );

        if (product) {
            await addToCart(product.id);
            addToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
            await stopScanner();
        } else {
            addToast(`Không tìm thấy sản phẩm: ${scannedText}`, 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

    return (
        <div className="qr-scanner-container">
            <h1 className="scanner-title">📷 Quét QR Code</h1>
            <p className="scanner-desc">Quét mã QR sản phẩm để thêm vào giỏ hàng</p>

            <div className="scanner-area">
                <div id="qr-reader" className={isScanning ? 'active' : ''}></div>

                {!isScanning && (
                    <div className="scanner-placeholder">
                        <span>📱</span>
                        <p>Bấm nút bên dưới để bắt đầu quét</p>
                    </div>
                )}
            </div>

            {error && <div className="scanner-error">{error}</div>}

            <div className="scanner-controls">
                {!isScanning ? (
                    <button className="scan-btn start" onClick={startScanner}>
                        <span>📸</span> Bắt đầu quét
                    </button>
                ) : (
                    <button className="scan-btn stop" onClick={stopScanner}>
                        <span>⏹️</span> Dừng quét
                    </button>
                )}
            </div>

            <div className="qr-info">
                <h3>💡 Hướng dẫn</h3>
                <p>QR code cần chứa ID sản phẩm, ví dụ: <code>product-1</code> đến <code>product-100</code></p>
            </div>
        </div>
    );
}
