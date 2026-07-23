/* Gannoe Media — CMS connection config (public values only, safe to commit).
   Sanity project id + dataset are public by design; no secrets here.

   enabled:false  -> site uses the built-in static media in gallery-data.js
                     (exactly how the site behaves today).
   enabled:true   -> site pulls live content from Sanity/Mux.

   Flip to true once Mux is connected and Henry has published work in the Studio.
   If Sanity is unreachable or returns nothing, the site auto-falls back to the
   static media, so it never renders an empty gallery. */
window.GM_CMS = {
  projectId: 'cwyreh3g',
  dataset: 'production',
  enabled: false,
};

/* Contact form delivery. Create a free form at https://formspree.io (point it
   at the inbox that should receive leads) and paste its endpoint below, e.g.
   'https://formspree.io/f/abcdwxyz'. Form IDs are public — safe to commit.
   While empty, the Send button falls back to opening the visitor's email app
   with the message pre-filled, so no lead is silently dropped. */
window.GM_FORM = {
  endpoint: '',
  fallbackEmail: 'hello@gannoemedia.com',
};
