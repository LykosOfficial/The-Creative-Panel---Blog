// Runs before the static files (wrangler.jsonc: "run_worker_first": true).
// One job: send www.joelgreen.studio and http:// to https://joelgreen.studio with a
// permanent (301) redirect, so search engines see one address for every page.
// Everything else is served from ./dist exactly as before.

const CANONICAL_HOST = 'joelgreen.studio';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const isOurDomain = url.hostname === CANONICAL_HOST || url.hostname === `www.${CANONICAL_HOST}`;

		if (isOurDomain && (url.hostname !== CANONICAL_HOST || url.protocol !== 'https:')) {
			url.hostname = CANONICAL_HOST;
			url.protocol = 'https:';
			url.port = '';
			return Response.redirect(url.toString(), 301);
		}

		// workers.dev preview link, localhost and the real site: serve the files
		return env.ASSETS.fetch(request);
	},
};
