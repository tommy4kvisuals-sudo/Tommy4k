/* Home page: reel, project rows with side preview, creator cards, project view, cursor, contact form. */
(function () {
  var U = window.T4KUtil, T = window.T4K, reduce = U.reduce;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var root = document.documentElement;
  function $(id) { return document.getElementById(id); }

  /* ---------- trusted by: enough copies of the logo set to cover the screen, moving exactly one copy per loop ---------- */
  (function () {
    var row = $('logoRow'), list = T.clients || []; if (!row || !list.length) return;
    function makeSet() {
      var set = document.createElement('div'); set.className = 'logos__set';
      list.forEach(function (c) {
        var el;
        if (c.logo) {
          el = document.createElement('span'); el.className = 'logo logo--img'; el.setAttribute('role', 'img'); el.setAttribute('aria-label', c.name);
          el.style.setProperty('--src', "url('" + c.logo + "')"); el.style.width = '120px';
          var im = new Image(); im.onload = function () { var h0 = el.getBoundingClientRect().height || 34, ar = im.naturalWidth / im.naturalHeight, h = Math.min(h0 * 1.15, Math.sqrt(h0 * h0 * 4.2 / ar)); el.style.height = h.toFixed(1) + 'px'; el.style.width = (h * ar).toFixed(1) + 'px'; fillStrip(); }; im.src = c.logo;
        } else { el = document.createElement('span'); el.className = 'logo logo--text'; el.textContent = c.name; }
        set.appendChild(el);
      });
      return set;
    }
    function fillStrip() {
      var first = row.firstElementChild || row.appendChild(makeSet());
      var sw = first.getBoundingClientRect().width; if (!sw) return;
      var need = Math.ceil(row.parentNode.getBoundingClientRect().width / sw) + 1;
      while (row.children.length < need + 1) { var c = makeSet(); c.setAttribute('aria-hidden', 'true'); row.appendChild(c); }
      row.style.setProperty('--shift', sw.toFixed(1) + 'px'); row.style.animationDuration = (sw / 45).toFixed(1) + 's';
    }
    fillStrip();
    var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fillStrip, 200); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillStrip);
  })();

  /* ---------- project rows (real links for Google, open the project view on click) ---------- */
  var rows = $('rows'), pv = $('preview');
  /* Social Spots sits in the list as its own row, right after Aston Martin, and links to its page */
  var rowList = T.video.slice();
  if (T.spots && T.spots.length) {
    var s0 = T.spots[0], at = rowList.map(function (w) { return w.slug; }).indexOf('aston-martin');
    rowList.splice(at < 0 ? Math.min(4, rowList.length) : at + 1, 0, { slug: 'social-spots', name: 'Social Spots', type: 'Launches & promos', href: 'social-spots.html', count: T.spots.length,
      vimeo: s0.vimeo, poster: s0.poster, ar: s0.ar, focus: s0.focus, look: s0.look });
  }
  rowList.forEach(function (w, i) {
    var a = document.createElement('a');
    a.className = 'row' + (w.href ? ' row--group' : ''); a.href = w.href || 'work/' + w.slug + '.html'; a.dataset.cursor = 'View'; a.dataset.i = i;
    var th = document.createElement('div'); th.className = 'row__thumb'; th.appendChild(U.pic(w, w.poster ? '' : '16:9')); a.appendChild(th);
    var n = document.createElement('span'); n.className = 'row__name display'; n.textContent = w.name; a.appendChild(n);
    var t = document.createElement('span'); t.className = 'row__type'; t.textContent = w.type;
    var cnt = w.count || (w.more && w.more.length ? w.more.length + 1 : 0);
    if (cnt) { var tg = document.createElement('em'); tg.className = 'row__count'; tg.textContent = cnt + (w.count ? (cnt === 1 ? ' spot' : ' spots') : ' films'); t.appendChild(tg); }
    a.appendChild(t);
    var ar = document.createElement('span'); ar.className = 'row__arrow'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = '→'; a.appendChild(ar);
    if (!w.href) a.addEventListener('click', function (e) { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); openProject(w, true); });
    rows.appendChild(a);
    var it = document.createElement('div'); it.className = 'preview__item'; it.appendChild(U.pic(w, w.vimeo ? '' : 'Preview loop · Vimeo')); pv.appendChild(it);
  });
  $('video-count').textContent = T.video.length + (T.video.length === 1 ? ' project' : ' projects');

  /* card rows (content creation, social spots): each card plays its film muted, on a loop, while on screen */
  function cardRow(list, cards, countEl, unit) {
    if (!cards) return;
    list = list || [];
    if (!list.length) { var sec = cards.closest('section'); if (sec) sec.hidden = true; return; }
    list.forEach(function (w) {
      var b = document.createElement('a'); b.className = 'card'; b.href = 'work/' + w.slug + '.html'; b.dataset.cursor = 'View';
      var p = document.createElement('div'); p.className = 'card__pic'; p.appendChild(U.pic(w, w.poster ? '' : '9:16')); b.appendChild(p);
      var tx = document.createElement('span'); tx.className = 'card__txt';
      var n = document.createElement('span'); n.className = 'card__name'; n.textContent = w.name; tx.appendChild(n);
      var t = document.createElement('span'); t.className = 'card__type'; t.textContent = w.type; tx.appendChild(t);
      b.appendChild(tx);
      b.addEventListener('click', function (e) { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); openProject(w, true); });
      cards.appendChild(b);
    });
    if (countEl) countEl.textContent = list.length + ' ' + unit + (list.length === 1 ? '' : 's');
    if (reduce || !('IntersectionObserver' in window)) return;
    var els = [].slice.call(cards.querySelectorAll('.card__pic'));
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        var p = e.target, k = els.indexOf(p), f = p.querySelector('iframe');
        if (e.isIntersecting && !f) {
          var src = U.vimeoSrc(list[k].vimeo, 'bg'); if (!src) { io.unobserve(p); return; }
          f = document.createElement('iframe'); f.src = src; f.allow = 'autoplay'; f.tabIndex = -1; f.title = ''; f.setAttribute('aria-hidden', 'true');
          f.addEventListener('load', function () { setTimeout(function () { f.classList.add('ready'); }, 900); });
          p.appendChild(f);
        } else if (f) { vcmd(f, e.isIntersecting ? 'play' : 'pause'); }
      });
    }, { rootMargin: '200px' });
    els.forEach(function (p) { io.observe(p); });
  }
  cardRow(T.creator, $('cards'), $('creator-count'), 'piece');
  cardRow(T.spots, $('spotCards'), $('spots-count'), 'spot');

  /* ---------- reel: Vimeo in the background once a link is added, soft moving light until then ---------- */
  var reel = $('reel'), reelBox = $('reelVideo'), reelFrame = null, reelOn = true;
  var canvas = $('reel-canvas'), ctx = canvas.getContext('2d'), lights = [];
  var bgSrc = U.vimeoSrc(T.reel.vimeo, 'bg');
  if (bgSrc) {
    reelFrame = document.createElement('iframe');
    reelFrame.src = bgSrc; reelFrame.allow = 'autoplay; fullscreen'; reelFrame.tabIndex = -1; reelFrame.title = 'Showreel';
    reelFrame.addEventListener('load', function () { setTimeout(function () { reelFrame.classList.add('ready'); }, 600); });
    reelBox.appendChild(reelFrame);
  }
  for (var q = 0; q < 11; q++) lights.push({ x: (q * .37 + .13) % 1, y: (q * .53 + .21) % 1, r: .1 + ((q * 7) % 5) * .035, warm: q % 3 === 0, sp: .00004 + (q % 4) * .000018, ph: q * 1.7 });
  function fit() { canvas.width = Math.max(320, Math.round(canvas.clientWidth / 2)); canvas.height = Math.max(200, Math.round(canvas.clientHeight / 2)); }
  function draw(t) {
    var w = canvas.width, h = canvas.height;
    ctx.globalCompositeOperation = 'source-over';
    var g0 = ctx.createLinearGradient(0, 0, w, h); g0.addColorStop(0, '#2a3f78'); g0.addColorStop(.7, '#19274c');
    ctx.fillStyle = g0; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    lights.forEach(function (l) {
      var x = (l.x + Math.sin(t * l.sp + l.ph) * .12) * w, y = (l.y + Math.cos(t * l.sp * .8 + l.ph) * .1) * h, r = l.r * Math.max(w, h);
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, l.warm ? 'rgba(239,231,214,0.2)' : 'rgba(64,82,128,0.26)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    });
  }
  var tcEl = $('timecode');
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function loop(t) {
    if (!bgSrc) draw(t);
    var fr = Math.floor(t / 1000 * 24), s = Math.floor(fr / 24);
    if (tcEl) tcEl.textContent = two(Math.floor(s / 3600)) + ':' + two(Math.floor(s / 60) % 60) + ':' + two(s % 60) + ':' + two(fr % 24);
    if (!reduce && reelOn && !document.hidden) requestAnimationFrame(loop);
  }
  fit(); draw(0);
  addEventListener('resize', function () { fit(); draw(performance.now()); });
  function vcmd(frame, m) { if (frame && frame.contentWindow) try { frame.contentWindow.postMessage(JSON.stringify({ method: m }), '*'); } catch (_) {} }
  function playBg() { vcmd(reelFrame, 'play'); if (reelOn) return; reelOn = true; if (!reduce) requestAnimationFrame(loop); }
  function pauseBg() { vcmd(reelFrame, 'pause'); reelOn = false; }
  document.addEventListener('visibilitychange', function () { if (!reduce && reelOn && !document.hidden) requestAnimationFrame(loop); });
  if (!reduce) requestAnimationFrame(loop);

  /* ---------- full reel lightbox ---------- */
  var lb = $('lb'), lbf = $('lbFrame');
  function fill(box, w, label, mode) {
    box.innerHTML = '';
    var src = U.vimeoSrc(w.vimeo, mode || 'player');
    if (src) { var f = document.createElement('iframe'); f.src = src; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.title = w.name || 'Film'; box.appendChild(f); }
    else box.appendChild(U.pic(w, label));
  }
  function openReel(e) {
    if (e) e.preventDefault(); U.setSheet(false);
    fill(lbf, { name: 'Showreel', vimeo: T.reel.vimeo, look: [60, 40, .45, 160] }, 'Full showreel with sound · add the Vimeo link in site-data.js');
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); root.style.overflow = 'hidden'; pauseBg(); $('lbClose').focus();
  }
  function closeReel() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); root.style.overflow = ''; playBg(); setTimeout(function () { lbf.innerHTML = ''; }, 400); }
  document.querySelectorAll('[data-reel]').forEach(function (a) { a.addEventListener('click', openReel); });
  reel.addEventListener('click', openReel);
  reel.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') openReel(e); });
  $('lbClose').addEventListener('click', closeReel);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeReel(); });

  /* ---------- project view: fades in over the home page, back button closes it ---------- */
  var pj = $('pj'), pjf = $('pjFrame'), cur = null, pushed = false, opener = null;
  function openProject(w, push) {
    cur = w; var set = w.set, i = set.indexOf(w);
    $('pjCrumb').textContent = (i + 1 < 10 ? '0' : '') + (i + 1) + ' / ' + (set.length < 10 ? '0' : '') + set.length;
    $('pjTitle').textContent = w.name; $('pjType').textContent = w.type;
    var ab = $('pjAbout'); ab.innerHTML = '';
    (w.about || []).forEach(function (t) { var p = document.createElement('p'); p.textContent = t; ab.appendChild(p); });
    var cr = $('pjCredits'); cr.innerHTML = '';
    (w.credits || []).forEach(function (c) { var dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = c[0]; U.creditInto(dd, c[1]); cr.appendChild(dt); cr.appendChild(dd); });
    $('pjLink').href = 'work/' + w.slug + '.html';
    $('pjLink').textContent = w.more && w.more.length ? 'See all ' + (w.more.length + 1) + ' ' + w.name + ' films' : 'Full project page';
    var ser = $('pjSeries'), stk = $('pjStack'); stk.innerHTML = '';
    if (w.more && w.more.length) {
      ser.href = 'work/' + w.slug + '.html#more';
      $('pjSeriesCount').textContent = '+' + w.more.length + ' more ' + w.name + ' film' + (w.more.length > 1 ? 's' : '');
      w.more.slice(0, 3).forEach(function (f, k) {
        var c = document.createElement('span'); c.className = 'pj__card'; c.style.setProperty('--k', k - (Math.min(w.more.length, 3) - 1) / 2);
        c.appendChild(U.pic({ name: w.name + ' ' + (f.title || ''), type: w.type, poster: f.poster, look: f.look || w.look, vimeo: f.vimeo, focus: f.focus }, ''));
        stk.appendChild(c);
      });
      ser.hidden = false;
    } else ser.hidden = true;
    $('pjMoreName').textContent = set[(i + 1) % set.length].name;
    pjf.style.aspectRatio = String(w.ar);
    pjf.style.width = 'min(100%, calc((100svh - ' + (w.more && w.more.length ? 210 : 120) + 'px) * ' + w.ar.toFixed(4) + '))'; /* leave room for the series button */
    fill(pjf, w, (w.ar < 1 ? '9:16' : '16:9') + ' · add the Vimeo link in site-data.js');
    pj.scrollTop = 0;
    if (!pj.classList.contains('open')) opener = document.activeElement;
    U.setSheet(false); pj.classList.add('open'); pj.setAttribute('aria-hidden', 'false'); root.style.overflow = 'hidden'; pauseBg();
    items.forEach(function (it) { vcmd(it.querySelector('iframe'), 'pause'); });
    if (push && location.hash !== '#' + w.slug) { pushed = true; location.hash = w.slug; }
    try { $('pjClose').focus({ preventScroll: true }); } catch (_) {}
  }
  function closeProject(fromNav) {
    if (!pj.classList.contains('open')) return;
    pj.classList.remove('open'); pj.setAttribute('aria-hidden', 'true'); root.style.overflow = ''; playBg();
    setTimeout(function () { if (!pj.classList.contains('open')) pjf.innerHTML = ''; }, 450);
    if (!fromNav) {
      if (pushed) { pushed = false; history.back(); }
      else { try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {} }
    } else pushed = false;
    if (opener) try { opener.focus({ preventScroll: true }); } catch (_) {}
  }
  $('pjClose').addEventListener('click', function () { closeProject(false); });
  $('pjMore').addEventListener('click', function () {
    var s = cur.set; openProject(s[(s.indexOf(cur) + 1) % s.length], false);
    try { history.replaceState(history.state, '', '#' + cur.slug); } catch (_) {}
  });
  addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (pj.classList.contains('open')) closeProject(false);
    else if (lb.classList.contains('open')) closeReel();
  });
  function route() {
    var h = location.hash.slice(1);
    if (h === 'showreel') { openReel(); return; }
    var w = U.find(h);
    if (w) openProject(w, false); else closeProject(true);
  }
  addEventListener('hashchange', route);

  /* section links glide instead of jumping */
  document.querySelectorAll('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = $(a.getAttribute('data-go')); if (!t) return;
      e.preventDefault(); U.setSheet(false);
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---------- cursor: trailing ring and dot, "View" over projects ---------- */
  var ring = $('cur'), dot = $('dot'), lab = $('curLabel');
  var mx = -200, my = -200, cx = -200, cy = -200;
  if (fine) {
    document.body.classList.add('cursor-on');
    addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; ring.classList.remove('off'); dot.classList.remove('off'); });
    document.addEventListener('pointerleave', function () { ring.classList.add('off'); dot.classList.add('off'); });
    (function tick() { cx += (mx - cx) * .18; cy += (my - cy) * .18; ring.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; requestAnimationFrame(tick); })();
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('[data-cursor]'), l = e.target.closest('a,button,input,textarea,summary');
      var big = !!t && (!l || l === t);
      ring.classList.toggle('big', big); ring.classList.toggle('link', !big && !!l);
      if (big) lab.textContent = t.getAttribute('data-cursor');
      dot.style.opacity = big ? 0 : 1;
    });
  }

  /* ---------- name drifts against the pointer, then shrinks into the header ---------- */
  var nameEl = $('name'), nameGone = false;
  if (fine && !reduce) {
    reel.addEventListener('pointermove', function (e) { if (nameGone) return; var r = reel.getBoundingClientRect(); var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; nameEl.style.transform = 'translate(' + (-x * 18) + 'px,' + (-y * 12) + 'px)'; });
    reel.addEventListener('pointerleave', function () { if (!nameGone) nameEl.style.transform = ''; });
  }
  (function () {
    if (!root.classList.contains('name-intro')) return;
    var timer = 0;
    function finish() { if (nameGone) return; nameGone = true; clearTimeout(timer); removeEventListener('scroll', onS); root.classList.add('name-done'); }
    function busy() { return scrollY > 40 || lb.classList.contains('open') || pj.classList.contains('open'); }
    function onS() { if (scrollY > 40) finish(); }
    function shrink() {
      if (nameGone) return;
      if (busy() || !nameEl.animate) { finish(); return; }
      nameGone = true; removeEventListener('scroll', onS);
      nameEl.style.transition = 'none'; nameEl.style.transform = '';
      var an = nameEl.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.35)', opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' });
      an.onfinish = function () { setTimeout(function () { root.classList.add('name-done'); an.cancel(); nameEl.style.transition = ''; }, 180); };
    }
    if (location.hash.length > 1 || scrollY > 40) { finish(); return; }
    addEventListener('scroll', onS, { passive: true });
    function start() { timer = setTimeout(shrink, 3000); }
    if (!root.classList.contains('is-preloading')) start();
    else { var mo = new MutationObserver(function () { if (!root.classList.contains('is-preloading')) { mo.disconnect(); start(); } }); mo.observe(root, { attributes: true, attributeFilter: ['class'] }); }
  })();

  /* ---------- side preview: lines up with the hovered row and loops that project's film ---------- */
  var items = [].slice.call(pv.querySelectorAll('.preview__item')), act = -1, loaded = false;
  function loadVideos() {
    if (loaded) return; loaded = true;
    items.forEach(function (it, k) {
      var src = U.vimeoSrc(rowList[k].vimeo, 'bg'); if (!src) return;
      var f = document.createElement('iframe'); f.src = src; f.allow = 'autoplay'; f.tabIndex = -1; f.title = '';
      if (rowList[k].ar < 1) f.style.height = (16 / 9 / rowList[k].ar * 100).toFixed(1) + '%'; /* vertical film: fill the wide preview instead of letterboxing */
      f.addEventListener('load', function () { if (k !== act) vcmd(f, 'pause'); setTimeout(function () { f.classList.add('ready'); }, 900); });
      it.appendChild(f);
    });
  }
  if (fine) {
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { loadVideos(); o.disconnect(); } }, { rootMargin: '400px' }).observe(rows);
    rows.addEventListener('pointerleave', function () { pv.classList.remove('on'); items.forEach(function (it) { it.classList.remove('on'); vcmd(it.querySelector('iframe'), 'pause'); }); act = -1; });
    rows.querySelectorAll('.row').forEach(function (r) {
      r.addEventListener('pointerenter', function () {
        loadVideos();
        var i = +r.dataset.i;
        pv.style.top = (r.offsetTop + r.offsetHeight / 2) + 'px'; pv.classList.add('on');
        if (i === act) return;
        items.forEach(function (it, k) { it.classList.toggle('on', k === i); it.style.zIndex = k === i ? 2 : 1; vcmd(it.querySelector('iframe'), k === i ? 'play' : 'pause'); });
        act = i;
      });
    });
  }

  /* ---------- contact form: emailed to Tommy through FormSubmit (works on any host) ---------- */
  var form = $('form'), st = $('status'), btn = form.querySelector('button');
  var live = /(^|\.)tommy4k\.com$|\.netlify\.app$|\.github\.io$/.test(location.hostname);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var miss = [].slice.call(form.querySelectorAll('[required]')).filter(function (f) { return !f.value.trim(); });
    if (miss.length) { st.textContent = 'Please fill in the required fields.'; miss[0].focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('email').value.trim())) { st.textContent = 'Please check your email address.'; $('email').focus(); return; }
    var to = ((T.contact || {}).email || '').trim();
    if (form.elements._honey.value) { form.reset(); st.textContent = 'Thanks, I\'ll be in touch soon.'; return; }
    if (!live || !to) { st.textContent = 'Preview only: nothing was sent. On the live site this goes straight to Tommy\'s inbox.'; return; }
    var d = {
      'Name': (form.elements['first-name'].value + ' ' + form.elements['last-name'].value).trim(),
      'Email': form.elements.email.value.trim(),
      'Phone': form.elements.phone.value.trim() || '-',
      'Project details': form.elements['project-details'].value.trim(),
      _replyto: form.elements.email.value.trim(),
      _subject: 'New enquiry from tommy4k.com: ' + form.elements['first-name'].value.trim() + ' ' + form.elements['last-name'].value.trim(),
      _template: 'table', _captcha: 'false'
    };
    btn.disabled = true; st.textContent = 'Sending…';
    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) === 'false') throw 0; }); })
      .then(function () { form.reset(); st.textContent = 'Thanks, I\'ll be in touch soon.'; })
      .catch(function () { st.textContent = 'Something went wrong. Email me at ' + to + '.'; })
      .then(function () { btn.disabled = false; });
  });

  if (location.hash.length > 1) route();
})();
