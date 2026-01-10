# Analytics Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Set Up Environment Variables

Create `.env.local`:

```env
POSTGRES_URL=postgres://username:password@host:5432/database
ADMIN_PASSWORD=mysecurepassword123
JWT_SECRET=your-random-32-char-secret-here
```

### Step 3: Run Database Migrations

```bash
pnpm drizzle-kit push
```

### Step 4: Start Development Server

```bash
pnpm dev
```

### Step 5: Access the System

- **Homepage**: http://localhost:3000 (view stats)
- **Admin Login**: http://localhost:3000/admin (use `ADMIN_PASSWORD`)
- **Dashboard**: http://localhost:3000/admin/dashboard

---

## 📊 What You Get

### For Readers

✅ View count on every blog post  
✅ Popular posts list on homepage  
✅ Site statistics (total views, posts, visitors)

### For Admin

✅ Real-time dashboard with charts  
✅ 30-day trend analysis  
✅ Popular posts ranking  
✅ Traffic sources breakdown  
✅ Recent visits table

---

## 🔧 Key Files

### Database

- `lib/db/schema.ts` - Database tables
- `lib/db/queries.ts` - Query functions

### APIs

- `app/api/analytics/track/route.ts` - Track views
- `app/api/analytics/stats/route.ts` - Public stats
- `app/api/admin/analytics/route.ts` - Admin data

### Components

- `components/analytics/page-view-tracker.tsx` - Client-side tracker
- `components/analytics/popular-posts.tsx` - Popular widget
- `components/analytics/site-stats.tsx` - Stats cards
- `components/admin/analytics-charts.tsx` - Dashboard charts

### Admin

- `app/admin/page.tsx` - Login page
- `app/admin/dashboard/page.tsx` - Dashboard
- `middleware.ts` - Route protection

---

## 🛠️ Common Commands

```bash
# Install dependencies
pnpm install

# Generate migrations
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit push

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🔐 Security Notes

⚠️ **Never commit `.env.local` to git**  
⚠️ Use strong passwords for `ADMIN_PASSWORD`  
⚠️ Generate a random `JWT_SECRET` (min 32 characters)  
⚠️ In production, add `CRON_SECRET` for cron job security

---

## 📈 Performance Features

✅ **Edge Runtime** - Fast tracking API  
✅ **ISR Caching** - 5-minute cache for public stats  
✅ **Aggregated Data** - Separate tables for raw/summary data  
✅ **Anti-Spam** - 1-minute cooldown per visitor  
✅ **Efficient Queries** - Indexed database columns

---

## 🐛 Troubleshooting

### Can't connect to database?

→ Check `POSTGRES_URL` in `.env.local`

### Admin login fails?

→ Verify `ADMIN_PASSWORD` and `JWT_SECRET` are set

### Stats not updating?

→ Run the aggregation manually: `curl http://localhost:3000/api/cron/aggregate-stats`

### Cron job not working?

→ Cron jobs only work on Vercel, not locally

---

## 📞 Need Help?

Check the full setup guide: `ANALYTICS_SETUP.md`
