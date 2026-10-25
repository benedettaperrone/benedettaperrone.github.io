# Benedetta Perrone, portfolio

Static personal site: HTML, CSS and one JavaScript file. No build step, no
dependencies to install. It publishes to GitHub Pages as it is, at
**https://benedettaperrone.github.io/**.

The repository is named `benedettaperrone.github.io`, which is what makes GitHub
serve it at the root of the address. It used to be called `portfolio` and live
at `.../portfolio/`; a separate small repository named `portfolio` now only
redirects those old links here (see "Old address" below).

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
| `index.html` | Home: hero, About me, a **summary** of Publications and Background, Projects, Beyond, Contact strip |
| `publications.html` | Full list: journal articles (with summary and figure), workshop paper, theses |
| `cv.html` | The **Background** page: five collapsible sections, all open by default, plus the PDF download |
| `beyond.html` | Outreach and mentoring, In my own time. The Music and Three cities sections exist in the file but are commented out until their content is written |
| `contact.html` | Email, office address, research profiles (Scholar, ORCID, LinkedIn, GitHub), CV download |
| `styles.css` | Every style, shared by the five pages |
| `site.js` | Mobile menu, figure lightbox, email panel, BibTeX copy, publication filters, reveal on scroll, back-to-top button, footer year |
| `sitemap.xml` | The five pages, for Google Search Console |
| `robots.txt` | Allows everything and points crawlers to the sitemap. It works because the site sits at the root of the address |
| `images/` | Portrait, paper figures, institution logos, galleries |
| `cv/` | `CV_BenedettaPerrone.pdf` |

### Home vs. the other pages

The home page is a **summary**, and says so: every section that has its own
page ends with a button that goes there.

- **Publications** on the home page shows only title, venue, authors and links.
  The summary paragraph and the figure live on `publications.html`.
- **Background** on the home page is three lines (Now / Before / Education),
  built with the same `.strip` component as the facts under the portrait. The
  timeline cards with logos, grades, leadership, awards and skills are on
  `cv.html`.
- **Projects** exists only on the home page.

If you add something, put the full version on its page and, at most, a line
about it on the home page.

### What `site.js` does

All progressive enhancement. The site stays readable and navigable with
JavaScript off: you lose the mobile menu, nothing fades in, the figures open as
plain image files instead of in the lightbox, the email links fall back to the
plain `mailto:` they already are, and the BibTeX and filter controls simply
never appear rather than appearing and doing nothing.

1. **Mobile menu.** Below 960px the nav becomes a drop-down panel. The script
   opens and closes it, keeps `aria-expanded` correct for screen readers, closes
   it after a link is tapped, and closes it on Esc.
2. **Figure lightbox.** Clicking a paper figure opens it large over the blurred
   page. Closes on the X, on Esc, or on a click outside the figure.
3. **Email panel.** Every `mailto:` link opens a small panel: the address with a
   copy button, Gmail and Outlook compose links, and the original `mailto:`.
   A bare `mailto:` does nothing on a machine with no mail client registered.
4. **BibTeX copy.** Every publication carries its entry in the HTML, in a
   `<script type="application/x-bibtex">` block inside its `<article>`. The chip
   that copies it is built by the script.
5. **Publication filters.** A row of chips under the page title on
   `publications.html`, derived from the items themselves (year from `.pyear`,
   kind from the `.subh` heading of the section).
6. **Reveal on scroll.** Section blocks fade up as they come into view, once
   each. Skipped under `prefers-reduced-motion`.
7. **Reading progress: removed.** There used to be a thin green bar under the
   header that filled up as you scrolled. It was taken out on request in
   October 2026; both the script and its style are gone.
8. **Scroll spy: switched off.** The code is still in `site.js`, but it only
   acts on elements with a `data-nav` attribute, and none are left in the HTML.
   This is deliberate: when the underline followed the scroll on the home page,
   the site read as one long page instead of five. To turn it back on, add
   `data-nav="page.html"` to a section.
9. **Back to top.** A round button appears bottom right after 500px of scroll.
10. **Footer year.** Writes the current year so the copyright does not age.

---

## Navigation

```
Benedetta Perrone    HOME  PUBLICATIONS  BACKGROUND  BEYOND  CONTACT  │  social icons
```

All five items are **separate pages**. The green underline is the `.on` class,
written by hand in each page's HTML on its own link, and it marks only the page
you are on; it does not move when you scroll.

The file is called `cv.html` on disk but the menu says **Background**: "CV" is
reserved for the downloadable PDF.

Every page except `contact.html` still ends with the short contact strip
(`.contact`) above the footer. `contact.html` leaves it out, since the page
itself is the contact block.

The header icons are, in order: Google Scholar, ORCID, LinkedIn, GitHub, email.
They are repeated in every page's `.socials` block and in `.herosoc` on the home
page, so a change to a profile link means editing all of them.

---

## Search engines and link previews

What is in the `<head>` of each page, and why:

- **`<title>` and `<meta name="description">`**: the blue title and the grey
  text in Google results. The home title carries the field and the university
  ("EEG and Brain-Computer Interfaces, KU Leuven") because several other people
  share the name, some of them also in science.
- **`<link rel="canonical">`**: the one official address of the page. The home
  page is reachable both as `/` and `/index.html`; this
  stops Google from treating them as two competing pages.
- **Open Graph and Twitter tags** (`og:…`, `twitter:…`): title, text and image
  of the preview card on LinkedIn, WhatsApp, Slack and similar. **The URLs must
  be absolute** (`https://benedettaperrone.github.io/...`): those
  services do not resolve relative paths, which is why the preview used to show
  no photo.
