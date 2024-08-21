"use client"
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import NavBar from '@/components/ui/navbar';
import ProtectedRoute from '@/utils/protectedRoute';
import { PostData } from '../genre/[slug]/page';
import Loading from '../loading';
import { SmallCards } from '@/components/ui/main-cards';
import SkeletonCustom from '@/components/ui/skeleton-custom';
import { Bounce, ToastContainer } from "react-toastify";
import { FaShareAlt } from "react-icons/fa";
import ReadMoreModal from "@/components/posts/readMoreModal";

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [mainData, setMainData] = useState<PostData[]>([]);
    const [isFound, setIsFound] = useState(true);
    const searchParams = useSearchParams();
    const postId = searchParams.get('id');
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

    if (!postId) {
        notFound();
    };
    useEffect(() => {
        const mainParams = { page: currentPage, limit: 15, givenPostId: postId };

        const fetchData = async () => {
            try {
                const response = await axios.post("/api/fetch-posts", mainParams, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data);
                setMainData(response.data.posts);
                setTotalPages(Math.ceil(response.data.total / mainParams.limit))
                setLoading(false);
            } catch (error) {
                console.log("some error occured", error);
                setLoading(false);
                setIsFound(false);
            }
        };
        fetchData();
    }, [postId, currentPage]);
    if (loading) return <Loading />
    else if (!loading && !isFound) return notFound();
    return (
        <>
            <ProtectedRoute>
                <div className="flex flex-col items-center w-full min-h-screen pb-10">
                    <NavBar />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        {loading ? (
                            <span> <SkeletonCustom /></span>
                        ) : (
                            <>
                                <div className="h-4 w-full "></div>

                                {mainData && mainData.length > 0 && (
                                    <div className="mt-10">
                                        <SmallCards
                                            key={mainData[0].postId.toString()}
                                            _id={mainData[0].postId}
                                            url={mainData[0].url}
                                            title={mainData[0].title}
                                            tags={mainData[0].tags}
                                            likes={mainData[0].likes}
                                            dislikes={mainData[0].dislikes}
                                            content={mainData[0].content}
                                            name={mainData[0].user.name}
                                            image={mainData[0].user.image}
                                            userLiked={mainData[0].userLiked}
                                            userDisliked={mainData[0].userDisliked}
                                            isPostInList={mainData[0].isPostInList}
                                            userId={mainData[0].userId}
                                            onReadMore={handleOpenModal}
                                        />
                                    </div>
                                )}
                                {mainData && mainData.length > 1 && (
                                    <div className="mt-10">
                                        <h2 className="flex items-center mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                            You might also like..
                                        </h2>
                                        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                                            {mainData.slice(1).map((data, index) => (
                                                <SmallCards
                                                    key={data.postId.toString()}
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
                                )}
                            </>
                        )}
                    </div>
                </div>
            </ProtectedRoute>

        </>
    )
}