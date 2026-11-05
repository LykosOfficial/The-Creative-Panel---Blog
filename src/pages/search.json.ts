// An Astro *endpoint*: a .ts file in pages/ that returns data instead of HTML.
// At build time this becomes a static /search.json file the search box loads.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { formatDate, sortByDate } from '../lib/posts';

export const GET: APIRoute = async () => {
	const posts = sortByDate(await getCollection('blog'));
	const index = posts.map((p) => ({
		title: p.data.title,
		description: p.data.description,
		url: `/blog/${p.id}/`,
		category: p.data.category,
		tags: p.data.tags,
		date: formatDate(p.data.pubDate),
	}));
	return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
};
