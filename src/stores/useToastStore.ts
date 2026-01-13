import { create } from 'zustand';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    exiting?: boolean;
}

interface ToastState {
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
    toasts: [],

    addToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = `toast-${Date.now()}`;
        const toast: Toast = { id, message, type };

        set(state => ({ toasts: [...state.toasts, toast] }));

        // Auto remove after 3 seconds
        setTimeout(() => {
            set(state => ({
                toasts: state.toasts.map(t =>
                    t.id === id ? { ...t, exiting: true } : t
                )
            }));

            setTimeout(() => {
                get().removeToast(id);
            }, 300);
        }, 3000);
    },

    removeToast: (id: string) => {
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }
}));
