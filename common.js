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
    String(text).split(/(@[A-Za-z0-9._]+)/).forEach(function (part) {
      if (/^@[A-Za-z0-9._]+$/.test(part)) { var a = document.createElement('a'); a.href = 'https://www.instagram.com/' + part.slice(1).replace(/\.$/, '') + '/'; a.target = '_blank'; a.rel = 'noopener'; a.textContent = part; dd.appendChild(a); }
      else if (part) dd.appendChild(document.createTextNode(part));
    });
  }
  window.T4KUtil = { creditInto: creditInto, reduce: reduce, canEmbed: canEmbed, vimeo: vimeo, vimeoSrc: vimeoSrc, lookStyle: lookStyle, pic: pic, find: find };

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
