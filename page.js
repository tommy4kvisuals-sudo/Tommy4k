/* Inner pages: project films load on click, work cards fill from site-data.js. */
(function () {
  var U = window.T4KUtil, T = window.T4K;
  var base = document.body.getAttribute('data-base') || '';

  /* project page film: still or placeholder first, the Vimeo player loads on click */
  document.querySelectorAll('.film[data-slug]').forEach(function (b) {
    var w = U.find(b.getAttribute('data-slug')); if (!w) return;
    b.style.aspectRatio = String(w.ar);
    if (w.ar < 1) b.classList.add('tall');
    /* project layout: vertical films sit beside their details; the film's own colours glow behind it */
    var px = b.closest('.pjx');
    if (px) {
      if (w.ar < 1) px.classList.add('pjx--tall');
      var remote = /^https?:/.test(w.poster || '');
      if (w.poster && (U.canEmbed || !remote)) {
        var g = document.createElement('div'); g.className = 'pjx__glow'; g.setAttribute('aria-hidden', 'true');
        g.style.backgroundImage = 'url("' + (remote ? '' : base) + w.poster + '")';
        b.parentNode.insertBefore(g, b);
      }
    }
    b.insertBefore(U.pic(w, w.vimeo ? '' : (w.ar < 1 ? '9:16' : '16:9') + ' · add the Vimeo link in site-data.js', base), b.firstChild);
    var src = U.vimeoSrc(w.vimeo, 'player');
    if (!src) { b.querySelector('.film__play').hidden = true; b.style.cursor = 'default'; return; }
    b.addEventListener('click', function () {
      var f = document.createElement('iframe'); f.src = src; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.title = w.name;
      b.innerHTML = ''; b.appendChild(f); b.style.cursor = 'default';
    }, { once: true });
  });

  /* series: a client's other films under the main one, each plays in place */
  function filmButton(f, w, cls) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'film ' + (cls || '');
    var ar = f.ar || w.ar; b.style.aspectRatio = String(ar); if (ar < 1) b.classList.add('tall');
    b.setAttribute('aria-label', 'Play ' + (f.title || w.name));
    var pw = { name: w.name + (f.title ? ' ' + f.title : ''), type: w.type, poster: f.poster, look: f.look || w.look, vimeo: f.vimeo, focus: f.focus };
    b.appendChild(U.pic(pw, f.vimeo ? '' : 'Add the Vimeo link in site-data.js', base));
    var pl = document.querySelector('.film__play'); if (pl) b.appendChild(pl.cloneNode(true));
    var src = U.vimeoSrc(f.vimeo, 'player');
    if (src) b.addEventListener('click', function () {
      var fr = document.createElement('iframe'); fr.src = src; fr.allow = 'autoplay; fullscreen; picture-in-picture'; fr.allowFullscreen = true; fr.title = pw.name;
      b.innerHTML = ''; b.appendChild(fr); b.style.cursor = 'default';
    }, { once: true });
    else b.style.cursor = 'default';
    return b;
  }
  document.querySelectorAll('[data-series]').forEach(function (sec) {
    var w = U.find(sec.getAttribute('data-series')); if (!w || !w.more || !w.more.length) return;
    var main = document.querySelector('.film[data-slug="' + w.slug + '"]');
    if (main && w.title) { var cap = document.createElement('p'); cap.className = 'film__cap'; cap.textContent = w.title; main.parentNode.appendChild(cap); }
    var h = document.createElement('h2'); h.className = 'series__head'; h.textContent = 'More from ' + w.name; sec.appendChild(h);
    var g = document.createElement('div'); g.className = 'series__grid'; sec.appendChild(g);
    w.more.forEach(function (f) {
      var c = document.createElement('figure'); c.className = 'series__item' + ((f.ar || w.ar) >= 1 ? ' wide' : '');
      c.appendChild(filmButton(f, w));
      if (f.title) { var fc = document.createElement('figcaption'); fc.textContent = f.title; c.appendChild(fc); }
      g.appendChild(c);
    });
    sec.hidden = false; sec.id = 'more';
    if (location.hash === '#more') setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 400);
  });

  /* write-up and credits come from site-data.js, so they only need editing in one place */
  document.querySelectorAll('[data-about]').forEach(function (box) {
    var w = U.find(box.getAttribute('data-about')); if (!w || !w.about || !w.about.length) return;
    box.innerHTML = ''; w.about.forEach(function (t) { var p = document.createElement('p'); p.textContent = t; box.appendChild(p); });
  });
  document.querySelectorAll('[data-credits]').forEach(function (dl) {
    var w = U.find(dl.getAttribute('data-credits')); if (!w || !w.credits) return;
    dl.innerHTML = ''; w.credits.forEach(function (c) { var dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = c[0]; dd.textContent = c[1]; dl.appendChild(dt); dl.appendChild(dd); });
  });

  /* stills on cards: swap the placeholder for the poster once one is set */
  document.querySelectorAll('.wcard[data-slug] .wcard__img').forEach(function (box) {
    var w = U.find(box.parentNode.getAttribute('data-slug')); if (!w) return;
    box.innerHTML = ''; box.appendChild(U.pic(w, '', base));
  });
  document.querySelectorAll('.phero__frame[data-slug]').forEach(function (box) {
    var w = U.find(box.getAttribute('data-slug')); if (!w) return;
    var old = box.querySelector('.ph'); var p = U.pic(w, '', base); if (old) box.replaceChild(p, old); else box.insertBefore(p, box.firstChild);
  });
})();
