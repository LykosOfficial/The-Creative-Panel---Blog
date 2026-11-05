import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Newest first. */
export function sortByDate(posts: Post[]) {
	return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Minutes to read, at ~230 words per minute. */
export function readingTime(post: Post) {
	const words = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 230));
}

/** Every tag used across posts, alphabetical. */
export function allTags(posts: Post[]) {
	return [...new Set(posts.flatMap((p) => p.data.tags))].sort();
}

/** Search snippet: the post's description, or its opening text trimmed to ~155 characters. */
export function seoDescription(post: Post) {
	if (post.data.description) return post.data.description;
	const text = (post.body ?? '')
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images → their text
		.replace(/[#>*_`~|-]+/g, ' ') // Markdown symbols
		.replace(/\s+/g, ' ')
		.trim();
	return text.length > 155 ? text.slice(0, 152).replace(/\s+\S*$/, '') + '…' : text;
}

export const wordCount = (post: Post) => (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;

export function formatDate(date: Date) {
	// UTC: publish dates are stored as midnight UTC, so local time zones would show the day before
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
