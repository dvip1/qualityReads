"use client"
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PostData } from '../genre/[slug]/page';
import ProtectedRoute from '@/utils/protectedRoute';
import NavBar from '@/components/ui/navbar';
import { ProfileHeader } from '../profile/page';
import Loading from '../loading';
import SkeletonCustom from '@/components/ui/skeleton-custom';
import { SmallCards } from '@/components/ui/main-cards';
import { Pagination } from '@nextui-org/pagination';
import { Button } from '@nextui-org/button';
export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [mainData, setMainData] = useState<PostData[]>([]);
    const [userImage, setUserImage] = useState("")
    const [userName, setUserName] = useState("")
    const [isFound, setIsFound] = useState(true);
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');
    if (!userId) {
        notFound();
    };
    useEffect(() => {
        const mainParams = { page: currentPage, limit: 15, userId: userId };

        const fetchData = async () => {
            try {
                const response = await axios.post("/api/user-posts", mainParams, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`This is somethin here: ${JSON.stringify(response.data)}`)
                setMainData(response.data.posts);
                setUserName(response.data.name);
                setUserImage(response.data.image);
                setTotalPages(Math.ceil(response.data.total / mainParams.limit))
                setLoading(false);
            } catch (error) {
                console.log("some error occured", error);
                setLoading(false);
                setIsFound(false);
            }
        };
        fetchData();
    }, [userId, currentPage]);
    if (loading) return <Loading />
    else if (!loading && !isFound) return notFound();
    else
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex flex-col items-center font-sans pb-4 ">
                    <NavBar />
                    <div>
                        <ProfileHeader url={userImage} />
                    </div>
                    <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl text-blue-800/70 dark:text-blue-300/80 ">
                        {userName}
                    </h1>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                            {loading ? <span> <SkeletonCustom />
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
                                    userId={userId}
                                />
                            ))}
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