/* ============================================================
   Gannoe Media — Redesign shared engine
   Camera scroll v3: frame-blended scrubbing, lerped progress,
   depth ghost, scene phases. Plus reveals, parallax, cursor,
   magnetic buttons, timecode, marquee helpers, form.
   Requires: gsap + ScrollTrigger loaded first.
   ============================================================ */
window.GM = (function () {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- frame sequence ---------- */
  const N = 100;
  /* 4K set on large/hi-dpi displays; 1080 set on small screens (same look, saner memory) */
  const FRAME_DIR = (Math.min(screen.width, screen.height) * Math.min(window.devicePixelRatio || 1, 2) > 1100)
    ? 'public/images/camera-frames-4k'
    : 'public/images/camera-frames-1080';
  const SRC = (n) => `${FRAME_DIR}/frame-${String(n + 1).padStart(3, '0')}.webp`;
  const frames = new Array(N);
  const ready = new Array(N).fill(false);

  function preload(srcFn) {
    const S = srcFn || SRC;
    // coarse pass first (every 4th), then fill — scrub works early, sharpens fast
    const order = [];
    for (let i = 0; i < N; i += 4) order.push(i);
    for (let i = 0; i < N; i++) if (i % 4 !== 0) order.push(i);
    order.forEach((i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = S(i);
      img.onload = () => {
        if (window.createImageBitmap) {
          /* pre-decode to a GPU-friendly bitmap so drawImage never stalls mid-scroll */
          createImageBitmap(img).then((bm) => { frames[i] = bm; ready[i] = true; })
            .catch(() => { frames[i] = img; ready[i] = true; });
        } else {
          frames[i] = img; ready[i] = true;
        }
      };
      frames[i] = img;
    });
  }

  function nearest(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (ready[i]) return i;
    for (let d = 1; d < N; d++) {
      if (i - d >= 0 && ready[i - d]) return i - d;
      if (i + d < N && ready[i + d]) return i + d;
    }
    return -1;
  }

  /* ---------- camera scroll ---------- */
  function camera(opts) {
    const sec = document.querySelector(opts.section);
    const canvas = document.querySelector(opts.canvas);
    const ghost = opts.ghost ? document.querySelector(opts.ghost) : null;
    if (!sec || !canvas) return null;
    const ctx = canvas.getContext('2d');
    const gctx = ghost ? ghost.getContext('2d') : null;
    let pos = 0, target = 0, lastDrawn = -1, lastW = 0, lastGhost = -1, lastT = 0;

    function size() {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (ghost) { ghost.width = Math.round(r.width * 0.5); ghost.height = Math.round(r.height * 0.5); }
      lastDrawn = -1;
    }

    function paint(cv, c2, p, mult) {
      const cw = cv.width, ch = cv.height;
      c2.clearRect(0, 0, cw, ch);
      /* single nearest frame at full alpha — cross-fading two frames of a
         moving subject reads as motion-blur ghosting at slow scroll speeds */
      const i = nearest(Math.round(p * (N - 1)));
      if (i < 0) return;
      const sc = (typeof opts.scale === 'function' ? opts.scale(p) : (opts.scale || 0.8)) * (mult || 1);
      const s = Math.min(cw, ch) * sc;
      const x = cw * (typeof opts.x === 'function' ? opts.x(p) : (opts.x ?? 0.5));
      const y = ch * (typeof opts.y === 'function' ? opts.y(p) : (opts.y ?? 0.5));
      c2.globalAlpha = 1;
      c2.drawImage(frames[i], x - s / 2, y - s / 2, s, s);
    }

    function progressNow() {
      const vh = window.innerHeight;
      const total = sec.offsetHeight - vh;
      const r = sec.getBoundingClientRect();
      return Math.max(0, Math.min(1, -r.top / total));
    }

    function apply() {
      if (opts.phases) opts.phases.forEach((ph) => {
        ph.node = ph.node || document.querySelector(ph.el);
        if (ph.node) ph.node.classList.toggle('on', pos >= ph.from && pos < ph.to);
      });
      if (opts.onProgress) opts.onProgress(pos);
    }

    /* hard update — used when rAF is throttled (hidden/background tab) */
    function hardUpdate() {
      if (canvas.width === 0 && canvas.parentElement.getBoundingClientRect().width > 0) size();
      pos = target = progressNow();
      paint(canvas, ctx, pos, 1);
      if (gctx) paint(ghost, gctx, pos, 1.04);
      lastDrawn = pos; lastW = canvas.width;
      apply();
    }

    function loop(now) {
      const vh = window.innerHeight;
      const r = sec.getBoundingClientRect();
      target = progressNow();
      /* frame-rate-independent smoothing — identical feel at 30, 60 or 120 fps */
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;
      pos += (target - pos) * (1 - Math.exp(-10 * dt));
      if (Math.abs(target - pos) < 0.0004) pos = target;
      const visible = r.bottom > 0 && r.top < vh;
      /* self-heal: if init raced layout and the canvas sized to 0, re-size once layout exists */
      if (visible && canvas.width === 0 && canvas.parentElement.getBoundingClientRect().width > 0) {
        size();
      }
      if (visible && (Math.abs(pos - lastDrawn) > 0.0005 || canvas.width !== lastW)) {
        paint(canvas, ctx, pos, 1);
        /* ghost is blurred to 46px anyway — repaint it on a coarser grid */
        if (gctx && Math.abs(pos - lastGhost) > 0.004) { paint(ghost, gctx, pos, 1.04); lastGhost = pos; }
        lastDrawn = pos; lastW = canvas.width;
      }
      if (visible) apply();
      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', size);
    window.addEventListener('scroll', () => { if (document.hidden) hardUpdate(); }, { passive: true });
    /* hidden/background docs get no rAF and unreliable scroll events — poll instead */
    setInterval(() => { if (document.hidden) hardUpdate(); }, 300);
    size();
    lastT = performance.now();
    requestAnimationFrame(loop);
    /* first paint as soon as any frame decodes, even without rAF */
    const bootPaint = setInterval(() => {
      if (ready.some(Boolean)) { hardUpdate(); clearInterval(bootPaint); }
    }, 120);
    return { size, hardUpdate };
  }

  /* ---------- scroll reveals ---------- */
  function reveals() {
    if (document.hidden) return; /* background tab: keep content visible, skip entrance anims */
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.15, ease: 'power3.out',
          delay: parseFloat(el.dataset.reveal) || 0,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
    });
  }

  /* ---------- parallax media ---------- */
  function parallax() {
    if (document.hidden) return;
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const amt = parseFloat(el.dataset.parallax) || 10;
      gsap.fromTo(el, { yPercent: -amt }, {
        yPercent: amt, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---------- custom cursor ---------- */
  function cursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'gm-cur-dot';
    ring.className = 'gm-cur-ring';
    ring.innerHTML = '<span></span>';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    const label = ring.querySelector('span');
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    (function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, .tchip, input, textarea');
      if (t) { ring.classList.add('big'); label.textContent = t.dataset.cursor; }
      else { ring.classList.remove('big'); label.textContent = ''; ring.classList.toggle('mid', !!link); }
    });
  }

  /* ---------- magnetic buttons ---------- */
  function magnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - r.left - r.width / 2;
        const dy = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${dx * 0.2}px, ${dy * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- running timecode ---------- */
  function timecode(el) {
    if (!el) return;
    let f = 0;
    const p = (n) => String(n).padStart(2, '0');
    setInterval(() => {
      f = (f + 1) % 2073600;
      el.textContent = `${p(Math.floor(f / 86400))}:${p(Math.floor(f / 1440) % 60)}:${p(Math.floor(f / 24) % 60)}:${p(f % 24)}`;
    }, 1000 / 24);
  }

  /* ---------- contact form ---------- */
  function form(formSel, sentSel) {
    const f = document.querySelector(formSel);
    if (!f) return;
    const cfg = window.GM_FORM || {};
    const service = () => {
      const chip = f.querySelector('.tchip.on');
      return chip ? chip.textContent.trim() : '';
    };
    const showSent = () => {
      f.classList.add('hide');
      const s = document.querySelector(sentSel);
      if (s) s.classList.add('show');
    };
    /* no endpoint configured (or send failed) -> open the visitor's email app
       pre-filled, so the lead still has a path out */
    const mailtoFallback = (data) => {
      const subject = 'Project inquiry — ' + (service() || 'Gannoe Media');
      const body =
        'Name: ' + (data.get('name') || '') + '\n' +
        'Email: ' + (data.get('email') || '') + '\n' +
        'Service: ' + service() + '\n\n' +
        (data.get('project') || '');
      location.href = 'mailto:' + (cfg.fallbackEmail || '') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    };
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(f);
      data.append('service', service());
      if (!cfg.endpoint) { mailtoFallback(data); return; }
      const btn = f.querySelector('.send');
      if (btn) btn.disabled = true;
      try {
        const r = await fetch(cfg.endpoint, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (!r.ok) throw new Error('send failed: ' + r.status);
        showSent();
      } catch (err) {
        mailtoFallback(data);
      } finally {
        if (btn) btn.disabled = false;
      }
    });
    f.querySelectorAll('.tchip').forEach((c) => c.addEventListener('click', () => {
      f.querySelectorAll('.tchip').forEach((x) => x.classList.toggle('on', x === c));
    }));
  }

  /* ---------- sticky REC hud over a section ---------- */
  function recHud(hudSel, sectionSel) {
    const hud = document.querySelector(hudSel);
    const sec = document.querySelector(sectionSel);
    if (!hud || !sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 65%', end: 'bottom 35%',
      onToggle: (self) => hud.classList.toggle('on', self.isActive),
    });
  }

  /* ---------- mobile hamburger menu ---------- */
  function burger() {
    const btn = document.querySelector('.burger');
    const menu = document.querySelector('.mob-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* auto-init burger on load */
  burger();

  return { preload, camera, reveals, parallax, cursor, magnetic, timecode, form, recHud, burger, N };
})();
