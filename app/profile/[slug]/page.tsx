"use client"
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ProtectedRoute from "@/utils/protectedRoute";
import NavBar from "@/components/ui/navbar";
import { PostData } from "@/app/genre/[slug]/page";
import { SmallCards } from "@/components/ui/main-cards";
import axios from "axios";

const SlugURL = ["liked", "disliked", "my-posts"];
const isValidSlug = (slug: string) => {
    return SlugURL.includes(slug);
};
const stringMapping: { [key: string]: string } = {
    liked: "Liked By You",
    disliked: "Disliked",
    "my-posts": "My Posts",
}


export default function Page({ params }: { params: { slug: string } }) {
    const [sendParams, setSendParams] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [mainData, setMainData] = useState<PostData[]>([]);

    useEffect(() => {
        if (!isValidSlug(params.slug)) {
            notFound();
        }
        const paramMapping: { [key: string]: string } = {
            liked: "likedByUser",
            disliked: "dislikedByUser",
            "my-posts": "usersPost",
        };

        const currentParam = paramMapping[params.slug];
        if (currentParam) {
            setSendParams(currentParam);
        }
    }, [params.slug]);

    useEffect(() => {
        if (sendParams) {
            const mainParams = { page: currentPage, limit: 15, [sendParams]: true };

            const fetchData = async () => {
                try {
                    const response = await axios.post("/api/fetch-posts", mainParams, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(`This is somethin here: ${response.data.posts}`)
                    setMainData(response.data.posts);

                    setTotalPages(Math.ceil(response.data.total / mainParams.limit))
                } catch (error) {
                    console.error("There was a problem with the axios request:", error);
                }
            };
            fetchData();
        }
    }, [sendParams, currentPage]);

    return (
        <>
            <ProtectedRoute>
                <div className="min-h-screen pb-10">
                    <NavBar />
                    <div className="max-w-full flex justify-center">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex items-center">
                                {stringMapping[params.slug]}
                            </h1>
                            <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                                {(mainData.length) ? mainData.map((data, index) => (
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
                                    />
                                )) : <p>Nothing to see here</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    );
}