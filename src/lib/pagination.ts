// Page-numbered lists: /categories/writing/ is page 1, /categories/writing/page/2/ is page 2, and so on.
// Real URLs (not infinite scroll) so readers can link to a page and Google can follow every one.

export const PER_PAGE = 12;

/** Address of page `n` of a list whose first page lives at `base` (e.g. "/tags/the-halo/"). */
export const pageUrl = (base: string, n: number) => (n <= 1 ? base : `${base}page/${n}/`);

export interface Page<T> {
	items: T[];
	current: number;
	total: number;
	base: string;
}

/** Split a list into pages of PER_PAGE (always at least one page, even when empty). */
export function paginate<T>(items: T[], base: string, perPage = PER_PAGE): Page<T>[] {
	const total = Math.max(1, Math.ceil(items.length / perPage));
	return Array.from({ length: total }, (_, i) => ({
		items: items.slice(i * perPage, (i + 1) * perPage),
		current: i + 1,
		total,
		base,
	}));
}

/** Page numbers to show, with null for a gap: 1 … 4 5 6 … 12 */
export function pageWindow(current: number, total: number): (number | null)[] {
	const keep = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
	const out: (number | null)[] = [];
	let last = 0;
	for (const n of [...keep].sort((a, b) => a - b)) {
		if (n - last > 1) out.push(n - last === 2 ? n - 1 : null); // fill a single gap with its number, bigger gaps with …
		out.push(n);
		last = n;
	}
	return out;
}
