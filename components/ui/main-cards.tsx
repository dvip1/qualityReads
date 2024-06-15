import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { HandThumbUpIcon as HandThumbUpOutlineIcon, HandThumbDownIcon as HandThumbDownOutlineIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolidIcon, HandThumbDownIcon as HandThumbDownSolidIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import LikePost, { LikePostTypes } from "@/utils/interactions";
import { ObjectId } from "mongodb";

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
    _id?: ObjectId
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

    const handleReactionClick = async (reaction: 'like' | 'dislike', propId) => {
        if (reaction === 'like') {
            const sendObject: LikePostTypes = {
                like: liked,
                postId: propId
            }
            setLiked(prevLiked => !prevLiked);
            await LikePost(sendObject);

            if (!liked) setDisliked(false);
        } else if (reaction === 'dislike') {
            setDisliked(prevDisliked => !prevDisliked);
            if (!disliked) setLiked(false);
        }
    };
    return (
        <>
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
                        <p className="text-small text-default-500">{props.title}</p>
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
                    <Button
                        onClick={() => handleReactionClick('like', props._id)}
                        className="flex items-center space-x-1 pr-4 mr-2 text-black dark:text-white"
                        radius="full"
                        color="default"
                        variant="flat"
                    >
                        {liked ? <HandThumbUpSolidIcon className="h-8 text-blue-500" /> : <HandThumbUpOutlineIcon className="h-8 text-gray-500" />}
                        <span>{liked ? '1' : '0'}</span>
                    </Button>
                    <button onClick={() => handleReactionClick('dislike', props._id)} className="flex items-center space-x-2">
                        {disliked ? <HandThumbDownSolidIcon className="h-8 text-red-500" /> : <HandThumbDownOutlineIcon className="h-8 text-gray-500" />}
                        <span>{disliked ? 'Disliked' : 'Dislike'}</span>
                    </button>
                </CardFooter>
            </Card>
        </>
    )
};