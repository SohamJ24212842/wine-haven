// Database operations for promotional media
// Uses Supabase with fallback to empty array
import { createServerClient, createAdminClient } from '@/lib/supabase';

// Check if Supabase is configured
const USE_SUPABASE = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export type PromotionalMedia = {
	id: string;
	type: "video" | "image";
	url: string;
	thumbnail?: string;
	title?: string;
	description?: string;
	order: number;
	active: boolean;
	created_at?: string;
	updated_at?: string;
};

// Map database row to PromotionalMedia type
function mapRowToMedia(row: any): PromotionalMedia {
	return {
		id: row.id,
		type: row.type,
		url: row.url,
		thumbnail: row.thumbnail || undefined,
		title: row.title || undefined,
		description: row.description || undefined,
		order: row.order || 0,
		active: row.active !== false, // Default to true
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
}

// Map PromotionalMedia to database row
function mapMediaToRow(media: Partial<PromotionalMedia>): any {
	return {
		type: media.type,
		url: media.url,
		thumbnail: media.thumbnail || null,
		title: media.title || null,
		description: media.description || null,
		order: media.order ?? 0,
		active: media.active !== false,
	};
}

// Get all promotional media
export async function getAllPromotionalMedia(): Promise<PromotionalMedia[]> {
	if (USE_SUPABASE) {
		const supabase = createServerClient();
		if (supabase) {
			try {
				const { data, error } = await supabase
					.from('promotional_media')
					.select('*')
					.order('order', { ascending: true });

				if (!error && data) {
					return data.map(mapRowToMedia);
				}
			} catch (error) {
				console.error('Error fetching promotional media from Supabase:', error);
			}
		}
	}

	// Return empty array if no database
	return [];
}

// Create promotional media (admin only)
export async function createPromotionalMedia(media: Partial<PromotionalMedia>): Promise<PromotionalMedia> {
	if (USE_SUPABASE) {
		const supabase = createAdminClient();
		if (supabase) {
			try {
				const row = mapMediaToRow(media);
				const { data, error } = await supabase
					.from('promotional_media')
					.insert(row)
					.select()
					.single();

				if (error) {
					throw new Error(`Failed to create promotional media: ${error.message}`);
				}

				if (!data) {
					throw new Error('No data returned from database');
				}

				return mapRowToMedia(data);
			} catch (error: any) {
				console.error('Error in createPromotionalMedia:', error);
				throw error;
			}
		}
	}

	throw new Error('Supabase not configured. Please set up Supabase to manage promotional media.');
}

// Update promotional media (admin only)
export async function updatePromotionalMedia(id: string, media: Partial<PromotionalMedia>): Promise<PromotionalMedia> {
	if (USE_SUPABASE) {
		const supabase = createAdminClient();
		if (supabase) {
			try {
				const row = mapMediaToRow(media);
				const { data, error } = await supabase
					.from('promotional_media')
					.update(row)
					.eq('id', id)
					.select()
					.single();

				if (error) {
					throw new Error(`Failed to update promotional media: ${error.message}`);
				}

				if (!data) {
					throw new Error('No data returned from database');
				}

				return mapRowToMedia(data);
			} catch (error: any) {
				console.error('Error in updatePromotionalMedia:', error);
				throw error;
			}
		}
	}

	throw new Error('Supabase not configured.');
}

// Delete promotional media (admin only)
export async function deletePromotionalMedia(id: string): Promise<void> {
	if (USE_SUPABASE) {
		const supabase = createAdminClient();
		if (supabase) {
			const { error } = await supabase
				.from('promotional_media')
				.delete()
				.eq('id', id);

			if (error) {
				throw new Error(`Failed to delete promotional media: ${error.message}`);
			}
			return;
		}
	}

	throw new Error('Supabase not configured.');
}

