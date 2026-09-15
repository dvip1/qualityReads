"use client"
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useSession } from 'next-auth/react';
import { getNotificationCount } from '@/app/notification/service';

interface NotificationContextType {
    unreadCount: number;
    resetUnreadCount: () => void;
    refreshUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: React.ReactNode;
    userId: string;
    theme: string;
}

export function NotificationProvider({ children, userId, theme }: NotificationProviderProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const { data: session } = useSession();

    const refreshUnreadCount = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await getNotificationCount(userId);
            setUnreadCount(Number(response?.data ?? 0));
        } catch (error) {
            console.error('Failed to refresh notification count:', error);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId || !session) return;

        // EventSource reconnects on its own (honouring the `retry:` hint the
        // server sends), so there is no manual reconnect logic to maintain.
        const source = new EventSource('/api/notifications/stream');

        source.addEventListener('ready', () => {
            // Redis pub/sub is fire-and-forget, so anything published while this
            // tab was disconnected never arrived. Resync on every (re)connect.
            refreshUnreadCount();
        });

        source.addEventListener('notification', () => {
            setUnreadCount((previous) => previous + 1);
            toast('🔔 You have a new notification!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: theme === 'dark' ? 'dark' : 'light',
                toastId: `notification-${Date.now()}`,
            });
        });

        source.onerror = () => {
            // Readable state only; the browser retries automatically.
            if (source.readyState === EventSource.CLOSED) {
                console.warn('[notifications] stream closed');
            }
        };

        return () => source.close();
    }, [userId, session, theme, refreshUnreadCount]);

    const resetUnreadCount = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{ unreadCount, resetUnreadCount, refreshUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
