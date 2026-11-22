/* Shared by every page: film grain, header, mobile menu, Vimeo and placeholder helpers. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = window.T4K || { reel: {}, video: [], creator: [] };

  /* every project knows its set, aspect ratio and page address */
  (T.video || []).forEach(function (w) { w.ar = w.ar || 16 / 9; w.set = T.video; w.kind = 'video'; });
  (T.creator || []).forEach(function (w) { w.ar = 9 / 16; w.set = T.creator; w.kind = 'creator'; });
  (T.documentary || []).forEach(function (w) { w.ar = w.ar || 16 / 9; w.set = T.documentary; w.kind = 'documentary'; });
  (T.spots || []).forEach(function (w) { w.ar = w.ar || 9 / 16; w.set = T.spots; w.kind = 'spots'; });

  /* "https://vimeo.com/123456789/abc123" -> { id: '123456789', h: 'abc123' } */
  function vimeo(link) {
    if (!link) return null;
    var m = String(link).match(/(?:vimeo\.com\/(?:video\/)?)?(\d{6,})(?:[\/?](?:h=)?([0-9a-f]{6,}))?/i);
    return m ? { id: m[1], h: m[2] || '' } : null;
  }
  /* Vimeo only loads on the real site (and local testing); in previews that block outside media, show placeholders instead */
  var canEmbed = /(^|\.)tommy4k\.com$|\.netlify\.app$|\.github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname) || location.protocol === 'file:';
  function vimeoSrc(link, mode) {
    var v = vimeo(link); if (!v || !canEmbed) return '';
    var q = mode === 'bg'
      ? 'background=1&autoplay=1&loop=1&muted=1&dnt=1'
      : 'autoplay=1&dnt=1&title=0&byline=0&portrait=0&color=efe7d6';
    return 'https://player.vimeo.com/video/' + v.id + '?' + (v.h ? 'h=' + v.h + '&' : '') + q;
  }
  function lookStyle(l) { l = l || [60, 40, .45, 150]; return '--lx:' + l[0] + '%;--ly:' + l[1] + '%;--warm:' + l[2] + ';--tilt:' + l[3] + 'deg'; }
  /* a still if there is one, otherwise a soft placeholder */
  function placeholder(w, label) {
    var s = document.createElement('span'); s.className = 'ph'; s.style.cssText = lookStyle(w.look);
    if (label) { var sm = document.createElement('small'); sm.textContent = label; s.appendChild(sm); }
    return s;
  }
  /* a still if there is one and it loads, otherwise a soft placeholder */
  function pic(w, label, base) {
    var remote = /^https?:/.test(w.poster || '');
    if (w.poster && (canEmbed || !remote)) {
      var im = document.createElement('img'); im.className = 'media-fill'; im.loading = 'lazy';
      im.alt = w.name + ' ' + (w.type || '').toLowerCase() + ' by Tommy 4K';
      im.onerror = function () { if (im.parentNode) im.parentNode.replaceChild(placeholder(w, label), im); };
      if (w.focus) im.style.objectPosition = w.focus;
      im.src = (remote ? '' : (base || '')) + w.poster; return im;
    }
    if (w.vimeo && !canEmbed) label = w.name + ' · film plays on the live site';
    return placeholder(w, label);
  }
  function find(slug) { var all = (T.video || []).concat(T.creator || [], T.documentary || [], T.spots || []), r = null; all.forEach(function (w) { if (w.slug === slug) r = w; }); return r; }

  /* credits: plain names stay text, @handles link to Instagram */
  function creditInto(dd, text) {
    dd.textContent = '';
    String(text).split(/,\s*/).forEach(function (item, n) {
      if (n) dd.appendChild(document.createTextNode(', '));
      var m = item.match(/^(.*)\|([A-Za-z0-9._]+)$/), h = item.match(/^@([A-Za-z0-9._]+)$/);
      if (m || h) { var a = document.createElement('a'); a.href = 'https://www.instagram.com/' + (m ? m[2] : h[1]).replace(/\.$/, '') + '/'; a.target = '_blank'; a.rel = 'noopener'; a.textContent = m ? m[1] : '@' + h[1]; dd.appendChild(a); }
      else dd.appendChild(document.createTextNode(item));
    });
  }
  /* roles one person holds are shown once: "Director / DP / Edit  Tommy Omolabi" */
  function mergeCredits(list) {
    var out = [], idx = {};
    (list || []).forEach(function (c) {
      var who = String(c[1]).trim();
      if (who in idx) { out[idx[who]][0].push(c[0]); return; }
      idx[who] = out.length; out.push([[c[0]], c[1]]);
    });
    return out.map(function (c) {
      var roles = c[0].length > 1 ? c[0].map(function (r) { return r === 'Editor' ? 'Edit' : r; }) : c[0];
      return [roles.join('/'), c[1]];
    });
  }
  /* the pop-up on the home page shows the key crew; the project page lists everyone */
  function keyCredits(list) {
    function rank(r) {
      if (/client|brand/i.test(r)) return 0;
      if (/art|creative|set design|production design/i.test(r)) return 6;
      if (/director|\bdp\b|creator/i.test(r)) return 1;
      if (/producer/i.test(r)) return 2;
      if (/1st ac/i.test(r)) return 3;
      if (/gaffer/i.test(r)) return 4;
      if (/edit/i.test(r)) return 5;
      return -1;
    }
    return mergeCredits(list).map(function (c, i) { return { c: c, r: rank(c[0]), i: i }; })
      .filter(function (x) { return x.r >= 0; })
      .sort(function (a, b) { return a.r - b.r || a.i - b.i; })
      .map(function (x) { return x.c; });
  }
  window.T4KUtil = { mergeCredits: mergeCredits, keyCredits: keyCredits, creditInto: creditInto, reduce: reduce, canEmbed: canEmbed, vimeo: vimeo, vimeoSrc: vimeoSrc, lookStyle: lookStyle, pic: pic, find: find };

  /* grain: a handful of film-like frames swapped about 12 times a second, so it flickers in place */
  (function () {
    var els = document.querySelectorAll('.grain'), frames = [], N = 6, S = 256;
    try {
      for (var f = 0; f < N; f++) {
        var c = document.createElement('canvas'); c.width = c.height = S;
        var x = c.getContext('2d'), im = x.createImageData(S, S), d = im.data;
        for (var i = 0; i < d.length; i += 4) {
          var g = (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 0.5;
          var v = Math.max(0, Math.min(255, 128 + g * 150)) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
        }
        x.putImageData(im, 0, 0); frames.push('url(' + c.toDataURL() + ')');
      }
      var k = 0;
      function paint() { var p = ((Math.random() * S) | 0) + 'px ' + ((Math.random() * S) | 0) + 'px'; for (var j = 0; j < els.length; j++) { els[j].style.backgroundImage = frames[k]; els[j].style.backgroundPosition = p; } }
      paint();
      if (!reduce) setInterval(function () { k = (k + 1 + ((Math.random() * (N - 1)) | 0)) % N; paint(); }, 83);
    } catch (_) {}
  })();

  /* header: solid once scrolled, hides on the way down, back on the way up */
  var hd = document.getElementById('header'), last = 0;
  function onScroll() { if (!hd) return; var y = scrollY; hd.classList.toggle('solid', y > 40); hd.classList.toggle('hide', y > last && y > 400); last = y; }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  var menu = document.getElementById('menu'), sheet = document.getElementById('sheet');
  function setSheet(o) {
    if (!menu || !sheet) return;
    sheet.classList.toggle('open', o); menu.setAttribute('aria-expanded', o); sheet.setAttribute('aria-hidden', !o);
    menu.classList.toggle('open', o); menu.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
  }
  if (menu && sheet) {
    menu.addEventListener('click', function () { setSheet(!sheet.classList.contains('open')); });
    sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setSheet(false); }); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('open')) setSheet(false); });
  }
  window.T4KUtil.setSheet = setSheet;
})();

