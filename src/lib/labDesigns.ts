// The layouts in the design lab (src/pages/lab/). Kept in its own file because
// Astro runs getStaticPaths() apart from the rest of the page.
export const DESIGNS = {
	'nav-combo': {
		group: 'Navbar',
		name: 'Sections menu',
		note: 'Click ☰: mega menu with saved posts on desktop, drawer on tablets and phones',
	},
	saved: { group: 'Pages', name: 'Saved posts', note: 'Every post saved on this device' },
} as const;
export type Design = keyof typeof DESIGNS;
