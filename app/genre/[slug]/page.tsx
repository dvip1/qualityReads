"use client"
import ProtectedRoute from "@/utils/protectedRoute";
import NavBar from "@/components/ui/navbar";
import { notFound } from "next/navigation";
import isValidSlug from "./isValidSlug";
import { SlugToTitle } from "./data";
import { SmallCards, SmallCardsType } from "@/components/ui/main-cards";
import { useEffect, useState } from "react";
import fetchGenreData from "./fetchGenreData";
export default function Page({ params }: { params: { slug: string } }) {
    if (!isValidSlug(params.slug))
        notFound();

    const title = SlugToTitle[params.slug];
    const [mainData, setMainData] = useState<Array<{ user: { name: string, image: string }, url: string, title: string, tags: string[], likes: number, dislikes: number, content: string }>>([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = {
                category: title,
                page: 1,
                limit: 15,
            };
            const result = await fetchGenreData(data);
            setMainData(result);
        };
        fetchData();
    }, [title]);

    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                <NavBar />
                <div className="max-w-full flex justify-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            {title}
                        </h1>
                        <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                            {mainData.map((data, index) => (
                                <SmallCards
                                    key={index}
                                    url={data.url}
                                    title={data.title}
                                    tags={data.tags}
                                    likes={data.likes}
                                    dislikes={data.dislikes}
                                    content={data.content}
                                    name={data.user.name}
                                    image={data.user.image}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
