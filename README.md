# SodaSupply

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/andrewslifkin/v0-eazle)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/NRTMfIYs7r3)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/andrewslifkin/v0-eazle](https://vercel.com/andrewslifkin/v0-eazle)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/NRTMfIYs7r3](https://v0.dev/chat/projects/NRTMfIYs7r3)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Database Setup

This project uses Supabase as its database. To set up the database:

1. Create a Supabase account at [supabase.com](https://supabase.com) if you don't have one
2. Create a new project
3. Navigate to the SQL Editor in your Supabase dashboard
4. Run the SQL script in `scripts/db/init.sql` to create the necessary tables
5. Copy your project URL and anon key from the API settings page
6. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Environment Variables

The following environment variables need to be set in your `.env.local` file:

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anonymous key |
