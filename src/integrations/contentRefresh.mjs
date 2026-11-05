// Dev-only: lets the admin tell the running blog dev server to reload content from the API.
//
// Content collections are loaded once when `astro dev` starts, so posts/books/sites
// saved in the admin wouldn't show until a restart. The admin POSTs to /_refresh-content
// after each save, and this re-runs the loaders (Astro's refreshContent()).
// In production the equivalent is rebuilding the site (e.g. a Cloudflare deploy hook).

/** @returns {import('astro').AstroIntegration} */
export default function contentRefresh() {
	return {
		name: 'content-refresh',
		hooks: {
			'astro:server:setup': ({ server, refreshContent, logger }) => {
				server.middlewares.use('/_refresh-content', async (req, res) => {
					const origin = req.headers.origin ?? '';
					// Only local apps (the admin on localhost) may trigger it
					if (origin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
						res.statusCode = 403;
						return res.end();
					}
					if (origin) {
						res.setHeader('Access-Control-Allow-Origin', origin);
						res.setHeader('Vary', 'Origin');
					}
					if (req.method === 'OPTIONS') {
						res.statusCode = 204;
						return res.end();
					}
					if (req.method !== 'POST') {
						res.statusCode = 405;
						return res.end();
					}
					try {
						await refreshContent?.({ loaders: ['posts', 'books', 'sites'] });
						logger.info('Content reloaded from the API');
						res.statusCode = 204;
					} catch (e) {
						logger.error(`Content refresh failed: ${/** @type {Error} */ (e).message}`);
						res.statusCode = 500;
					}
					res.end();
				});
			},
		},
	};
}
