# Analytics & Dashboard Setup Guide

## 📋 Prerequisites

- Vercel account (for Postgres and Cron Jobs)
- Node.js and pnpm installed

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

This will install the newly added dependencies:

- `jose` - JWT authentication
- `recharts` - Charts and data visualization

### 2. Set Up Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to "Storage" → "Create Database" → "Postgres"
3. Copy the `POSTGRES_URL` connection string

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
POSTGRES_URL=your_vercel_postgres_url_here

# Admin Authentication
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_here

# Optional: Cron Job Security
CRON_SECRET=your_cron_secret_here

# Optional: Site URL (for API calls)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Security Notes:**

- Use a strong password for `ADMIN_PASSWORD`
- Generate a random string for `JWT_SECRET` (at least 32 characters)
- `CRON_SECRET` is optional but recommended for production

### 4. Run Database Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate

# Push schema to database
pnpm drizzle-kit push
```

Alternatively, you can use:

```bash
pnpm drizzle-kit migrate
```

### 5. Test Locally

```bash
pnpm dev
```

Visit:

- Homepage: `http://localhost:3000` (see stats and popular posts)
- Blog post: `http://localhost:3000/blog/[slug]` (see view count)
- Admin login: `http://localhost:3000/admin`
- Admin dashboard: `http://localhost:3000/admin/dashboard`

### 6. Deploy to Vercel

```bash
vercel
```

Or push to your connected GitHub repository to trigger automatic deployment.

## 📊 Features Implemented

### Public Features (Visible to Readers)

1. **View Counter on Blog Posts**
   - Shows total views on each article
   - Located in the post metadata section

2. **Popular Posts Widget**
   - Displays top 5 most-viewed articles
   - Shown on the homepage

3. **Site Statistics**
   - Total views, articles, and unique visitors
   - Displayed on the homepage

### Admin Features (Protected Routes)

1. **Admin Dashboard** (`/admin/dashboard`)
   - Overview cards: Today's views, weekly views, total stats
   - 30-day trend chart
   - Top 20 popular posts chart
   - Top 10 traffic sources chart
   - Real-time recent visits table
   - Auto-refresh every 30 seconds

2. **Authentication System**
   - Simple password-based login
   - JWT token stored in httpOnly cookie
   - 7-day session duration
   - Protected routes via middleware

### Backend Infrastructure

1. **Database Schema**
   - `page_views` table: Raw visit data
   - `post_stats` table: Aggregated statistics

2. **API Endpoints**
   - `POST /api/analytics/track` - Record page views
   - `GET /api/analytics/stats` - Public statistics (cached 5 minutes)
   - `GET /api/admin/analytics` - Detailed analytics (admin only)
   - `POST /api/admin/login` - Admin authentication
   - `POST /api/admin/logout` - Admin logout
   - `GET /api/cron/aggregate-stats` - Data aggregation (cron job)

3. **Performance Optimizations**
   - Edge Runtime for tracking API (low latency)
   - ISR caching for public stats (5-minute revalidate)
   - Separate tables for raw data and aggregated stats
   - Anti-spam protection (1-minute cooldown per visitor)

4. **Privacy Protection**
   - IP addresses are SHA-256 hashed
   - Visitor IDs are randomly generated UUIDs
   - No personal identifiable information collected

## 🔧 Configuration

### Cron Job Schedule

The data aggregation cron job runs every hour. To change the schedule, edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/aggregate-stats",
      "schedule": "0 * * * *" // Every hour
    }
  ]
}
```

Schedule format (cron expression):

- `0 * * * *` - Every hour
- `0 */6 * * *` - Every 6 hours
- `0 0 * * *` - Daily at midnight

### Cache Configuration

Public stats API cache duration is 5 minutes. To adjust, edit `app/api/analytics/stats/route.ts`:

```typescript
export const revalidate = 300 // Change to desired seconds
```

## 🛠️ Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify `POSTGRES_URL` is correct
2. Check Vercel Postgres is active
3. Ensure your IP is not blocked (Vercel Postgres allows all by default)

### Migration Errors

If migrations fail:

```bash
# Reset and try again
rm -rf drizzle
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

### Cron Job Not Running

Cron jobs only work on Vercel (not locally). To test locally:

```bash
curl http://localhost:3000/api/cron/aggregate-stats
```

In production, monitor cron executions in Vercel dashboard → Logs.

### Admin Login Not Working

1. Check `ADMIN_PASSWORD` and `JWT_SECRET` are set
2. Clear browser cookies
3. Try incognito/private mode
4. Check browser console for errors

## 📈 Next Steps

### Optional Enhancements

1. **Add More Charts**
   - Device type distribution
   - Browser statistics
   - Geographic data (requires IP geolocation service)

2. **Export Data**
   - CSV export for analytics
   - PDF reports

3. **Email Notifications**
   - Weekly summary emails
   - Alert for traffic spikes

4. **Advanced Features**
   - A/B testing
   - Conversion tracking
   - User flow analysis

### Scaling Considerations

For high-traffic blogs:

1. Use Vercel KV for caching hot data
2. Implement request rate limiting
3. Consider upgrading Postgres plan
4. Use Vercel Edge Config for feature flags

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Review Vercel function logs
3. Verify environment variables are set correctly
4. Ensure database migrations ran successfully

## 🔒 Security Checklist

- [ ] Set a strong `ADMIN_PASSWORD`
- [ ] Generate a random `JWT_SECRET` (32+ characters)
- [ ] Add `CRON_SECRET` for production
- [ ] Enable HTTPS in production (automatic on Vercel)
- [ ] Review and update `middleware.ts` as needed
- [ ] Regularly update dependencies

---

**Congratulations!** Your analytics system is now set up and ready to track your blog's performance! 🎉
