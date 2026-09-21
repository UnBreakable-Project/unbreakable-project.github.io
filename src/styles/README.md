# Design system

`tokens.css` defines the shared palette, spacing, typography and motion tokens.
The green accent is `#68c368` (`--green`, hover `--accent-hover`); official brand
files and the brand colors in the visual identity gallery remain unchanged.

- Use `--ink` for the canvas, `--ink-soft` for cards, and `--panel` for elevation.
- Use `--paper` for primary text and `--muted` for supporting text.
- Use `--green` for actions and keyboard focus, with dark text on filled actions.
- Use the display family for headings, the body family for prose, and mono for
  short labels and numbering.
- Use the spacing scale and responsive `--section-space` for layout rhythm.
- Keep decorative grids low contrast and official logos unmodified.

Home composition lives in `features/home/home.css`, scoped under `.home`.
Shared controls and secondary pages retain their styles in `index.css`.
`components/SiteUI.jsx` contains the shared arrow and event list. Event cards
remain non-interactive because individual event destinations are not provided.

Keyboard focus stays visible; reduced motion disables transitions and animation.
Method and FAQ share `components/Accordion.jsx`, retaining native details/summary.
Height transitions measure content, support reversal and respect reduced motion.
`components.css` provides shared accordion and secondary-page styling.
The mobile menu supports Escape and restores
focus to its toggle. Validate layout in a browser from 320px through wide desktop
before publishing, including the four secondary routes.

Route titles, descriptions, the official domain and sharing image are configured
in `data/page-meta.js`. The build writes metadata directly into each route's HTML
for social crawlers, including noindex on the 404 page. Review `siteUrl` when
deploying to a different domain or fork.

The featured event's `nextEvent.date` in `content/site.mdx` uses YYYY-MM-DD.
It is displayed as upcoming through the end of that day in America/Sao_Paulo;
afterward it appears in the history. Existing undated talks stay in the history.
Do not invent dates, member roles or write-up destinations to fill empty fields.

## Offensive-security layer

`offensive.css` (loaded last) holds the terminal idiom: typed prompt, the
`unbreakable.conf` card, the tag ticker, the method pipeline, comment-style
headings, desaturated team portraits (color returns on hover/focus and on touch
devices), the terminal 404 and the command palette. All motion sits inside
`prefers-reduced-motion: no-preference`; the ticker and typing degrade to static.

Everything shown comes from `content/site.mdx` (`home.terminal`, `home.ticker`,
`home.method.pipeline`). Do not add fake command output, scores or stats.

The command palette opens with Ctrl/Cmd+K or `/`; its catalogue is built by
`lib/commands.js` from the same navigation and social links as the header.
The Konami code and the `sudo su` palette command trigger a short Matrix rain.

`scripts/generate-static-routes.mjs` also writes a strict Content-Security-Policy
meta tag (build only; the dev server needs inline scripts)

## CTF Pink Hat page and redirects

`/eventos/ctf-pink-hat` (`features/pink-hat/`) has its own palette, scoped to
`.pinkhat` with `--ph-*` tokens measured from the event art: black, hot pink
`#e92974`, soft pink `#ff8fbe` for small text, dark magenta `#761639` for rules
and chevrons. The team's `pinkhat.css` uses `#ff0a78`; the JPG measures darker,
so swap `--ph-pink` if you want the two sites to match exactly.

Content lives in `content/site.mdx` under `pinkHat`. The date and place come
from the poster; do not add schedule, prizes or a registration link until the
organizers publish them. The poster itself sits in `public/eventos/` and is
also the page's `og:image`.

Short aliases live in `redirects` in `data/page-meta.js` (`/pinkhat` today).
The build writes a static `meta refresh` page for each one (no JavaScript, so it
passes the CSP), and the app redirects client-side in dev. Aliases are kept out
of the sitemap.

### Pink Hat gallery, podium and photos

`PhotoCarousel.jsx` is a native scroll-snap carousel (swipe, arrow keys, buttons,
pixel dots). Photos show whole over a blurred copy of themselves, so portrait
and landscape mix freely. Rotation is automatic, pauses on hover/focus and after
any manual navigation, has a Pausar/Retomar button, and is off under reduced
motion. Its styles, the podium, the pink ticker and the hero extras live in
`features/pink-hat/gallery.css`.

Photos are optimized WebP (max 1600 px, quality 80, no metadata) in
`src/assets/eventos/pink_hat_ctf/`, listed with captions and alt text in
`pinkHat.gallery` in `content/site.mdx`. To add one, convert it the same way
(the untouched originals sit beside them as `.jpg`, unused by the build), give
it a descriptive name and add an entry. Alt text describes the scene and never
names people.

The photo of the on-screen TOP 10 ranking is deliberately not published: it
shows participants' usernames and scores. Add it only with their consent.
The podium names no winners for the same reason.
