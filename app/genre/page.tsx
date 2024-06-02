"use client"
import ProtectedRoute from "@/utils/protectedRoute"
import NavBar from "@/components/ui/navbar"
import Link from "next/link";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { differentGenre, GenreTypes } from "./data";
interface GenreCardProps {
    genre: GenreTypes;
}

export default function Genre() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                <NavBar />
                <div className="max-w-full flex justify-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="mt-10 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Genre
                        </h1>
                        <div className="mt-10 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:max-w-none">
                            {differentGenre.map((genre: GenreTypes, index) => (
                                <GenreCard key={index} genre={genre} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

const GenreCard: React.FC<GenreCardProps> = (genre) => {
    return (
        <Link href={genre.genre.link} passHref>
            <Card className="py-4 max-w-fit cursor-pointer"
                isBlurred
            >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-large">{genre.genre.title}</h4>
                    <small className="text-default-500">{genre.genre.description}</small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <Image
                        alt="Card background"
                        className="object-cover rounded-xl h-48"
                        src={genre.genre.image}
                        width={270}
                    />
                </CardBody>
            </Card>
        </Link>
    );
}