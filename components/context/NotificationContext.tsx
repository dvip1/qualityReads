"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Ably from "ably";
import { toast } from "react-toastify";
import { useSession } from 'next-auth/react';

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
    const { data: session, status } = useSession();

    useEffect(() => {
        if (!userId || !session) return;

        const connectToAbly = async () => {
            try {
                const ablyInstance = new Ably.Realtime({ authUrl: `/api/Ably?userId=${userId}` });
                await ablyInstance.connection.once('connected');
                console.log('Ably connected');

                ablyInstance.connection.on('disconnected', () => {
                    console.log('Ably connection disconnected');
                    // Attempt to reconnect
                    reconnectToAbly(ablyInstance);
                });

                ablyInstance.connection.on('closed', () => {
                    console.log('Ably connection closed');
                    // Attempt to reconnect
                    reconnectToAbly(ablyInstance);
                });

                setAbly(ablyInstance);
            } catch (error) {
                console.error('Error connecting to Ably:', error);
            }
        };

        const reconnectToAbly = (ablyInstance: Ably.Realtime) => {
            try {
                ablyInstance.connection.connect();
            } catch (error) {
                console.error('Error reconnecting to Ably:', error);
                // Implement fallback logic or notify the user
            }
        };

        connectToAbly();

        return () => {
            if (ably) {
                ably.close();
            }
        };
    }, [userId, session]);

    useEffect(() => {
        if (!ably) {
            console.warn('Ably instance is not available, skipping channel setup');
            return;
        }

        const channel = ably.channels.get(`notifications:${userId}`);
        let activeToasts: React.ReactText[] = [];

        const handleNotification = (message: any) => {
            try {
                setUnreadCount((prevCount) => prevCount + 1);
                const toastId = toast(`🔔 You have a new notification!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme === 'dark' ? 'dark' : 'light',
                    toastId: `notification-${new Date().getTime()}`,
                });
                activeToasts.push(toastId);
            } catch (error) {
                console.error('Error processing notification:', error);
            }
        };

        channel.subscribe('new-notification', handleNotification);

        return () => {
            console.log('Unsubscribing from channel and dismissing toasts');
            if (channel) {
                channel.unsubscribe('new-notification', handleNotification);
            }
            if (activeToasts.length > 0) {
                activeToasts.forEach((id) => toast.dismiss(id));
            }
        };
    }, [ably, userId, theme]);

    const resetUnreadCount = () => {
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