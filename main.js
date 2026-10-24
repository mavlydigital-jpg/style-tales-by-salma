/* Style Tales by Salma - shared site script */
(function () {
  // Mobile menu
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('mobileNav');
  if (btn && nav) {
    function setMenu(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }
  // Gallery videos: play muted while on screen, pause when scrolled away
  var reels = document.querySelectorAll('.reel video');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reels.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reels.forEach(function (v) { v.controls = true; });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
          else e.target.pause();
        });
      }, { threshold: 0.5 });
      reels.forEach(function (v) { io.observe(v); });
    }
    document.querySelectorAll('.reel .sound-btn').forEach(function (b) {
      var v = b.parentNode.querySelector('video');
      b.addEventListener('click', function () {
        var on = v.muted;
        // only one video plays sound at a time
        reels.forEach(function (o) { o.muted = true; });
        document.querySelectorAll('.reel .sound-btn').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        v.muted = !on;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on && v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      });
    });
  }
  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
