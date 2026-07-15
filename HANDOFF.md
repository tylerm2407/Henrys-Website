# Gannoe Media — Client Handoff & Self-Serve Content Guide

This document covers two things:
1. **For Henry** — how to add/change videos and photos yourself, no developer needed.
2. **For the developer / owner** — how full ownership of the code, hosting, and domain is transferred.

---

## Part 1 — Self-serve content (for Henry)

You never touch code to update the site. All videos and photos live in a
dashboard called **Sanity Studio**. Uploaded videos are streamed by **Mux**
(handles any file size, auto-generates thumbnails, adaptive quality).

### Add a new video or photo
1. Go to **https://gannoemedia.sanity.studio** and log in (Google).
2. Click **Work → Create new**.
3. Fill in:
   - **Title** — e.g. `Baseball — Cinematic`
   - **Category** — Highlights, Commercial, or Photography (drives the filter tabs)
   - **Media type** — Video or Image
   - **Video** — drag your file in; Mux ingests + transcodes automatically
     (wait for it to finish before publishing), **or Image** — upload the photo
   - **Order** — lower numbers appear first. The first ~10 also feed the
     spinning orbit ring on the homepage, so put your strongest reels first.
4. Click **Publish**. The site picks it up on the next page load.

### Edit or remove
- Open the item, change fields, **Publish** again.
- To remove: open the item → **⋮ menu → Delete**.

### Notes
- No file-size limit — big feature cuts are fine, Mux streams them.
- Thumbnails are automatic (pulled from the video). For photos, the uploaded
  image is the thumbnail.
- Changes are live within seconds; hard-refresh if you don't see them.

---

## Part 2 — Ownership transfer (for the developer / owner)

Goal: the client owns everything under their own accounts. Nothing is locked to
the developer.

### Accounts to create / transfer (under the client's email)
| Asset | Action |
|-------|--------|
| **Domain** `gannoemedia.com` | Client buys under their own registrar account |
| **GitHub repo** | Repo → Settings → *Transfer ownership* → client's account/org |
| **Vercel hosting** | Client's own Vercel account, connected to their repo; deploys + billing under them |
| **Sanity** (content CMS) | Client is the org owner; developer added as member if on retainer |
| **Mux** (video streaming) | Client's own account; billing under them |

### Environment / config
The site reads its CMS connection from **`gm-cms-config.js`** (Sanity project ID
+ dataset). No secret keys ship to the browser — Sanity's content API and Mux
playback IDs are public-read by design. Mux *upload* tokens live only inside the
Sanity Studio project, not the public site.

### Deploy
Static site — Vercel auto-deploys on every push to `main`. No build command
needed (it's plain HTML/CSS/JS). To preview locally, run any static server in
the repo root (e.g. `npx serve`).

### If keeping a maintenance relationship
Stay added as a collaborator on GitHub + a member on Sanity/Vercel. Otherwise
remove yourself after transfer — the client is fully self-sufficient.

---

## Reusable freelance SOP (internal — NovaWealth)

This same flow is the clean-exit template for every web client:
1. **Decouple content from code** — anything the client updates routinely goes
   behind a dashboard (CMS), never in the repo.
2. **Client owns the accounts** — domain, hosting, CMS, media, all under their
   email from day one (or transferred at handoff).
3. **Hand over a packet** — this doc + a short Loom walkthrough.
4. **Optional retainer** — keep collaborator access only if paid to maintain.
