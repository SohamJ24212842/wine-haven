export function toSlug(input: string): string {
	return input
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * Prefer using a real stored slug, but if it looks like a name (spaces, etc),
 * normalize it to a URL-safe slug.
 */
export function normalizeSlugForHref(slug: string): string {
	const trimmed = slug.trim();
	if (!trimmed) return "";
	// If it contains whitespace, it's almost certainly not a canonical slug.
	if (/\s/.test(trimmed)) return toSlug(trimmed);
	return trimmed;
}

