import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import { HandThumbUpIcon as HandThumbUpOutlineIcon, HandThumbDownIcon as HandThumbDownOutlineIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolidIcon, HandThumbDownIcon as HandThumbDownSolidIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { LikePostTypes, LikePost, DislikePost, DislikePostTypes } from "@/utils/interactions";
import { ObjectId } from "mongodb";
import { Chip } from "@nextui-org/react";
export default function MainCards() {

    const url = "https://www.wikipedia.org/"
    return (
        <div className="">
            <SmallCards url={url} title="some title" tags={[]} likes={0} dislikes={0}
                name="my name" image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                content="Make beautiful websites regardless of your design experience."
                userLiked={false}
                userDisliked={false}
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
    userLiked: boolean
    userDisliked: boolean
}
function removeHashtags(text: string) {
    return text.replace(/#[^\s#]+/g, '').trim();
}

export const SmallCards: React.FC<SmallCardsType> = (props) => {
    const [liked, setLiked] = useState(props.userLiked);
    const [disliked, setDisliked] = useState(props.userDisliked);
    const [likes, setLikes] = useState(props.likes);
    const [dislikes, setDislikes] = useState(props.dislikes);
    const propId = props._id;
    const handleDislike = async () => {
        if (disliked) {
            const sendObject: DislikePostTypes = {
                dislike: false,
                postId: propId
            }
            const updatedData = await DislikePost(sendObject);
            if (updatedData) {
                setDislikes(updatedData.dislikes);
                setDisliked(false);
            }
        } else {
            const sendObject: DislikePostTypes = {
                dislike: true,
                postId: propId
            }
            const sendLiked: LikePostTypes = {
                like: false,
                postId: propId
            }
            if (liked) {
                await LikePost(sendLiked);
                setLiked(false);
            }
            const updatedData = await DislikePost(sendObject);

            if (updatedData) {
                setDislikes(updatedData.dislikes);
                setLikes(updatedData.likes);
                setDisliked(true);
            }
        }
    };
    const handleLike = async () => {

        if (liked) {
            const sendObject: LikePostTypes = {
                like: false,
                postId: propId
            }
            const updatedData = await LikePost(sendObject);
            if (updatedData) {
                setLikes(updatedData.likes);
                setDislikes(updatedData.dislikes);
                setLiked(false);
            }
        } else {
            const sendObject: LikePostTypes = {
                like: true,
                postId: propId
            }
            const sendDislike: DislikePostTypes = {
                dislike: false,
                postId: propId
            }
            if (disliked) {
                await DislikePost(sendDislike);
                setDisliked(false);
            }
            const updatedData = await LikePost(sendObject);

            if (updatedData) {
                setLikes(updatedData.likes);
                setDislikes(updatedData.dislikes);
                setLiked(true);
            }
        }
    };

    return (
        <>
            <Card className="max-w-[350px]  my-2 " isBlurred >
                <CardHeader className=" flex gap-3 ">
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src={props.image}
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">{props.name}</p>

                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="flex flex-col gap-1">
                    <p className="text-small ">{props.title}</p>
                    <p className="text-small text-black/60 dark:text-white/60">{removeHashtags(props.content)}</p>

                    <Link
                        isExternal
                        showAnchorIcon
                        href={props.url}
                        className="text-blue-500"
                    >
                        {props.url}
                    </Link>
                    <div className="flex flex-wrap mt-auto">
                        {
                            props.tags.map((item, index) => (
                                <p key={index} className="bg-[#ffffffaa] backdrop-blur-md bg-opacity-30 text-black/70 text-small inline-block mr-2 mb-2 rounded-xl p-1 border border-white border-opacity-20 shadow-md transition-colors duration-200 hover:bg-blue-500 hover:text-white cursor-pointer dark:bg-[#1e1e1e] dark:text-gray-300 dark:hover:bg-blue-700 dark:hover:text-white"> {item}</p>))
                        }
                    </div>
                </CardBody>
                <Divider />
                <CardFooter >
                    <Button
                        onClick={() => handleLike()}
                        className="flex items-center space-x-1 pr-4 mr-2 text-black dark:text-white"
                        radius="full"
                        color="default"
                        variant="flat"
                    >
                        {liked ? <HandThumbUpSolidIcon className="h-8 text-blue-500" /> : <HandThumbUpOutlineIcon className="h-8 text-gray-500" />}
                        <span>{likes}</span>
                    </Button>
                    <button onClick={() => handleDislike()} className="flex items-center space-x-2">
                        {disliked ? <HandThumbDownSolidIcon className="h-8 text-red-500" /> : <HandThumbDownOutlineIcon className="h-8 text-gray-500" />}
                        <span>{dislikes}</span>
                    </button>
                </CardFooter>
            </Card>
        </>
    )
};