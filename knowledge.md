# Matikiri Music Service API

## Project Overview

This is a music service API built with Elysia.js and Bun, featuring:
- Album management with pagination and search
- Artist and song relationships
- Database operations using Drizzle ORM with PostgreSQL
- Redis for caching

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis (ioredis)
- **Image Processing**: Sharp

## Database Schema

- `artists` - Artist information
- `albums` - Albums linked to artists
- `songs` - Songs linked to albums with count fields (viewCount, playCount, downloadCount)
- `playlists` - User playlists
- `playlist_songs` - Many-to-many relationship between playlists and songs
- Analytics tables: `song_views`, `song_plays`, `song_downloads`, `album_views`
- Database triggers auto-increment count fields when analytics records inserted

## Development

- Use `bun dev` to start development server with hot reload
- Database migrations handled by Drizzle Kit
- Path alias `~/*` maps to project root

## API Patterns

- Use pagination helpers from `utils/helpers/paginate.ts`
- Validation schemas in `utils/plugins/validators/general.ts`
- Database plugin provides `DB.Postgres` and `DB.Redis` decorators
- Routes organized by feature (albums, etc.)

## File Structure

- `src/` - Main application code
- `utils/` - Shared utilities, plugins, and helpers
- `storage/` - File storage (gitignored)
- Environment variables required (see .env-example)
