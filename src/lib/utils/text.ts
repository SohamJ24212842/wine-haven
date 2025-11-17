/**
 * Normalize text by removing diacritics (accents) and converting to lowercase
 * Example: "Côtes du Rhône" -> "cotes du rhone"
 */
export function normalizeText(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '');
}

/**
 * Convert text to a URL-friendly slug
 * - Removes diacritics
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters (keeps only alphanumeric and hyphens)
 * Example: "Côtes du Rhône 2020!" -> "cotes-du-rhone-2020"
 */
export function slugify(text: string): string {
	return normalizeText(text)
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, '') // Remove special characters (keep only word chars and hyphens)
		.replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
		.replace(/^-+/, '') // Remove leading hyphens
		.replace(/-+$/, ''); // Remove trailing hyphens
}

