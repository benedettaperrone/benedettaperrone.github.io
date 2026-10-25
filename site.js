// Mobile navigation drawer, figure lightbox, email panel, reveal on scroll,
// scroll spy, back to top, year stamp.
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

  // Copy to clipboard, used by the BibTeX chips and the email panel.
  // navigator.clipboard is unavailable when the page is opened straight from
  // disk (file://), which is how the README says to preview it, so the old
  // execCommand path stays as the fallback. The callback reports whether the
  // text actually made it, because both callers show something different when
  // it did not.
  function copyText(text, done) {
    function legacy() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      ta.remove();
      return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          done(true);
        },
        function () {
          done(legacy());
        }
      );
    } else {
      done(legacy());
    }
  }

  // BibTeX. The entry for each paper sits in the HTML in a
  // <script type="application/x-bibtex">, which the browser leaves alone: it is
  // never parsed, never displayed, and survives copy-paste exactly as written.
  // The chip that copies it is built here, so with JS off no button appears
  // promising something that cannot happen.
  var bibItems = document.querySelectorAll(
    '.pitem script[type="application/x-bibtex"]'
  );
  bibItems.forEach(function (source) {
    var item = source.closest(".pitem");
    var chips = item ? item.querySelector(".chips") : null;
    if (!chips) return;
    // textContent, not innerHTML: the entry contains braces and quotes that
    // must reach the clipboard as typed.
    var entry = source.textContent.trim();

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip bibchip";
    btn.textContent = "BibTeX";
    chips.appendChild(btn);

    btn.addEventListener("click", function () {
      copyText(entry, function (ok) {
        if (ok) {
          btn.classList.add("ok");
          btn.textContent = "Copied";
          setTimeout(function () {
            btn.classList.remove("ok");
            btn.textContent = "BibTeX";
          }, 1900);
          return;
        }
        // Clipboard refused. Rather than fail silently, put the entry on the
        // page and select it, so the copy can still be made by hand.
        var out = item.querySelector(".bibout");
        if (!out) {
          out = document.createElement("pre");
          out.className = "bibout";
          out.tabIndex = -1;
          out.textContent = entry;
          chips.parentNode.insertBefore(out, chips.nextSibling);
        }
        var range = document.createRange();
        range.selectNodeContents(out);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        out.focus();
      });
    });
  });

  // Publication filters. Built from the items themselves rather than a list
  // written by hand: the year comes from each item's own .pyear, the kind from
  // the heading of the section it sits in. Adding a publication in the existing
  // markup therefore updates the filters with it, and there is no second place
  // to keep in step.
  var filterList = document.querySelector(".plist");
  var pageHead = document.querySelector(".pagehead");
  if (filterList && pageHead && document.querySelectorAll(".pitem").length > 2) {
    var records = [];
    document.querySelectorAll(".pitem").forEach(function (item) {
      var section = item.closest("section");
      var heading = section ? section.querySelector(".subh") : null;
      var yearEl = item.querySelector(".pyear");
      records.push({
        el: item,
        section: section,
        year: yearEl ? yearEl.textContent.trim() : "",
        kind: heading ? heading.textContent.trim() : ""
      });
    });

    // A facet with a single value filters nothing, so it is not offered.
    function valuesOf(key) {
      var seen = [];
      records.forEach(function (r) {
        if (r[key] && seen.indexOf(r[key]) === -1) seen.push(r[key]);
      });
      return seen;
    }
    var kinds = valuesOf("kind");
    var years = valuesOf("year").sort().reverse();

    if (kinds.length > 1 || years.length > 1) {
      var bar = document.createElement("div");
      bar.className = "pfilter";
      bar.setAttribute("role", "group");
      bar.setAttribute("aria-label", "Filter publications");

      var status = document.createElement("p");
      status.className = "pfilter-status";
      // polite, not assertive: this is a summary of what just happened, not an
      // interruption worth cutting across whatever is being read.
      status.setAttribute("aria-live", "polite");

      function addChip(label, key, value) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chip fchip";
        b.textContent = label;
        b.dataset.key = key;
        b.dataset.value = value;
        bar.appendChild(b);
        return b;
      }

      addChip("All", "", "").classList.add("k");
      if (kinds.length > 1) {
        kinds.forEach(function (k) {
          var n = records.filter(function (r) { return r.kind === k; }).length;
          addChip(k + " (" + n + ")", "kind", k);
        });
      }
      if (years.length > 1) {
        // Kinds and years are two different questions. Without a rule between
        // them the row reads as one long list of unrelated chips.
        if (kinds.length > 1) {
          var sep = document.createElement("span");
          sep.className = "fsep";
          sep.setAttribute("aria-hidden", "true");
          bar.appendChild(sep);
        }
        years.forEach(function (y) {
          var n = records.filter(function (r) { return r.year === y; }).length;
          addChip(y + " (" + n + ")", "year", y);
        });
      }

      function applyFilter(key, value) {
        var shown = 0;
        records.forEach(function (r) {
          var match = !key || r[key] === value;
          r.el.hidden = !match;
          if (match) shown++;
        });
        // A heading with nothing under it is worse than no heading, so a
        // section whose items are all filtered out goes with them.
        document.querySelectorAll(".plist").forEach(function (list) {
          var section = list.closest("section");
          if (!section) return;
          var live = section.querySelectorAll(".pitem:not([hidden])").length;
          section.hidden = live === 0;
        });
        status.textContent = key
          ? "Showing " + shown + (shown === 1 ? " publication" : " publications")
          : "";
      }

      bar.addEventListener("click", function (e) {
        var b = e.target.closest(".fchip");
        if (!b) return;
        bar.querySelectorAll(".fchip").forEach(function (other) {
          other.classList.toggle("k", other === b);
        });
        applyFilter(b.dataset.key, b.dataset.value);
      });

      pageHead.appendChild(bar);
      pageHead.appendChild(status);
    }
  }

  // Email panel. A bare mailto: link does nothing at all on a machine with no
  // mail client registered, which is most of them now: the click is swallowed
  // and the visitor gets no feedback. Every mailto: on the page opens a small
  // panel instead, offering the address with a copy button, the two webmail
  // clients most people actually use, and the original mailto for whoever does
  // have a desktop client. Progressive enhancement over the plain link: with JS
  // off the mailto keeps its native behaviour.
  var mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length) {
    var mbox = null;
    var mailFocus = null;

    function mailClose() {
      if (!mbox) return;
      var box = mbox;
      mbox = null;
      box.classList.remove("on");
      document.body.classList.remove("lboxopen");
      document.removeEventListener("keydown", onMailKey);
      // Wait out the fade so the panel does not vanish mid-transition.
      setTimeout(function () {
        box.remove();
      }, 240);
      if (mailFocus) mailFocus.focus();
    }

    function onMailKey(e) {
      if (e.key === "Escape") {
        mailClose();
        return;
      }
      // Keep Tab inside the panel: it is a modal dialog, so the page behind it
      // must not be reachable while it is open.
      if (e.key !== "Tab" || !mbox) return;
      var stops = mbox.querySelectorAll("a[href], button");
      if (!stops.length) return;
      var first = stops[0];
      var last = stops[stops.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    // The address stays selectable in the panel either way, so a refused
    // clipboard leaves the visitor no worse off than before.
    function copyAddress(address, btn) {
      copyText(address, function (ok) {
        if (!ok) return;
        btn.classList.add("ok");
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.classList.remove("ok");
          btn.textContent = "Copy";
        }, 1900);
      });
    }

    function mailOpen(link) {
      // Keep any subject or body the href already carries, but copy the bare
      // address on its own.
      var href = link.getAttribute("href");
      var address = href.replace(/^mailto:/i, "").split("?")[0];
      var to = encodeURIComponent(address);
      mailFocus = link;

      mbox = document.createElement("div");
      mbox.className = "mbox";
      mbox.setAttribute("role", "dialog");
      mbox.setAttribute("aria-modal", "true");
      mbox.setAttribute("aria-label", "Email Benedetta Perrone");

      var panel = document.createElement("div");
      panel.className = "mpanel";
      panel.innerHTML =
        '<span class="label">Contact</span>' +
        "<h2>Write to me</h2>" +
        '<p class="mnote">Copy the address, or open it directly in your mail client.</p>' +
        '<div class="maddr"><span>' +
        address +
        '</span><button type="button" class="mcopy">Copy</button></div>' +
        '<div class="mopts">' +
        '<a class="btn solid" href="' +
        href +
        '">Open my mail app</a>' +
        '<a class="btn line" href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=' +
        to +
        '" target="_blank" rel="noopener">Compose in Gmail</a>' +
        '<a class="btn line" href="https://outlook.office.com/mail/deeplink/compose?to=' +
        to +
        '" target="_blank" rel="noopener">Compose in Outlook</a>' +
        "</div>";

      var close = document.createElement("button");
      close.type = "button";
      close.className = "lclose";
      close.setAttribute("aria-label", "Close");
      close.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      close.addEventListener("click", mailClose);
      panel.appendChild(close);

      panel.querySelector(".mcopy").addEventListener("click", function () {
        copyAddress(address, this);
      });
      // The webmail links leave the page anyway; closing behind them means the
      // panel is not still sitting there on return.
      panel.querySelectorAll(".mopts a").forEach(function (a) {
        a.addEventListener("click", function () {
          setTimeout(mailClose, 120);
        });
      });

      mbox.appendChild(panel);
      // Backdrop click only: a click that starts inside the panel must not close.
      mbox.addEventListener("click", function (e) {
        if (e.target === mbox) mailClose();
      });

      document.body.appendChild(mbox);
      document.body.classList.add("lboxopen");
      document.addEventListener("keydown", onMailKey);
      requestAnimationFrame(function () {
        mbox.classList.add("on");
        panel.querySelector(".mcopy").focus();
      });
    }

    mailLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        // Leave modified clicks alone: someone who ctrl-clicks a mailto wants
        // the browser's own behaviour, not ours.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        mailOpen(link);
      });
    });
  }

  // Reveal on scroll. Whole blocks, not item by item: a stagger down every card
  // in a section turns reading into waiting. The hidden state is applied from
  // here rather than written into the HTML, so with JS off, or without
  // IntersectionObserver, nothing is ever hidden in the first place.
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion && "IntersectionObserver" in window) {
    var blocks = document.querySelectorAll(
      ".strip, .sec, .pubs .head, .pitem, .pmore, .contact .wrap"
    );
    var seen = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          // One reveal each: re-hiding a block on the way back up makes the
          // page feel unstable rather than alive.
          seen.unobserve(entry.target);
        });
      },
      // Slightly inside the bottom edge, so a block starts moving as it comes
      // up rather than after it has already arrived.
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" }
    );
    blocks.forEach(function (block) {
      block.classList.add("rv");
      seen.observe(block);
    });
  }

  // Back to top. Built here rather than repeated in every HTML file, and it is
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

  // (The green reading-progress bar under the header was removed in
  // October 2026 at the owner's request.)

  // Scroll spy. Switched off in practice: it only acts on elements carrying a
  // data-nav attribute, and none are left in the HTML, because every menu item
  // is now a separate page and the underline should mark only the page you are
  // on. Add data-nav="page.html" to a section to bring it back.
  var spySections = document.querySelectorAll("[data-nav]");
  var navLinks = document.querySelectorAll(".navgroup a");
  // The link marked .on in the HTML is the current *page*. It is what the
  // indicator returns to whenever no tracked section is in view, so the header
  // never ends up with nothing lit.
  var pageLink = document.querySelector(".navgroup a.on");
  var spyCurrent = pageLink;

  function syncSpy() {
    if (!spySections.length) return;
    var active = null;
    // Last section whose top has passed under the header wins. Reading forward
    // is cheaper than measuring every section against the viewport centre.
    for (var i = 0; i < spySections.length; i++) {
      if (spySections[i].getBoundingClientRect().top <= 88) {
        active = spySections[i].getAttribute("data-nav");
      }
    }
    // The closing blocks are together shorter than a viewport, so scrolling can
    // run out before their tops ever reach the line above. At the bottom of the
    // document the last section is the one you are looking at, by definition.
    var atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atBottom) {
      active = spySections[spySections.length - 1].getAttribute("data-nav");
    }
    var link = active
      ? document.querySelector('.navgroup a[href="' + active + '"]')
      : pageLink;
    if (!link || link === spyCurrent) return;
    navLinks.forEach(function (a) {
      a.classList.remove("on");
    });
    link.classList.add("on");
    spyCurrent = link;
  }

  // rAF-throttled: scroll fires far more often than any of this needs to run.
  var ticking = false;
  function sync() {
    var y = window.scrollY;
    toTop.classList.toggle("show", y > 500);
    syncSpy();
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
