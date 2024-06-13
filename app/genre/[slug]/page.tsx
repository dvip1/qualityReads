"use client"
import ProtectedRoute from "@/utils/protectedRoute";
import NavBar from "@/components/ui/navbar";
import { notFound } from "next/navigation";
import isValidSlug from "./isValidSlug";
import { SlugToTitle } from "./data";
import { SmallCards, SmallCardsType } from "@/components/ui/main-cards";
import { useEffect, useState } from "react";
import fetchGenreData from "./fetchGenreData";
import { Pagination } from "@nextui-org/pagination";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

export default function Page({ params }: { params: { slug: string } }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // New state variable for total pages

    if (!isValidSlug(params.slug))
        notFound();

    const title = SlugToTitle[params.slug];
    const [mainData, setMainData] = useState<Array<{ user: { name: string, image: string }, url: string, title: string, tags: string[], likes: number, dislikes: number, content: string }>>([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = {
                category: title,
                page: currentPage, 
                limit: 15,
            };
            const result = await fetchGenreData(data);
            setMainData(result.posts); 
            setTotalPages(Math.ceil(result.total / data.limit)); // 
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
                <div className={`flex flex-col gap-5 items-center mt-24 ${(totalPages>1)?'':'hidden'}`}>
                
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
