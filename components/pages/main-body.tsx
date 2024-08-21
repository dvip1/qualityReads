"use client"
import { SmallCards, SmallCardsType } from "@/components/ui/main-cards";
import { PostData } from "@/app/genre/[slug]/page";
import PostComponent from "@/components/posts/postComponent";
import { BiSolidHomeCircle } from "react-icons/bi";
import { useState, useEffect } from "react";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Bounce, ToastContainer } from "react-toastify";
import SkeletonCustom from "../ui/skeleton-custom";
import axios from "axios";
import ReadMoreModal from "../posts/readMoreModal";

export default function MainBody() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // New state variable for total pages
    const [mainData, setMainData] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
            try {
                setIsLoading(true);
                const data = {
                    page: currentPage,
                    limit: 15,
                };
                const response = await axios.post("/api/fetch-posts", data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setMainData(response?.data?.posts);
                setTotalPages(Math.ceil(response?.data?.total / data.limit)); //  
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-10">

            <div className="max-w-full flex justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="flex justify-center items-center">
                        <PostComponent />
                    </span>
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
                    <ReadMoreModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={modalTitle}
                        content={modalContent}
                    />
                    <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                        <BiSolidHomeCircle className="mr-2" /> Home
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
    )
}
