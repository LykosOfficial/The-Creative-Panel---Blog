// Design lab only (src/pages/lab/): fills layouts with enough posts to judge them.
// Starts with the real posts, then adds made-up ones that reuse their images.
// Never used on real pages.
import type { Post } from './posts';

const SAMPLE = [
	['Mapping the Astroseed', 'Worldbuilding', ['astroseed', 'worldbuilding'], 'How a sketch on a napkin became the map the whole trilogy hangs on.'],
	['Why Corporate Villains Work', 'Craft', ['craft', 'the-halo'], 'Faceless institutions can be scarier than any monster. Here is why.'],
	['Chapter One, Draft Seven', 'Writing', ['writing-progress', 'the-halo'], 'What changed between the first opening and the one that finally stuck.'],
	['Reading Like a Writer', 'Reading', ['reading', 'craft'], 'Five books I take apart to see how they work.'],
	['The Myth Under the Story', 'Worldbuilding', ['mythology', 'worldbuilding'], 'Old myths quietly shape The Halo. A look at where they show up.'],
	['Writing Through a Bad Week', 'Writing', ['writing-life'], 'Some weeks the words do not come. What I do anyway.'],
	['A Near-Future That Feels Close', 'Craft', ['craft', 'science-fiction'], 'Keeping the technology believable without drowning the reader.'],
	['Notes From the Revision Desk', 'Process', ['writing-progress', 'process'], 'Cutting 6,000 words and why the book got better for it.'],
	['Building a Believable Company', 'Worldbuilding', ['worldbuilding', 'the-halo'], 'Org charts, logos and lies: designing the corporation at the heart of the book.'],
	['What I Learned From Bad Drafts', 'Craft', ['craft', 'writing-life'], 'Every abandoned draft taught me something. Here are the big ones.'],
	['Soundtrack for Chapter Nine', 'Process', ['process', 'the-halo'], 'The music on repeat while writing the hardest chapter so far.'],
	['Characters Who Lie to Themselves', 'Craft', ['craft', 'characters'], 'The most interesting liars are the ones who believe themselves.'],
	['Halfway: 40,000 Words', 'News', ['writing-progress', 'author-update'], 'A milestone, a few surprises and what comes next.'],
	['Research Rabbit Holes', 'Process', ['process', 'science-fiction'], 'How much research is enough? Probably less than I did.'],
] as const;

export function labPosts(real: Post[]): Post[] {
	const images = real.map((p) => p.data.heroImage).filter(Boolean);
	const start = Math.min(...real.map((p) => p.data.pubDate.valueOf()), Date.now());
	const fakes = SAMPLE.map(([title, category, tags, description], i) => {
		const base = real[i % real.length];
		return {
			...base,
			id: `sample-${i + 1}`,
			body: base?.body ?? 'word '.repeat(600 + i * 120),
			data: {
				...base?.data,
				title,
				description,
				category,
				tags: [...tags],
				featured: false,
				pubDate: new Date(start - (i + 1) * 5 * 86_400_000),
				updatedDate: undefined,
				// every third sample has no image, to see how layouts cope
				heroImage: i % 3 === 2 ? undefined : images[i % Math.max(1, images.length)],
			},
		} as Post;
	});
	return [...real, ...fakes].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export { CATEGORY_BLURBS } from '../data/categories';

/** Design lab only: what a grown-up section structure could look like (sections → subsections). */
export const SAMPLE_SECTIONS = [
	{ label: 'Writing', href: '/categories/writing/', subs: ['Drafting', 'Revision', 'Writing Life', 'Habits'] },
	{ label: 'Craft', href: '#', subs: ['Character', 'Structure', 'Voice', 'Dialogue', 'Tension'] },
	{ label: 'Worldbuilding', href: '#', subs: ['Astroseed', 'Mythology', 'Maps', 'Technology'] },
	{ label: 'The Halo', href: '#', subs: ['Chapter Notes', 'Characters', 'Behind the Scenes', 'Progress'] },
	{ label: 'Reading', href: '#', subs: ['Reviews', 'Recommendations', 'Reading Lists'] },
	{ label: 'News', href: '/categories/news/', subs: ['Announcements', 'Site Updates', 'Events'] },
].map((s) => ({ ...s, subs: s.subs.map((label) => ({ label, href: '#' })) }));
