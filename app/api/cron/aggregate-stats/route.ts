import { NextResponse } from 'next/server'

import { aggregateStats } from '@/lib/db/queries'

// Vercel Cron Job endpoint
export async function GET(request: Request) {
  try {
    // Verify cron secret (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting stats aggregation...')
    const result = await aggregateStats()

    if (result.success) {
      console.log('Stats aggregation completed successfully')
      return NextResponse.json({ success: true, message: 'Stats aggregated' }, { status: 200 })
    } else {
      console.error('Stats aggregation failed:', result.error)
      return NextResponse.json({ success: false, error: 'Aggregation failed' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in aggregate-stats cron:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
