# Benedetta Perrone, portfolio

Static personal site: HTML, CSS and one JavaScript file. No build step, no
dependencies to install. It publishes to GitHub Pages as it is.

---

## Running it

**Locally**: double-click `index.html`. It opens in the browser and everything
works, mobile menu included, because every path is relative.

If you want a local server (only needed to test social previews):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

**Online**: GitHub Pages, from *Settings → Pages → Source: main branch, / (root)*.

---

## Structure

| File | What it holds |
|---|---|
| `index.html` | Home: hero, About me, Publications, Projects, Background, Beyond, Contact |
| `publications.html` | Full list: journal articles, workshop paper, theses |
| `cv.html` | The **Background** page: five collapsible sections, all open by default, plus the PDF download |
| `beyond.html` | Outreach and mentoring. The Music and Three cities sections exist in the file but are commented out until their content is written |
| `styles.css` | Every style, shared by the four pages |
| `site.js` | Mobile menu, figure lightbox, email panel, BibTeX copy, publication filters, reveal on scroll, reading progress, scroll spy, back-to-top button, footer year |
| `images/` | Portrait, paper figures, institution logos, galleries |
| `cv/` | `CV_BenedettaPerrone.pdf` |

### What `site.js` does

Nine things, all progressive enhancement. The site stays readable and
navigable with JavaScript off: you lose the mobile menu, nothing fades in, the
figures open as plain image files instead of in the lightbox, the email links
fall back to the plain `mailto:` they already are, and the BibTeX and filter
controls simply never appear rather than appearing and doing nothing.

1. **Mobile menu.** Below 960px the nav becomes a drop-down panel. The script
   opens and closes it, keeps `aria-expanded` correct for screen readers, closes
   it after a link is tapped, and closes it on Esc.
2. **Figure lightbox.** Clicking a paper figure opens it large over the blurred
   page. Closes on the X, on Esc, or on a click outside the figure. Page scroll
   is locked while it is open and focus returns to the figure on close. It is
   built on top of a plain `<a href="image">`, so without JavaScript the link
   still opens the file.
3. **Email panel.** A bare `mailto:` does nothing at all on a machine with no
   mail client registered, which is most of them: the click is swallowed and the
   visitor gets no feedback. Every `mailto:` link on the page, in the header, the
   hero and the contact block, opens a small panel instead: the address with a
   copy button, Gmail and Outlook compose links, and the original `mailto:` for
   whoever does have a desktop client. Closes on the X, on Esc, or on a click
   outside; Tab stays inside it; focus returns to the icon on close.
   Ctrl-clicking a mail icon still gets the browser's own behaviour.
4. **BibTeX copy.** Every publication carries its entry in the HTML, in a
   `<script type="application/x-bibtex">` block inside its `<article>`. The
   browser never parses or displays that type, so the entry survives exactly as
   written, braces and all. The chip that copies it is built by the script. If
   the clipboard refuses, the entry is printed under the chips and selected, so
   it can still be copied by hand.
5. **Publication filters.** A row of chips under the page title on
   `publications.html`, one selection at a time. **The chips are derived from
   the items**, not from a list written by hand: the year comes from each item's
   own `.pyear`, the kind from the `.subh` heading of the section it sits in.
   Adding a publication in the existing markup therefore updates the filters
   with it, and there is nothing to keep in step. A facet with only one value is
   not offered, a section whose items are all filtered out is hidden with them,
   and the result count is announced through `aria-live`.
6. **Reveal on scroll.** Section blocks fade up as they come into view, once
   each. The hidden state is applied from the script, never written into the
   HTML, so without JavaScript nothing is ever hidden. Skipped entirely under
   `prefers-reduced-motion`.
7. **Reading progress.** A 2px green bar on the bottom edge of the sticky
   header, tracking how far down the document you are.
8. **Scroll spy.** The green underline in the nav follows the section you are
   reading. Sections say which link they belong to through `data-nav`, holding
   that link's own `href`. Projects deliberately has none: leaving it out keeps
   the indicator moving in one direction instead of flicking back to Home in
   the middle of the page. With no section in view the underline returns to the
   link marked `.on` in the HTML, which is the current page.
