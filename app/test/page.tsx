"use client"
import { Textarea } from "@nextui-org/react"
import { useEffect, useState } from "react";
import FetchReadingList from "@/utils/fetchReadingList";
import ProtectedRoute from "@/utils/protectedRoute";
const parseHashtags = (text: string) => {
    const hashtagRegex = /#\w+/g;
    const hashtags = text.match(hashtagRegex);
    return hashtags ? hashtags.map((hashtag, index) =>
        <span key={index} className="bg-blue-200 rounded-full px-2 py-1 m-1 text-blue-700">
            {hashtag}
        </span>
    ) : null;
}

const getHashtagsArray = (text: string) => {
    const hashtagRegex = /#\w+/g;
    return text.match(hashtagRegex);
}

export default function Test() {
    const handleClick = async () => {
        const readingList = await FetchReadingList({ page: 1, limit: 15 });
        console.log(readingList);
    }
    const [text, setText] = useState("");
    console.log(getHashtagsArray(text));
    return (
        <ProtectedRoute>
            <Textarea
                label="Description"
                placeholder="Enter your description"
                className="max-w-xs"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleClick}>Click</button>
            <div className="flex flex-wrap">
                {parseHashtags(text)}
            </div>
        </ProtectedRoute>
    )
}