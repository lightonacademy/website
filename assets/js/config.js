/* ============================================================
   LightOn Academy — site settings
   Courses, training centers, services, team and gallery are
   edited in the Google Sheet. This file only holds the links.
   ============================================================ */
window.LIGHTON = Object.assign({
  /* Your Google Sheet's web app link (Apps Script ▸ Deploy ▸ Web app URL).
     Leave empty to use data/site-data.json instead.                        */
  DATA_URL: "",

  /* Registration + student portal (your Apps Script portal PWA) */
  REGISTER_URL: "https://lightonacademy.github.io/?page=register",
  PORTAL_URL: "https://lightonacademy.github.io",

  /* Free online lessons (LightOn Learn). Leave empty to hide the "Learn free" links. */
  LEARN_URL: "https://learn.lightonacademy.com",

  /* Google Analytics 4 measurement ID, e.g. "G-XXXXXXX". Leave empty to switch analytics off.
     On WordPress, use Site Kit instead and leave this empty.                              */
  GA_ID: "",

  /* Contacts */
  WHATSAPP: "231886360203",               // international format, no + or spaces
  PHONES: ["0886360203", "0777959077"],
  EMAIL: "lightonacademy@gmail.com",
  FACEBOOK: "https://facebook.com/lightonacademy",
  CITY: "Monrovia, Liberia",

  /* Numbers on the home and about pages. "centers" counts the active centers in the sheet. */
  STATS: [
    { n: "250+", l: "Students trained" },
    { n: "6", l: "Innovators cohorts" },
    { n: "12+", l: "Courses & programs" },
    { n: "centers", l: "Training centers" }
  ],

  /* Page links (the WordPress theme overrides these automatically) */
  LINKS: {
    home: "index.html", programs: "programs.html", course: "course.html",
    kids: "kids.html", services: "services.html", about: "about.html",
    sponsor: "sponsor.html", contact: "contact.html", learn: "learn.html", media: "media.html"
  },
  ASSETS: "assets/",            // folder that holds css/, js/, img/
  DATA: "data/site-data.json"   // fallback content
}, window.LIGHTON || {});

/* The GitHub copy (*.github.io) must not compete with lightonacademy.com in Google.
   This adds "noindex" only there, and switches itself off on any other address. */
(function () {
  if (/\.github\.io$/i.test(location.hostname)) {
    var m = document.createElement("meta");
    m.name = "robots"; m.content = "noindex, follow";
    document.head.appendChild(m);
  }
})();
