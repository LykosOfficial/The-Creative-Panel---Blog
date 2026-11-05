// Newsletter sign-up for every <form data-newsletter> on the page
// (the homepage bar and the footer). Posts to services/api `/subscribers`.
//
// Markup: <form data-newsletter data-api="https://api…"> with an <input name="email">,
// and optionally a [data-newsletter-status] element inside the nearest [data-newsletter-root].

export function initNewsletterForms() {
	document.querySelectorAll<HTMLFormElement>('form[data-newsletter]:not([data-ready])').forEach((form) => {
		form.dataset.ready = 'true'; // safe to call more than once
		const root = form.closest('[data-newsletter-root]') ?? form.parentElement;
		const status = root?.querySelector<HTMLElement>('[data-newsletter-status]');

		const show = (msg: string, ok: boolean) => {
			if (!status) return;
			status.textContent = msg;
			status.hidden = false;
			status.style.color = ok ? 'var(--primary)' : 'var(--destructive)';
		};

		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const email = new FormData(form).get('email');
			try {
				const res = await fetch(`${form.dataset.api ?? ''}/subscribers`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email }),
				});
				if (!res.ok) throw new Error();
				const data = (await res.json().catch(() => ({}))) as { confirmEmail?: boolean };
				form.reset();
				// EcoSend sends a confirmation link first (double opt-in)
				show(data.confirmEmail ? 'Almost there! Check your inbox and click the link to confirm.' : "You're on the list. Thanks for subscribing!", true);
			} catch {
				show('Something went wrong. Please try again.', false);
			}
		});
	});
}