- **JSON-LD** (home page only): structured data. The `WebSite` block gives the
  site its name in results; the `Person` block says who the site is about, with
  affiliation, award, topics and the profiles in `sameAs` (ORCID, Scholar,
  LinkedIn, GitHub). Keep it in step with reality.
- **`google-site-verification`** (home page): proves to Search Console that the
  site is yours. Do not remove it.

After publishing a change worth indexing, in Google Search Console: submit
`https://benedettaperrone.github.io/sitemap.xml` under *Sitemaps*, and
use *URL inspection → Request indexing* on the pages that changed. Update the
`<lastmod>` dates in `sitemap.xml` when a page changes substantially.

**Adding a page**: copy the `<head>` of an existing sub-page and change title,
description, canonical, `og:title`, `og:description` and `og:url`; add the page
to the nav of every page and to `sitemap.xml`.

---

## Design

- **Colours**: warm paper `#faf8f3`, secondary paper `#f2efe7`, forest green
  `#1f5c46`, deep green `#0e3b2e`, sage `#8ea08e`. All CSS variables at the top
  of `styles.css`, so the palette changes in one place.
- **Green carries the page, sage stays out of the way.** Green is on the name in
  the header, the hero and page headings, the portrait frame, the publication
  numbers, the timeline spine, and the buttons. Sage
  keeps the quiet parts: side labels, meta lines, captions.
- **The portrait is framed, not outlined**: a paper gap, then a solid green rule
  around it.
- **Fonts**: [Fraunces](https://fonts.google.com/specimen/Fraunces) for display,
  [Inter](https://fonts.google.com/specimen/Inter) for text, from Google Fonts.
- **Section titles carry no full stop.**
- **No long dashes anywhere in the visible text.** Not in prose, not in headings,
  not in date ranges. Date ranges read "Sep 2022 to Dec 2024" or
  "since Nov 2025". If you add copy, keep to this. (The FWO is written
  "Research Foundation Flanders" for the same reason, without its official dash.)
- **A section label is never repeated as its own heading.**
- **Institution logos live inside the timeline cards**, greyscale at rest and in
  colour on hover.
- **Contact and footer share one tone** (`--paper-2`) so they read as a single
  closing block.
- **Nothing half written is visible.** Sections whose text or photos do not
  exist yet are commented out of the HTML rather than shipped as placeholder
  copy. The markup stays in the file, wrapped in a comment that says what to
  write and what to uncomment alongside it.

### Responsive

No horizontal overflow at 375 or 1440px on any of the five pages.

- below **960px**: hero, sections and grids go single column, the menu becomes a
  drop-down;
- below **560px**: the photo gallery goes to one column, the logo column inside
  timeline cards narrows, the back-to-top button shrinks;
- below **440px**: the social icons leave the header, because five of them do
  not fit next to the name and the hamburger. They stay in the hero on the home
  page and on the Contact page.

---

## What is still missing

Every gap is marked in the code with a `TODO [CONTENT]` comment explaining what
to write and where. To list them:

```bash
grep -rn "TODO \[CONTENT\]" *.html
```

Nothing on that list is visible on the live site.

### Hidden until written

| Where | What is needed | Uncomment alongside |
|---|---|---|
| `beyond.html`, Music section | Two short paragraphs | the Music card in the `.bgrid` in `index.html` |
| `beyond.html`, Three cities section | Three photos plus a one-line intro | the Photos card in the `.bgrid` in `index.html` |
| `beyond.html`, Outreach gallery | Three photos and their captions | nothing, it sits inside a section that is already live |

### Images to add to `images/`

| File | Where it goes |
|---|---|
| `outreach-1.jpg` `outreach-2.jpg` `outreach-3.jpg` | Outreach gallery in `beyond.html` |
| `city-turin.jpg` `city-dublin.jpg` `city-leuven.jpg` | Three cities gallery in `beyond.html` |

Gallery images are cropped to 3:4 portrait, so vertical shots survive best.

> **Figure copyright.** *Algorithms* (MDPI) is CC-BY, so its figure can be
> republished with attribution. *Biomedical Signal Processing and Control*
> (Elsevier) is published open access under CC-BY on this article. Check the
> licence before adding a figure from anywhere else.

### Adding a publication

Copy an existing `<article class="pitem">` in `publications.html`, keeping the
`.pyear` span and the section it belongs to: the filter chips read both. Add its
BibTeX in a `<script type="application/x-bibtex">` inside the article, after the
`.chips` div. Continue the `.pnum` numbering. If it should also appear on the
home page, add the short version there (no `.pwhy`, no figure, `pbody nofig`).

### Optional additions

- **Talks and presentations** in `publications.html`. There is a
  `TODO [CONTENT]` where the block goes.
- **M.Sc. thesis PDF** in `publications.html`.

---

## Old address

Until October 2026 the site lived at `https://benedettaperrone.github.io/portfolio/`.
Links to that address may still be around (old posts, emails, CVs). They keep
working through a separate repository named `portfolio`, which contains only
`index.html` and `404.html`: both send the visitor to the same page at the new
address (`/portfolio/cv.html` goes to `/cv.html`, and so on). Do not delete that
repository, and do not put anything else in it.

## Notes

- **No dark theme, on purpose.** The warm paper palette is the identity of the
  site.
- **FWO fellowship** appears in four places: the first sentence of About me
  (`index.html`), the Experience and Awards sections of `cv.html`, and the
  `award` field of the JSON-LD. The CV PDF in `cv/` is updated separately.
- **Tracking and indexing**: GA4 (`G-70KGV6CNRB`), Search Console verification
  tag, `sitemap.xml`.
