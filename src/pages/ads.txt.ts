// /ads.txt — tells ad buyers which ad networks may sell ads on joelgreen.studio
// (Google requires it for AdSense). Built from PUBLIC_ADSENSE_CLIENT, the same
// publisher ID the ad slots use, so there's one place to set it:
//   apps/blog/.env  →  PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
	const client = import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '';
	// AdSense IDs look like "ca-pub-123…"; ads.txt wants the "pub-123…" part
	const pubId = client.replace(/^ca-/, '');
	const body = /^pub-\d{10,}$/.test(pubId)
		? `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`
		: '# No ad networks configured yet (set PUBLIC_ADSENSE_CLIENT to add Google AdSense).\n';
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
