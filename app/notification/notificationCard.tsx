"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Button } from "@nextui-org/button";
import { Avatar, AvatarGroup } from '@nextui-org/avatar';
import getGroupImages from './getGroupImges';
export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    metadata: {
        userIds: string[];
        count: number;
    };
}

export interface NotificationCardProps {
    notification: Notification;
    onClear: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClear }) => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const handleViewPost = () => {
        router.push(`/posts?id=${notification.id}`);
    };

    useEffect(() => {
        const getData = async () => {
            const data = await getGroupImages(notification.metadata.userIds);
            setImages(data);
        }
        getData();
    }, [notification?.metadata?.userIds]);

    return (
        <Card className="max-w-[400px]" isBlurred>
            <CardBody>
                <div className="px-6 pt-4">
                    <div className="font-medium text-xl mb-2">{notification.message}</div>
                    <AvatarGroup isBordered max={3}>
                        {(images?.length > 0) && images?.map(image => (
                            <Avatar src={image || './user.png'} key={Math.random()} />
                        ))}
                    </AvatarGroup>
                </div>
            </CardBody>
            <CardFooter>
                <div className="px-6 pt-4 pb-2 flex justify-between">
                    <Button
                        onClick={handleViewPost}
                        variant='bordered'
                        className='mr-2'
                    >
                        View Post
                    </Button>
                    <Button
                        onClick={onClear}
                        color='primary'
                        className='ml-2'
                        variant='faded'
                    >
                        Clear
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default NotificationCard;
