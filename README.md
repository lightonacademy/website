# LightOn Academy website — GitHub Pages version

A fast, mobile-first website for LightOn Academy. **Courses, training centers, services, team, gallery, media and case studies are all edited in one Google Sheet.** Tick `active` to show a row and untick it to hide it. The WordPress theme reads the same sheet, so one change updates both sites.

> **Main site:** lightonacademy.com (WordPress) is the main website. This GitHub copy tells Google not to list it whenever it's served from `github.io` (see `assets/js/config.js`), so the two sites never compete in search. The plan for growing traffic with free lessons is in **lighton-learn/PLAN.md**.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `programs.html` | All programs (filter tabs) + learning paths + masterclasses |
| `learn.html` | **Learn free:** the three free online tracks (Computer Fundamentals, Web Development, AI Essentials) linking to learn.lightonacademy.com, how it works, bootcamp cards, FAQ |
| `course.html?id=…` | One page per course, built automatically from the sheet |
| `kids.html` | Innovators Bootcamp, for parents, plus the **STEAM Innovators Program** (coming next) |
| `services.html` | Services (from the sheet) + team training |
| `about.html` | Story, mission, vision, values, team and gallery (from the sheet) |
| `sponsor.html` | Sponsor a student |
| `media.html` | **Media & stories:** case studies, videos and news, gallery (all from the sheet) |
| `contact.html` | Contacts, training centers, FAQ, message form (sends via WhatsApp) |

The menu shows **Learn free** after Programs and **Media** after About. The footer has **Free online lessons** and **Media & stories**.

## 1. Put it on GitHub (about 5 minutes)

Your portal already uses `lightonacademy.github.io`, so the website goes in its own repository:

1. Sign in to GitHub as **lightonacademy** ▸ **New repository** ▸ name it `website` ▸ **Public** ▸ Create.
2. **Add file ▸ Upload files** and drag in *everything* in this folder, keeping the folders (`assets/`, `data/`, `google-sheet/`). Commit.
3. **Settings ▸ Pages** ▸ Source: *Deploy from a branch* ▸ Branch: `main`, folder `/ (root)` ▸ Save.
4. After about a minute the site is live at **https://lightonacademy.github.io/website/**

