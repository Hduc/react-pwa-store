import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { users } from '../data/users';
import './UserSwitcher.css';

export function UserSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const currentUser = useAppStore(state => state.currentUser);
    const switchUser = useAppStore(state => state.switchUser);

    const handleSwitch = async (userId: string) => {
        if (userId !== currentUser.id) {
            await switchUser(userId);
        }
        setIsOpen(false);
    };

    return (
        <div className="user-switcher">
            <button className="user-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className="user-avatar">{currentUser.avatar}</span>
                <span className="user-name-short">{currentUser.name.split(' ').pop()}</span>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <>
                    <div className="user-backdrop" onClick={() => setIsOpen(false)}></div>
                    <div className="user-dropdown">
                        <div className="dropdown-header">Chuyển tài khoản</div>
                        {users.map(user => (
                            <button
                                key={user.id}
                                className={`user-option ${user.id === currentUser.id ? 'active' : ''}`}
                                onClick={() => handleSwitch(user.id)}
                            >
                                <span className="user-avatar">{user.avatar}</span>
                                <span className="user-name">{user.name}</span>
                                {user.id === currentUser.id && <span className="check">✓</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
