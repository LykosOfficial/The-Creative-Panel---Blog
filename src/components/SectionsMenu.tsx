// ☰ "The Panel" (next to the dark-mode toggle): every section and its subsections, like The Verge,
// Gizmodo, TechCrunch and Mashable. Two styles to compare in the design lab:
//   variant="drawer": slides in from the right; each section expands to show its subsections
//   variant="mega":   drops down under the header; every section is a column with its subsections,
//                     plus an optional "Saved for later" column (the reader's saved posts)
//   variant="auto":   mega on desktop, drawer on tablets and phones (the ☰ replaces the phone menu)
// Built on Radix Dialog (focus stays inside, Esc closes) and Radix Accordion.
import { Bookmark, ChevronDown, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Accordion, Dialog } from "radix-ui"
import { loadSavedPosts, onSavedChange, unsave, type SavedPost } from "@/lib/saved"
import { cn } from "@/lib/utils"

export interface Section {
  label: string
  href: string
  subs: { label: string; href: string }[]
}

interface Props {
  sections: Section[]
  /** Archive, Trending, Tags… shown along the bottom */
  browse: { label: string; href: string }[]
  /** "auto": mega menu on desktop (1180px+), drawer on tablets and phones */
  variant?: "drawer" | "mega" | "auto"
  /** Show the reader's saved posts in the mega menu */
  saved?: boolean
  /** Where "See saved posts" goes; /saved/ is built when the menu is switched on in the admin */
  savedHref?: string
  /** The menu's title, e.g. "The Panel" */
  title?: string
}

const WIDE = "(min-width: 1180px)"

const heading = { fontFamily: "var(--font-heading)" }

export default function SectionsMenu({ sections, browse, variant = "drawer", saved = false, savedHref = "/saved/", title = "The Panel" }: Props) {
  // In "auto", pick the style when the menu opens, from the current screen width
  const [wide, setWide] = useState(false)
  const style = variant === "auto" ? (wide ? "mega" : "drawer") : variant
  return (
    <Dialog.Root onOpenChange={(open) => open && setWide(window.matchMedia(WIDE).matches)}>
      <Dialog.Trigger
        aria-label={`Open ${title}`}
        title={title}
        className="inline-flex size-9 items-center justify-center text-white/60 outline-none transition-colors hover:text-white focus-visible:text-white data-[state=open]:text-brand-logo-accent"
      >
        <Menu className="size-5" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        {style === "drawer" ? <Drawer sections={sections} browse={browse} saved={saved} savedHref={savedHref} title={title} /> : <Mega sections={sections} browse={browse} saved={saved} savedHref={savedHref} title={title} />}
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <Dialog.Title className="!m-0 font-display text-[22px] font-semibold uppercase tracking-[-0.2px] text-white">
        {title}
        <span className="text-brand-logo-accent">.</span>
      </Dialog.Title>
      <Dialog.Description className="sr-only">Every section of The Creative Panel and its subsections.</Dialog.Description>
      <Dialog.Close className="inline-flex size-9 items-center justify-center text-white/70 outline-none hover:text-white focus-visible:text-white" aria-label="Close menu">
        <X className="size-5" />
      </Dialog.Close>
    </div>
  )
}

function Browse({ browse }: { browse: Props["browse"] }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 px-6 py-5">
      {browse.map((b) => (
        <a key={b.href} href={b.href} className="text-[16px] uppercase tracking-[1.2px] text-white/60 no-underline hover:text-brand-logo-accent" style={heading}>
          {b.label}
        </a>
      ))}
    </div>
  )
}

