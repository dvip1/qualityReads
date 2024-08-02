"use client"
import { useState, useEffect } from "react"
import { getAllNotification, getNotificationCount } from "./service"
import fetchUserData from "@/utils/fetchUserData";
import ProtectedRoute from "@/utils/protectedRoute";
import NavBar from "@/components/ui/navbar";
import { Bounce, ToastContainer } from "react-toastify";
import NotificationCard, { NotificationCardProps, Notification } from "./notificationCard";
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from "@nextui-org/button";
import NothingToSeeHere from "@/components/ui/nothingtosee";

export default function Page() {
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [notificationData, setNotificationData] = useState<Notification[]>();
    useEffect(() => {
        const fetchNotification = async () => {
            const userData = await fetchUserData();
            const count = await getNotificationCount(userData._id.toString());
            if (!count.data) return;
            setNotificationCount(count.data || 0);
            const data = await getAllNotification(userData._id.toString());
            setNotificationData(data.data[0]);
        }
        fetchNotification();
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-10">
                <NavBar />
                <div className="max-w-full flex flex-col items-center">
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
                        theme="light"
                    />
                    <h1 className="mt-10 mb-5 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Notifications
                    </h1>

                    <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                        {
                            (notificationCount) ?
                                <Card
                                    className="min-h-24"
                                    onClick={() => {
                                        // Handle the click event here
                                        console.log('Card clicked');
                                    }}
                                    isBlurred
                                    isPressable

                                >
                                    <CardBody className="flex flex-col justify-center items-center">
                                        <div className="m-auto">
                                            <p className=" px-2 py-1 text-black/70 dark:text-white/70 text-lg font-semibold font-sans ">Clear All</p>
                                        </div>
                                    </CardBody>
                                </Card> : <NothingToSeeHere />
                        }
                        {notificationCount && notificationData && (notificationData?.length > 0) && notificationData?.map(notification => (
                            <NotificationCard
                                key={notification?.id}
                                notification={notification}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    )
}