/* ---------- "Send me a message": a small chat-style enquiry that stays on every page ---------- */
(function () {
  var me = document.currentScript, base = me ? me.src.replace(/common\.js.*$/, '') : '';
  var T = window.T4K || {}, to = ((T.contact || {}).email || '').trim();
  var live = /(^|\.)tommy4k\.com$|\.netlify\.app$|\.github\.io$/.test(location.hostname);
  var KEY = 't4k-msg', av = base + 'media/tommy-avatar.jpg';
  var TYPES = ['Commercial', 'Content creation', 'Social spots', 'Documentary', 'Something else'];
  var send = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var w = document.createElement('div'); w.className = 'msg'; w.id = 'msg';
  w.innerHTML =
    '<div class="msg__panel" id="msgPanel" role="dialog" aria-labelledby="msgWho" aria-hidden="true">' +
      '<div class="msg__top"><span class="msg__av"><img src="' + av + '" alt=""><i></i></span>' +
        '<div class="msg__who"><b id="msgWho">Tommy Omolabi</b><span>Director &amp; DP · Atlanta</span></div>' +
        '<button class="msg__x" type="button" aria-label="Close">&times;</button></div>' +
      '<div class="msg__body">' +
        '<p class="msg__bubble">Hey, I\'m Tommy. Tell me what you\'re making and I\'ll get back to you personally.</p>' +
        '<form class="msg__form" novalidate>' +
          '<p hidden><label>Leave this empty <input name="_honey" tabindex="-1" autocomplete="off"></label></p>' +
          '<div class="msg__q">What are you making?</div>' +
          '<div class="msg__chips">' + TYPES.map(function (t) { return '<button type="button" class="msg__chip" aria-pressed="false">' + t + '</button>'; }).join('') + '</div>' +
          '<input name="who" placeholder="Your name" autocomplete="name" aria-label="Your name" required>' +
          '<input name="email" type="email" placeholder="Email" autocomplete="email" aria-label="Email" required>' +
          '<div class="msg__compose"><textarea name="message" rows="3" placeholder="Tell me about the project…" aria-label="Message" required></textarea>' +
          '<button class="msg__send" type="submit" aria-label="Send">' + send + '</button></div>' +
          '<p class="msg__status" role="status"></p>' +
        '</form>' +
        '<div class="msg__done" hidden></div>' +
      '</div>' +
      '<a class="msg__mail" href="mailto:' + to + '">Prefer email? ' + to + '</a>' +
    '</div>' +
    '<button class="msg__pill" type="button" aria-expanded="false" aria-controls="msgPanel">' +
      '<span class="msg__av"><img src="' + av + '" alt=""><i></i></span>' +
      '<span class="msg__txt">Send me a message</span>' +
      '<span class="msg__go">' + send + '</span>' +
    '</button>';
  document.body.appendChild(w);

  var pill = w.querySelector('.msg__pill'), panel = w.querySelector('.msg__panel'), form = w.querySelector('form');
  var st = w.querySelector('.msg__status'), done = w.querySelector('.msg__done'), chips = [].slice.call(w.querySelectorAll('.msg__chip'));
  var bubble = w.querySelector('.msg__bubble');

  /* keep what they've typed while they move between pages */
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ n: form.elements.who.value, e: form.email.value, m: form.message.value, t: type() })); } catch (_) {} }
  function type() { var c = chips.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0]; return c ? c.textContent : ''; }
  function pick(t) { chips.forEach(function (b) { b.setAttribute('aria-pressed', b.textContent === t); }); }
  try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d) { form.elements.who.value = d.n || ''; form.email.value = d.e || ''; form.message.value = d.m || ''; pick(d.t); } } catch (_) {}
  chips.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('aria-pressed') === 'true' ? '' : b.textContent); save(); }); });
  form.addEventListener('input', save);

  function open(o) {
    w.classList.toggle('open', o); pill.setAttribute('aria-expanded', o); panel.setAttribute('aria-hidden', !o);
    if (o) setTimeout(function () { (done.hidden ? (form.elements.who.value ? form.message : form.elements.who) : w.querySelector('.msg__x')).focus({ preventScroll: true }); }, 250);
  }
  pill.addEventListener('click', function () { open(!w.classList.contains('open')); });
  w.querySelector('.msg__x').addEventListener('click', function () { open(false); pill.focus(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && w.classList.contains('open')) { open(false); pill.focus(); } });
  document.addEventListener('pointerdown', function (e) { if (w.classList.contains('open') && !w.contains(e.target)) open(false); });
  /* any "Get in touch" / "Contact" link can open it with data-msg */
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-msg]'); if (a) { e.preventDefault(); open(true); } });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var miss = [form.elements.who, form.email, form.message].filter(function (f) { return !f.value.trim(); });
    if (miss.length) { st.textContent = 'Add your name, email and a quick note.'; miss[0].focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())) { st.textContent = 'Check your email address.'; form.email.focus(); return; }
    var name = form.elements.who.value.trim(), first = name.split(/\s+/)[0];
    function finish() {
      form.hidden = true; bubble.hidden = true; done.hidden = false;
      done.innerHTML = '<p class="msg__bubble msg__bubble--you"></p><p class="msg__bubble">Got it, ' + first.replace(/[<>&"]/g, '') + '. It\'s in my inbox and I\'ll be in touch soon.</p>';
      done.firstChild.textContent = form.message.value.trim();
      form.reset(); pick(''); try { localStorage.removeItem(KEY); } catch (_) {}
    }
    if (form._honey.value) { finish(); return; }
    if (!live || !to) { st.textContent = 'Preview only: nothing was sent. On the live site this goes straight to my inbox.'; return; }
    var btn = form.querySelector('.msg__send'); btn.disabled = true; st.textContent = 'Sending…';
    fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        'Name': name, 'Email': form.email.value.trim(), 'Project type': type() || '-', 'Message': form.message.value.trim(),
        'Sent from': location.pathname.replace(/^.*\//, '/') || '/',
        _replyto: form.email.value.trim(), _subject: 'New message from tommy4k.com: ' + name, _template: 'table', _captcha: 'false'
      })
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) === 'false') throw 0; }); })
      .then(function () { st.textContent = ''; finish(); })
      .catch(function () { st.textContent = 'That didn\'t send. Email me at ' + to + '.'; })
      .then(function () { btn.disabled = false; });
  });

  /* step aside when the full contact form is on screen, shrink to the face while scrolling down on phones */
  var c = document.getElementById('contact');
  if (c && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { w.classList.toggle('away', es[0].isIntersecting && !w.classList.contains('open')); }, { threshold: .25 }).observe(c);
  var y0 = scrollY;
  addEventListener('scroll', function () { var y = scrollY; if (Math.abs(y - y0) > 6) { w.classList.toggle('mini', y > y0 && y > 300); y0 = y; } }, { passive: true });
  setTimeout(function () { w.classList.add('in'); }, 900);
})();
