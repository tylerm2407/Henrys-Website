/* Gannoe Media — gallery + orbit media set.
   Real client work. Videos are web-optimized H.264 in public/videos/web/.
   The first 10 entries also feed the orbit ring on dark.html (N=10),
   so the strongest cinematic reels are ordered first. */
window.GM_MEDIA = [
  /* ---- orbit ring picks (first 10) ---- */
  { id: 'v-baseballcine', type: 'video', cat: 'Highlights', title: 'Baseball — Cinematic',
    thumb: 'public/images/posters/baseballcine.jpg',
    src: 'public/videos/web/baseballcine.mp4' },
  /* PENDING EMBED — 5 entries below are commented out for launch: their video
     files are too large to self-host and are NOT in the deploy (gitignored).
     After uploading each to YouTube/Vimeo, restore the entry with type:'embed'
     and src set to the embed URL (e.g. https://www.youtube.com/embed/ID or
     https://player.vimeo.com/video/ID).
  { id: 'v-footballvsiu', type: 'embed', cat: 'Highlights', title: 'Football — Penn State vs Indiana',
    thumb: 'public/images/posters/footballvsIU.jpg',
    src: 'EMBED_URL_HERE' },
  */
  { id: 'v-soccercine', type: 'video', cat: 'Highlights', title: 'Soccer — Cinematic',
    thumb: 'public/images/posters/soccercine.jpg',
    src: 'public/videos/web/soccercine.mp4' },
  { id: 'v-laxedit1', type: 'video', cat: 'Highlights', title: 'Lacrosse — Highlight Edit',
    thumb: 'public/images/posters/laxedit1.jpg',
    src: 'public/videos/web/laxedit1.mp4' },
  { id: 'v-womensvb1', type: 'video', cat: 'Highlights', title: 'Women’s Volleyball — Reel',
    thumb: 'public/images/posters/womensvb1.jpg',
    src: 'public/videos/web/womensvb1.mp4' },
  { id: 'v-socceredit', type: 'video', cat: 'Highlights', title: 'Soccer — Highlight Edit',
    thumb: 'public/images/posters/socceredit.jpg',
    src: 'public/videos/web/socceredit.mp4' },
  { id: 'v-footballcine', type: 'video', cat: 'Highlights', title: 'Football — Cinematic',
    thumb: 'public/images/posters/footballcine.jpg',
    src: 'public/videos/web/footballcine.mp4' },
  { id: 'v-baseballedit', type: 'video', cat: 'Highlights', title: 'Baseball — Highlight Edit',
    thumb: 'public/images/posters/baseballedit.jpg',
    src: 'public/videos/web/baseballedit.mp4' },
  /* PENDING EMBED
  { id: 'v-sequence01', type: 'embed', cat: 'Highlights', title: 'Showreel — Feature Cut',
    thumb: 'public/images/posters/sequence-01.jpg',
    src: 'EMBED_URL_HERE' },
  */
  { id: 'v-qbcinecolor', type: 'video', cat: 'Highlights', title: 'Quarterback — Color Grade',
    thumb: 'public/images/posters/qbcinecolor.jpg',
    src: 'public/videos/web/qbcinecolor.mp4' },

  /* ---- remaining videos (gallery wall) ---- */
  { id: 'v-baseballcine2vert', type: 'video', cat: 'Highlights', title: 'Baseball — Vertical Cut',
    thumb: 'public/images/posters/baseballcine2vert.jpg',
    src: 'public/videos/web/baseballcine2vert.mp4' },
  { id: 'v-baseballhrvert', type: 'video', cat: 'Highlights', title: 'Baseball — Home Run',
    thumb: 'public/images/posters/baseballHRvert.jpg',
    src: 'public/videos/web/baseballHRvert.mp4' },
  { id: 'v-laxshort', type: 'video', cat: 'Highlights', title: 'Lacrosse — Short',
    thumb: 'public/images/posters/laxshort.jpg',
    src: 'public/videos/web/laxshort.mp4' },
  { id: 'v-laxshortvert2', type: 'video', cat: 'Highlights', title: 'Lacrosse — Vertical Cut',
    thumb: 'public/images/posters/laxshortvert2.jpg',
    src: 'public/videos/web/laxshortvert2.mp4' },

  /* ---- commercial / business ----
     ALL PENDING EMBED — when restoring any of these, also restore the
     Commercial filter chip in gallery.html.
  { id: 'v-portniantic', type: 'embed', cat: 'Commercial', title: 'Port Niantic — Brand Film',
    thumb: 'public/images/posters/portniantic.jpg',
    src: 'EMBED_URL_HERE' },
  { id: 'v-shellshockers', type: 'embed', cat: 'Commercial', title: 'Shell Shockers — Business',
    thumb: 'public/images/posters/shellshockers.jpg',
    src: 'EMBED_URL_HERE' },
  { id: 'v-thursdaylive', type: 'embed', cat: 'Commercial', title: 'Thursday Live — Event',
    thumb: 'public/images/posters/thursday-live.jpg',
    src: 'EMBED_URL_HERE' },
  */

  /* ---- photography ---- */
  { id: 'p-01', type: 'image', cat: 'Photography', title: 'On Location — 01',
    thumb: 'public/images/gallery/photo-01-thumb.jpg', src: 'public/images/gallery/photo-01.jpg' },
  { id: 'p-02', type: 'image', cat: 'Photography', title: 'On Location — 02',
    thumb: 'public/images/gallery/photo-02-thumb.jpg', src: 'public/images/gallery/photo-02.jpg' },
  { id: 'p-03', type: 'image', cat: 'Photography', title: 'On Location — 03',
    thumb: 'public/images/gallery/photo-03-thumb.jpg', src: 'public/images/gallery/photo-03.jpg' },
  { id: 'p-04', type: 'image', cat: 'Photography', title: 'On Location — 04',
    thumb: 'public/images/gallery/photo-04-thumb.jpg', src: 'public/images/gallery/photo-04.jpg' },
  { id: 'p-05', type: 'image', cat: 'Photography', title: 'On Location — 05',
    thumb: 'public/images/gallery/photo-05-thumb.jpg', src: 'public/images/gallery/photo-05.jpg' },
  { id: 'p-06', type: 'image', cat: 'Photography', title: 'On Location — 06',
    thumb: 'public/images/gallery/photo-06-thumb.jpg', src: 'public/images/gallery/photo-06.jpg' },
  { id: 'p-07', type: 'image', cat: 'Photography', title: 'On Location — 07',
    thumb: 'public/images/gallery/photo-07-thumb.jpg', src: 'public/images/gallery/photo-07.jpg' },
  { id: 'p-08', type: 'image', cat: 'Photography', title: 'On Location — 08',
    thumb: 'public/images/gallery/photo-08-thumb.jpg', src: 'public/images/gallery/photo-08.jpg' },
  { id: 'p-09', type: 'image', cat: 'Photography', title: 'On Location — 09',
    thumb: 'public/images/gallery/photo-09-thumb.jpg', src: 'public/images/gallery/photo-09.jpg' },
  { id: 'p-10', type: 'image', cat: 'Photography', title: 'On Location — 10',
    thumb: 'public/images/gallery/photo-10-thumb.jpg', src: 'public/images/gallery/photo-10.jpg' },
  { id: 'p-11', type: 'image', cat: 'Photography', title: 'On Location — 11',
    thumb: 'public/images/gallery/photo-11-thumb.jpg', src: 'public/images/gallery/photo-11.jpg' },
  { id: 'p-12', type: 'image', cat: 'Photography', title: 'On Location — 12',
    thumb: 'public/images/gallery/photo-12-thumb.jpg', src: 'public/images/gallery/photo-12.jpg' },
];
