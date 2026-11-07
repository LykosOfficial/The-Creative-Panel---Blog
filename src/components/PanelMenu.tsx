// "The Panel ▾" in the navbar: the ways to browse the blog (Archive, Trending, Categories, Tags).
// shadcn DropdownMenu (Radix), so it opens with click, Enter/Space or ↓ and closes with Esc.
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface PanelLink {
  href: string
  label: string
  description: string
}

interface Props {
  label: string
  links: PanelLink[]
  /** The current page's path, to highlight the trigger and the current item */
  pathname: string
}

/** /blog/some-post/ belongs to Archive; /tags/the-halo/page/2/ belongs to Tags */
const isCurrent = (href: string, pathname: string) => pathname === href || pathname.startsWith(`${href}/`)

export default function PanelMenu({ label, links, pathname }: Props) {
  const active = links.some((l) => isCurrent(l.href, pathname))
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          "panel-trigger inline-flex items-center gap-1 border-b-2 border-transparent px-2 py-2 text-[16px] uppercase tracking-[1px] text-white/70 outline-none transition-colors hover:text-white focus-visible:text-white data-[state=open]:text-white",
          active && "border-brand-teal-light !text-brand-teal-light"
        )}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {label}
        <ChevronDown className="size-3.5 transition-transform duration-200 [[data-state=open]>&]:rotate-180" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="w-72 rounded-none border-white/10 bg-black p-1.5 text-white shadow-xl"
      >
        {links.map((l) => {
          const current = isCurrent(l.href, pathname)
          return (
            <DropdownMenuItem
              key={l.href}
              asChild
              className="flex-col items-start gap-0.5 rounded-none px-3 py-2.5 focus:bg-white/10 focus:text-white"
            >
              <a href={l.href} aria-current={current ? "page" : undefined} className="no-underline">
                <span
                  className={cn("text-[16px] uppercase tracking-[1px]", current ? "text-brand-teal-light" : "text-white")}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {l.label}
                </span>
                <span className="text-[16px] leading-snug text-white/55">{l.description}</span>
              </a>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
