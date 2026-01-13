import { useToastStore } from '../stores/useToastStore';

export function Toast() {
    const toasts = useToastStore(state => state.toasts);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-[1000] flex flex-col gap-3 max-w-[90vw]">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`
            px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md
            flex items-center gap-3 min-w-[280px]
            ${toast.exiting ? 'toast-exit' : 'toast-enter'}
            ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
            ${toast.type === 'info' ? 'bg-indigo-500/90 text-white' : ''}
          `}
                >
                    <span className="text-xl">
                        {toast.type === 'success' && '✅'}
                        {toast.type === 'error' && '❌'}
                        {toast.type === 'info' && 'ℹ️'}
                    </span>
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
