/**
 * LightOn Academy — website content (Website.gs)
 * ------------------------------------------------------------
 * Add this as a NEW file in your Academy Management Dashboard's Apps Script
 * (Extensions ▸ Apps Script ▸ ＋ ▸ Script ▸ name it "Website"). It sits next to
 * Code.gs and Index.html and does not change anything the portal uses.
 *
 * One-time setup:
 * 1. In Code.gs, find  function doGet(e) {  and add this as its first line:
 *      if (e && e.parameter && e.parameter.website) return lightonWebsiteApi(e);
 * 2. Save, choose  setupWebsiteTabs  in the toolbar and click ▶ Run.
 *    This adds the "Web …" tabs (Web Courses, Web Paths, Web Centers, Web Services,
 *    Web Team, Web Gallery) and a "LightOn Website" menu. Your portal tabs are not touched.
 * 3. Deploy ▸ Manage deployments ▸ ✏ Edit ▸ Version: New version ▸ Deploy (same link as before).
 * 4. Website data link = your portal's Web app URL + ?website=1
 *    e.g. https://script.google.com/macros/s/XXXX/exec?website=1
 *    Paste it into the website (config.js → DATA_URL) and WordPress
 *    (Appearance ▸ Customize ▸ LightOn Academy ▸ Website data link).
 *
 * Only the "Web …" tabs are ever sent to the website. Students, fees, users and
 * every other portal tab stay private.
 *
 * After that, edit the "Web …" tabs. Tick "active" to show a row, untick to hide it
 * (untick rather than delete: "Set up / repair tabs" re-adds missing starter rows).
 * Changes appear on the websites within about a minute
 * (menu LightOn Website ▸ Publish changes now makes it instant).
 */

var LW_TABS = {
  'Web Courses': ['id', 'active', 'featured', 'order', 'category', 'title', 'level', 'tagline', 'audience', 'duration', 'format', 'start',
             'schedule', 'price', 'regular_price', 'show_price', 'price_note', 'payment_plan', 'learn', 'projects', 'outcomes',
             'requirements', 'image', 'path', 'step'],
  'Web Paths': ['id', 'active', 'order', 'name', 'description'],
  'Web Centers': ['id', 'active', 'order', 'name', 'venue', 'address', 'map_link', 'note'],
  'Web Services': ['id', 'active', 'order', 'title', 'icon', 'description', 'points', 'button_label', 'whatsapp_message'],
  'Web Team': ['id', 'active', 'order', 'name', 'role', 'photo'],
  'Web Gallery': ['id', 'active', 'order', 'image', 'caption']
};
var LW_CHECKBOXES = ['active', 'featured', 'show_price'];
var LW_NOTES = {
  'Web Courses': 'category: professional, tech, youth, kids or masterclass.  Lists (schedule, learn, projects, outcomes, payment_plan): separate items with |  e.g. "Paynesville: Saturday, 2–5 PM | Sinkor: Tuesday, 3–6 PM".  Untick show_price to show "Fees on request".  path + step: courses with the same path name form a learning path, shown in step order (1, 2, 3…) with "what to take next" advice.  category ministry = Ministries & Organizations.',
  'Web Paths': 'One row per learning path. name must match the "path" column in Web Courses exactly. Untick active to hide a path.',
  'Web Centers': 'Add a row for each new training center. map_link is optional (paste a Google Maps link).',
  'Web Services': 'icon: laptop, spark, cal, award, video, cloud, bot, path, pin, mail or phone.  points: separate with |',
  'Web Team': 'photo: a full https:// image link (e.g. from WordPress Media) or a file in the website\'s assets/img folder, e.g. team/samuel-ogundele.jpg',
  'Web Gallery': 'image: a full https:// image link or a file in assets/img. caption is optional.'
};

/* ---------- the website reads this ---------- */
function lightonWebsiteApi(e) {
  var fresh = e && e.parameter && e.parameter.fresh;
  var cache = CacheService.getScriptCache();
  var hit = fresh ? null : cache.get('lighton_website');
  var json = hit || lwBuildJson_();
  if (!hit) { try { cache.put('lighton_website', json, 60); } catch (err) {} }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function lwBuildJson_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var out = { updated: new Date().toISOString() };
  Object.keys(LW_TABS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    out[lwKey_(name)] = sh ? lwReadTab_(sh) : [];
  });
  return JSON.stringify(out);
}

function lwKey_(tab) { return tab.replace(/^Web /, '').toLowerCase(); }

function lwReadTab_(sh) {
  var values = sh.getDataRange().getDisplayValues();
  if (values.length < 2) return [];
  var head = values[0].map(function (h) { return String(h).trim().toLowerCase().replace(/\s+/g, '_'); });
  return values.slice(1).filter(function (r) { return r.join('').trim(); }).map(function (r) {
    var o = {};
    head.forEach(function (h, i) { if (h) o[h] = String(r[i] == null ? '' : r[i]).trim(); });
    return o;
  });
}

