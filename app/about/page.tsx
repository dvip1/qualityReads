"use client"
import ProtectedRoute from "@/utils/protectedRoute"
import { LuBadgeInfo } from "react-icons/lu";
import { Link } from "@nextui-org/react";
import NavBar from "@/components/ui/navbar";
export default function Page() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-10 ">
                <NavBar />
                <div className="max-w-4xl mx-auto flex flex-col items-center px-4">
                    <h1 className="mt-10 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center dark:text-white">
                        <LuBadgeInfo className="mr-2 text-blue-600" /> QualityReads
                    </h1>

                    <section className="mt-10 w-full bg-white/60 bg-opacity-80 dark:bg-[#3D3B40] dark:bg-opacity-80 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">About QualityReads</h2>
                        <p className="mb-4 dark:text-gray-300">QualityReads is a website where you can share & find your favorite content, whether it be a website, video, or audio.</p>
                    </section>

                    <section className="mt-10 w-full bg-white/60 bg-opacity-80 dark:bg-[#3D3B40] dark:bg-opacity-80 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">Features</h2>
                        <ul className="list-disc list-inside space-y-2 dark:text-gray-300">
                            <li>Like a post, and view all liked and disliked posts in your profile. 👍</li>
                            <li>Customize your profile with theme changes and settings. 🎨</li>
                            <li>Add posts to a list for later viewing. 📋</li>
                            <li>Share posts with friends. 📤</li>
                            <li>Click on hashtags to find related posts. 🔗</li>
                            <li>View all posts by clicking on a profile or username. 👤</li>
                            <li>Explore trending posts and hashtags. 📈</li>
                            <li>Receive notifications when someone likes your posts. 🔔</li>
                            <li>Access settings, log out, notifications, and your list by clicking your profile at the top. ⚙️</li>
                        </ul>
                    </section>

                    <section className="mt-10 w-full bg-white/60 bg-opacity-80 dark:bg-[#3D3B40] dark:bg-opacity-80 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">Get Involved</h2>
                        <p className="mb-4 dark:text-gray-300">If you want to contribute, report issues or simply checkout my project:</p>
                        <Link
                            href="https://github.com/dvip1/qualityReads/"
                            isExternal
                            showAnchorIcon
                        >dvip1/qualityReads</Link>
                    </section>

                    <section className="mt-10 w-full text-center">
                        <p className="mb-4 dark:text-gray-300 text-md font-sans">Start Exploring QualityReads from navigation bar above!</p>                    </section>
                </div>
            </div>

        </ProtectedRoute>
    )
}