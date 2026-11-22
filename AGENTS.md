# AGENTS.md

## Project
Mobile-first landing page for "proyecto ada". Plain HTML + CSS only: no JavaScript, frameworks, libraries, preprocessors, or build step. Google Fonts is the only external resource.

## Files and preview
- `index.html` — single page. Sections are already built in this order: sticky header/mobile menu, hero, purple marquee, talleres, testimonios, nosotras, resultados, white marquee, faq, unete, footer/legal. Placeholder copy and images still need replacing.
- `css/` — one plain stylesheet per area, loaded from `index.html` in page order: `base.css`, `header.css`, `shared.css`, `hero.css`, `marquee.css`, `talleres.css`, `testimonios.css`, `nosotras.css`, `resultados.css`, `faq.css`, `unete.css`, `footer.css`. Add new section styles in their own file and link it in page order. The old `styles/` folder and Meyer reset were removed; do not reintroduce them.
- `images/` — empty for now (`.gitkeep`). Photos are `.image-placeholder` divs with a comment showing where an `<img>` will go.
- Preview: `python3 -m http.server 8000`, then open `http://localhost:8000`. No lint/format/test setup; verify manually at 360–390px.

## Tokens and conventions
- Colors: `--color-primary: #7447e1`, `--color-accent: #8c52ff`, white, black, `--color-lavender: #e6dcff`, `--color-lavender-border: #c9b8ff`, `--color-gray-border: #d9d9d9`.
- Fonts: `--font-heading: "League Spartan", sans-serif`; `--font-body: "Montserrat", sans-serif`. Headings/numbers bold; body 400; buttons/menu/subtitles 600/700.
- Spacing: rem variables for 8/16/24/32/48/64px plus `--space-20: 1.25rem`; radii 16/24/999px; header 4rem; tap targets 2.75rem (44px), 3rem (48px) for CTA/summaries.
- All hex colors, font names, and spacing values must come from `:root` variables. No raw hex outside `:root`, no `!important`, no deep nesting.
- Base CSS targets ~375px. No tablet/desktop media queries yet; keep the cascade ready for later `@media (min-width: ...)` blocks.
- Normal content uses a centered container (`max-width: ~600px`, 20px side padding). Marquees are full-bleed siblings.
- Flexbox for 1D layouts; grid for the 2x2 stats. Simple English kebab-case classes; IDs only for in-page anchors.
- Comments in English explaining WHY; visible copy in Spanish. Body copy >= 1rem; smaller sizes only for roles/legal/eyebrows as specified.
- Do not add sections, colors, or features beyond the spec. Put improvement ideas in the chat response, not the page.

## CSS-only interactions
- Menu uses `:target`: open link `href="#menu"`, close link `href="#site-header"` (not `#`, which jumps to top). Open/close controls must be `<a>` styled as buttons. Keep `#menu` outside the sticky header to avoid stacking/clipping issues.
- Sticky header is 4rem; every anchored section needs `scroll-margin-top: calc(var(--header-height) + 1rem)`.
- If closing the menu with sticky positioning causes a scroll jump, switch the header to `position: fixed` with body padding-top and report it.
- Marquees duplicate content and animate `translateX`; disable animation under `prefers-reduced-motion: reduce`.
- Testimonials use horizontal `overflow-x: auto` + `scroll-snap-type: x mandatory`; cards are 85% of the carousel width. Arrow buttons are inert until JS is added.
- FAQ uses `<details>/<summary>`; hide the default marker, rotate `+` 45deg when open.
- Rotated Únete cards need `overflow-x: clip` to prevent horizontal scroll.

## Quality bar
- No horizontal scroll at 360–390px.
- Every tappable target >= 44px tall (48px for summaries and hero CTA).
- Visible `:focus-visible` on links, buttons, summaries.
- Contrast >= 4.5:1 normal text, >= 3:1 large text. Card 3 uses 1.25rem bold white on #8c52ff to qualify as large text.
- One `<h1>`, ordered headings (h2 per section, h3 for card/sub-block titles), unique IDs, viewport meta, `lang="es"`, meta description, alt text on real images.

## Locked decisions
- Written spec is authoritative; attachments were not available.
- Star: repeat inline SVG with a shared `.star` class; do not add `<symbol id>`/`<use>`.
- Optional Nosotras dotted curve is skipped.
- Menu overlay is an inset fixed panel so its 24px corners are visible.
