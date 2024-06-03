interface SlugToTitleType {
    [key: string]: string;
    "food-drink": string;
    "fashion-beauty": string;
    "travel": string;
    "home-garden": string;
    "wellness": string;
    "gaming": string;
    "music": string;
    "art-creativity": string;
    "movies-tv-shows": string;
    "sports": string;
    "productivity": string;
    "business-finance": string;
    "science-technology": string;
    "history-current-events": string;
    "personal-development": string;
}
const SlugToTitle: SlugToTitleType = {
    "food-drink": "Food & Drink",
    "fashion-beauty": "Fashion & Beauty",
    "travel": "Travel",
    "home-garden": "Home & Garden",
    "wellness": "Wellness",
    "gaming": "Gaming",
    "music": "Music",
    "art-creativity": "Art & Creativity",
    "movies-tv-shows": "Movies & TV Shows",
    "sports": "Sports",
    "productivity": "Productivity",
    "business-finance": "Business & Finance",
    "science-technology": "Science & Technology",
    "history-current-events": "History & Current Events",
    "personal-development": "Personal Development"
};
const SlugUrl = [
    "food-drink",
    "fashion-beauty",
    "travel",
    "home-garden",
    "wellness",
    "gaming",
    "music",
    "art-creativity",
    "movies-tv-shows",
    "sports",
    "productivity",
    "business-finance",
    "science-technology",
    "history-current-events",
    "personal-development"
]

export { SlugToTitle, SlugUrl };