/* Gannoe Media — CMS loader.
   Builds window.GM_MEDIA from Sanity/Mux at runtime, mapping to the same shape
   the gallery already expects: {id, type, cat, title, thumb, src[, playbackId]}.
   Falls back to the static gallery-data.js array on disable/empty/error so the
   gallery is never blank. Load AFTER gallery-data.js, BEFORE gm-gallery-shared.js.

   Usage in the page: GM_loadMedia().then(() => { GMGallery.orbitRing(...); ... }) */
window.GM_loadMedia = async function () {
  const cfg = window.GM_CMS || {};
  const staticMedia = Array.isArray(window.GM_MEDIA) ? window.GM_MEDIA.slice() : [];
  const useStatic = () => { window.GM_MEDIA = staticMedia; return window.GM_MEDIA; };

  if (!cfg.enabled || !cfg.projectId) return useStatic();

  // Pull published work, ordered; dereference the Mux asset for its playbackId
  // and the image asset for its CDN url.
  const groq =
    '*[_type=="work" && (mediaType=="image" || defined(video.asset))]|order(order asc){' +
    '_id,title,category,mediaType,order,' +
    '"playbackId":video.asset->playbackId,' +
    '"imageUrl":image.asset->url}';
  const url =
    'https://' + cfg.projectId + '.apicdn.sanity.io/v2023-05-03/data/query/' +
    (cfg.dataset || 'production') + '?query=' + encodeURIComponent(groq);

  try {
    const res = await fetch(url);
    const json = await res.json();
    const rows = Array.isArray(json.result) ? json.result : [];
    const mapped = rows.map((r) => {
      if (r.mediaType === 'image') {
        if (!r.imageUrl) return null;
        return {
          id: r._id, type: 'image', cat: r.category, title: r.title,
          thumb: r.imageUrl + '?w=800&fit=max&auto=format',
          src: r.imageUrl + '?w=2000&fit=max&auto=format',
        };
      }
      if (!r.playbackId) return null;
      return {
        id: r._id, type: 'mux', cat: r.category, title: r.title,
        playbackId: r.playbackId,
        thumb: 'https://image.mux.com/' + r.playbackId + '/thumbnail.jpg?width=800&fit_mode=preserve',
        src: r.playbackId,
      };
    }).filter(Boolean);

    if (!mapped.length) return useStatic();
    window.GM_MEDIA = mapped;
    return window.GM_MEDIA;
  } catch (e) {
    console.warn('[GM] Sanity fetch failed — using static media.', e);
    return useStatic();
  }
};
