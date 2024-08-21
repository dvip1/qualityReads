"use client"
import ProtectedRoute from "@/utils/protectedRoute"
import NavBar from "@/components/ui/navbar"
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { PostData } from "../genre/[slug]/page";
import axios from "axios";
import FetchTrendingPost from "@/utils/fetchTrendingPost";
import { SmallCards } from "@/components/ui/main-cards";
import SkeletonCustom from "@/components/ui/skeleton-custom";
import ReadMoreModal from "@/components/posts/readMoreModal";
export default function Page() {
    const [tags, setTags] = useState<string[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [trendingData, setTrendingData] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Added state for loading
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const handleOpenModal = (title: string, content: string) => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Start loading
            try {
                const tag = await FetchTrendingPost("tags", 5);
                setTags(tag);
                const daily = await FetchTrendingPost("daily", 10);
                const mainParams = { page: 1, limit: 10, postIdInArray: daily }
                const response = await axios.post("/api/fetch-posts", mainParams, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setTrendingData(response.data.posts);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); // End loading
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <ProtectedRoute>
                <div className="flex flex-col items-center w-full min-h-screen pb-10">

                    <NavBar />
                    <ReadMoreModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={modalTitle}
                        content={modalContent}
                    />
                    <div className="max-w-full flex justify-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         
                            <h1 className="mt-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                                <MdOutlineTravelExplore className="mr-2" /> Explore
                            </h1>

                            <div className="xl:max-w-none">
                                <div className="p-6 ">
                                    <div className="bg-gray-100/80 dark:bg-[#393646] rounded-2xl shadow-lg p-4 w-fit">
                                        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                                            Today&apos;s Trending Hashtags
                                        </h2>
                                        <div className="bg-white/70 dark:bg-[#4F4557] rounded-xl p-3 ">
                                            <div className="flex flex-wrap gap-2 ">
                                                {tags && tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100/80 dark:bg-[#6D5D6E] text-blue-800 dark:text-[#F4EEE0] rounded-full text-sm font-medium backdrop-blur-sm"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h2 className="flex items-center mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                    Trending <FaArrowTrendUp className="ml-2" />
                                </h2>
                                <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                                    {isLoading ? <span> <SkeletonCustom />
                                    </span> : trendingData && trendingData.map((data, index) => (
                                        <SmallCards
                                            key={index}
                                            _id={data.postId}
                                            url={data.url}
                                            title={data.title}
                                            tags={data.tags}
                                            likes={data.likes}
                                            dislikes={data.dislikes}
                                            content={data.content}
                                            name={data.user.name}
                                            image={data.user.image}
                                            userLiked={data.userLiked}
                                            userDisliked={data.userDisliked}
                                            isPostInList={data.isPostInList}
                                            userId={data.userId}
                                            onReadMore={handleOpenModal}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </ProtectedRoute>
        </>
    )
}