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