/** No sections yet: the navbar's destinations as large links, in place of the sections */
function BigLinks({ links, className }: { links: Props["browse"]; className?: string }) {
  return (
    <ul className={cn("!m-0 !list-none !p-0", className)} role="list">
      {links.map((l) => (
        <li key={l.href} className="border-b border-white/10 last:border-b-0">
          <a href={l.href} className="block px-4 py-4 font-display text-[22px] font-semibold uppercase tracking-[-0.2px] text-white no-underline hover:text-brand-logo-accent">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Full-screen drawer from the right (phones and tablets, like Gizmodo), an accordion per section.
 * Phones: saved posts on top. Tablets (768px+): sections on the left, saved posts in a side column, like the mega menu.
 */
function Drawer({ sections, browse, saved, savedHref = "/saved/", title = "The Panel" }: Omit<Props, "variant">) {
  return (
    <Dialog.Content
      className="fixed inset-0 z-[61] flex w-full flex-col bg-black text-white outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right"
    >
      <Header title={title} />
      <div className={cn("flex-1 overflow-y-auto", saved && "md:grid md:grid-cols-[minmax(0,1fr)_320px] md:items-start")}>
      {saved && (
        <div className="md:order-2 md:h-full">
          <SavedColumn compact href={savedHref} />
        </div>
      )}
      {sections.length === 0 ? <BigLinks links={browse} className="px-2 py-2 md:order-1" /> : (
      <Accordion.Root type="multiple" className="px-2 py-2 md:order-1">
        {sections.map((s) => (
          <Accordion.Item key={s.label} value={s.label} className="border-b border-white/10 last:border-b-0">
            <Accordion.Header className="m-0 flex">
              <Accordion.Trigger className="group flex flex-1 items-center justify-between px-4 py-4 text-left font-display text-[22px] font-semibold uppercase tracking-[-0.2px] text-white outline-none hover:text-brand-logo-accent focus-visible:text-brand-logo-accent">
                {s.label}
                <ChevronDown className="size-5 text-white/50 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <ul className="!m-0 !list-none !p-0 pb-4 pl-4" role="list">
                <li>
                  <a href={s.href} className="block px-4 py-1.5 text-[16px] uppercase tracking-[1.2px] text-brand-logo-accent no-underline hover:text-white" style={heading}>
                    All {s.label} →
                  </a>
                </li>
                {s.subs.map((sub) => (
                  <li key={sub.label}>
                    <a href={sub.href} className="block px-4 py-1.5 text-[16px] text-white/75 no-underline hover:text-white">
                      {sub.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      )}
      </div>
      {sections.length > 0 && <Browse browse={browse} />}
    </Dialog.Content>
  )
}

/** Full-width panel under the header: one column per section */
function Mega({ sections, browse, saved, savedHref = "/saved/", title = "The Panel" }: Omit<Props, "variant">) {
  return (
    <Dialog.Content
      className={cn(
        "fixed inset-x-0 top-0 z-[61] max-h-[85vh] overflow-y-auto border-b border-white/10 bg-black text-white shadow-2xl outline-none",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <Header title={title} />
        <div className={cn("grid", saved && "lg:grid-cols-[minmax(0,1fr)_300px]")}>
          {sections.length === 0 ? <BigLinks links={browse} className="grid px-2 py-4 sm:grid-cols-2" /> : (
          <div className={cn("grid gap-x-8 gap-y-10 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3", !saved && "xl:grid-cols-6")}>
            {sections.map((s) => (
              <div key={s.label}>
                <a href={s.href} className="mb-3 block border-b-2 border-brand-gold pb-2 font-display text-[22px] font-semibold uppercase leading-none tracking-[-0.2px] text-white no-underline hover:text-brand-logo-accent">
                  {s.label}
                </a>
                <ul className="!m-0 !list-none !p-0" role="list">
                  {s.subs.map((sub) => (
                    <li key={sub.label}>
                      <a href={sub.href} className="block py-1.5 text-[16px] text-white/70 no-underline hover:text-white">
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          )}
          {saved && <SavedColumn href={savedHref} />}
        </div>
        {sections.length > 0 && <Browse browse={browse} />}
      </div>
    </Dialog.Content>
  )
}

/**
 * "Saved for later": this reader's saved posts (stored in their browser), newest first.
 * In the mega menu it's a side column (5 posts); `compact` is the top of the phone/tablet drawer (3 posts).
 */
function SavedColumn({ compact = false, href }: { compact?: boolean; href: string }) {
  const [posts, setPosts] = useState<SavedPost[] | null>(null)
  useEffect(() => {
    const refresh = () => void loadSavedPosts().then(setPosts)
    refresh()
    return onSavedChange(refresh)
  }, [])
  const shown = posts?.slice(0, compact ? 3 : 5) ?? []

  return (
    <aside
      aria-label="Saved for later"
      className={
        compact
          ? "border-b border-white/10 px-6 py-5 md:h-full md:border-b-0 md:border-l md:py-8"
          : "border-t border-white/10 px-6 py-8 lg:border-t-0 lg:border-l"
      }
    >
      <p className="mb-1 flex items-baseline justify-between text-[16px] uppercase tracking-[1.5px] text-brand-logo-accent" style={heading}>
        Saved for later
        {posts && posts.length > 0 && <span className="text-white/50">{posts.length}</span>}
      </p>
      <p className="mb-4 text-[16px] text-white/40">Saved on this device</p>
      {posts === null ? (
        <p className="text-[16px] text-white/40">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-[16px] leading-relaxed text-white/60">
          Nothing saved yet. Tap <Bookmark className="inline size-3.5 -translate-y-px" aria-label="the bookmark" /> on any post to keep it here for later.
        </p>
      ) : (
        <>
          <ul className="!m-0 !list-none space-y-1 !p-0" role="list">
            {shown.map((p) => (
              <li key={p.id} className="group flex items-start gap-2">
                <a href={p.url} className="min-w-0 flex-1 py-1.5 no-underline">
                  <span className="block text-[16px] uppercase tracking-[1px] text-white/45" style={heading}>
                    {p.category}
                  </span>
                  <span className="block font-display text-[17px] font-semibold uppercase leading-tight text-white transition-colors group-hover:text-brand-logo-accent">
                    {p.title}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => unsave(p.id)}
                  className="mt-2 inline-flex size-7 shrink-0 items-center justify-center text-white/40 outline-none hover:text-white focus-visible:text-white"
                  aria-label={`Remove “${p.title}” from saved`}
                  title="Remove"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <a href={href} className="mt-4 inline-block text-[16px] uppercase tracking-[1.2px] text-brand-logo-accent no-underline hover:text-white" style={heading}>
            {posts.length > shown.length ? `See all ${posts.length} saved →` : "See saved posts →"}
          </a>
        </>
      )}
    </aside>
  )
}