/* ---------- menu ---------- */
function lightonWebsiteMenu() {
  SpreadsheetApp.getUi().createMenu('LightOn Website')
    .addItem('Publish changes now', 'publishWebsiteNow')
    .addItem('Set up / repair tabs', 'setupWebsiteTabs')
    .addToUi();
}
function publishWebsiteNow() {
  CacheService.getScriptCache().remove('lighton_website');
  SpreadsheetApp.getActiveSpreadsheet().toast('The websites will show your changes on the next page load.', 'LightOn Website', 5);
}

/* ---------- one-time setup ---------- */
function setupWebsiteTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // If you already imported the earlier courses CSV as a tab, reuse it (only an exact match is renamed)
  if (!ss.getSheetByName('Web Courses')) {
    var want = ['id', 'active', 'featured', 'order', 'category'];
    ss.getSheets().some(function (s) {
      if (s.getLastRow() < 1 || s.getLastColumn() < 5) return false;
      var h = s.getRange(1, 1, 1, 5).getValues()[0].map(function (x) { return String(x).trim(); });
      if (h.join('|') === want.join('|')) { s.setName('Web Courses'); return true; }
      return false;
    });
  }

  Object.keys(LW_TABS).forEach(function (name) {
    var headers = LW_TABS[name];
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var isEmpty = sh.getLastRow() === 0;
    if (sh.getMaxColumns() < headers.length) sh.insertColumnsAfter(sh.getMaxColumns(), headers.length - sh.getMaxColumns());
    if (sh.getMaxRows() < 200) sh.insertRowsAfter(sh.getMaxRows(), 200 - sh.getMaxRows());

    var added = [];
    if (isEmpty) {
      // Text columns stay exactly as typed (so "$60" doesn't turn into a number)
      headers.forEach(function (h, i) {
        if (LW_CHECKBOXES.indexOf(h) === -1 && h !== 'order' && h !== 'step') sh.getRange(2, i + 1, sh.getMaxRows() - 1, 1).setNumberFormat('@');
      });
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    } else {
      // Repair: add any new columns at the end
      var have = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim().toLowerCase(); });
      headers.forEach(function (h) {
        if (have.indexOf(h) === -1) {
          var col = have.length + 1;
          sh.getRange(1, col).setValue(h);
          if (LW_CHECKBOXES.indexOf(h) === -1 && h !== 'order' && h !== 'step') sh.getRange(2, col, sh.getMaxRows() - 1, 1).setNumberFormat('@');
          have.push(h);
          added.push(h);
        }
      });
    }

    // Add starter rows whose id isn't in the tab yet (your own edits are never overwritten)
    var cols = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim().toLowerCase(); });
    var idCol = cols.indexOf('id');
    var existing = {};
    if (idCol > -1 && sh.getLastRow() > 1) {
      sh.getRange(2, idCol + 1, sh.getLastRow() - 1, 1).getValues().forEach(function (r) { existing[String(r[0]).trim()] = 1; });
    }
    var rows = (LW_SEED[lwKey_(name)] || []).filter(function (o) { return !existing[o.id]; }).map(function (o) {
      return cols.map(function (h) {
        var v = o[h];
        if (LW_CHECKBOXES.indexOf(h) > -1) return v === true || String(v).toUpperCase() === 'TRUE';
        return v == null ? '' : v;
      });
    });
    // Fill brand-new columns (e.g. path, step) for rows you already had, using the starter values
    if (added.length && idCol > -1 && sh.getLastRow() > 1) {
      var seedById = {};
      (LW_SEED[lwKey_(name)] || []).forEach(function (o) { seedById[o.id] = o; });
      var ids = sh.getRange(2, idCol + 1, sh.getLastRow() - 1, 1).getValues();
      added.forEach(function (h) {
        var col = cols.indexOf(h) + 1;
        var vals = ids.map(function (r) { var o = seedById[String(r[0]).trim()]; return [o && o[h] != null ? o[h] : '']; });
        sh.getRange(2, col, vals.length, 1).setValues(vals);
      });
    }
    if (rows.length) sh.getRange(Math.max(sh.getLastRow(), 1) + 1, 1, rows.length, cols.length).setValues(rows);

    var lastRow = sh.getMaxRows() - 1;
    var current = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).toLowerCase(); });
    LW_CHECKBOXES.forEach(function (c) {
      var col = current.indexOf(c);
      if (col > -1) sh.getRange(2, col + 1, lastRow, 1).insertCheckboxes();
    });
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold').setBackground('#0a0d3a').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.getRange(1, 1).setNote(LW_NOTES[name] || '');
  });

  // Show the "LightOn Website" menu every time the sheet opens (alongside the portal's own menu)
  var hasTrigger = ScriptApp.getProjectTriggers().some(function (tr) { return tr.getHandlerFunction() === 'lightonWebsiteMenu'; });
  if (!hasTrigger) ScriptApp.newTrigger('lightonWebsiteMenu').forSpreadsheet(ss).onOpen().create();
  try { lightonWebsiteMenu(); } catch (err) {}

  ss.setActiveSheet(ss.getSheetByName('Web Courses'));
  publishWebsiteNow();
  SpreadsheetApp.getUi().alert('Website tabs are ready.\n\nFirst time? Make sure doGet in Code.gs has the website line (see the top of Website.gs), then Deploy ▸ Manage deployments ▸ Edit ▸ New version. Your website data link is your portal Web app URL followed by ?website=1');
}

