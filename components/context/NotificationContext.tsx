// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useSession } from 'next-auth/react';
// import { useTheme } from 'next-themes';
// import { toast } from 'react-toastify';
// import io, { Socket } from 'socket.io-client';
// import fetchUserData from '@/utils/fetchUserData';

// type Notification = {
//     type: string,
//     message: string
// };

// type NotificationContextType = {
//     unreadCount: number,
//     setUnreadCount: (count: number) => void
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export function NotificationProvider({ children }: { children: ReactNode }) {
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [userId, setUserId] = useState<string | undefined>(undefined);
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const { data: session } = useSession();
//     const { theme } = useTheme();

//     useEffect(() => {
//         if (!session?.user?.email) return;

//         const getUserData = async () => {
//             try {
//                 const data = await fetchUserData();
//                 setUserId(data._id);
//             } catch (error) {
//                 console.error('Failed to fetch user data', error);
//             }
//         };

//         getUserData();
//     }, [session?.user?.email]);

//     useEffect(() => {
//         if (!userId) return;

//         const socketInitializer = async () => {
//             await fetch('/api/notification?query=stream&userId=' + userId);
//             const newSocket = io(undefined, {
//                 query: { userId },
//             });

//             newSocket.on('connect', () => {
//                 console.log('Connected to socket');
//             });

//             newSocket.on('notification', (notification: Notification) => {
//                 console.log("New Notification!", notification);
//                 toast(" 📋 You have a new Notification!", {
//                     position: "top-right",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: theme === "dark" ? "dark" : "light",
//                 });
//                 setUnreadCount(prev => prev + 1);
//             });

//             setSocket(newSocket);
//         };

//         socketInitializer();

//         return () => {
//             if (socket) {
//                 socket.disconnect();
//             }
//         };
//     }, [userId, theme]);

//     return (
//         <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
//             {children}
//         </NotificationContext.Provider>
//     );
// }

// export function useNotification() {
//     const context = useContext(NotificationContext);
//     if (context === undefined) {
//         throw new Error('useNotification must be used within a NotificationProvider');
//     }
//     return context;
// };