const CURRENT_USER_KEY = 'pwa-store-current-user';

export function getCurrentUserId(): string {
    return localStorage.getItem(CURRENT_USER_KEY) || 'user-1';
}

export function setCurrentUserId(userId: string): void {
    localStorage.setItem(CURRENT_USER_KEY, userId);
}
