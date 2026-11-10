# LightOn Academy website — GitHub Pages version

A fast, mobile-first website for LightOn Academy. **Courses, training centers, services, team and gallery are all edited in one Google Sheet.** Tick `active` to show a row and untick it to hide it. The WordPress theme reads the same sheet, so one change updates both sites.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `programs.html` | All programs (filter tabs) + masterclasses |
| `course.html?id=…` | One page per course, built automatically from the sheet |
| `kids.html` | Innovators Bootcamp, for parents |
| `services.html` | Services (from the sheet) + team training |
| `about.html` | Story, mission, vision, values, team and gallery (from the sheet) |
| `sponsor.html` | Sponsor a student |
| `contact.html` | Contacts, training centers, FAQ, message form (sends via WhatsApp) |

## 1. Put it on GitHub (about 5 minutes)

Your portal already uses `lightonacademy.github.io`, so the website goes in its own repository:

1. Sign in to GitHub as **lightonacademy** ▸ **New repository** ▸ name it `website` ▸ **Public** ▸ Create.
2. **Add file ▸ Upload files** and drag in *everything* in this folder. Commit.
3. **Settings ▸ Pages** ▸ Source: *Deploy from a branch* ▸ Branch: `main`, folder `/ (root)` ▸ Save.
4. After about a minute the site is live at **https://lightonacademy.github.io/website/**

The site works straight away using `data/site-data.json`. Connect the sheet next so you can edit without touching code.

## 2. Connect your Academy Management Dashboard sheet (one time, about 10 minutes)

The website content lives in the **same Google Sheet as your portal**, in six extra tabs starting with "Web": **Web Courses, Web Paths, Web Centers, Web Services, Web Team, Web Gallery**. Your portal's own tabs (Courses, Students, Fees…) are not touched, and only the "Web …" tabs are ever sent to the website.

1. Open the dashboard sheet ▸ **Extensions ▸ Apps Script**.
2. Click **＋ ▸ Script** and name the new file **`Website`**. Paste in everything from `google-sheet/website-data.gs` and save 💾.
   This is the one extra file the portal is meant to have next to `Code.gs` and `Index.html`; it doesn't replace either of them.
3. Open **`Code.gs`**, find the line `function doGet(e) {` (Ctrl+F) and add this as the very next line:
   ```js
   if (e && e.parameter && e.parameter.website) return lightonWebsiteApi(e);
   ```
   Save 💾.
4. In the toolbar dropdown choose **`setupWebsiteTabs`** ▸ ▶ **Run** ▸ approve the permissions (**Advanced ▸ Go to project**). This adds the six tabs, filled in, and a **LightOn Website** menu.
5. **Deploy ▸ Manage deployments ▸ ✏ Edit ▸ Version: New version ▸ Deploy.** The portal keeps the same link.
6. Your **website data link** is your portal's Web app URL with `?website=1` on the end:
   `https://script.google.com/macros/s/…/exec?website=1`
   - GitHub: open `assets/js/config.js` ▸ ✏ edit ▸ paste it into `DATA_URL: "…"` ▸ commit.
   - WordPress: **Appearance ▸ Customize ▸ LightOn Academy ▸ Website data link**.

Open that link in your browser: you should see text starting with `{"updated":`. If you see the portal login instead, step 3 or 5 was missed.

**When you update the portal to a new version later:** pasting a new `Code.gs` removes the line from step 3, so add it again before deploying. `Website.gs` stays as it is.

*Prefer a separate sheet? Put `Website.gs` in any other sheet's Apps Script, remove the `//` from the `function doGet` line near the bottom of the file, run `setupWebsiteTabs` and deploy it as a new Web app (Execute as: Me, Who has access: Anyone).*

**Updating `Website.gs` later?** Paste in the new version, save, and choose **LightOn Website ▸ Set up / repair tabs**. It adds new tabs, columns and starter rows (such as the ministry modules and new services) and never changes rows you've edited. To get rid of a starter row for good, untick `active` instead of deleting it, because repair adds back missing rows.

From then on, **edit the sheet, not the website.** Changes appear within about a minute. To make them appear at once, use the sheet's menu **LightOn Website ▸ Publish changes now**. Visitors see saved content instantly, and it refreshes from the sheet in the background.

