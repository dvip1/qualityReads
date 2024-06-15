"use client"
import MainCards from "@/components/ui/main-cards";
import PostComponent from "@/components/posts/postComponent";
import { BiSolidHomeCircle } from "react-icons/bi";
export default function MainBody() {
  
    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-10">
            <div className="max-w-full flex justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="flex justify-center items-center">
                        <PostComponent />
                    </span>
                    <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                        <BiSolidHomeCircle className="mr-2" /> Home
                    </h1>
                    <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                        <MainCards />
                    </div>
                </div>
            </div>
        </div>
    )
}
