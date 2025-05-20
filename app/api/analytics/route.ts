import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for events (in production, you'd use a database)
let analyticsEvents: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.events || !Array.isArray(data.events)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }
    
    // Store events
    analyticsEvents = [...analyticsEvents, ...data.events];
    
    // In production, you might:
    // 1. Store in a database
    // 2. Send to a third-party analytics service
    // 3. Process events for real-time dashboards
    
    console.log(`Received ${data.events.length} events. Total stored: ${analyticsEvents.length}`);
    
    return NextResponse.json({ success: true, count: data.events.length });
  } catch (error) {
    console.error('Error processing analytics events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to view stored events (for demo purposes only)
export async function GET() {
  // In production, you'd want authentication here
  return NextResponse.json({ events: analyticsEvents });
} 