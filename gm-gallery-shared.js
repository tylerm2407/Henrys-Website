/* ============================================================
   Gannoe Media — shared gallery modules
   lightbox viewer · orbit ring carousel · depth grid wall
   Requires: gsap + gallery-data.js (window.GM_MEDIA) loaded first.
   ============================================================ */
window.GMGallery = (function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
  const badge = (it) => (it.type === 'video' || it.type === 'embed' || it.type === 'mux') ? '<span class="play">&#9654;</span>' : '';

  function bindOpen(node, item) {
    node.addEventListener('click', () => window.gmOpenLightbox(item));
    node.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.gmOpenLightbox(item); });
  }

  /* ---------- lightbox viewer ---------- */
  function lightbox() {
    const lb = $('#lb');
    if (!lb) return;
    let lastFocus = null;
    window.gmOpenLightbox = function (item) {
      lastFocus = document.activeElement;
      $('#lb-title').textContent = item.title;
      $('#lb-cat').textContent = item.cat + (item.type === 'image' ? ' · Still' : ' · Film');
      const slot = $('#lb-media');
      slot.innerHTML = '';
      if (item.type === 'video') {
        slot.appendChild(el(`<video src="${item.src}" controls autoplay playsinline poster="${item.thumb}"></video>`));
      } else if (item.type === 'embed') {
        const sep = item.src.indexOf('?') > -1 ? '&' : '?';
        slot.appendChild(el(`<iframe src="${item.src}${sep}autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${item.title}"></iframe>`));
      } else if (item.type === 'mux') {
        slot.appendChild(el(`<mux-player playback-id="${item.src}" stream-type="on-demand" autoplay playsinline title="${item.title}" style="width:100%;height:100%;--controls-backdrop-color:rgba(0,0,0,.4)"></mux-player>`));
      } else {
        slot.appendChild(el(`<img src="${item.src}" alt="${item.title}" />`));
      }
      lb.classList.add('open');
      gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo('#lb-card', { scale: 0.86, y: 30 }, { scale: 1, y: 0, duration: 0.55, ease: 'power3.out' });
      $('#lb-close').focus();
    };
    function closeLb() {
      gsap.to(lb, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => { lb.classList.remove('open'); $('#lb-media').innerHTML = ''; lb.style.opacity = ''; if (lastFocus) lastFocus.focus(); },
      });
    }
    $('#lb-close').addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }

  /* ---------- orbit ring (3D carousel, drag to spin) ---------- */
  function orbitRing(stageSel, ringSel) {
    const stage = $(stageSel);
    const ring = $(ringSel);
    if (!stage || !ring) return;
    const N = 10, R = 700; // chord 2·R·sin(π/N) ≈ 432px > 340px card — no overlap
    const M = window.GM_MEDIA || [];
    const items = M.slice(0, N);
    items.forEach((it, i) => {
      const c = el(
        `<div class="g5-card" style="transform:rotateY(${(360 / N) * i}deg) translateZ(${R}px)" tabindex="0">
          <img src="${it.thumb}" alt="" />${badge(it)}
          <div class="meta"><b>${it.title}</b><span>${it.cat}</span></div>
        </div>`);
      bindOpen(c, it);
      ring.appendChild(c);
    });
    const state = { rot: 0 };
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const BASE = REDUCED ? 0 : -5.5; // idle cruise, degrees per second
    let vel = BASE;
    let drag = false, sx = 0, sr = 0, movedTot = 0, lastX = 0, lastT = 0, dragVel = 0;
    stage.addEventListener('pointerdown', (e) => {
      drag = true; sx = lastX = e.clientX; sr = state.rot; movedTot = 0; dragVel = 0; lastT = performance.now();
      gsap.killTweensOf(state);
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      movedTot = Math.abs(e.clientX - sx);
      state.rot = sr + (e.clientX - sx) * 0.18;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      dragVel = ((e.clientX - lastX) * 0.18) / dt * 1000; // deg per second
      lastX = e.clientX; lastT = now;
      apply();
    });
    window.addEventListener('pointerup', () => {
      if (!drag) return; drag = false;
      // fling: carry the throw velocity, clamped, then ease back to cruise
      vel = Math.max(-260, Math.min(260, dragVel));
      if (Math.abs(vel) < 2) vel = BASE;
    });
    ring.addEventListener('click', (e) => { if (movedTot > 8) { e.stopPropagation(); e.preventDefault(); } }, true);

    /* auto-orbit — cruises slowly, throws decay back to cruise speed */
    let prev = performance.now();
    (function spin(now) {
      requestAnimationFrame(spin);
      const dt = Math.min(0.05, (now - prev) / 1000) || 0;
      prev = now;
      if (!drag && dt > 0) {
        vel = BASE + (vel - BASE) * Math.exp(-dt * 0.7); // ease throws back to cruise
        if (BASE !== 0 || Math.abs(vel) > 0.1) {
          state.rot += vel * dt;
          const r = stage.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) apply();
        }
      }
    })(prev);
    function apply() {
      // translateZ(-R) keeps the front card at z≈0 → true scale
      gsap.set(ring, { z: -R, rotateY: state.rot });
      [...ring.children].forEach((c, i) => {
        let a = ((360 / N) * i + state.rot) % 360; if (a < 0) a += 360;
        const facing = Math.cos((a * Math.PI) / 180); // 1 = front
        c.style.opacity = 0.25 + 0.75 * Math.max(0, facing);
        c.style.filter = `brightness(${0.45 + 0.55 * Math.max(0, facing)})`;
      });
    }
    apply();
  }

  /* ---------- depth grid (parallax wall + filters) ---------- */
  function depthGrid(sectionSel, gridSel, filtersSel) {
    const sec = $(sectionSel);
    const grid = $(gridSel);
    if (!sec || !grid) return;
    const spans = [2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2];
    const M = window.GM_MEDIA || [];
    M.forEach((it, i) => {
      const c = el(
        `<div class="g4-card" tabindex="0" data-cat="${it.cat}" data-depth="${(i % 3) + 1}" style="grid-row:span ${spans[i % spans.length]}">
          <img src="${it.thumb}" alt="" />${badge(it)}
          <div class="meta"><b>${it.title}</b><span>${it.cat}</span></div>
        </div>`);
      bindOpen(c, it);
      grid.appendChild(c);
    });
    // mouse parallax by depth layer
    if (!window.matchMedia('(pointer: coarse)').matches) {
      sec.addEventListener('mousemove', (e) => {
        const r = sec.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        grid.querySelectorAll('.g4-card').forEach((c) => {
          const d = +c.dataset.depth;
          gsap.to(c, { x: -nx * d * 9, y: -ny * d * 9, duration: 0.6, ease: 'power2.out' });
        });
      });
    }
    // filter chips
    if (filtersSel) {
      document.querySelectorAll(filtersSel + ' .chip').forEach((ch) => ch.addEventListener('click', () => {
        document.querySelectorAll(filtersSel + ' .chip').forEach((x) => x.classList.toggle('active', x === ch));
        const f = ch.dataset.f;
        gsap.killTweensOf('.g4-card');
        grid.querySelectorAll('.g4-card').forEach((c) => {
          const show = f === 'All' || c.dataset.cat === f;
          gsap.to(c, { opacity: show ? 1 : 0.12, scale: show ? 1 : 0.94, y: 0, duration: 0.45, ease: 'power2.out' });
          c.style.pointerEvents = show ? '' : 'none';
        });
      }));
    }
  }

  return { lightbox, orbitRing, depthGrid };
})();
