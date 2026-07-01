/* Eagle-L Roofing & Remodeling. OTM Web Design. */

(function () {
  "use strict";

  /* Active nav state */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav-links a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === page) a.classList.add("is-active");
    });
  }

  /* Hamburger + slide-in panel */
  var burger = document.querySelector(".hamburger");
  var panel = document.querySelector(".nav-links");
  var overlay = document.querySelector(".nav-overlay");

  function closeMenu() {
    burger.classList.remove("is-open");
    panel.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && panel) {
    panel.classList.add("mobile-panel-ready");
    burger.addEventListener("click", function () {
      var open = burger.classList.toggle("is-open");
      panel.classList.add("mobile-panel");
      panel.classList.toggle("is-open", open);
      if (overlay) overlay.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (overlay) overlay.addEventListener("click", closeMenu);
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* Carousels (gallery) */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var slides = root.querySelectorAll(".carousel-slide");
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    var dotsWrap = root.querySelector(".carousel-dots");
    var index = 0;

    function perView() {
      var w = window.innerWidth;
      if (w <= 560) return 1;
      if (w <= 1100) return 2;
      return 3;
    }

    function pageCount() {
      return Math.max(1, slides.length - perView() + 1);
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      for (var i = 0; i < pageCount(); i++) {
        var b = document.createElement("button");
        b.className = "carousel-dot" + (i === index ? " is-active" : "");
        b.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (n) {
          b.addEventListener("click", function () { go(n); });
        })(i);
        dotsWrap.appendChild(b);
      }
    }

    function go(n) {
      var max = pageCount() - 1;
      index = Math.max(0, Math.min(n, max));
      var slide = slides[0];
      var gap = 22;
      var step = slide.getBoundingClientRect().width + gap;
      track.style.transform = "translateX(" + (-index * step) + "px)";
      dotsWrap.querySelectorAll(".carousel-dot").forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
      });
    }

    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { buildDots(); go(index); }, 150);
    });

    buildDots();
  });

  /* Form validation */
  var form = document.querySelector("form[data-validate]");
  if (form) {
    form.addEventListener("submit", function (e) {
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".form-field");
        var bad = !field.value.trim();
        if (field.type === "email" && !bad) {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (wrap) wrap.classList.toggle("invalid", bad);
        if (bad) valid = false;
      });
      if (!valid) e.preventDefault();
    });
  }

  /* Footer year */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
