# Better X - Twitter/X MVP Clone

A simple MVP clone of X (formerly Twitter) built with Next.js, TypeScript, and shadcn/ui.

## Features

- ✍️ Create and post tweets (280 character limit)
- ❤️ Like and repost tweets
- 👥 Follow/unfollow users
- 📱 Timeline feed (For You & Following tabs)
- 👤 User profiles with followers/following counts
- 🔥 Trending topics sidebar
- 💬 Real-time interactions

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `app/page.tsx` - Main application page with all features
- `lib/mock-data.ts` - In-memory data store for tweets, users, and interactions
- `components/ui/` - shadcn/ui components

## Notes

- Uses in-memory mock data (no database)
- All data persists during the session
- Single-page application architecture
