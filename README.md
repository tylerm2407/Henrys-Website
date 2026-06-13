# Gannoe Media — Website

Static site: no build step, no dependencies. `index.html` is the homepage
(Penn State edition), `dark.html` is the dark edition, `gallery.html` is the gallery.

## Replacing the old Next.js site in this repo

From a fresh clone of the repo:

```bash
git clone https://github.com/tylerm2407/Henrys-Website.git
cd Henrys-Website

# remove the old Next.js app (keeps .git)
git rm -r --quiet src public package.json package-lock.json next.config.ts \
  tsconfig.json postcss.config.mjs eslint.config.mjs AGENTS.md CLAUDE.md README.md

# copy EVERYTHING inside this deploy folder into the repo root, then:
git add -A
git commit -m "Replace Next.js site with new static Gannoe Media site"
git push
```

## Hosting note (Vercel)

If the repo deploys via Vercel, open the Vercel project → Settings → Build & Development
and set **Framework Preset** to **Other** (no build command, output directory = repo root).
Vercel then serves the static files directly. GitHub Pages works the same way.

## Known gaps

- **Contact form** does not send email yet — it shows the thank-you state only.
  (The old site used EmailJS; that can be wired into the form handler in
  `gm-redesign-engine.js` → `GM.form`.)
- **Gallery media is placeholder** (stock photos + sample videos) in
  `gallery-data.js` — swap in real work when ready.
