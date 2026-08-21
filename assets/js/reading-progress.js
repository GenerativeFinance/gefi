(function () {
  "use strict";

  var bar = document.querySelector("[data-reading-progress-bar]");
  var target = document.querySelector("[data-reading-progress-target]");
  if (!bar || !target) return;

  var ticking = false;

  function update() {
    var rect = target.getBoundingClientRect();
    var viewport = window.innerHeight || document.documentElement.clientHeight;
    var total = rect.height - viewport;
    var scrolled = -rect.top;
    var pct = 0;
    if (total > 0) {
      pct = Math.max(0, Math.min(1, scrolled / total));
    } else if (rect.top <= 0) {
      pct = 1;
    }
    bar.style.transform = "scaleX(" + pct + ")";
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
