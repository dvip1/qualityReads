import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Link,
} from "@nextui-org/react";
import {
  HandThumbUpIcon as HandThumbUpOutlineIcon,
  HandThumbDownIcon as HandThumbDownOutlineIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HandThumbDownIcon as HandThumbDownSolidIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import {
  LikePostTypes,
  LikePost,
  DislikePost,
  DislikePostTypes,
} from "@/utils/interactions";
import { ObjectId } from "mongodb";
import { BsPatchPlusFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";
import AddRemoveFromList, { MyListTypes } from "@/utils/addToList";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { FaShareAlt } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, cn } from "@nextui-org/react";

export interface SmallCardsType {
  _id?: ObjectId;
  url: string;
  title: string;
  tags: string[];
  likes: number;
  dislikes: number;
  content: string;
  name: string;
  image: string;
  userLiked: boolean;
  userDisliked: boolean;
  isPostInList: boolean;
  userId?: string;
}
function removeHashtags(text: string) {
  return text.replace(/#[^\s#]+/g, "").trim();
}
function getDomainFromUrl(url: string) {
  try {
    const anchor = new URL(url);
    return anchor.hostname;
  } catch {
    return "";
  }
}
export const SmallCards: React.FC<SmallCardsType> = (props) => {
  const router = useRouter();
  const [liked, setLiked] = useState(props.userLiked);
  const [disliked, setDisliked] = useState(props.userDisliked);
  const [likes, setLikes] = useState(props.likes);
  const [dislikes, setDislikes] = useState(props.dislikes);
  const [addList, setAddList] = useState(props.isPostInList);
  const propId = props._id;
  const { theme } = useTheme();
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const isWebShareSupported = navigator.share !== undefined;
  const optionItems = [
    {
      key: "Share",
      label: "Share",
      onClick: () => handleShare({ url: `/posts?id=${props._id}` }),
      startContent: <FaShareAlt className={iconClasses} />
    },
    {
      key: "list",
      label: addList ? "Remove From List" : "Add To List",
      onClick: () => handleAddToList(),
      startContent: addList ? <HiMinusCircle className={iconClasses} /> :
        <BsPatchPlusFill className={iconClasses} />
    }
  ];
  const handleShare = async (shareData: { url: string }) => {
    if (isWebShareSupported) {
      try {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for unsupported browsers
      // You can implement a custom share menu here
      console.log('Web Share not supported');
      // For now, let's just copy the URL to clipboard
      navigator.clipboard.writeText(`${window.location.protocol}://${window.location.host}${shareData.url}`);
      toast(" 📋 Copied to Clipboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
    }
  };
  const handleDislike = async () => {
    if (!propId) return;
    if (disliked) {
      const sendObject: DislikePostTypes = {
        dislike: false,
        postId: propId,
      };
      const updatedData = await DislikePost(sendObject);
      if (updatedData) {
        setDislikes(updatedData.dislikes);
        setDisliked(false);
      }
    } else {
      const sendObject: DislikePostTypes = {
        dislike: true,
        postId: propId,
      };
      const sendLiked: LikePostTypes = {
        like: false,
        postId: propId,
      };
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
    if(!propId)return;
    if (liked) {
      const sendObject: LikePostTypes = {
        like: false,
        postId: propId,
      };
      const updatedData = await LikePost(sendObject);
      if (updatedData) {
        setLikes(updatedData.likes);
        setDislikes(updatedData.dislikes);
        setLiked(false);
      }
    } else {
      const sendObject: LikePostTypes = {
        like: true,
        postId: propId,
      };
      const sendDislike: DislikePostTypes = {
        dislike: false,
        postId: propId,
      };
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
  const handleProfileClick = () => {
    router.push(`/user?id=${props?.userId}`);
  };
  const handleAddToList = () => {
    if (addList) {
      setAddList(false);
      propId && AddRemoveFromList({ postId: propId });
      toast(" 📑 Removed from List!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
    } else {
      setAddList(true);
      propId && AddRemoveFromList({ postId: propId });
      toast(" 📑 Added to List!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === "dark" ? "dark" : "light",
      });
    }
  };
  return (
    <>
      <Card className="max-w-[350px]  my-2 " isBlurred>
        <CardHeader className=" flex gap-3 ">
          <Image
            alt={props.name[0] || "D"}
            height={40}
            radius="sm"
            src={props.image || "/user.png"}
            width={40}
            onClick={handleProfileClick}
            className="cursor-pointer"
          />
          <div className="flex flex-col">
            <Link
              className="text-md"
              href={`/user?id=${props?.userId}`}
              color={"foreground"}
            >
              {props.name}
            </Link>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-1">
          <p className="text-small ">{props.title}</p>
          <p className="text-small text-black/60 dark:text-white/60">
            {removeHashtags(props.content)}
          </p>

          <Link href={props.url} showAnchorIcon target="_blank">
            {getDomainFromUrl(props.url)}
          </Link>
          <div className="flex flex-wrap mt-auto">
            {props.tags &&
              props.tags.map((item, index) => (
                <p
                  key={index}
                  className="bg-[#ffffffaa] backdrop-blur-md bg-opacity-30 text-black/70 text-small inline-block mr-2 mb-2 rounded-xl p-1 border border-white border-opacity-20 shadow-md transition-colors duration-200 hover:bg-blue-500 hover:text-white cursor-pointer dark:bg-[#1e1e1e] dark:text-gray-300 dark:hover:bg-blue-700 dark:hover:text-white"
                >
                  {" "}
                  {item}
                </p>
              ))}
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="px-2 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              onClick={() => handleLike()}
              className="flex items-center space-x-1 pr-4 mr-2 text-black dark:text-white"
              radius="full"
              color="default"
              variant="flat"
            >
              {liked ? (
                <HandThumbUpSolidIcon className="h-8 text-blue-500" />
              ) : (
                <HandThumbUpOutlineIcon className="h-8 text-gray-500" />
              )}
              <span>{likes}</span>
            </Button>
            <button
              onClick={() => handleDislike()}
              className="flex items-center space-x-2"
            >
              {disliked ? (
                <HandThumbDownSolidIcon className="h-8 text-red-500" />
              ) : (
                <HandThumbDownOutlineIcon className="h-8 text-gray-500" />
              )}
              <span>{dislikes}</span>
            </button>
          </div>

          <span className=" cursor-pointer ">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="w-fit"
                  disableAnimation={true}
                >
                  <SlOptionsVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions" items={optionItems}>
                {(notItem) => (
                  <DropdownItem
                    key={notItem.key}
                    color={notItem.key === "delete" ? "danger" : "default"}
                    className={notItem.key === "delete" ? "text-danger" : ""}
                    onClick={notItem.onClick}
                    startContent={notItem.startContent}
                  >
                    {notItem.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>

            {/* {addList ? (
              <HiMinusCircle
                onClick={handleAddToList}
                className="text-2xl text-[#C8CFA0] hover:text-blue-500 dark:hover:text-blue-500"
              />
            ) : (
              <BsPatchPlusFill
                onClick={handleAddToList}
                className="text-2xl text-[#78ABA8] hover:text-blue-500"
              />
            )} */}
          </span>
        </CardFooter>
      </Card>
    </>
  );
};
