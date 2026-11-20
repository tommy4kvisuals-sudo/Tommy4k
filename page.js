/* Inner pages: project films load on click, work cards fill from site-data.js. */
(function () {
  var U = window.T4KUtil, T = window.T4K;
  var base = document.body.getAttribute('data-base') || '';

  /* project page film: still or placeholder first, the Vimeo player loads on click */
  document.querySelectorAll('.film[data-slug]').forEach(function (b) {
    var w = U.find(b.getAttribute('data-slug')); if (!w) return;
    b.style.aspectRatio = String(w.ar);
    if (w.ar < 1) b.classList.add('tall');
    b.insertBefore(U.pic(w, w.vimeo ? '' : (w.ar < 1 ? '9:16' : '16:9') + ' · add the Vimeo link in site-data.js', base), b.firstChild);
    var src = U.vimeoSrc(w.vimeo, 'player');
    if (!src) { b.querySelector('.film__play').hidden = true; b.style.cursor = 'default'; return; }
    b.addEventListener('click', function () {
      var f = document.createElement('iframe'); f.src = src; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.title = w.name;
      b.innerHTML = ''; b.appendChild(f); b.style.cursor = 'default';
    }, { once: true });
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
