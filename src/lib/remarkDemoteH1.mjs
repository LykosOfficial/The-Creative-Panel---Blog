// Markdown plugin: turns "# Heading 1" inside a post into "## Heading 2".
// The post title is the page's one <h1>; a second h1 confuses search engines and screen readers.
// Registered in astro.config.mjs (markdown.remarkPlugins), so it applies to Markdown/MDX files
// and to posts loaded from the API.
export default function remarkDemoteH1() {
	return (tree) => {
		const visit = (node) => {
			if (node.type === 'heading' && node.depth === 1) node.depth = 2;
			node.children?.forEach(visit);
		};
		visit(tree);
	};
}
