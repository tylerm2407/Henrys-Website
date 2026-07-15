# Gannoe Media — Sanity Studio

The content dashboard for the Gannoe Media site. Henry uploads videos/photos
here; the public site reads them at runtime. Videos are streamed by Mux.

- **Project ID:** `cwyreh3g`
- **Dataset:** `production`
- **Live Studio:** https://gannoemedia.sanity.studio (after first deploy)

## One-time setup (developer)

```bash
cd sanity
npm install
npm run dev        # local Studio at http://localhost:3333
```

### Connect Mux (one time)
1. Create an account at https://mux.com and generate an **API Access Token**
   (Settings → API Access Tokens → new token with *Mux Video* read/write).
2. Open the Studio → the **Mux** input → paste the token when prompted.
   It's stored in Sanity, **not** in this code and **not** in the public site.

### Publish the Studio for Henry
```bash
npm run deploy     # -> https://gannoemedia.sanity.studio
```
Then invite Henry: manage.sanity.io → project → Members → invite his email.

## How the site consumes this
The public site fetches published `work` documents from Sanity's CDN at load
time (see `../gm-cms.js`). No build step. To go live, set `enabled: true` in
`../gm-cms-config.js`.
