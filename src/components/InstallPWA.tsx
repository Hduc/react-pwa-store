import { useState, useEffect } from 'react';
import './InstallPWA.css';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSModal, setShowIOSModal] = useState(false);

    useEffect(() => {
        // Check if already installed as standalone
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if running as iOS standalone
        if ('standalone' in navigator && (navigator as unknown as { standalone: boolean }).standalone) {
            setIsInstalled(true);
            return;
        }

        // Check iOS device
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream;
        setIsIOS(iOS);

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setDeferredPrompt(null);
    };

    const handleIOSInstall = () => {
        setShowIOSModal(true);
    };

    if (isInstalled) {
        return null;
    }

    return (
        <>
            <div className="install-pwa">
                {/* Android/Desktop - show install button */}
                {deferredPrompt && (
                    <button className="install-btn" onClick={handleInstall}>
                        <span>📲</span> Cài đặt
                    </button>
                )}

                {/* iOS - show button that opens instructions */}
                {isIOS && !deferredPrompt && (
                    <button className="install-btn ios" onClick={handleIOSInstall}>
                        <span>📲</span> Thêm vào Home
                    </button>
                )}
            </div>

            {/* iOS Instructions Modal */}
            {showIOSModal && (
                <div className="ios-modal-overlay" onClick={() => setShowIOSModal(false)}>
                    <div className="ios-modal" onClick={e => e.stopPropagation()}>
                        <button className="ios-modal-close" onClick={() => setShowIOSModal(false)}>✕</button>
                        <h3>📲 Cài đặt ứng dụng trên iOS</h3>
                        <div className="ios-steps">
                            <div className="ios-step">
                                <span className="step-num">1</span>
                                <span>Bấm nút <strong>Chia sẻ</strong> <span className="share-icon">⬆️</span> ở thanh Safari bên dưới</span>
                            </div>
                            <div className="ios-step">
                                <span className="step-num">2</span>
                                <span>Cuộn xuống và chọn <strong>"Thêm vào Màn hình chính"</strong></span>
                            </div>
                            <div className="ios-step">
                                <span className="step-num">3</span>
                                <span>Bấm <strong>"Thêm"</strong> ở góc phải trên</span>
                            </div>
                        </div>
                        <p className="ios-note">Sau khi thêm, ứng dụng sẽ hoạt động như app thật và chạy offline!</p>
                    </div>
                </div>
            )}
        </>
    );
}
