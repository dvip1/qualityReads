"use client"
import ProtectedRoute from "@/utils/protectedRoute"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
interface ProfileHeaderType {
    url: string
}
export default function Profile() {
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <ProtectedRoute>
            {session?.user?.image && <ProfileHeader url={session?.user?.image} />}
        </ProtectedRoute>
    )
}

const ProfileHeader: React.FC<ProfileHeaderType> = (props) => {
    return (
        <>
            <div className="container flex justify-center items-center md:mt-10 md:mb-6 mt-4 mb-2">
                <Avatar isBordered showFallback name="CN" color="default" src={props.url} />
            </div>
        </>
    )
}