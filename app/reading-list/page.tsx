"use client"
import { SmallCards, SmallCardsType } from "@/components/ui/main-cards";
import { PostData } from "@/app/genre/[slug]/page";
import NavBar from "@/components/ui/navbar";
import { FaBook } from "react-icons/fa6";
import { useState, useEffect } from "react";
import FetchReadingList from "@/utils/fetchReadingList";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import ProtectedRoute from "@/utils/protectedRoute";
import SkeletonCustom from "@/components/ui/skeleton-custom";

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // New state variable for total pages
    const [mainData, setMainData] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Added state for loading
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = {
                    page: currentPage,
                    limit: 15,
                };
                const result = await FetchReadingList(data);
                console.log(result);
                setMainData(result.posts);
                setTotalPages(Math.ceil(result.total / data.limit));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    return (
        <>
            <ProtectedRoute>
                <div className="flex flex-col items-center w-full min-h-screen pb-10">
                    <NavBar />
                    <div className="max-w-full flex justify-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                                <FaBook className="mr-2" /> My List
                            </h1>
                            <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                                {isLoading ? <span> <SkeletonCustom />
                                </span> : mainData?.map((data, index) => (
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
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-5 items-center mt-24 ${(totalPages > 1) ? '' : 'hidden'}`}>

                        <Pagination
                            total={totalPages} // Use totalPages instead of hardcoding 10
                            color="secondary"
                            page={currentPage}
                            onChange={setCurrentPage}
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="flat"
                                color="secondary"
                                onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                color="secondary"
                                onPress={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))} // Use totalPages instead of hardcoding 10
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}
