(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme ---------- */
  var toggle = document.querySelector(".theme-toggle");
  var label = document.querySelector(".theme-label");
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return media && media.matches ? "dark" : "light";
  }

  function syncToggle() {
    var dark = currentTheme() === "dark";
    if (label) label.textContent = dark ? "Light mode" : "Dark mode";
    if (toggle) toggle.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggle();
    });
  }
  if (media && media.addEventListener) media.addEventListener("change", syncToggle);
  syncToggle();

  /* ---------- BibTeX toggles + copy ---------- */
  document.querySelectorAll("[data-bib]").forEach(function (btn) {
    var box = btn.closest(".pub-main").querySelector(".bib");
    if (!box) return;
    btn.addEventListener("click", function () {
      var open = box.hidden;
      box.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.querySelectorAll(".bib .copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.parentElement.querySelector("pre").textContent;
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        ta.remove();
      }
    });
  });

  /* ---------- Author lists ---------- */
  document.querySelectorAll("[data-authors]").forEach(function (p) {
    var short = p.querySelector(".short");
    var full = p.querySelector(".full");
    var btn = p.querySelector(".more");
    if (!short || !full || !btn) return;
    var collapsedLabel = btn.textContent;
    btn.addEventListener("click", function () {
      var expand = full.hidden;
      full.hidden = !expand;
      short.hidden = expand;
      btn.textContent = expand ? "show fewer" : collapsedLabel;
      btn.setAttribute("aria-expanded", expand ? "true" : "false");
    });
  });

  /* ---------- Copy email ---------- */
  var toast = document.querySelector(".toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 1800);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      copyText(text).then(
        function () { showToast("Copied " + text); },
        function () { showToast(text); }
      );
    });
  });

  /* ---------- Section highlighting in the sidebar ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  var sections = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
  var lockUntil = 0;

  function setActive(i) {
    links.forEach(function (a, j) {
      a.classList.toggle("active", j === i);
      if (j === i) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  function update() {
    if (Date.now() < lockUntil || !links.length) return;
    var doc = document.documentElement;
    // At the very bottom of the page, the last section is the one being read.
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) { setActive(links.length - 1); return; }
    var line = window.innerHeight * 0.3;
    var current = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i] && sections[i].getBoundingClientRect().top <= line) current = i;
    }
    setActive(current);
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  window.addEventListener("resize", update);

  links.forEach(function (a, i) {
    a.addEventListener("click", function () {
      setActive(i);
      lockUntil = Date.now() + 900; // keep the clicked item highlighted while smooth-scrolling
      setTimeout(update, 950);
    });
  });
  update();
})();
