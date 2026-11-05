// Facts used by the legal pages (src/pages/privacy.mdx, terms.mdx, cookies.mdx, disclaimer.mdx).
// Update these instead of editing every page.
import { profile } from './profile';

export const legal = {
	/** Who runs the site (the "we" in the policies). */
	owner: 'Joel Green',
	site: 'joelgreen.studio',
	siteName: 'The Creative Panel',
	/** Address for privacy requests and legal notices. Defaults to the public contact email in profile.ts. */
	contactEmail: profile.email,
	/** Where the site owner is based, e.g. 'the State of New York, United States'. Empty = not stated. */
	governingLaw: '',
	/** Bump this whenever a policy changes. */
	lastUpdated: 'November 5, 2026',
};

/** The legal pages, in footer/sidebar order. */
export const legalPages = [
	{ href: '/privacy', label: 'Privacy Policy' },
	{ href: '/cookies', label: 'Cookie Policy' },
	{ href: '/terms', label: 'Terms of Use' },
	{ href: '/disclaimer', label: 'Disclaimer' },
];
