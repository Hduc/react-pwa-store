import { useAppStore } from '../stores/useAppStore';
import './SyncScreen.css';

export function SyncScreen() {
    const syncSteps = useAppStore(state => state.syncSteps);

    const completedCount = syncSteps.filter(s => s.status === 'done').length;
    const progress = (completedCount / syncSteps.length) * 100;

    return (
        <div className="sync-screen">
            <div className="sync-content">
                <div className="sync-logo">
                    <span>🛍️</span>
                </div>
                <h1 className="sync-title">PWA Store</h1>
                <p className="sync-subtitle">Đang đồng bộ dữ liệu...</p>

                <div className="sync-progress-bar">
                    <div
                        className="sync-progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="sync-steps">
                    {syncSteps.map(step => (
                        <div
                            key={step.id}
                            className={`sync-step ${step.status}`}
                        >
                            <span className="step-icon">
                                {step.status === 'pending' && '⏳'}
                                {step.status === 'loading' && '🔄'}
                                {step.status === 'done' && '✅'}
                            </span>
                            <span className="step-label">{step.label}</span>
                        </div>
                    ))}
                </div>

                {completedCount === syncSteps.length && (
                    <div className="sync-complete">
                        <span>🎉</span>
                        <p>Đồng bộ hoàn tất! Ứng dụng sẵn sàng hoạt động <strong>offline</strong></p>
                    </div>
                )}
            </div>
        </div>
    );
}