Every tab name below starts with "Web" in the sheet (Web Courses, Web Paths…).

## The tabs

Every tab has `active` (✅ show · ☐ hide) and `order` (1 shows first). Hover over cell **A1** in any tab for a reminder.

**Courses**

| Column | What it does |
|---|---|
| `id` | Short unique name used in the link (`course.html?id=next-step`). Don't change it once shared. |
| `featured` | ✅ also show on the home page under "Programs starting soon" |
| `category` | `professional`, `tech`, `youth`, `kids`, `ministry` (Ministries & Organizations) or `masterclass` |
| `title`, `level`, `tagline`, `audience` | Text on the card and course page |
| `duration`, `format`, `start` | e.g. `6 weeks` · `Onsite` · `Starting in January` (the yellow badge) |
| `schedule` | Days and times per center. Change them whenever you like. Separate centers with `|`, e.g. `Paynesville: Saturday, 2–5 PM | Sinkor: Tuesday, 3–6 PM`. Leave it empty to show "times confirmed when you register". |
| `price`, `regular_price` | e.g. `$60` and `$100` (shown crossed out). Leave `regular_price` empty if there's no discount. |
| `show_price` | ☐ hides the price and shows "Fees on request" |
| `price_note` | Small green line under the price |
| `payment_plan`, `learn`, `projects`, `outcomes` | Lists: separate items with `|` |
| `image` | A file in `assets/img/` (e.g. `photos/backend.jpg`) or any full `https://` image link |
| `path`, `step` | Learning path name and step number (see **Paths** below). Leave empty for a course that isn't part of a path. |

Masterclasses only need `id`, `active`, `order`, `category` = `masterclass`, `title` and `tagline`.
**New course:** add a row with a new `id` and tick `active`. Its page is created automatically.

**Paths (learning paths):** each row is one path: `name`, `description`, `active`, `order`. Courses join a path by putting the same `name` in their `path` column, with a `step` number (1, 2, 3…). The site then automatically:
- shows every path as connected steps on the Programs page ("Grow step by step"),
- adds "Step 2 of 4" to each course card,
- adds a **Your learning path** section to each course page, with advice on what to take before and after it, plus a WhatsApp button for placement help.

Starting paths: **Skill Up, Stand Out** (Level 1 → 2 → 3 → Excel & Power BI), **Become a Developer** (Web → Backend → Mobile) and **Digital Leadership for Ministries & Organizations** (Modules 1–4). Untick a path to hide it; its courses stay visible.

**Centers:** `name`, `venue`, `address`, an optional `map_link` (a Google Maps link; otherwise one is made from the address) and an optional `note` (e.g. "Saturdays only"). Add a row for each new center. The header, footer, center cards, page text and the "Training centers" count all update automatically.

**Services:** `title`, `icon` (`laptop`, `spark`, `cal`, `award`, `video`, `cloud`, `bot`, `path`, `pin`, `mail` or `phone`), `description`, `points` (separate with `|`), `button_label` and `whatsapp_message` (the message the button starts).

**Team:** `name`, `role` and `photo` (a full `https://` link, e.g. copied from WordPress **Media ▸ Copy URL**, or a file like `team/samuel-ogundele.jpg`). With no photo, the person's initials are shown.

**Gallery:** `image` (a full `https://` link or a file in `assets/img/`) and an optional `caption`. The home page shows the first 6; the About page shows all. If a photo can't load it's skipped, and an empty gallery hides itself.

> Moses, Ferston and Fayiah's photos and the gallery currently load from your WordPress site (`lightonacademy.com/wp-content/uploads/…`). If you ever close the WordPress site, upload those photos to `assets/img/` in GitHub and update the links in the sheet.

## 3. Other settings

`assets/js/config.js` holds the phones, email, WhatsApp number, register/portal links and the home-page numbers (`250+ students` and so on). Page wording lives in the `.html` files.

## Using a custom address later

To run this version at `lightonacademy.com` (for example, if you leave Bluehost): **Settings ▸ Pages ▸ Custom domain**, then point the domain's DNS at GitHub Pages in Cloudflare. All links are relative, so nothing else changes.
