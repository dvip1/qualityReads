import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { HandThumbUpIcon as HandThumbUpOutlineIcon, HandThumbDownIcon as HandThumbDownOutlineIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolidIcon, HandThumbDownIcon as HandThumbDownSolidIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
export default function MainCards() {

    const url = "https://www.wikipedia.org/"
    return (
        <div className="">
            <SmallCards url={url} title="some title" tags={[]} likes={0} dislikes={0}
                name="my name" image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                content="Make beautiful websites regardless of your design experience."
            />
        </div>
    )
}
export interface SmallCardsType {
    _id?: string
    url: string
    title: string
    tags: string[]
    likes: number
    dislikes: number
    content: string
    name: string
    image: string
}
export const SmallCards: React.FC<SmallCardsType> = (props) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const handleLikeClick = () => {
        if (liked) {
            setLiked(false);
        } else {
            setLiked(true);
            setDisliked(false);
        }
    };

    const handleDislikeClick = () => {
        if (disliked) {
            setDisliked(false);
        } else {
            setDisliked(true);
            setLiked(false);
        }
    };
    return (
        <>
            <div className="">
                <Card className="max-w-[400px] h-fit my-2" isBlurred >
                    <CardHeader className="flex gap-3">
                        <Image
                            alt="nextui logo"
                            height={40}
                            radius="sm"
                            src={props.image}
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">{props.name}</p>
                            {/* <p className="text-small text-default-500">loves knowledge</p> */}
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <p>{props.content}</p>
                        <Link
                            isExternal
                            showAnchorIcon
                            href={props.url}
                        >
                            Visit source code on GitHub.
                        </Link>
                    </CardBody>
                    <Divider />
                    <CardFooter >
                        <button onClick={handleLikeClick} className="flex items-center space-x-2 pr-2">
                            {liked ? <HandThumbUpSolidIcon className="h-8 text-blue-500" /> : <HandThumbUpOutlineIcon className="h-8 text-gray-500" />}
                            <span>{liked ? 'Liked' : 'Like'}</span>
                        </button>
                        <button onClick={handleDislikeClick} className="flex items-center space-x-2">
                            {disliked ? <HandThumbDownSolidIcon className="h-8 text-red-500" /> : <HandThumbDownOutlineIcon className="h-8 text-gray-500" />}
                            <span>{disliked ? 'Disliked' : 'Dislike'}</span>
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
};