// Links that come from the admin (post bodies, sites, books, socials) get rel="nofollow",
// so search engines don't treat them as endorsements. Links within joelgreen.studio stay
// followed: those help search engines find the site's own pages.

const OWN_HOSTS = new Set(['joelgreen.studio', 'www.joelgreen.studio']);

/** true for http(s) links that leave joelgreen.studio */
export function isExternal(href) {
	if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false; // relative, #anchor, mailto:
	try {
		return !OWN_HOSTS.has(new URL(href).hostname.toLowerCase());
	} catch {
		return false;
	}
}

/** rel value for a link: adds "nofollow noopener" to external links, keeping any extra words (e.g. "me") */
export function relFor(href, extra = '') {
	const words = new Set(String(extra).split(/\s+/).filter(Boolean));
	if (isExternal(href)) {
		words.add('nofollow');
		words.add('noopener');
	}
	return words.size ? [...words].join(' ') : undefined;
}

/** rehype plugin: applies relFor() to every <a> in rendered Markdown (posts from the admin) */
export default function rehypeNofollow() {
	const visit = (node) => {
		if (node.type === 'element' && node.tagName === 'a' && isExternal(node.properties?.href)) {
			const current = node.properties.rel;
			const rel = relFor(node.properties.href, Array.isArray(current) ? current.join(' ') : current);
			node.properties.rel = rel.split(' ');
		}
		node.children?.forEach(visit);
	};
	return (tree) => visit(tree);
}
