# QualityReads

QualityReads is a website where you can share & find your favorite content, whether it be a website, video, or audio.

[Live Link](https://quality-reads-tau.vercel.app/)

## Features

- **Like a post**: View all liked and disliked posts in your profile. 👍
- **Customize your profile**: Change themes and settings to personalize your experience. 🎨
- **Add posts to a list**: Save posts for later viewing. 📋
- **Share posts**: Easily share posts with friends. 📤
- **Hashtags**: Click on hashtags to find related posts (feature coming soon). 🔗
- **User profiles**: View all posts by clicking on a profile or username. 👤
- **Trending**: Explore trending posts and hashtags. 📈
- **Notifications**: Receive notifications when someone likes your posts. 🔔
- **Profile menu**: Access settings, log out, notifications, and your list by clicking your profile at the top. ⚙️

## Technology Stack

- **Frontend**: Next.js 14 app router
- **Database**: MongoDB
- **Cache/Queue**: Redis (for storing trending items and notifications)

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `AUTH_GOOGLE_ID`: Google OAuth Client ID
- `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret
- `AUTH_SECRET`: Secret for NextAuth
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URI`: Redis connection string
- `SERVER_PROTOCOL`: `http` or `https`
- `SERVER_HOST`: Server host address
- `ABLY_API_KEY`: Ably API key for real-time notifications

## Contribution

We welcome contributions! Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

Thank you for contributing to QualityReads!