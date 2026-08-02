/* =========================================================
   THEJAS A. NAIR — PORTFOLIO
   Behavior: ambient starfield, animated gravitational-wave
   chirp (the page's signature element), nav interactions,
   scroll reveals, active-link tracking.
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("active"); });
            var match = navLinks.find(function (l) {
              return l.getAttribute("href") === "#" + entry.target.id;
            });
            if (match) match.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .research-card, .timeline li, .skill-card, .stat-card, .activity-card, .ref-card, .about-body, .courses-wrap"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () { el.classList.add("in-view"); }, (i % 4) * 60);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- ambient starfield ---------- */
  var starCanvas = document.getElementById("starfield");
  if (starCanvas) {
    var sctx = starCanvas.getContext("2d");
    var stars = [];
    var W, H, DPR;

    function sizeStars() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      starCanvas.width = W * DPR;
      starCanvas.height = H * DPR;
      starCanvas.style.width = W + "px";
      starCanvas.style.height = H + "px";
      sctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      var count = Math.floor((W * H) / 9000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.1 + 0.2,
          baseAlpha: Math.random() * 0.5 + 0.15,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.015 + 0.004
        });
      }
    }

    function drawStars(t) {
      sctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var twinkle = reduceMotion ? 1 : 0.6 + 0.4 * Math.sin(t * s.speed + s.phase);
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sctx.fillStyle = "rgba(232,236,245," + (s.baseAlpha * twinkle).toFixed(3) + ")";
        sctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(drawStars);
    }

    sizeStars();
    window.addEventListener("resize", sizeStars);
    requestAnimationFrame(drawStars);
    if (reduceMotion) drawStars(0);
  }

  /* ---------- signature element: gravitational-wave chirp ---------- */
  var chirpCanvas = document.getElementById("chirp");
  if (chirpCanvas) {
    var cctx = chirpCanvas.getContext("2d");
    var cw = chirpCanvas.width;
    var ch = chirpCanvas.height;
    var mid = ch / 2;

    // Generate the chirp waveform: frequency & amplitude rise toward
    // "merger", then a short ringdown decay — modeled loosely on the
    // shape of a real binary-inspiral gravitational-wave signal.
    function chirpValue(x) {
      var p = x / cw; // 0..1 progress
      var mergerAt = 0.82;
      if (p < mergerAt) {
        var pp = p / mergerAt;
        var freq = 3 + Math.pow(pp, 3.2) * 46;
        var amp = 0.08 + Math.pow(pp, 2.6) * 0.86;
        return Math.sin(pp * freq * Math.PI * 2) * amp;
      } else {
        var dp = (p - mergerAt) / (1 - mergerAt);
        var decay = Math.exp(-dp * 7);
        return Math.sin((mergerAt * 49 * Math.PI * 2) + dp * 40) * decay * 0.95;
      }
    }

    function drawChirp(progress) {
      cctx.clearRect(0, 0, cw, ch);

      // baseline
      cctx.strokeStyle = "rgba(154,166,196,0.18)";
      cctx.lineWidth = 1;
      cctx.beginPath();
      cctx.moveTo(0, mid);
      cctx.lineTo(cw, mid);
      cctx.stroke();

      var visibleW = cw * progress;
      var grad = cctx.createLinearGradient(0, 0, cw, 0);
      grad.addColorStop(0, "rgba(203,169,104,0.9)");
      grad.addColorStop(0.82, "rgba(111,214,198,0.95)");
      grad.addColorStop(1, "rgba(111,214,198,0.25)");

      cctx.strokeStyle = grad;
      cctx.lineWidth = 2.2;
      cctx.lineJoin = "round";
      cctx.lineCap = "round";
      cctx.shadowBlur = 14;
      cctx.shadowColor = "rgba(111,214,198,0.35)";

      cctx.beginPath();
      var step = 2;
      for (var x = 0; x <= visibleW; x += step) {
        var y = mid - chirpValue(x) * (ch * 0.42);
        if (x === 0) cctx.moveTo(x, y);
        else cctx.lineTo(x, y);
      }
      cctx.stroke();
      cctx.shadowBlur = 0;

      // leading point (only while animating in)
      if (progress < 1) {
        var lx = visibleW;
        var ly = mid - chirpValue(lx) * (ch * 0.42);
        cctx.beginPath();
        cctx.arc(lx, ly, 4, 0, Math.PI * 2);
        cctx.fillStyle = "#EAD9AE";
        cctx.shadowBlur = 16;
        cctx.shadowColor = "#EAD9AE";
        cctx.fill();
        cctx.shadowBlur = 0;
      }
    }

    function resizeChirp() {
      var rect = chirpCanvas.getBoundingClientRect();
      var DPR2 = Math.min(window.devicePixelRatio || 1, 2);
      cw = Math.max(rect.width, 300);
      ch = chirpCanvas.height / (chirpCanvas.width / cw) || 260;
      chirpCanvas.width = cw * DPR2;
      chirpCanvas.height = 260 * DPR2;
      cctx.setTransform(DPR2, 0, 0, DPR2, 0, 0);
      cw = chirpCanvas.width / DPR2;
      ch = chirpCanvas.height / DPR2;
      mid = ch / 2;
    }

    resizeChirp();
    window.addEventListener("resize", function () {
      resizeChirp();
      drawChirp(1);
    });

    if (reduceMotion) {
      drawChirp(1);
    } else {
      // Play the draw-on animation once the hero is visible.
      var played = false;
      var start = null;
      var duration = 2200;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        drawChirp(eased);
        if (progress < 1) requestAnimationFrame(step);
      }

      var chirpObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !played) {
              played = true;
              requestAnimationFrame(step);
            }
          });
        },
        { threshold: 0.3 }
      );
      chirpObserver.observe(chirpCanvas);
    }
  }
})();