9. **Back to top.** A round button appears bottom right after 500px of scroll.
   Injected from the script rather than repeated in four HTML files.
10. **Footer year.** Writes the current year so the copyright does not age.

---

## Navigation

```
Benedetta Perrone    HOME  PUBLICATIONS  BACKGROUND  BEYOND  CONTACT  │  social icons
```

The first four are whole pages. **Contact** is the one anchor: it points at
`#contact`, the block that closes every page, so it behaves the same wherever you
click it. The green underline is the `.on` class, and it does double duty: it
marks the current page, and on scroll it follows the section you are reading
(see "Scroll spy" above). The name top left also goes home, and is set in green
rather than ink: it is the one piece of branding in the header.

The file is called `cv.html` on disk but the menu says **Background**: "CV" is
reserved for the downloadable PDF.

---

## Design

- **Colours**: warm paper `#faf8f3`, secondary paper `#f2efe7`, forest green
  `#1f5c46`, deep green `#0e3b2e`, sage `#8ea08e`. All CSS variables at the top
  of `styles.css`, so the palette changes in one place.
- **Green carries the page, sage stays out of the way.** Green is on the name in
  the header, the hero and page headings, the portrait frame, the publication
  numbers, the timeline spine, the buttons and the reading progress bar. Sage
  keeps the quiet parts: side labels, meta lines, captions. If you add an accent,
  decide which of the two jobs it is doing before picking the colour.
- **The portrait is framed, not outlined**: a paper gap, then a solid green rule
  around it. The gap is what makes it read as a mount inside a frame rather than
  a border drawn on the photograph.
