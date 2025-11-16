// API route for individual promotional media (PUT update, DELETE)
import { NextRequest, NextResponse } from 'next/server';
import { updatePromotionalMedia, deletePromotionalMedia } from '@/lib/db/promotional-media';

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const updated = await updatePromotionalMedia(id, body);
		return NextResponse.json(updated);
	} catch (error: any) {
		console.error('Error updating promotional media:', error);
		return NextResponse.json(
			{ error: error.message || 'Failed to update promotional media' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		await deletePromotionalMedia(id);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error('Error deleting promotional media:', error);
		return NextResponse.json(
			{ error: error.message || 'Failed to delete promotional media' },
			{ status: 500 }
		);
	}
}

