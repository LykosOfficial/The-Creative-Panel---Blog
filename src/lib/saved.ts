// Saved posts ("read later"): the Save button stores post ids in this browser's localStorage
// (see reactions.ts). This turns those ids into titles and links using /search.json,
// the site's list of every post. Nothing leaves the reader's device.
import { toggle } from './reactions';

export interface SavedPost {
	id: string;
	title: string;
	url: string;
	category: string;
	date: string;
}

type SearchEntry = { title: string; url: string; category: string; date: string };
let index: Promise<SearchEntry[]> | null = null;
const loadIndex = () => (index ??= fetch('/search.json').then((r) => (r.ok ? r.json() : [])).catch(() => []));

/** Ids saved in this browser, newest first */
export function savedIds(): string[] {
	try {
		return (JSON.parse(localStorage.getItem('savedPosts') ?? '[]') as string[]).slice().reverse();
	} catch {
		return [];
	}
}

/** Saved posts with titles, newest first. Posts that no longer exist are skipped. */
export async function loadSavedPosts(): Promise<SavedPost[]> {
	const ids = savedIds();
	if (ids.length === 0) return [];
	const byId = new Map((await loadIndex()).map((e) => [e.url.replace(/^\/blog\/|\/$/g, ''), e]));
	return ids.flatMap((id) => {
		const e = byId.get(id);
		return e ? [{ id, ...e }] : [];
	});
}

/** Remove a post from this browser's saved list (the post page's Save button updates too). */
export const unsave = (id: string) => toggle('save', id);

/** Run fn whenever a post is saved or unsaved (this tab or another). Returns a function that stops listening. */
export function onSavedChange(fn: () => void) {
	window.addEventListener('post-reactions-change', fn); // same event reactions.ts sends
	window.addEventListener('storage', fn);
	return () => {
		window.removeEventListener('post-reactions-change', fn);
		window.removeEventListener('storage', fn);
	};
}