/* Using a separate Google Sheet instead of the portal's? Remove the two slashes from the next line.
// function doGet(e) { return lightonWebsiteApi(e); }
*/

/* ---------- starting content (only used to fill empty tabs) ---------- */
var LW_SEED = {
 "courses": [
  {
   "id": "skill-up-level-1",
   "active": true,
   "featured": true,
   "order": 1,
   "category": "professional",
   "title": "Skill Up Stand Out — Level 1",
   "level": "Beginner",
   "tagline": "Practical digital skills that help you work, earn and grow. No experience needed.",
   "audience": "Adults, job seekers, workers and anyone starting with computers",
   "duration": "6 weeks",
   "format": "Onsite",
   "start": "Enrollment ongoing",
   "schedule": "Paynesville: Saturday, 2:00 PM – 5:00 PM | Chicken Soup: Tuesday, 2:00 PM – 5:00 PM | Duazon: Saturday, 10:00 AM – 1:00 PM",
   "price": "$60",
   "regular_price": "$100",
   "show_price": true,
   "price_note": "Limited offer — save 40%",
   "payment_plan": "50% before training starts | 50% during week 2",
   "learn": "Digital skills & computer fundamentals | Microsoft Word & Excel for work | Professional email communication | AI tools for productivity",
   "projects": "",
   "outcomes": "Certificate of completion | Step-by-step training | Confidence using a computer at work",
   "requirements": "No experience needed",
   "image": "photos/level2.jpg",
   "path": "Skill Up, Stand Out",
   "step": 1
  },
  {
   "id": "skill-up-level-2",
   "active": true,
   "featured": false,
   "order": 2,
   "category": "professional",
   "title": "Skill Up Stand Out — Level 2",
   "level": "Intermediate",
   "tagline": "Take your digital skills to the next level and stand out at work.",
   "audience": "Workers, graduates and Level 1 graduates",
   "duration": "9 weeks",
   "format": "Onsite",
   "start": "Enrollment ongoing",
   "schedule": "Paynesville: Saturday, 2:00 PM – 5:00 PM | Chicken Soup: Tuesday, 2:00 PM – 5:00 PM | Duazon: Saturday, 10:00 AM – 1:00 PM",
   "price": "$90",
   "regular_price": "$150",
   "show_price": true,
   "price_note": "Limited offer — save 40%",
   "payment_plan": "50% before training starts | 50% during week 2",
   "learn": "Advanced office tools (Word, Excel, PowerPoint) | Smart online collaboration (Zoom, OneDrive and more) | Professional email mastery | AI tools for productivity | Leadership & communication skills",
   "projects": "",
   "outcomes": "Certificate of completion | Workplace-ready office skills",
   "requirements": "Basic computer skills required",
   "image": "photos/hero-couple.jpg",
   "path": "Skill Up, Stand Out",
   "step": 2
  },
  {
   "id": "skill-up-level-3",
   "active": true,
   "featured": false,
   "order": 3,
   "category": "professional",
   "title": "Skill Up Stand Out — Level 3",
   "level": "Expert",
   "tagline": "Advanced data, digital marketing and business skills for professionals.",
   "audience": "Professionals, managers, entrepreneurs and Level 2 graduates",
   "duration": "12 weeks",
   "format": "Onsite",
   "start": "Enrollment ongoing",
   "schedule": "",
   "price": "",
   "regular_price": "",
   "show_price": false,
   "price_note": "",
   "payment_plan": "50% before training starts | 50% during week 2",
   "learn": "Microsoft Office Suite (Word, Excel, PowerPoint) | Access & advanced data analytics | Digital marketing & online branding | Business communication & project management | AI for business",
   "projects": "",
   "outcomes": "Certificate of completion | Business-ready digital skills",
   "requirements": "Intermediate computer skills",
   "image": "photos/excel.jpg",
   "path": "Skill Up, Stand Out",
   "step": 3
  },
  {
   "id": "next-step",
   "active": true,
   "featured": true,
   "order": 4,
   "category": "youth",
   "title": "Your Next Step — High School Graduates",
   "level": "Beginner",
   "tagline": "9 weeks of hands-on digital skills to get you ready for college, trade school, university or work.",
   "audience": "Recent high school graduates",
   "duration": "9 weeks",
   "format": "Onsite, one session a week (3 hours)",
   "start": "Starting in December",
   "schedule": "Paynesville: Thursday, 4:00 PM – 7:00 PM | Duazon: Thursday, 10:00 AM – 1:00 PM | Chicken Soup: Tuesday, 3:00 PM – 6:00 PM",
   "price": "$100",
   "regular_price": "",
   "show_price": true,
   "price_note": "$20 registration + $80 training (2 installments)",
   "payment_plan": "$20 registration, paid once | $80 training, payable in 2 installments",
   "learn": "Computer and digital skills foundations | Email & cloud storage (Google Drive) | Word: CV & cover letter | Excel: budgets & formulas | PowerPoint: present with confidence | AI tools for study & job applications | Canva design for college & career",
   "projects": "CV | Cover letter | Personal statement | Budget | Presentation | Designed materials",
   "outcomes": "Certificate of completion | Your Next-Step Portfolio",
   "requirements": "No experience needed",
   "image": "photos/nextstep.jpg",
   "path": "",
   "step": ""
  },
  {
   "id": "innovators-bootcamp",
   "active": true,
   "featured": true,
   "order": 5,
   "category": "kids",
   "title": "Innovators Bootcamp (Ages 12–17)",
   "level": "Explorer & Builder",
   "tagline": "Robotics, coding, AI, design, leadership and woodwork — a holiday that builds the future.",
   "audience": "Children and teens aged 12 to 17",
   "duration": "8 weeks (2 months)",
   "format": "Online — just a smartphone",
   "start": "Registration ongoing",
   "schedule": "3 live sessions a week (2 hours each, FreeConferenceCall) + 1 self-paced group work day (WhatsApp groups)",
   "price": "FREE tuition",
   "regular_price": "",
   "show_price": true,
   "price_note": "$40 one-time registration per child · 3rd child onwards $20",
   "payment_plan": "One-time $40 registration secures the spot | Family discount for 3 or more children",
   "learn": "Robotics (virtual simulation) | Coding: HTML & CSS | Artificial Intelligence | Graphic design with Canva | Leadership, innovation & entrepreneurship | Woodwork innovation challenge",
   "projects": "A published webpage | An AI-powered creative project | A physical creation from scrap wood | Demo Day presentation",
   "outcomes": "Certificate of completion | Live portfolio | Real project | Physical creation",
   "requirements": "A smartphone",
   "image": "photos/robotics.jpg",
   "path": "",
   "step": ""
  },
  {
   "id": "web-development",
   "active": true,
   "featured": false,
   "order": 6,
   "category": "tech",
   "title": "Coding & Web Development Bootcamp",
   "level": "Beginner",
   "tagline": "Build and publish real, responsive websites — and a personal portfolio.",
   "audience": "Beginners, students and aspiring developers",
   "duration": "8 weeks",
   "format": "Online & onsite",
   "start": "Enrollment ongoing",
   "schedule": "",
   "price": "$100",
   "regular_price": "",
   "show_price": true,
   "price_note": "",
   "payment_plan": "50% before training starts | 50% during week 2",
   "learn": "HTML | CSS | Flexbox | Responsive design | Publishing your site",
   "projects": "Real projects | Personal portfolio website",
   "outcomes": "Certificate of completion | Expert mentorship",
   "requirements": "Basic computer skills",
   "image": "photos/students-study.jpg",
   "path": "Become a Developer",
   "step": 1
  },
  {
   "id": "mobile-app-development",
   "active": true,
   "featured": true,
   "order": 7,
   "category": "tech",
   "title": "Mobile App Development — Flutter & Android",
   "level": "Foundation · Level 1",
   "tagline": "Build your first real Android app and install it on your phone. Beginner friendly.",
   "audience": "Beginners and aspiring app developers",
   "duration": "6 weeks",
   "format": "Onsite · Saturdays, 3 hours per session (2 PM)",
   "start": "Enrollment ongoing",
   "schedule": "Paynesville: Saturday, 2:00 PM – 5:00 PM",
   "price": "$70",
   "regular_price": "",
   "show_price": true,
   "price_note": "Limited offer — save 40%",
   "payment_plan": "50% before training starts | 50% during week 2",
   "learn": "Build mobile app interfaces with Flutter | Navigate between multiple screens | Collect and store user data | Build and export an Android APK | Install your app on a real phone | Explore Google Play Store & freelancing",
   "projects": "Credit & debit tracker | Market sales tracker | Local delivery request app",
   "outcomes": "Certificate of completion | Your own Android app",
   "requirements": "Basic computer skills",
   "image": "photos/girl-laptop.png",
   "path": "Become a Developer",
   "step": 3
  },
  {
   "id": "backend-php-mysql",
   "active": true,
   "featured": true,
   "order": 8,
   "category": "tech",
   "title": "Build & Deploy — Backend Development (PHP & MySQL)",
   "level": "Level 2",
   "tagline": "Go beyond design. Build powerful, dynamic web applications.",
   "audience": "Frontend graduates, aspiring full-stack developers and entrepreneurs",
   "duration": "10 weeks",
   "format": "Onsite only · Saturday, 2:00 PM – 5:00 PM",
   "start": "Registration ongoing",
   "schedule": "Paynesville: Saturday, 2:00 PM – 5:00 PM",
   "price": "$60",
   "regular_price": "$100",
   "show_price": true,
   "price_note": "Early registration $60 · Late registration $100",
   "payment_plan": "50% before training starts | 50% during week 2",
   "learn": "PHP fundamentals, forms (GET & POST), functions & validation | MySQL database design and SQL queries (CRUD) | Connecting PHP to MySQL | Authentication: registration, secure login, password hashing, sessions | Role-based access (admin/user) | Deployment",
   "projects": "Authentication & messaging API | File upload management system | User registration & authentication platform",
   "outcomes": "Certificate of completion | Personal developer portfolio | Mentorship & code review | Internship recommendation (top students)",
   "requirements": "Completed frontend (HTML/CSS) training",
   "image": "photos/backend.jpg",
   "path": "Become a Developer",
   "step": 2
  },
  {
   "id": "excel-power-bi-ai",
   "active": true,
   "featured": true,
   "order": 9,
   "category": "tech",
   "title": "Excel, Power BI & AI — Data Insights & Visualization",
   "level": "Intermediate",
   "tagline": "Turn raw data into powerful insights with Excel, Power BI dashboards and AI.",
   "audience": "Professionals, accountants, NGO & M&E staff, project officers, entrepreneurs and aspiring data analysts",
   "duration": "8 weeks",
   "format": "Onsite · 3 hours per session",
   "start": "Starting in January",
   "schedule": "Paynesville (Vine School System)",
   "price": "",
   "regular_price": "",
   "show_price": false,
   "price_note": "",
   "payment_plan": "50% before training starts | 50% during week 2",
   "learn": "Excel data analysis & reporting | Power BI interactive dashboards | AI tools & applications | Data visualization & storytelling",
   "projects": "Hands-on final project",
   "outcomes": "Certificate of completion",
   "requirements": "Basic Excel skills",
   "image": "photos/excel.jpg",
   "path": "Skill Up, Stand Out",
   "step": 4
  },
  {
   "id": "graphic-design-ai",
   "active": true,
   "featured": false,
   "order": 10,
   "category": "tech",
   "title": "Graphic Design & AI Essentials (Online)",
   "level": "Beginner",
   "tagline": "Design and create with AI from your phone, tablet or laptop.",
   "audience": "Working adults, students and entrepreneurs",
   "duration": "3 weeks",
   "format": "Online · twice a week, 8:00 PM – 9:30 PM",
   "start": "Enrollment ongoing",
   "schedule": "Online: twice a week, 8:00 PM – 9:30 PM",
   "price": "$50",
   "regular_price": "",
   "show_price": true,
   "price_note": "Certificate included",
   "payment_plan": "",
   "learn": "Graphic design tools | Designing for social media | AI essentials for creativity",
   "projects": "",
   "outcomes": "Certificate of completion",
   "requirements": "A phone, tablet or laptop",
   "image": "photos/kids-laptop.jpg",
   "path": "",
   "step": ""
  },
  {
   "id": "ai-essentials",
   "active": false,
   "featured": false,
   "order": 11,
   "category": "tech",
   "title": "AI Essentials",
   "level": "Beginner",
   "tagline": "Use AI tools confidently for work, study and business.",
   "audience": "Everyone",
   "duration": "4 weeks",
   "format": "Online",
   "start": "",
   "schedule": "",
   "price": "$40",
   "regular_price": "",
   "show_price": true,
   "price_note": "",
   "payment_plan": "",
   "learn": "AI basics | Prompting | AI for productivity",
   "projects": "",
   "outcomes": "Certificate of completion",
   "requirements": "",
   "image": "photos/students-study.jpg",
   "path": "",
   "step": ""
  },
  {
   "active": true,
   "featured": false,
   "category": "ministry",
   "level": "Module 1 · 3 sessions",
   "audience": "Pastors, church and ministry leaders, NGO staff and organization teams",
   "format": "Onsite or online · group training",
   "start": "Book for your team",
   "schedule": "",
   "price": "",
   "regular_price": "",
   "show_price": false,
   "price_note": "",
   "payment_plan": "",
   "projects": "",
   "requirements": "No experience needed",
   "path": "Digital Leadership for Ministries & Organizations",
   "id": "ministry-digital-foundations",
   "order": 12,
   "step": 1,
   "title": "Digital Foundations",
   "duration": "3 sessions",
   "tagline": "Technology, digital transformation and confident everyday computer and smartphone use for ministry and organizations.",
   "learn": "Technology, digital transformation and ministry | Basic computer and smartphone skills | Professional digital communication",
   "outcomes": "Certificate of participation | Confident everyday digital skills",
   "image": "photos/level2.jpg"
  },
  {
   "active": true,
   "featured": false,
   "category": "ministry",
   "level": "Module 2 · 3 sessions",
   "audience": "Pastors, church and ministry leaders, NGO staff and organization teams",
   "format": "Onsite or online · group training",
   "start": "Book for your team",
   "schedule": "",
   "price": "",
   "regular_price": "",
   "show_price": false,
   "price_note": "",
   "payment_plan": "",
   "projects": "",
   "requirements": "Digital Foundations or basic computer skills",
   "path": "Digital Leadership for Ministries & Organizations",
   "id": "ministry-digital-content",
   "order": 13,
   "step": 2,
   "title": "Digital Content & Online Presence",
   "duration": "3 sessions",
   "tagline": "Reach your community online with social media, polished documents and eye-catching designs.",
   "learn": "Social media for ministry and community engagement | Document preparation and presentation skills | Graphic design and digital content creation",
   "outcomes": "Certificate of participation | Ready-to-use content for your ministry or organization",
   "image": "photos/hero-couple.jpg"
  },
  {
   "active": true,
   "featured": false,
   "category": "ministry",
   "level": "Module 3 · 3 sessions",
   "audience": "Pastors, church and ministry leaders, NGO staff and organization teams",
   "format": "Onsite or online · group training",
   "start": "Book for your team",
   "schedule": "",
   "price": "",
   "regular_price": "",
   "show_price": false,
   "price_note": "",
   "payment_plan": "",
   "projects": "",
   "requirements": "Digital Foundations or basic computer skills",
   "path": "Digital Leadership for Ministries & Organizations",
   "id": "ministry-ai-leadership",
   "order": 14,
   "step": 3,
   "title": "Artificial Intelligence for Leadership & Ministry",
   "duration": "3 sessions",
   "tagline": "Use AI wisely to research, prepare content and run administration more efficiently.",
   "learn": "Introduction to AI and ChatGPT | Research, learning and content development using NotebookLM | AI tools for productivity and administration",
   "outcomes": "Certificate of participation | Practical AI workflows for your team",
   "image": "photos/students-study.jpg"
  },
  {
   "active": true,
   "featured": false,
   "category": "ministry",
   "level": "Module 4 · 2 sessions",
   "audience": "Pastors, church and ministry leaders, NGO staff and organization teams",
   "format": "Onsite or online · group training",
   "start": "Book for your team",
   "schedule": "",
   "price": "",
   "regular_price": "",
   "show_price": false,
   "price_note": "",
   "payment_plan": "",
   "projects": "",
   "requirements": "",
   "path": "Digital Leadership for Ministries & Organizations",
   "id": "ministry-digital-responsibility",
   "order": 15,
   "step": 4,
   "title": "Digital Responsibility & Technology Adoption",
   "duration": "2 sessions",
   "tagline": "Stay safe online and bring technology into your ministry or organization responsibly.",
   "learn": "Cybersecurity, privacy and responsible technology use | Technology integration for ministry and organizations",
   "outcomes": "Certificate of participation | A technology adoption plan for your organization",
   "image": "photos/excel.jpg"
  },
  {
   "id": "mc-graphics-branding",
   "active": true,
   "order": 20,
   "category": "masterclass",
   "title": "Graphics & Branding",
   "tagline": "Logos, flyers and brand identity.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-video-editing",
   "active": true,
   "order": 21,
   "category": "masterclass",
   "title": "Video Editing",
   "tagline": "Edit, cut and publish professional videos.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-mobile-web",
   "active": true,
   "order": 22,
   "category": "masterclass",
   "title": "Mobile & Web Development",
   "tagline": "Hands-on app and website building.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-ai",
   "active": true,
   "order": 23,
   "category": "masterclass",
   "title": "Artificial Intelligence",
   "tagline": "Practical AI for work and business.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-data-analytics",
   "active": true,
   "order": 24,
   "category": "masterclass",
   "title": "Data Analytics",
   "tagline": "Clean, analyse and present data.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-digital-marketing-cyber",
   "active": true,
   "order": 25,
   "category": "masterclass",
   "title": "Digital Marketing & Cybersecurity",
   "tagline": "Grow online and stay safe online.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-social-media",
   "active": true,
   "order": 26,
   "category": "masterclass",
   "title": "Social Media Branding & Marketing",
   "tagline": "Content, ads and audience growth.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-public-speaking",
   "active": true,
   "order": 27,
   "category": "masterclass",
   "title": "Public Speaking",
   "tagline": "Speak and present with confidence.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-project-management",
   "active": true,
   "order": 28,
   "category": "masterclass",
   "title": "Project Management",
   "tagline": "Plan, deliver and report projects.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-bookkeeping",
   "active": true,
   "order": 29,
   "category": "masterclass",
   "title": "Bookkeeping",
   "tagline": "Keep clean records for any business.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  },
  {
   "id": "mc-health-safety",
   "active": true,
   "order": 30,
   "category": "masterclass",
   "title": "Occupational Health & Safety",
   "tagline": "Safer workplaces, healthier teams.",
   "featured": false,
   "show_price": true,
   "path": "",
   "step": ""
  }
 ],
 "centers": [
  {
   "id": "paynesville",
   "active": true,
   "order": 1,
   "name": "Paynesville",
   "venue": "Vine School System",
   "address": "Bishop Michael Francis Road, Kpelle Town Road, Paynesville",
   "map_link": "",
   "note": ""
  },
  {
   "id": "chicken-soup",
   "active": true,
   "order": 2,
   "name": "Chicken Soup",
   "venue": "Free Pentecostal Global Mission School System",
   "address": "Chicken Soup Factory Junction, opposite the market",
   "map_link": "",
   "note": ""
  },
  {
   "id": "duazon",
   "active": true,
   "order": 3,
   "name": "Duazon",
   "venue": "Redeemed Christian Church of God (RCCG)",
   "address": "Eugene Lane Community, Duazon",
   "map_link": "",
   "note": ""
  },
  {
   "id": "sinkor",
   "active": true,
   "order": 4,
   "name": "Sinkor",
   "venue": "",
   "address": "5th Street, Sinkor, Monrovia",
   "map_link": "",
   "note": ""
  }
 ],
 "services": [
  {
   "id": "web-app-dev",
   "active": true,
   "order": 1,
   "title": "Website & app development",
   "icon": "laptop",
   "description": "Modern, mobile-friendly websites and web or mobile apps for businesses, schools, churches and NGOs.",
   "points": "Business and organization websites | Management systems and portals | Android apps",
   "button_label": "Request a quote",
   "whatsapp_message": "Hello LightOn Academy, I'd like a quote for a website or app."
  },
  {
   "id": "branding",
   "active": true,
   "order": 2,
   "title": "Social media branding & marketing",
   "icon": "spark",
   "description": "Logos, brand identity, flyers and social media content that help you stand out and reach more people.",
   "points": "Logo and brand identity | Flyers, banners and social graphics | Page setup and content plans",
   "button_label": "Request a quote",
   "whatsapp_message": "Hello LightOn Academy, I'd like help with branding and social media."
  },
  {
   "id": "project-management",
   "active": true,
   "order": 3,
   "title": "Project & product management",
   "icon": "cal",
   "description": "Planning, coordination and delivery support for digital projects, from idea to launch.",
   "points": "Project planning and tracking | Digital transformation support | Staff capacity training",
   "button_label": "Talk to us",
   "whatsapp_message": "Hello LightOn Academy, I'd like to discuss project management support."
  },
  {
   "id": "video",
   "active": true,
   "order": 4,
   "title": "Video production & advert creation",
   "icon": "video",
   "description": "Promotional videos, adverts and event coverage, edited and ready for social media.",
   "points": "Adverts and promo videos | Event coverage and highlights | Short-form social video",
   "button_label": "Request a quote",
   "whatsapp_message": "Hello LightOn Academy, I'd like a quote for video production."
  },
  {
   "id": "digitization",
   "active": true,
   "order": 5,
   "title": "Service digitization",
   "icon": "cloud",
   "description": "Move paper-based work online so your organization serves people faster and keeps better records.",
   "points": "Digital forms, registration and records | Online payment and attendance tracking | Dashboards and reports for decision-making",
   "button_label": "Digitize our services",
   "whatsapp_message": "Hello LightOn Academy, we'd like to digitize our services."
  },
  {
   "id": "ai-preparedness",
   "active": true,
   "order": 6,
   "title": "AI preparedness",
   "icon": "bot",
   "description": "Get your team ready to use AI safely and productively, with a plan that fits your organization.",
   "points": "AI readiness assessment | Staff training on practical AI tools | Responsible-use guidelines and policies",
   "button_label": "Prepare our team for AI",
   "whatsapp_message": "Hello LightOn Academy, we'd like help preparing our organization for AI."
  }
 ],
 "team": [
  {
   "id": "samuel-ogundele",
   "active": true,
   "order": 1,
   "name": "Samuel Ogundele",
   "role": "Lead Trainer & Coordinator · AI, Woodwork, Graphics, Leadership",
   "photo": "team/samuel-ogundele.jpg"
  },
  {
   "id": "blessing-ogundele",
   "active": true,
   "order": 2,
   "name": "Blessing Ogundele",
   "role": "Lead Administrator & Trainer · Leadership & Entrepreneurship",
   "photo": "team/blessing-ogundele.jpg"
  },
  {
   "id": "ephraim-doherty",
   "active": true,
   "order": 3,
   "name": "Ephraim Doherty",
   "role": "Trainer & Programmer · Coding",
   "photo": "team/ephraim-doherty.jpg"
  },
  {
   "id": "robert-bimba",
   "active": true,
   "order": 4,
   "name": "Robert Bimba",
   "role": "Head of Student Support",
   "photo": "team/robert-bimba.jpg"
  },
  {
   "id": "owen-blay",
   "active": true,
   "order": 5,
   "name": "Owen Blay",
   "role": "Trainer · Graphics & Innovation",
   "photo": "team/owen-blay.jpg"
  },
  {
   "id": "barnabas-kollie",
   "active": true,
   "order": 6,
   "name": "Barnabas Kollie",
   "role": "Trainer · Coding",
   "photo": "team/barnabas-kollie.jpg"
  },
  {
   "id": "charles-nyeswah",
   "active": true,
   "order": 7,
   "name": "Charles Nyeswah",
   "role": "Trainer · Robotics",
   "photo": "team/charles-nyeswah.jpg"
  },
  {
   "id": "moses-akpan",
   "active": true,
   "order": 8,
   "name": "Moses Akpan",
   "role": "Trainer",
   "photo": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/04/image-5-edited.png?w=480&ssl=1"
  },
  {
   "id": "ferston-yah",
   "active": true,
   "order": 9,
   "name": "Ferston Yah",
   "role": "Trainer",
   "photo": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/04/image-6-edited.png?w=480&ssl=1"
  },
  {
   "id": "fayiah-mbayoh",
   "active": true,
   "order": 10,
   "name": "Fayiah Mbayoh",
   "role": "Team Member",
   "photo": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/04/image-8-edited.png?w=480&ssl=1"
  }
 ],
 "gallery": [
  {
   "id": "photo-1",
   "active": true,
   "order": 1,
   "image": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-27-at-23.20.30_a40224dc.jpg?w=900&ssl=1",
   "caption": ""
  },
  {
   "id": "photo-2",
   "active": true,
   "order": 2,
   "image": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/03/WhatsApp-Image-2025-04-02-at-00.20.13_2370c461-e1743770256848.jpg?w=900&ssl=1",
   "caption": ""
  },
  {
   "id": "photo-3",
   "active": true,
   "order": 3,
   "image": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/03/lass2.jpg?w=900&ssl=1",
   "caption": ""
  },
  {
   "id": "photo-4",
   "active": true,
   "order": 4,
   "image": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/04/p-edited.jpeg?w=900&ssl=1",
   "caption": ""
  },
  {
   "id": "photo-5",
   "active": true,
   "order": 5,
   "image": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/03/lightOngirl-scaled.jpg?w=900&ssl=1",
   "caption": ""
  },
  {
   "id": "photo-6",
   "active": true,
   "order": 6,
   "image": "https://i0.wp.com/lightonacademy.com/wp-content/uploads/2025/03/banner-1-.jpg?w=900&ssl=1",
   "caption": ""
  }
 ],
 "paths": [
  {
   "id": "skill-up",
   "active": true,
   "order": 1,
   "name": "Skill Up, Stand Out",
   "description": "From your first click to advanced data and business skills. Most people start at Level 1; if you already use Word and Excel at work, start at Level 2."
  },
  {
   "id": "developer",
   "active": true,
   "order": 2,
   "name": "Become a Developer",
   "description": "Build websites first, then the backend that powers them, then mobile apps. Each bootcamp builds on the one before."
  },
  {
   "id": "ministry",
   "active": true,
   "order": 3,
   "name": "Digital Leadership for Ministries & Organizations",
   "description": "Four short modules for churches, ministries and organizations. Take them in order, or book the full series for your team."
  }
 ]
};
