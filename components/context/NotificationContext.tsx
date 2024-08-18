import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Ably from "ably";
import { toast } from "react-toastify";
import { Bounce, ToastContainer } from "react-toastify";

interface AblyContextType {
    unreadCount: number;
    resetUnreadCount: () => void;
}

const AblyContext = createContext<AblyContextType | undefined>(undefined);

interface AblyProviderProps {
    children: React.ReactNode;
    userId: string;
    theme: string;
}
export function AblyProvider({ children, userId, theme }: AblyProviderProps) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [ably, setAbly] = useState<Ably.Realtime | null>(null);

    useEffect(() => {
        console.log(`[${new Date().toISOString()}] Initializing Ably instance with userId:`, userId);
        const ablyInstance = new Ably.Realtime({ authUrl: '/api/Ably?userId=' + userId });
        ablyInstance.connection.once('connected', () => {
            console.log(`[${new Date().toISOString()}] Ably connected`);
        });
        ablyInstance.connection.on('failed', (err) => {
            console.error(`[${new Date().toISOString()}] Ably connection failed:`, err);
        });
        setAbly(ablyInstance);
        return () => {
            console.log(`[${new Date().toISOString()}] Closing Ably instance`);
            ablyInstance.close();
        };
    }, [userId]);

    useEffect(() => {
        if (!ably) {
            console.log(`[${new Date().toISOString()}] Ably instance not available yet`);
            return;
        }
        console.log(`[${new Date().toISOString()}] Subscribing to channel notifications: notifications:${userId}`);
        const channel = ably.channels.get(`notifications:${userId}`);
        let activeToasts: React.ReactText[] = []; // Array to store active toast IDs
        const handleNotification = (message: any) => {
            console.log(`[${new Date().toISOString()}] Received notification:`, message);
            setUnreadCount((prevCount) => prevCount + 1);
            const toastId = toast(`🔔 You have a new notification!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme === "dark" ? "dark" : "light",
                toastId: `notification-${new Date().getTime()}` // Unique toast ID
            });
            activeToasts.push(toastId);
        };
        channel.subscribe('new-notification', handleNotification);

        return () => {
            console.log(`[${new Date().toISOString()}] Unsubscribing from channel notifications: notifications:${userId}`);
            channel.unsubscribe('new-notification', handleNotification);
            activeToasts.forEach(id => toast.dismiss(id));
        };
    }, [ably, userId, theme]);

    const resetUnreadCount = () => {
        console.log(`[${new Date().toISOString()}] Resetting unread count`);
        setUnreadCount(0);
    };

    return (
        <AblyContext.Provider value={{ unreadCount, resetUnreadCount }}>
            {children}
        </AblyContext.Provider>
    );
}
export function useAbly() {
    const context = useContext(AblyContext);
    if (context === undefined) {
        throw new Error('useAbly must be used within an AblyProvider');
    }
    return context;
}