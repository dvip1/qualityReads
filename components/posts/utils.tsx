export const parseHashtags = (text: string) => {
    const hashtagRegex = /#\w+/g;
    const hashtags = text.match(hashtagRegex);
    return hashtags ? hashtags.map((hashtag, index) =>
        <span key={index} className="bg-blue-200 rounded-full px-2 py-1 m-1 text-blue-700">
            {hashtag}
        </span>
    ) : null;
}
export const getHashtagsArray = (text: string) => {
    const hashtagRegex = /#\w+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches : [];
}