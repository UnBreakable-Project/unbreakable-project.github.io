# Design system

`tokens.css` defines the shared palette, spacing, typography and motion tokens.
The electric green is an interface accent; official brand files and the brand
colors in the visual identity gallery remain unchanged.

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