> **Tidy-up:** the live repo also has copies of `app.js`, `config.js`, `style.css`, `sw.js` (the portal's service worker), `site-data.json`, `website-data.gs` and the photos sitting loose in the **root** folder. The site only uses the ones inside `assets/`, `data/` and `google-sheet/`, so delete the loose root copies.

The site works straight away using `data/site-data.json`. Connect the sheet next so you can edit without touching code.

## 2. Connect your Academy Management Dashboard sheet (one time, about 10 minutes)

The website content lives in the **same Google Sheet as your portal**, in nine extra tabs starting with "Web": **Web Courses, Web Paths, Web Centers, Web Services, Web Team, Web Gallery, Web Media, Web Stories, Web Stats**. Your portal's own tabs (Courses, Students, Fees…) are not touched, and only the "Web …" tabs are ever sent to the website.

1. Open the dashboard sheet ▸ **Extensions ▸ Apps Script**.
2. Click **＋ ▸ Script** and name the new file **`Website`**. Paste in everything from `google-sheet/website-data.gs` and save 💾.
   This is the one extra file the portal is meant to have next to `Code.gs` and `Index.html`; it doesn't replace either of them.
3. Open **`Code.gs`**, find the line `function doGet(e) {` (Ctrl+F) and add this as the very next line:
   ```js
   if (e && e.parameter && e.parameter.website) return lightonWebsiteApi(e);
   ```
   Save 💾. *(Portal v6.1 and later does this for you.)*
4. In the toolbar dropdown choose **`setupWebsiteTabs`** ▸ ▶ **Run** ▸ approve the permissions (**Advanced ▸ Go to project**). This adds the tabs, filled in, and a **LightOn Website** menu.
5. **Deploy ▸ Manage deployments ▸ ✏ Edit ▸ Version: New version ▸ Who has access: Anyone ▸ Deploy.** The portal keeps the same link.
6. Your **website data link** is your portal's Web app URL with `?website=1` on the end:
   `https://script.google.com/macros/s/…/exec?website=1`
   - GitHub: open `assets/js/config.js` ▸ ✏ edit ▸ paste it into `DATA_URL: "…"` ▸ commit.
   - WordPress: **Appearance ▸ Customize ▸ LightOn Academy ▸ Website data link**.

Open that link in a private window: you should see text starting with `{"updated":`. If you see the portal login instead, step 3 or 5 was missed. If you see a Google sign-in page, "Who has access" isn't set to **Anyone**.

*Prefer a separate sheet? Put `Website.gs` in any other sheet's Apps Script, remove the `//` from the `function doGet` line near the bottom of the file, run `setupWebsiteTabs` and deploy it as a new Web app (Execute as: Me, Who has access: Anyone).*

**Updating `Website.gs` later?** Paste in the new version, save, choose **LightOn Website ▸ Set up / repair tabs**, then deploy a **New version** (step 5). Repair adds new tabs, columns and starter rows and never changes rows you've edited. To get rid of a starter row for good, untick `active` instead of deleting it, because repair adds back missing rows.

From then on, **edit the sheet, not the website.** Changes appear within about a minute. To make them appear at once, use the sheet's menu **LightOn Website ▸ Publish changes now**.

## The tabs

Every tab has `active` (✅ show · ☐ hide) and `order` (1 shows first). Hover over cell **A1** in any tab for a reminder.

**Courses**

| Column | What it does |
|---|---|
| `id` | Short unique name used in the link (`course.html?id=next-step`). Don't change it once shared. |
| `featured` | ✅ also show on the home page under "Programs starting soon" |
| `category` | `professional`, `tech`, `ai` (AI Training), `youth`, `kids`, `educators` (Teachers & Educators), `ministry` (Ministries & Organizations) or `masterclass` |
| `title`, `level`, `tagline`, `audience` | Text on the card and course page |
| `duration`, `format`, `start` | e.g. `6 weeks` · `Onsite` · `Starting in January` (the yellow badge) |
| `schedule` | Days and times per center, separated with `|`, e.g. `Paynesville: Saturday, 2–5 PM | Sinkor: Tuesday, 3–6 PM`. Leave it empty to show "times confirmed when you register". |
| `price`, `regular_price` | e.g. `$60` and `$100` (shown crossed out). Leave `regular_price` empty if there's no discount. |
| `show_price` | ☐ hides the price and shows "Fees on request" |
| `price_note` | Small green line under the price |
| `payment_plan`, `learn`, `projects`, `outcomes` | Lists: separate items with `|` |
| `image` | A file in `assets/img/` (e.g. `photos/backend.jpg`) or any full `https://` image link |
| `path`, `step` | Learning path name and step number (see **Paths** below). |

Masterclasses only need `id`, `active`, `order`, `category` = `masterclass`, `title` and `tagline`.
**New course:** add a row with a new `id` and tick `active`. Its page is created automatically.

Courses added in November 2026: **AI Training Levels 1–3** (`ai-level-1`, `ai-level-2`, `ai-level-3`: group class $50, $100 and $180 per learner shown as the main price, with one-on-one $150, $250 and $400 and $650 for all three one-on-one), **STEAM Innovators Program** (`steam-innovators`, next intake early 2027, fees on request) and **Teachers & Educators Program** (`teachers-educators`, coming soon). The old `ai-essentials` row stays switched off.

**Paths (learning paths):** each row is one path: `name`, `description`, `active`, `order`. Courses join a path by putting the same `name` in their `path` column, with a `step` number. The Programs page shows each path as connected steps, cards show "Step 2 of 4", and course pages get a **Your learning path** section. Paths: **Skill Up, Stand Out**, **Become a Developer**, **Digital Leadership for Ministries & Organizations** and **AI: Foundation to Builder**.

**Centers:** `name`, `venue`, `address`, optional `map_link` and `note`. Header, footer, center cards and the "Training centers" count update automatically.

**Services:** `title`, `icon` (`laptop`, `spark`, `cal`, `award`, `video`, `cloud`, `bot`, `chart`, `path`, `pin`, `mail` or `phone`), `description`, `points` (separate with `|`), `button_label` and `whatsapp_message`. Includes **Data health check** (for NGOs, schools and small businesses).

**Team:** `name`, `role` and `photo` (a full `https://` link or a file like `team/samuel-ogundele.jpg`). With no photo, initials are shown.

**Gallery:** `image` and an optional `caption`. The home page shows the first 6; the About and Media pages show all.

**Stats** (home-page numbers): `number` and `label`, e.g. `250+` · `Students trained`. Type `centers` as the number to count your training centers automatically. `STATS` in `config.js` is only used if this tab is empty.

**Media** (Media page, "Watch and read"): `type` (`video`, `photo`, `article`, `news` or `post`), `title`, `link`, optional `image`, `date` and `description`. YouTube links get their picture automatically; Facebook links need an `image`. With no rows switched on, the page invites visitors to follow the Facebook page.

**Stories** (Media page, case studies): `title`, `client`, `category`, `challenge`, `solution` (what we did), `result`, optional `quote` and `quote_by`, `image` and `link`. Use real numbers where you can. The starter story is the six STEAM pilot cohorts (44 learners, August 2024 – August 2026); an example row shows the format and stays switched off.

> Some photos load from your WordPress site (`lightonacademy.com/wp-content/uploads/…`). If you ever close the WordPress site, upload them to `assets/img/` and update the links in the sheet.

## Showing chosen courses on a page

Any element with `data-courses` becomes a grid of course cards from the sheet:
- `data-courses="featured"`, `"all"` or a category such as `"tech"`
- `data-courses="ids:web-development,skill-up-level-1"` shows exactly those courses in that order. Courses switched off in the sheet are skipped.
- Add `data-limit="3"` to cap how many show.

## 3. Other settings (`assets/js/config.js`)

| Setting | What it does |
|---|---|
| `DATA_URL` | The sheet's website data link |
| `LEARN_URL` | The free lessons site (`https://learn.lightonacademy.com`). Leave empty to hide the Learn links. |
| `GA_ID` | Your Google Analytics 4 ID (e.g. `G-ABC123XYZ`). Leave empty to turn analytics off. |
| `REGISTER_URL`, `PORTAL_URL` | Register button and Student Portal links |
| `WHATSAPP`, `PHONES`, `EMAIL`, `FACEBOOK`, `CITY` | Contacts |
| `STATS` | Backup home-page numbers, used only if the sheet's **Web Stats** tab is empty |
| `LINKS` | Page links, including `learn: "learn.html"` and `media: "media.html"`. The WordPress theme overrides these. |

The end of `config.js` adds `noindex, follow` only on `github.io` addresses, so Google lists lightonacademy.com instead of this copy. If you ever move this version onto lightonacademy.com, it switches off by itself.

The menu changes to the phone-style menu below **1200px** wide, so the 9 menu items never wrap onto two lines.

## WordPress theme (lighton-academy-theme.zip)

- **Version 1.2.0** adds the **Media & Stories** page (`/media/`), created automatically the next time an admin opens the dashboard after the update.
- **Old pages from the previous website:** **Appearance ▸ LightOn old pages** lists every live page that isn't part of the new site, with a suggested new page for each. Tick the ones to hide and click **Save**: they move to Drafts (nothing is deleted) and their old addresses send visitors to the new page with a permanent (301) redirect. You can also add old addresses by hand (for example from Google Search Console), and undo any redirect. A yellow notice on the dashboard reminds you while old pages are still live.

## Known to-dos
- Make every page's `og:image` a full `https://` link so WhatsApp and Facebook previews show the picture.
- Delete the loose root files (see step 1).
- Add real case studies (Web Stories) and videos (Web Media) as they happen.
- Fees for the STEAM Innovators and Teachers & Educators programs, once set.

## Using a custom address later

To run this version at `lightonacademy.com` (for example, if you leave Bluehost): **Settings ▸ Pages ▸ Custom domain**, then point the domain's DNS at GitHub Pages in Cloudflare. All links are relative, so nothing else changes.
