"use client"
import ProtectedRoute from "@/utils/protectedRoute"
import NavBar from "@/components/ui/navbar"
import { ToastContainer, Bounce } from "react-toastify"
import isValidSlug from './isValidSlug'
import { notFound, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { PostData } from "@/app/genre/[slug]/page"
import { SmallCards } from "@/components/ui/main-cards"
import NothingToSeeHere from "@/components/ui/nothingtosee";
import axios from "axios"
import { FcSearch } from "react-icons/fc";
import SkeletonCustom from "@/components/ui/skeleton-custom"

export default function Page({ params }: { params: { slug: string } }) {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [mainData, setMainData] = useState<PostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isValidSlug(params.slug) || !query)
            notFound();
    }, [params.slug]);

    useEffect(() => {
        let tags = [];
        if (params.slug === 'tags') {
            tags.push("#" + query);
        }
        const mainParams = {
            page: currentPage,
            limit: 15,
            [params.slug]: tags.length ? tags : query
        };
        const fetchData = async () => {
            try {
                const response = await axios.post("/api/fetch-posts", mainParams, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setMainData(response.data.posts);
                setLoading(false);
                setTotalPages(Math.ceil(response.data.total / mainParams.limit));
            } catch (error) {
                console.error("There was a problem with the axios request:", error);
            }
        };
        fetchData();
    }, [currentPage]);

    return (
        <>
            <ProtectedRoute>
                <div className="min-h-screen pb-10">
                    <NavBar />
                    <div className="max-w-full flex justify-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                                <FcSearch />  search={params.slug}
                            </h1>
                            <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                                {loading ? (
                                    <SkeletonCustom />
                                ) : mainData.length ? (
                                    mainData.map((data, index) => (
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
                                    ))
                                ) : (
                                    <NothingToSeeHere />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    )
}