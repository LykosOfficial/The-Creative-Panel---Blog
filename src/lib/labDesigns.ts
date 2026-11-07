// The layouts in the design lab (src/pages/lab/). Kept in its own file because
// Astro runs getStaticPaths() apart from the rest of the page.
export const DESIGNS = {
	'category-mix': { group: 'Category page', name: '★ Your mix', note: 'Stream title on top, Section front below' },
	'category-a': { group: 'Category page', name: 'A · Section front', note: 'Dark band, lead story + 3 beside it, card grid' },
	'category-b': { group: 'Category page', name: 'B · Stream', note: 'Huge title, one column of stories, image on the right' },
	'category-c': { group: 'Category page', name: 'C · Contents page', note: 'Text first, numbered entries in two columns' },
	'tags-mix': { group: 'Tags index', name: '★ Your mix', note: 'Word cloud, same-size words, counts in bubbles' },
	'tags-a': { group: 'Tags index', name: 'A · Book index', note: 'A–Z with a letter bar' },
	'tags-b': { group: 'Tags index', name: 'B · Word cloud', note: 'Sized by how many posts' },
	'tags-c': { group: 'Tags index', name: 'C · Topic cards', note: 'Each tag with its newest post' },
} as const;
export type Design = keyof typeof DESIGNS;
