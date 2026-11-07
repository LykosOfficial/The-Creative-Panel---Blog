// Tags and categories: each one gets a page listing its posts.
//   /tags/<slug>/        e.g. /tags/the-halo/      (a post can have several tags)
//   /categories/<slug>/  e.g. /categories/writing/ (a post has one category)
// Both are typed in the admin.
import type { Post } from './posts';

/** A tag/category page only goes into Google once it has this many posts (thin pages hurt more than help). */
export const MIN_POSTS_TO_INDEX = 3;

/** URL-safe version: "Writing Life" / "writing-life" → "writing-life" */
export const termSlug = (term: string) =>
	term
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs']);

/** Readable name: "the-halo" → "The Halo", "writing-life" → "Writing Life", "art-of-war" → "Art of War" */
export const termLabel = (term: string) =>
	term
		.replace(/[-_]+/g, ' ')
		.trim()
		.split(/\s+/)
		.map((w, i) => (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
		.join(' ');

export const tagUrl = (tag: string) => `/tags/${termSlug(tag)}/`;
export const categoryUrl = (category: string) => `/categories/${termSlug(category)}/`;

export interface Term {
	slug: string;
	label: string;
	posts: Post[];
}

/** Group posts by term, most-used first (ties: alphabetical). Terms that only differ in spelling/case share a page. */
function group(posts: Post[], termsOf: (p: Post) => string[]): Term[] {
	const map = new Map<string, Term>();
	for (const post of posts) {
		for (const term of new Set(termsOf(post).map(termSlug).filter(Boolean))) {
			const info = map.get(term) ?? { slug: term, label: termLabel(term), posts: [] };
			info.posts.push(post);
			map.set(term, info);
		}
	}
	return [...map.values()].sort((a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label));
}

export const tagIndex = (posts: Post[]) => group(posts, (p) => p.data.tags);
export const categoryIndex = (posts: Post[]) => group(posts, (p) => (p.data.category ? [p.data.category] : []));
