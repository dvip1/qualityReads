# QualityReads

QualityReads is a website where you can share & find your favorite content, whether it be a website, video, or audio.

[Live Link](https://reads.client.dvippatel.in)

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

- **Frontend**: Next.js 15 app router, React 18, NextUI, Tailwind
- **Auth**: Auth.js (NextAuth v5) with Google, database-backed sessions
- **Database**: MongoDB
- **Store/Queue**: Redis — trending rankings and notifications (durable, not a cache)
- **Realtime**: Server-Sent Events over Redis pub/sub, no third-party service

## Running with Docker

The whole stack runs from one compose file:

```bash
cp .env.example .env    # fill in secrets
docker compose up -d --build
```

See [DEPLOY.md](./DEPLOY.md) for the full guide: reverse-proxy configuration
(the notification stream needs buffering disabled), Google OAuth setup, backups,
and restoring an existing database.

## Running locally without Docker

You still need MongoDB and Redis reachable. `npm run build` itself needs neither —
both clients connect lazily — so only `npm run dev` and `npm start` require them.

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file (see [`.env.example`](./.env.example)):

- `MONGODB_URI`: MongoDB connection string. Must include the database name in the
  path, e.g. `mongodb://user:pass@host:27017/QualityReads?authSource=admin`
- `REDIS_URI`: Redis **hostname** (not a `redis://` URL)
- `REDIS_PORT`: defaults to `6379`
- `REDIS_PASSWORD`: optional
- `AUTH_SECRET`: `openssl rand -base64 32`
- `AUTH_URL`: public base URL, e.g. `https://reads.client.dvippatel.in`
- `AUTH_GOOGLE_ID`: Google OAuth Client ID
- `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret

## Contribution

We welcome contributions! Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

Thank you for contributing to QualityReads!