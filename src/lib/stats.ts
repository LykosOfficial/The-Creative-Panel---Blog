// View + like counts per post, loaded from services/api at BUILD time.
//   GET {PUBLIC_API_URL}/posts/stats → { "first-post": { "views": 523, "likes": 83 }, ... }
// Until that route exists (or PUBLIC_API_URL is unset) every count is 0, and the
// homepage falls back to newest-first ordering with dates instead of numbers.
// The site is rebuilt on publish, so counts refresh then.

export type PostStats = { views: number; likes: number };

let cache: Promise<Record<string, PostStats>> | undefined;

async function load(): Promise<Record<string, PostStats>> {
	const api = import.meta.env.PUBLIC_API_URL;
	if (!api) return {};
	try {
		const res = await fetch(`${api}/posts/stats`, { signal: AbortSignal.timeout(5000) });
		return res.ok ? await res.json() : {};
	} catch {
		return {};
	}
}

/** All counts, fetched once per build and shared by every page/component. */
export function getAllStats() {
	cache ??= load();
	return cache;
}

export async function getStats(slug: string): Promise<PostStats> {
	return (await getAllStats())[slug] ?? { views: 0, likes: 0 };
}
