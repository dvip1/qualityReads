"use client"
import ProtectedRoute from "@/utils/protectedRoute";
import NavBar from "@/components/ui/navbar";
import { notFound } from "next/navigation";
import isValidSlug from "./isValidSlug";
import { SlugToTitle } from "./data";
import { SmallCards } from "@/components/ui/main-cards";
import { useEffect, useState } from "react";
import fetchGenreData from "./fetchGenreData";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { ObjectId } from "mongodb";
import SkeletonCustom from "@/components/ui/skeleton-custom";
import axios from "axios";
import ReadMoreModal from "@/components/posts/readMoreModal";

interface UserTypes {
    name: string;
    image: string;
}

export interface PostData {
    user: UserTypes;
    url: string;
    title: string;
    tags: string[];
    likes: number;
    dislikes: number;
    content: string;
    postId: ObjectId;
    userLiked: boolean;
    userDisliked: boolean;
    isPostInList: boolean
    userId: string
}
export default function Page({ params }: { params: { slug: string } }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // New state variable for total pages
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

    if (!isValidSlug(params.slug))
        notFound();

    const title = SlugToTitle[params.slug];
    const [mainData, setMainData] = useState<PostData[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = {
                    category: title,
                    page: currentPage,
                    limit: 15,
                };
                const result = await axios.post("/api/fetch-posts", data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setMainData(result.data.posts);
                setTotalPages(Math.ceil(result.data.total / data.limit));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            finally {
                setIsLoading(false);
            }

        };
        fetchData();
    }, [title, currentPage]);


    return (
        <ProtectedRoute>
            <div className="min-h-screen pb-10">
                <NavBar />
                <div className="max-w-full flex justify-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      
                        <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {title}
                        </h1>
                        <ReadMoreModal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            title={modalTitle}
                            content={modalContent}
                        />
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
                                    onReadMore={handleOpenModal}
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
    )
}
