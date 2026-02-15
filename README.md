# Smart Bookmark

A simple bookmark manager with Google sign-in. Save and organize your links in one place, with real-time sync across browser tabs.

## Features

- **Google OAuth** – Sign up and log in with Google only
- **Add bookmarks** – URL + title
- **Private per user** – Row Level Security ensures User A cannot see User B’s bookmarks
- **Real-time updates** – Bookmark list updates without refresh (e.g. add in one tab, it appears in another)
- **Delete bookmarks** – Remove your own bookmarks
- **Deployable on Vercel** – Live URL with correct OAuth redirect

## Tech stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Supabase** – Auth (Google OAuth) + Postgres + Realtime
- **Tailwind CSS 4**
- **Sonner** – Toast notifications

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with Google OAuth configured
- Supabase env vars (see below)

## Setup

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd smart-bookmark-app
   npm install
   ```

2. **Environment variables**

   Create `.env.local` in the project root:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

   Optional for production (e.g. Vercel): set `NEXT_PUBLIC_APP_URL` to your live URL (e.g. `https://your-app.vercel.app`) if you need a fixed OAuth redirect base.

3. **Supabase database**

   In the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql), run the migrations in order:

   - `supabase/migrations/001_create_bookmarks.sql` – creates `bookmarks` table and RLS policies
   - `supabase/migrations/002_enable_realtime_bookmarks.sql` – adds `bookmarks` to the realtime publication

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Sign in with Google and add bookmarks from the dashboard.

## Deploy on Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Project Settings → Environment Variables.
3. In Supabase Dashboard → Authentication → URL Configuration, add your Vercel URL (e.g. `https://your-app.vercel.app`) to **Redirect URLs**.
4. Deploy. The app uses `window.location.origin` for the OAuth redirect, so the live URL works without extra config.

---

## Problems I ran into and how I solved them

### 1. **404 / “Could not find the table 'public.bookmarks'” (PGRST205)**

**Problem:** After implementing the “add bookmark” flow, the Supabase REST API returned `404` and the JSON error: `"Could not find the table 'public.bookmarks' in the schema cache"`. The table had not been created in the database.

**Solution:** I added a SQL migration that creates the `bookmarks` table with columns `id`, `user_id`, `title`, `url`, `created_at`, and enabled Row Level Security (RLS) so each user can only access their own rows. Running this migration in the Supabase SQL Editor fixed the 404. The migration lives in `supabase/migrations/001_create_bookmarks.sql`.

### 2. **Bookmark list not updating in other tabs (real-time requirement)**

**Problem:** The requirement was that if you open two tabs and add a bookmark in one, it should appear in the other without refreshing. The app only fetched bookmarks on load and after each add/delete in the same tab.

**Solution:** I used Supabase Realtime: the dashboard subscribes to Postgres changes on the `bookmarks` table with a filter on `user_id` so we only receive events for the current user. On any insert/update/delete, the app refetches the list so the UI stays in sync across tabs. I also had to add the `bookmarks` table to the `supabase_realtime` publication via a second migration (`002_enable_realtime_bookmarks.sql`); otherwise no events are emitted.

### 3. **Google OAuth redirect breaking on production (Vercel)**

**Problem:** The OAuth redirect URL was hardcoded to `http://localhost:3000/dashboard`. After deploying to Vercel, sign-in would redirect back to localhost instead of the live app.

**Solution:** I changed the redirect to use `window.location.origin` when in the browser, so it automatically uses the current site (e.g. `https://your-app.vercel.app`). I kept a fallback to `NEXT_PUBLIC_APP_URL` or `http://localhost:3000` for edge cases. I also added the Vercel URL to Supabase’s allowed Redirect URLs in Authentication settings.

### 4. **Making sure users only see their own bookmarks**

**Problem:** The app must guarantee that User A cannot see User B’s bookmarks. Relying only on client-side filtering would be unsafe.

**Solution:** I enforced this in the database with RLS. The migration defines policies so that `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on `bookmarks` are only allowed when `auth.uid() = user_id`. The Supabase client sends the user’s JWT, so the database restricts all operations to that user’s rows. The UI doesn’t need to filter by `user_id`; the backend does it.

---

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs) – Auth, Database, Realtime