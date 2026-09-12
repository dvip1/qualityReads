'use client';
import React, { useEffect, useState } from 'react';
import { NotificationProvider as InnerNotificationProvider } from './NotificationContext';
import fetchUserData from '@/utils/fetchUserData';
import { useTheme } from 'next-themes';
import { ToastContainer, Bounce } from 'react-toastify';

interface NotificationProviderProps {
    children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [userId, setUserId] = useState<string>('');
    const { theme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserData();
                if (!userData?._id) return;
                setUserId(userData._id.toString());
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchData();
    }, []);

    // The context mounts unconditionally, even before the user id resolves, so
    // that consumers such as the navbar badge can always call useNotifications().
    // The inner provider opens no stream while userId is empty.
    return (
        <InnerNotificationProvider userId={userId} theme={theme ?? 'light'}>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Bounce}
                theme={theme === 'dark' ? 'dark' : 'light'}
            />
            {children}
        </InnerNotificationProvider>
    );
}
