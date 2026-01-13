import { useState, useEffect } from 'react';
import './InstallPWA.css';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showIOSPrompt, setShowIOSPrompt] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS && !('standalone' in navigator)) {
            setShowIOSPrompt(true);
        }

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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'PWA Store',
                    text: 'Cửa hàng PWA hoạt động 100% offline',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    if (isInstalled) {
        return null;
    }

    return (
        <div className="install-pwa">
            {deferredPrompt && (
                <button className="install-btn" onClick={handleInstall}>
                    <span>📲</span> Cài đặt ứng dụng
                </button>
            )}

            {showIOSPrompt && (
                <div className="ios-prompt">
                    <p>
                        <span>📱</span> Để cài đặt, bấm <strong>Chia sẻ</strong> → <strong>Thêm vào Màn hình chính</strong>
                    </p>
                </div>
            )}

            {typeof navigator.share === 'function' && (
                <button className="share-btn" onClick={handleShare}>
                    <span>📤</span> Chia sẻ
                </button>
            )}
        </div>
    );
}
