"use client"
import ProtectedRoute from "@/utils/protectedRoute"
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import Loading from "@/app/loading";
import { ObjectId } from 'mongodb';
import Image from "next/image";
import NavBar from "@/components/ui/navbar";
import { ThemeSwitcher } from "./ui-client";
import { Button } from "@nextui-org/button";
import { FaSignOutAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import fetchUserData from "@/utils/fetchUserData";
import { useEffect, useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { IoMdHeartDislike } from "react-icons/io";
import { FaBook } from "react-icons/fa";
import "@/app/profile/custom.css"
interface ProfileHeaderType {
    url: string
}

export interface UserTypes {
    _id: ObjectId;
    name: string;
    email: string;
    image: string;
    emailVerified?: Date | null;
    myList?: string[] | null;
}

const Profile = async () => {
    const [userData, setUserData] = useState<UserTypes>();
    const iconClass = "text-xl text-default-500 pointer-events-none flex-shrink-0"
    useEffect(() => {
        const getUserData = async () => {
            const user = await fetchUserData();
            setUserData(user);
        }
        getUserData();
    }, [])
    if (!userData) return <Loading />;
    const handleSignOut = async () => {
        await signOut();
        console.log("Signed Out!")
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col items-center font-sans pb-4 ">
                <NavBar />
                <div>
                    <ProfileHeader url={userData?.image} />
                </div>
                <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl text-blue-800/70 dark:text-blue-300/80 ">
                    Welcome, {userData?.name}
                </h1>
                <div className="body max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 min-w-fit">
                    <div className="appearence flex gap-4 w-full">
                        <div className="text-area flex flex-col">
                            <p className="text-md">Appearance</p>
                            <p className="text-black/60 dark:text-white/60 text-sm">Customize how QualityNotes looks on your device</p>
                        </div>
                        <div className="ml-auto w-full">
                            <ThemeSwitcher />
                        </div>
                    </div>

                    <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Interactions</h2>
                    <div className="appearence flex  w-fit mt-4 items-center">
                        <p className="text-black/60 dark:text-white/60 text-md mr-1">Your Posts</p>
                    </div>
                    <div className="appearence flex  w-fit mt-4 items-center ">
                        <p className="text-black/60 dark:text-white/60 text-md mr-1">Liked Posts </p>
                    </div>
                    <div className="appearence flex  w-fit mt-4 items-center">
                        <p className="text-black/60 dark:text-white/60 text-md mr-1">Disliked Posts </p>
                    </div>
                    <div className="appearence flex  w-fit mt-4 items-center">
                        <p className="text-black/60 dark:text-white/60 text-md mr-1">Reading List </p>
                    </div>

                    <div className="mt-8">
                        <Button color="danger" variant="ghost">
                            <FaSignOutAlt className={iconClass} onClick={handleSignOut} /> Log out
                        </Button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};
const ProfileHeader: React.FC<ProfileHeaderType> = (props) => {
    return (
        <>
            <div className=" flex justify-center items-center md:pt-10 md:mb-6 pt-4 mb-2">

                <Image
                    src={props.url}
                    width={96}
                    height={96}
                    alt={"CN"}
                    className="rounded-full"
                />

            </div>
        </>
    )
}

export default Profile;