/* LightOn Academy — site script (shared by the GitHub site and the WordPress theme) */
(function () {
  "use strict";
  var C = window.LIGHTON;
  var CATS = {
    professional: "Professional Skills", tech: "Tech Bootcamps", youth: "Youth & Graduates",
    kids: "Kids & Teens", ministry: "Ministries & Organizations", masterclass: "Masterclasses"
  };

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function link(name, q) { var u = C.LINKS[name] || "#"; return q ? u + (u.indexOf("?") > -1 ? "&" : "?") + q : u; }
  function img(p) { return /^https?:|^\//.test(p) ? p : C.ASSETS + "img/" + p; }
  function wa(text) { return "https://wa.me/" + C.WHATSAPP + (text ? "?text=" + encodeURIComponent(text) : ""); }
  function list_(s) { return String(s || "").split("|").map(function (x) { return x.trim(); }).filter(Boolean); }
  function truthy(v) { return v === true || /^(true|yes|y|1|✓|x|on|active)$/i.test(String(v).trim()); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  var I = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>',
    award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H7a5 5 0 1 1 1.2-9.9A6 6 0 0 1 19.6 11 4 4 0 0 1 17.5 19z"/><path d="m9 14 2 2 4-4"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6M2 13v2M22 13v2"/></svg>',
    path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h6.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H15"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-4v12l-6-4"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>'
  };
  window.LIGHTON_ICONS = I;

  /* ---------- header & footer ---------- */
  function header() {
    var page = document.body.getAttribute("data-page") || "";
    var nav = [["home", "Home"], ["programs", "Programs"], ["kids", "Kids & Teens"], ["services", "Services"], ["sponsor", "Sponsor"], ["about", "About"], ["contact", "Contact"]];
    var items = nav.map(function (n) { return '<a href="' + link(n[0]) + '"' + (page === n[0] ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("");
    return '<div class="topbar"><div class="wrap"><span>' + I.pin + ' Training centers: <span data-center-list></span></span><span class="tb-right"><a href="tel:+231' + C.PHONES[0].slice(1) + '">' + I.phone + " " + C.PHONES.join(" · ") + '</a><a href="mailto:' + C.EMAIL + '">' + I.mail + " " + C.EMAIL + "</a></span></div></div>" +
      '<header class="site-header"><div class="wrap nav-wrap">' +
      '<a class="brand" href="' + link("home") + '"><img src="' + img("logo.png") + '" alt="LightOn Academy" width="148" height="54"></a>' +
      '<nav class="nav" id="nav">' + items +
      '<div class="nav-cta"><a class="btn btn-ghost" href="' + C.PORTAL_URL + '">Student Portal</a><a class="btn btn-orange" href="' + C.REGISTER_URL + '">Register</a></div></nav>' +
      '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav">' + I.menu + "</button></div></header>";
  }
  function footer() {
    return '<footer class="site-footer"><div class="wrap foot-grid">' +
      '<div><img src="' + img("logo.png") + '" alt="LightOn Academy" width="160" height="58" class="foot-logo"><p class="foot-tag">Innovate, Educate, Empower.</p><p class="motto">LightOn me, LightOn you, LightOn Africa.</p>' +
      '<div class="socials"><a href="' + wa("Hello LightOn Academy") + '" aria-label="WhatsApp">' + I.wa + '</a><a href="' + C.FACEBOOK + '" aria-label="Facebook">' + I.fb + '</a><a href="mailto:' + C.EMAIL + '" aria-label="Email">' + I.mail + "</a></div></div>" +
      '<div><h4>Explore</h4><ul class="links"><li><a href="' + link("programs") + '">All programs</a></li><li><a href="' + link("kids") + '">Kids & Teens</a></li><li><a href="' + link("services") + '">Services</a></li><li><a href="' + link("sponsor") + '">Sponsor a student</a></li><li><a href="' + link("about") + '">About us</a></li><li><a href="' + C.PORTAL_URL + '">Student portal</a></li></ul></div>' +
      '<div><h4>Training centers</h4><ul class="centers" data-centers-footer></ul></div>' +
      '<div><h4>Get in touch</h4><ul class="links"><li>' + esc(C.CITY) + '</li><li><a href="tel:+231' + C.PHONES[0].slice(1) + '">' + C.PHONES[0] + '</a> · <a href="tel:+231' + C.PHONES[1].slice(1) + '">' + C.PHONES[1] + '</a></li><li><a href="mailto:' + C.EMAIL + '">' + C.EMAIL + '</a></li></ul><a class="btn btn-orange btn-sm" href="' + C.REGISTER_URL + '">Register now</a></div>' +
      '</div><div class="wrap foot-bottom"><span>© ' + new Date().getFullYear() + " LightOn Academy, Monrovia, Liberia</span><span>“Today’s investment is tomorrow’s reward.”</span></div></footer>" +
      '<a class="wa-float" href="' + wa("Hello LightOn Academy, I have a question about your programs.") + '" aria-label="Chat with us on WhatsApp">' + I.wa + "</a>";
  }

  /* ---------- site data (Google Sheet via Apps Script, with fallbacks) ---------- */
  function money(v) { return String(v || "").replace(/(\d)\.00\b/g, "$1"); }
  function clean(arr, need) {
    return (arr || []).map(function (o) {
      o.active = truthy(o.active); o.order = parseFloat(o.order) || 99; return o;
    }).filter(function (o) { return o.active && o[need]; }).sort(function (a, b) { return a.order - b.order; });
  }
  /* Learning paths: courses that share a "path" name, in "step" order. Descriptions come from the Paths tab. */
  function buildPaths(courses, rows) {
    var info = {}, hidden = {};
    (rows || []).forEach(function (r) { var n = String(r.name || "").trim(); if (!n) return; if (!truthy(r.active)) hidden[n] = 1; info[n] = { description: r.description || "", order: parseFloat(r.order) || 99 }; });
    var map = {};
    courses.forEach(function (c) {
      if (!c.active || !c.path || hidden[c.path] || c.category === "masterclass") return;
      (map[c.path] = map[c.path] || []).push(c);
    });
    return Object.keys(map).map(function (n) {
      var steps = map[n].sort(function (a, b) { return (a.step || 99) - (b.step || 99) || a.order - b.order; });
      return { name: n, description: (info[n] || {}).description || "", order: (info[n] || {}).order || 99, steps: steps };
    }).sort(function (a, b) { return a.order - b.order; });
  }
  function pathOf(c) {
    var d = window.LIGHTON_DATA; if (!d || !c.path) return null;
    var p = d.paths.filter(function (x) { return x.name === c.path; })[0]; if (!p) return null;
    var i = p.steps.indexOf(c); return i < 0 ? null : { path: p, i: i };
  }
  function normalise(d) {
    var courses = (d.courses || []).map(function (c) {
      c.active = truthy(c.active); c.featured = truthy(c.featured);
      c.show_price = c.show_price === undefined || c.show_price === "" ? !!c.price : truthy(c.show_price);
      c.order = parseFloat(c.order) || 99; c.category = String(c.category || "").toLowerCase().trim();
      c.price = money(c.price); c.regular_price = money(c.regular_price);
      c.path = String(c.path || "").trim(); c.step = parseFloat(c.step) || 0;
      return c;
    }).filter(function (c) { return c.id && c.title; }).sort(function (a, b) { return a.order - b.order; });
    return { courses: courses, paths: buildPaths(courses, d.paths), centers: clean(d.centers, "name"), services: clean(d.services, "title"), team: clean(d.team, "name"), gallery: clean(d.gallery, "image") };
  }
  function fetchJSON(url, ms) {
    return new Promise(function (ok, bad) {
      var t = setTimeout(function () { bad(new Error("timeout")); }, ms || 9000);
      fetch(url, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) { clearTimeout(t); ok(j); }, function (e) { clearTimeout(t); bad(e); });
    });
  }
  /* Shows saved content instantly, then refreshes from the sheet in the background. */
  function loadData(render) {
    var fallback = function () { return fetchJSON(C.DATA, 9000); };
    var cached = store("lightonSite");
    var shown = "";
    function show(raw) { var s = JSON.stringify(raw); if (s === shown) return; shown = s; render(normalise(JSON.parse(s))); }
    if (!C.DATA_URL) return fallback().then(show);
    if (cached) show(cached);
    return fetchJSON(C.DATA_URL, 12000)
      .then(function (live) { store("lightonSite", live); show(live); })
      .catch(function () { if (!cached) return fallback().then(show); });
  }


  /* ---------- course rendering ---------- */
  function priceBlock(c, big) {
    if (!c.show_price || !c.price) return '<div class="price ask"><span class="p-main">' + (big ? "Fees on request" : "Ask for fees") + '</span><span class="p-note">WhatsApp us and we’ll send you the details</span></div>';
    return '<div class="price"><span class="p-main">' + esc(c.price) + "</span>" + (c.regular_price ? '<s class="p-reg">' + esc(c.regular_price) + "</s>" : "") + (c.price_note ? '<span class="p-note">' + esc(c.price_note) + "</span>" : "") + "</div>";
  }
  function stepLabel(c) {
    var w = pathOf(c); if (!w || w.path.steps.length < 2) return "";
    return '<span class="c-step">' + (c.level ? " · " : "") + "Step " + (w.i + 1) + " of " + w.path.steps.length + "</span>";
  }
  function pathSteps(p, current) {
    return '<ol class="steps-path">' + p.steps.map(function (s, i) {
      return '<li class="' + (s === current ? "here" : "") + '"><a href="' + link("course", "id=" + encodeURIComponent(s.id)) + '"><span class="n">' + (i + 1) + "</span><span><strong>" + esc(s.title) + "</strong><small>" + esc([s.duration, s === current ? "You are here" : ""].filter(Boolean).join(" · ")) + "</small></span></a></li>";
    }).join("") + "</ol>";
  }
  function card(c) {
    var u = link("course", "id=" + encodeURIComponent(c.id));
    return '<article class="card course reveal" data-cat="' + esc(c.category) + '">' +
      '<a class="c-img" href="' + u + '"><img loading="lazy" src="' + img(c.image || "photos/students-study.jpg") + '" alt="' + esc(c.title) + '"><span class="tag">' + esc(CATS[c.category] || c.category) + "</span>" + (c.start ? '<span class="start">' + I.cal + esc(c.start) + "</span>" : "") + "</a>" +
      '<div class="c-body"><p class="c-level">' + esc(c.level || "") + stepLabel(c) + '</p><h3><a href="' + u + '">' + esc(c.title) + '</a></h3><p class="c-tag">' + esc(c.tagline || "") + "</p>" +
      '<ul class="meta"><li>' + I.clock + esc(c.duration || "") + "</li>" + (c.format ? "<li>" + I.laptop + esc(c.format.split("·")[0]) + "</li>" : "") + "</ul>" +
      '<div class="c-foot">' + priceBlock(c) + '<a class="btn btn-navy btn-sm" href="' + u + '">Details ' + I.arrow + "</a></div></div></article>";
  }
  function masterclass(c) {
    return '<a class="mc reveal" href="' + wa("Hello LightOn Academy, I'm interested in the " + c.title + " masterclass.") + '"><span class="mc-ico">' + I.spark + "</span><span><strong>" + esc(c.title) + "</strong><small>" + esc(c.tagline || "") + '</small></span><span class="mc-go">' + I.wa + "</span></a>";
  }
  function emptyState(msg) { return '<div class="empty">' + msg + ' <a href="' + wa("Hello LightOn Academy, which programs are open now?") + '">Ask us on WhatsApp</a>.</div>'; }

  function mountCourses(all) {
    var active = all.filter(function (c) { return c.active; });
    var courses = active.filter(function (c) { return c.category !== "masterclass"; });

    $$("[data-courses]").forEach(function (el) {
      var mode = el.getAttribute("data-courses"), limit = +el.getAttribute("data-limit") || 99, set = courses;
      var here = el.closest("main") && $("[data-course-detail]") ? new URLSearchParams(location.search).get("id") : null;
      if (here) set = set.filter(function (c) { return c.id !== here; });
      if (mode === "featured") set = set.filter(function (c) { return c.featured; });
      else if (mode !== "all") set = set.filter(function (c) { return c.category === mode; });
      set = set.slice(0, limit);
      el.innerHTML = set.length ? set.map(card).join("") : emptyState("New intakes are being scheduled.");
    });
    $$("[data-masterclasses]").forEach(function (el) {
      var mcs = active.filter(function (c) { return c.category === "masterclass"; });
      el.innerHTML = mcs.length ? mcs.map(masterclass).join("") : emptyState("Masterclasses are being scheduled.");
    });
    /* filter tabs on programs page */
    $$("[data-filter]").forEach(function (bar) {
      var grid = $(bar.getAttribute("data-filter"));
      var cats = Object.keys(CATS).filter(function (k) { return k !== "masterclass" && courses.some(function (c) { return c.category === k; }); });
      bar.innerHTML = '<button class="chip on" data-k="all">All</button>' + cats.map(function (k) { return '<button class="chip" data-k="' + k + '">' + CATS[k] + "</button>"; }).join("");
      if (!bar._wired) bar.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        $$(".chip", bar).forEach(function (x) { x.classList.toggle("on", x === b); });
        $$(".course", grid).forEach(function (cardEl) { cardEl.hidden = !(b.dataset.k === "all" || cardEl.dataset.cat === b.dataset.k); });
      });
      bar._wired = true;
      var want = new URLSearchParams(location.search).get("track");
      if (want) { var t = $('[data-k="' + want + '"]', bar); if (t) t.click(); }
    });
    /* course select in contact form */
    $$("[data-course-select]").forEach(function (sel) {
      sel.innerHTML = '<option value="">General question</option>' + active.map(function (c) { return "<option>" + esc(c.title) + "</option>"; }).join("");
    });
    /* hide/show blocks depending on whether a course is active */
    $$("[data-if-active]").forEach(function (el) {
      var c = all.filter(function (x) { return x.id === el.getAttribute("data-if-active"); })[0];
      el.hidden = !(c && c.active);
    });
    $$("[data-if-inactive]").forEach(function (el) {
      var c = all.filter(function (x) { return x.id === el.getAttribute("data-if-inactive"); })[0];
      el.hidden = !!(c && c.active);
    });
    $$("[data-count-courses]").forEach(function (el) { el.textContent = courses.length; });
    /* single fields, e.g. data-field="innovators-bootcamp.duration" */
    $$("[data-field]").forEach(function (el) {
      var parts = el.getAttribute("data-field").split("."), c = all.filter(function (x) { return x.id === parts[0]; })[0];
      if (c && c[parts[1]]) el.textContent = c[parts[1]];
    });
    var d = $("[data-course-detail]"); if (d) detail(d, all);
  }
  function mountPaths(paths) {
    $$("[data-paths]").forEach(function (el) {
      var sec = el.closest("section"); if (sec) sec.hidden = !paths.length;
      el.innerHTML = paths.map(function (p) {
        return '<div class="path-card reveal"><div class="path-head"><span class="f-ico">' + I.path + "</span><div><h3>" + esc(p.name) + "</h3>" + (p.description ? "<p>" + esc(p.description) + "</p>" : "") + "</div></div>" + pathSteps(p, null) + "</div>";
      }).join("");
    });
  }
  function names(list) {
    var n = list.map(function (c) { return c.name; });
    return n.length > 1 ? n.slice(0, -1).join(", ") + " and " + n[n.length - 1] : n.join("");
  }
  function mapUrl(c) {
    return c.map_link || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([c.venue, c.address, "Liberia"].filter(Boolean).join(", "));
  }
  function mountCenters(list) {
    $$("[data-center-list]").forEach(function (el) { el.textContent = names(list); });
    $$("[data-center-count]").forEach(function (el) { el.textContent = list.length; });
    $$("[data-centers]").forEach(function (el) {
      el.innerHTML = list.map(function (c) {
        return '<div class="loc reveal"><span class="c-ico">' + I.pin + "</span><h3>" + esc(c.name) + "</h3>" + (c.venue ? "<p><strong>" + esc(c.venue) + "</strong></p>" : "") + "<p>" + esc(c.address) + "</p>" + (c.note ? '<p class="loc-note">' + esc(c.note) + "</p>" : "") + '<a href="' + esc(mapUrl(c)) + '" target="_blank" rel="noopener">Open in Maps ' + I.arrow + "</a></div>";
      }).join("");
    });
    $$("[data-centers-footer]").forEach(function (el) {
      el.innerHTML = list.map(function (c) { return "<li><strong>" + esc(c.name) + "</strong><br>" + esc([c.venue, c.address].filter(Boolean).join(", ")) + "</li>"; }).join("");
    });
    $$("[data-stats]").forEach(function (el) {
      el.innerHTML = C.STATS.map(function (s) { return '<div class="stat reveal"><strong>' + esc(s.n === "centers" ? list.length : s.n) + "</strong><span>" + esc(s.l) + "</span></div>"; }).join("");
    });
  }
  function mountServices(list) {
    $$("[data-services]").forEach(function (el) {
      el.innerHTML = list.length ? list.map(function (s) {
        var pts = list_(s.points);
        return '<div class="service reveal"><span class="f-ico">' + (I[s.icon] || I.spark) + "</span><h3>" + esc(s.title) + "</h3><p>" + esc(s.description || "") + "</p>" +
          (pts.length ? '<ul class="ticks">' + pts.map(function (x) { return "<li>" + I.check + "<span>" + esc(x) + "</span></li>"; }).join("") + "</ul>" : "") +
          '<a class="btn btn-navy btn-sm" href="' + wa(s.whatsapp_message || "Hello LightOn Academy, I'd like to know more about " + s.title + ".") + '">' + esc(s.button_label || "Request a quote") + "</a></div>";
      }).join("") : emptyState("Tell us what you need.");
    });
  }
  function initials(n) { return String(n).split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase(); }
  function mountTeam(list) {
    $$("[data-team]").forEach(function (el) {
      el.innerHTML = list.map(function (m) {
        return '<div class="member reveal"><div class="ph">' + (m.photo ? '<img src="' + esc(img(m.photo)) + '" alt="' + esc(m.name) + '" loading="lazy" onerror="this.replaceWith(document.createTextNode(\'' + initials(m.name) + '\'))">' : initials(m.name)) + "</div><h3>" + esc(m.name) + "</h3><p>" + esc(m.role || "") + "</p></div>";
      }).join("");
    });
  }
  window.LIGHTON_GONE = function (im) {
    var g = im.closest(".gallery"); im.closest("figure").remove();
    if (g && !g.children.length) { var s = g.closest("section"); if (s) s.hidden = true; }
  };
  function mountGallery(list) {
    $$("[data-gallery]").forEach(function (el) {
      var limit = +el.getAttribute("data-limit") || 99, set = list.slice(0, limit);
      var sec = el.closest("section"); if (sec) sec.hidden = !set.length;
      el.innerHTML = set.map(function (g) {
        return '<figure class="g-item reveal"><img src="' + esc(img(g.image)) + '" alt="' + esc(g.caption || "LightOn Academy class") + '" loading="lazy" onerror="LIGHTON_GONE(this)">' + (g.caption ? "<figcaption>" + esc(g.caption) + "</figcaption>" : "") + "</figure>";
      }).join("");
    });
  }
  function mountAll(d) {
    window.LIGHTON_DATA = d;
    mountCourses(d.courses); mountPaths(d.paths); mountCenters(d.centers); mountServices(d.services); mountTeam(d.team); mountGallery(d.gallery);
    reveal();
  }

  function pathBlock(c) {
    var w = pathOf(c); if (!w || w.path.steps.length < 2) return "";
    var s = w.path.steps, i = w.i, prev = s[i - 1], next = s[i + 1];
    var a = function (x) { return '<a href="' + link("course", "id=" + encodeURIComponent(x.id)) + '">' + esc(x.title) + "</a>"; };
    var tips = [];
    if (!prev) tips.push("<strong>Start here.</strong> This is step 1 of the " + esc(w.path.name) + " path, so no earlier course is needed.");
    else tips.push("<strong>Before this:</strong> we recommend " + a(prev) + " (step " + i + "), or the same skills from somewhere else.");
    if (next) tips.push("<strong>After this:</strong> continue with " + a(next) + " (step " + (i + 2) + ") to keep building on what you learned.");
    else tips.push("<strong>Final step.</strong> Finishing this completes the " + esc(w.path.name) + " path.");
    tips.push('Not sure which step fits you? <a href="' + wa("Hello LightOn Academy, which step of the " + w.path.name + " path should I start with?") + '">Ask us on WhatsApp</a> and we’ll place you at the right level.');
    return '<div class="block"><h2>Your learning path</h2><p class="path-name">' + I.path + " " + esc(w.path.name) + " · step " + (i + 1) + " of " + s.length + "</p>" + pathSteps(w.path, c) +
      '<ul class="advice">' + tips.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>";
  }
  function detail(el, all) {
    var id = new URLSearchParams(location.search).get("id");
    var c = all.filter(function (x) { return x.id === id; })[0];
    if (!c || !c.active || c.category === "masterclass") {
      el.innerHTML = '<section class="section"><div class="wrap narrow center"><h1>This program isn’t open right now</h1><p class="lead">It may be between intakes. See what’s open now, or ask us when the next class starts.</p><p><a class="btn btn-orange" href="' + link("programs") + '">See open programs</a> <a class="btn btn-ghost-dark" href="' + wa("Hello LightOn Academy, when does " + (c ? c.title : "this program") + " start next?") + '">' + I.wa + " Ask on WhatsApp</a></p></div></section>";
      return;
    }
    document.title = c.title + " | LightOn Academy";
    var lis = function (s) { return list_(s).map(function (x) { return "<li>" + I.check + "<span>" + esc(x) + "</span></li>"; }).join(""); };
    var sched = list_(c.schedule).map(function (s) { var p = s.split(":"); var place = p.length > 1 ? p.shift() : ""; return "<tr><th>" + esc(place || "Schedule") + "</th><td>" + esc(p.join(":").trim()) + "</td></tr>"; }).join("");
    var plan = list_(c.payment_plan);
    var regMsg = "Hello LightOn Academy, I'd like to register for " + c.title + ".";
    el.innerHTML =
      '<section class="c-hero"><div class="wrap c-hero-grid"><div>' +
      '<p class="crumbs"><a href="' + link("programs") + '">Programs</a> / ' + esc(CATS[c.category] || "") + "</p>" +
      '<span class="eyebrow light">' + esc(c.level || "") + '</span><h1>' + esc(c.title) + '</h1><p class="lead">' + esc(c.tagline || "") + "</p>" +
      '<ul class="facts">' + (c.duration ? "<li>" + I.clock + "<span><small>Duration</small>" + esc(c.duration) + "</span></li>" : "") + (c.format ? "<li>" + I.laptop + "<span><small>Format</small>" + esc(c.format) + "</span></li>" : "") + (c.start ? "<li>" + I.cal + "<span><small>Intake</small>" + esc(c.start) + "</span></li>" : "") + "<li>" + I.award + "<span><small>Certificate</small>Included</span></li></ul></div>" +
      '<div class="c-hero-img"><img src="' + img(c.image || "photos/students-study.jpg") + '" alt=""></div></div></section>' +
      '<section class="section"><div class="wrap detail-grid"><div class="detail-main">' +
      (c.audience ? '<div class="block"><h2>Who it’s for</h2><p>' + esc(c.audience) + (c.requirements ? ' <span class="req">' + esc(c.requirements) + "</span>" : "") + "</p></div>" : "") +
      (c.learn ? '<div class="block"><h2>What you will learn</h2><ul class="ticks two">' + lis(c.learn) + "</ul></div>" : "") +
      (c.projects ? '<div class="block"><h2>What you’ll build</h2><ul class="ticks two">' + lis(c.projects) + "</ul></div>" : "") +
      (c.outcomes ? '<div class="block"><h2>What you leave with</h2><ul class="ticks two">' + lis(c.outcomes) + "</ul></div>" : "") +
      '<div class="block"><h2>Where & when</h2>' + (sched ? '<table class="sched">' + sched + "</table>" : "<p>Class days and venues are confirmed when you register. We’ll WhatsApp you the schedule for the center closest to you.</p>") + "</div>" +
      pathBlock(c) +
      "</div><aside class=\"price-card\">" + priceBlock(c, true) +
      (plan.length ? '<div class="plan"><h4>Flexible payment</h4><ul class="ticks">' + plan.map(function (p) { return "<li>" + I.check + "<span>" + esc(p) + "</span></li>"; }).join("") + "</ul></div>" : "") +
      '<a class="btn btn-orange btn-block" href="' + C.REGISTER_URL + '">Register now ' + I.arrow + '</a><a class="btn btn-wa btn-block" href="' + wa(regMsg) + '">' + I.wa + " Ask on WhatsApp</a>" +
      '<p class="small">After you register, we’ll WhatsApp you the payment details and next steps, usually within 24 hours.</p></aside></div></section>';
  }

  /* ---------- interactions ---------- */
  function reveal() {
    var els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  function wire() {
    var t = $(".nav-toggle"), n = $("#nav");
    if (t) t.addEventListener("click", function () { var o = document.body.classList.toggle("menu-open"); t.setAttribute("aria-expanded", o); t.innerHTML = o ? I.close : I.menu; });
    $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); });
    $$("[data-register]").forEach(function (a) { a.href = C.REGISTER_URL; });
    $$("[data-portal]").forEach(function (a) { a.href = C.PORTAL_URL; });
    $$("[data-link]").forEach(function (a) { a.href = link(a.getAttribute("data-link"), a.getAttribute("data-q")); });
    $$("[data-img]").forEach(function (im) { im.src = img(im.getAttribute("data-img")); });
    $$("[data-icon]").forEach(function (s) { s.innerHTML = I[s.getAttribute("data-icon")] || ""; });
    $$("[data-contact-line]").forEach(function (el) {
      el.innerHTML = '<a href="tel:+231' + C.PHONES[0].slice(1) + '">' + I.phone + C.PHONES.join(" · ") + '</a><a href="mailto:' + C.EMAIL + '">' + I.mail + C.EMAIL + '</a><a href="' + wa("Hello LightOn Academy") + '">' + I.wa + "WhatsApp us</a>";
    });
    var f = $("#contact-form");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var msg = "Hello LightOn Academy,\n\nName: " + d.get("name") + "\nPhone: " + d.get("phone") + (d.get("course") ? "\nAbout: " + d.get("course") : "") + "\n\n" + d.get("message");
      window.open(wa(msg), "_blank");
    });
  }

  function init() {
    var h = $("#site-header"), ft = $("#site-footer");
    if (h) h.outerHTML = header();
    if (ft) ft.outerHTML = footer();
    wire(); reveal();
    loadData(mountAll).catch(function () {
      $$("[data-courses],[data-masterclasses]").forEach(function (el) { el.innerHTML = emptyState("We couldn’t load the program list."); });
    });
    window.addEventListener("scroll", function () { document.body.classList.toggle("scrolled", window.scrollY > 10); }, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
