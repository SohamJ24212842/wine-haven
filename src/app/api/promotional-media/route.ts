// API route for promotional media (GET all, POST create)
import { NextRequest, NextResponse } from 'next/server';
import { getAllPromotionalMedia, createPromotionalMedia } from '@/lib/db/promotional-media';

export async function GET() {
  try {
    const media = await getAllPromotionalMedia();
    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching promotional media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotional media' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.type || !['video', 'image'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be "video" or "image"' },
        { status: 400 }
      );
    }

    if (!body.url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const created = await createPromotionalMedia(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Error creating promotional media:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create promotional media' },
      { status: 500 }
    );
  }
}

