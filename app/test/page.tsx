"use client"
import { Textarea } from "@nextui-org/react"
import { useState } from "react";

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
    const [text, setText] = useState("");
    console.log(getHashtagsArray(text));
    return (
        <>
            <Textarea
                label="Description"
                placeholder="Enter your description"
                className="max-w-xs"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex flex-wrap">
                {parseHashtags(text)}
            </div>
        </>
    )
}