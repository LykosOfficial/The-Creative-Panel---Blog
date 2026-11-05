// Like + Save for posts.
//  - Whether *this visitor* liked/saved a post lives in localStorage.
//  - The public like count comes from services/api (live on the post page).
// Shared by the phone action bar and the desktop "Did you enjoy this piece?" bar,
// so clicking either one updates both.

import { paintStats } from './liveStats';

type Kind = 'like' | 'save';
const KEYS: Record<Kind, string> = { like: 'likedPosts', save: 'savedPosts' };
const EVENT = 'post-reactions-change';

const API = import.meta.env.PUBLIC_API_URL ?? '';

/** Live like counts from the API, once loaded. */
const liveLikes = new Map<string, number>();
const started = new Set<string>();

function read(kind: Kind): string[] {
	try {
		return JSON.parse(localStorage.getItem(KEYS[kind]) ?? '[]');
	} catch {
		return [];
	}
}
const emit = () => window.dispatchEvent(new CustomEvent(EVENT));

export function isOn(kind: Kind, postId: string) {
	return read(kind).includes(postId);
}

/**
 * Like count to display. Uses the live API count when we have it;
 * otherwise the count baked in at build time plus this visitor's own like.
 */
export function likeCount(postId: string, buildCount = 0) {
	return liveLikes.get(postId) ?? buildCount + (isOn('like', postId) ? 1 : 0);
}

async function api(path: string, body?: unknown) {
	if (!API) return null;
	try {
		const res = await fetch(`${API}/posts/${path}`, {
			method: body === undefined ? 'GET' : 'POST',
			headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
			body: body === undefined ? undefined : JSON.stringify(body),
		});
		return res.ok ? ((await res.json()) as { views: number; likes: number }) : null;
	} catch {
		return null;
	}
}

/**
 * Call once per post page: loads the live like count and records one view
 * per browser session (refreshing the page doesn't count again).
 */
export async function startPost(postId: string) {
	if (started.has(postId)) return;
	started.add(postId);

	const viewKey = `viewed:${postId}`;
	const firstVisit = !sessionStorage.getItem(viewKey);
	const stats = firstVisit ? await api(`${postId}/view`, {}) : await api(`${postId}/stats`);
	if (firstVisit && stats) sessionStorage.setItem(viewKey, '1');
	if (stats) {
		liveLikes.set(postId, stats.likes);
		paintStats({ [postId]: stats }); // e.g. the view count in the post hero
		emit();
	}
}

export function toggle(kind: Kind, postId: string) {
	const list = read(kind);
	const on = !list.includes(postId);
	localStorage.setItem(KEYS[kind], JSON.stringify(on ? [...list, postId] : list.filter((x) => x !== postId)));

	if (kind === 'like') {
		// Show the change instantly, then trust whatever the API says
		const live = liveLikes.get(postId);
		if (live !== undefined) liveLikes.set(postId, Math.max(0, live + (on ? 1 : -1)));
		api(`${postId}/like`, { liked: on }).then((stats) => {
			if (stats) {
				liveLikes.set(postId, stats.likes);
				emit();
			}
		});
	}
	emit();
	return on;
}

/** Run `fn` now and whenever likes/saves change (this tab or another tab). */
export function onChange(fn: () => void) {
	fn();
	window.addEventListener(EVENT, fn);
	window.addEventListener('storage', fn);
}

export async function copyLink(url: string) {
	await navigator.clipboard.writeText(url);
}
