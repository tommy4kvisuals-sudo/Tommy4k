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