- **Fonts**: [Fraunces](https://fonts.google.com/specimen/Fraunces) for display,
  [Inter](https://fonts.google.com/specimen/Inter) for text, from Google Fonts.
- **Section titles carry no full stop.**
- **No long dashes anywhere in the visible text.** Not in prose, not in headings,
  not in date ranges. Em and en dashes were removed throughout: headings use a
  comma or move the institution into the meta line, date ranges read
  "Sep 2022 to Dec 2024" or "since Nov 2025". If you add copy, keep to this.
- **A section label is never repeated as its own heading.** The side label says
  "About", so the heading does not also say "About me"; on the CV page the
  Education section is headed "Degrees and exchanges", not "Education".
- **Institution logos live inside the timeline cards**, greyscale at rest and in
  colour on hover, rather than in a separate badge row. They use
  `mix-blend-mode: multiply` so the white background baked into the Trinity JPEG
  disappears against the card.
- **Contact and footer share one tone** (`--paper-2`) so they read as a single
  closing block instead of a stray strip under the dark Beyond band.
- **Nothing half written is visible.** Sections whose text or photos do not
  exist yet are commented out of the HTML rather than shipped as placeholder
  copy and hatched grey boxes. The markup stays in the file, wrapped in a
  comment that says what to write and what to uncomment alongside it.

### Responsive

No horizontal overflow at 375 or 1440px on any of the four pages.

- below **960px**: hero, sections and grids go single column, the menu becomes a
  drop-down;
- below **560px**: the photo gallery goes to one column, the logo column inside
  timeline cards narrows from 76px to 52px, the back-to-top button shrinks;
- below **400px**: the social icons leave the header, because they do not fit
  next to the name and the hamburger. They stay in the hero on the home page.

---

## What is still missing

Every gap is marked in the code with a `TODO [CONTENT]` comment explaining what
to write and where. To list them:

```bash
grep -rn "TODO \[CONTENT\]" *.html
```

Nothing on that list is visible on the live site. Each gap is commented out, so
the site reads as finished; uncommenting is the last step of filling each one.

### Hidden until written

| Where | What is needed | Uncomment alongside |
|---|---|---|
| `beyond.html`, Music section | Two short paragraphs: what you listen to, and the link to studying how the brain follows one voice through noise | the Music card in the `.bgrid` in `index.html` |
| `beyond.html`, Three cities section | Three photos plus a one-line intro | the Photos card in the `.bgrid` in `index.html` |
| `beyond.html`, Outreach gallery | Three photos and their captions | nothing, it sits inside a section that is already live |

Two knock-on edits are noted in the comments and worth repeating here: the
`.sub` line under "Outside the lab" in `index.html` was narrowed to outreach
only, and the `<meta name="description">` in `beyond.html` likewise. Both widen
back when the other sections return.

### Images to add to `images/`

| File | Where it goes |
|---|---|
| `outreach-1.jpg` `outreach-2.jpg` `outreach-3.jpg` | Outreach gallery in `beyond.html` |
| `city-turin.jpg` `city-dublin.jpg` `city-leuven.jpg` | Three cities gallery in `beyond.html` |

Inside the commented markup each photo is a hatched box naming the file it
expects. To insert one, replace:

```html
<div class="slot"><span>Photo<br>images/outreach-1.jpg</span></div>
```

with:

```html
<img src="images/outreach-1.jpg" alt="what is happening in the photo"
     width="1200" height="1600" loading="lazy">
```

using the file's real pixel dimensions, and write the caption in `<figcaption>`.
Gallery images are cropped to 3:4 portrait, so vertical shots survive best.

The two paper figures are done: `pub-parkinson.png` and `pub-sleep.png` are in
place on both `index.html` and `publications.html`. Figure captions were removed,
and both images open in the lightbox.

> **Figure copyright.** *Algorithms* (MDPI) is CC-BY, so its figure can be
> republished with attribution. *Biomedical Signal Processing and Control*
> (Elsevier) is published open access under CC-BY on this article, which is why
> its figure is here too. Check the licence before adding a figure from anywhere
> else.

### Adding a publication

Copy an existing `<article class="pitem">` in `publications.html`, keeping the
`.pyear` span and the section it belongs to: the filter chips read both, so they
update on their own. Add its BibTeX in a
`<script type="application/x-bibtex">` inside the article, after the `.chips`
div, and the copy chip appears with it. Continue the `.pnum` numbering.

> **Author names in BibTeX.** The entries use full first names only where the
> site states them. Co-authors are initials, and the longer author lists end in
> `and others`, which is the BibTeX idiom that renders as "et al.". Expand them
> if you want the full list in a citation.

### Optional additions

- **Talks and presentations** in `publications.html`. There is none yet, so the
  page `<h1>` reads "Articles and theses" rather than promising talks it does
  not have. Widen it back when the section exists; there is a `TODO [CONTENT]`
  where the block goes.
- **M.Sc. thesis PDF** in `publications.html`. Only the code repository is
  linked; the thesis itself has no chip.
- **ORCID.** The header currently carries four icons: Google Scholar, LinkedIn,
  GitHub, email. ORCID was dropped rather than linked to a made-up identifier.
  To add it you need the URL in the form
  `https://orcid.org/0000-0000-0000-0000`, added to the `.socials` block in all
  four HTML files, to `.herosoc` in `index.html`, and to the `sameAs` array in
  the JSON-LD.

---

## Notes

- **No dark theme, on purpose.** Not a gap waiting to be filled: the warm paper
  palette is the identity of the site, and offering a second skin would mean
  publishing a look nobody chose. One theme, done properly.
  A dark theme was built and then removed, so nothing in `styles.css` is left
  half prepared for one. If it ever comes back it starts from the palette again,
  not from leftovers.
- The **JSON-LD** block in `index.html` (schema.org `Person`) is what tells
  Google who you are. Keep it in step with reality if the affiliation or the
  profile links change.
- The **logo column** in the timeline cards only appears on cards that carry a
  logo, through `:has(.cardlogo)`. Logos are left-aligned and vertically centered
  relative to the text block.
- **Tracking and indexing** are enabled with GA4 (`G-70KGV6CNRB`), `robots.txt`,
  and `sitemap.xml` for Search Console submission.
