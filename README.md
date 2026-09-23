# xingjianzhang-dev.github.io

Personal website of Xingjian (Scott) Zhang — served by GitHub Pages at
<https://xingjianzhang-dev.github.io/>.

Plain HTML, CSS and a little JavaScript; no build step.

```
index.html          all page content
assets/style.css    styles (light and dark themes)
assets/site.js      theme toggle, BibTeX / author toggles, CV detection, section highlighting
favicon.svg
404.html
```

## Updating

- **Content** — edit `index.html`. Each section (About, News, Publications, Code, Education)
  is marked with a comment; publications follow one repeated `<article class="pub">` pattern.
- **Resume** — `cv.pdf` at the repository root (one-page, no phone number). Replace the file to update it.
- **Photo** — add a square image at `assets/photo.jpg`. It replaces the monogram automatically.
- **Preview locally** — `python3 -m http.server` in this folder, then open <http://localhost:8000>.

Pushing to `main` redeploys the site within a minute or two.
