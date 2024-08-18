'use client';
import React, { useEffect, useState } from 'react';
import { AblyProvider as OriginalAblyProvider } from './NotificationContext';
import fetchUserData from '@/utils/fetchUserData';
import { useTheme } from 'next-themes';

interface AblyProviderProps {
    children: React.ReactNode;
}

export function AblyProvider({ children }: AblyProviderProps) {
    const [userId, setUserId] = useState<string>();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserData();
                if (!userData) return;
                setUserId(userData._id.toString());
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };
        fetchData();
    }, []);

    if (!theme || !userId) return <>{children}</>;

    return (
        <OriginalAblyProvider userId={userId} theme={theme}>
            {children}
        </OriginalAblyProvider>
    );
}