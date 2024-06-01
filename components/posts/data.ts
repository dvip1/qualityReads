export interface categoryTypes {
    label: string
    value: string
    description: string
}
export const primaryCategory: categoryTypes[] = [
    {
        label: "Lifestyle",
        value: "lifestyle",
        description: "Articles about daily living, wellness, and more."
    },
    {
        label: "Hobbies & Interests",
        value: "hobbies_interests",
        description: "Activities and topics people are passionate about."
    },
    {
        label: "Learning & Self-Improvement",
        value: "learning_self_improvement",
        description: "Content aimed at personal growth and education."
    }
];

export const lifestyle: categoryTypes[] = [
    {
        label: "Food & Drink",
        value: "food_drink",
        description: "Recipes, restaurant reviews, food trends, healthy eating tips."
    },
    {
        label: "Fashion & Beauty",
        value: "fashion_beauty",
        description: "Outfit inspiration, makeup tutorials, product reviews, sustainable fashion."
    },
    {
        label: "Travel",
        value: "travel",
        description: "Destination guides, travel tips, budget travel hacks, adventure travel."
    },
    {
        label: "Home & Garden",
        value: "home_garden",
        description: "DIY projects, interior design inspiration, gardening tips, sustainable living."
    },
    {
        label: "Wellness",
        value: "wellness",
        description: "Mental health, fitness routines, self-care practices, healthy habits."
    }
];

export const hobbies: categoryTypes[] = [
    {
        label: "Gaming",
        value: "gaming",
        description: "Reviews, walkthroughs, esports news, discussions on specific games or genres."
    },
    {
        label: "Music",
        value: "music",
        description: "Artist profiles, music history, genre explorations, concert reviews."
    },
    {
        label: "Art & Creativity",
        value: "art_creativity",
        description: "Drawing tutorials, photography tips, writing prompts, DIY crafts."
    },
    {
        label: "Movies & TV Shows",
        value: "movies_tv_shows",
        description: "Reviews, recommendations, behind-the-scenes content, analysis."
    },
    {
        label: "Sports",
        value: "sports",
        description: "Game recaps, athlete profiles, fantasy sports advice, discussions on specific sports."
    }
];

export const SelfImprovement: categoryTypes[] = [
    {
        label: "Productivity",
        value: "productivity",
        description: "Time management tips, organization hacks, app reviews, goal setting strategies."
    },
    {
        label: "Business & Finance",
        value: "business_finance",
        description: "Personal finance advice, entrepreneurship tips, career development, investing guides."
    },
    {
        label: "Science & Technology",
        value: "science_technology",
        description: "Scientific discoveries explained, technology trends, future predictions, gadget reviews."
    },
    {
        label: "History & Current Events",
        value: "history_current_events",
        description: "Historical deep dives, analysis of current events, social justice issues."
    },
    {
        label: "Personal Development",
        value: "personal_development",
        description: "Self-reflection prompts, relationship advice, communication skills, mindfulness practices."
    }
];
