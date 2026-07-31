// Mobile navigation drawer + current-year stamp.
(function () {
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the drawer after tapping a link, otherwise it stays over the target.
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Figure lightbox. Progressive enhancement over the plain <a href="image">:
  // without JS the link still opens the file, with JS it opens over the blurred
  // page instead.
  var figLinks = document.querySelectorAll(".pfig a");
  if (figLinks.length) {
    var lbox = null;
    var lastFocus = null;

    function closeBox() {
      if (!lbox) return;
      var box = lbox;
      lbox = null;
      box.classList.remove("on");
      document.body.classList.remove("lboxopen");
      document.removeEventListener("keydown", onKey);
      // Wait out the fade so the overlay does not vanish mid-transition.
      setTimeout(function () {
        box.remove();
      }, 240);
      if (lastFocus) lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === "Escape") closeBox();
    }

    function openBox(link) {
      var img = link.querySelector("img");
      // .figcap is a sibling of .pfig, not a descendant, so go up one more level.
      var pfig = link.closest(".pfig");
      var capEl = pfig && pfig.parentElement ? pfig.parentElement.querySelector(".figcap") : null;
      lastFocus = link;

      lbox = document.createElement("div");
      lbox.className = "lbox";
      lbox.setAttribute("role", "dialog");
      lbox.setAttribute("aria-modal", "true");
      lbox.setAttribute("aria-label", img ? img.alt : "Figure");

      var fig = document.createElement("figure");
      var big = document.createElement("img");
      big.src = link.getAttribute("href");
      big.alt = img ? img.alt : "";
      fig.appendChild(big);
      if (capEl) {
        var cap = document.createElement("figcaption");
        cap.textContent = capEl.textContent;
        fig.appendChild(cap);
      }

      var close = document.createElement("button");
      close.type = "button";
      close.className = "lclose";
      close.setAttribute("aria-label", "Close");
      close.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      close.addEventListener("click", closeBox);

      lbox.appendChild(fig);
      lbox.appendChild(close);
      // Backdrop click only: a click that starts inside the figure must not close.
      lbox.addEventListener("click", function (e) {
        if (e.target === lbox) closeBox();
      });

      document.body.appendChild(lbox);
      document.body.classList.add("lboxopen");
      document.addEventListener("keydown", onKey);
      requestAnimationFrame(function () {
        lbox.classList.add("on");
        close.focus();
      });
    }

    figLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        // Leave modified clicks alone so "open in new tab" keeps working.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        openBox(link);
      });
    });
  }

  // Back to top. Built here rather than repeated in four HTML files, and it is
  // only useful with JS anyway (it has to react to the scroll position).
  var toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "totop";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(toTop);

  toTop.addEventListener("click", function () {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  // rAF-throttled: scroll fires far more often than the class needs to change.
  var ticking = false;
  function sync() {
    toTop.classList.toggle("show", window.scrollY > 500);
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(sync);
      }
    },
    { passive: true }
  );
  sync();
})();
