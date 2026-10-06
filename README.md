# Style Tales by Salma

Website for **Style Tales by Salma**, a beauty salon at The Greenhouse Mall, Ngong Road, Nairobi.
Nails, braiding, weaving, blow dries, waxing and massage.

**Live site:** https://mavlydigital-jpg.github.io/style-tales-by-salma/

Plain HTML, CSS and JavaScript. No build step, no frameworks, no dependencies.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home page: about, services, gallery, review, location |
| `booking.html` | 4-step booking form (services → day and time → details → check and send). Sends the booking to the salon on WhatsApp |
| `404.html` | Page not found |

## Files

```
.
├── index.html
├── booking.html
├── 404.html
├── styles.css          # all styles
├── main.js             # mobile menu + footer year
├── booking.js          # booking flow (WhatsApp number set at the top)
├── logo.webp
├── og-image.jpg        # link preview image for WhatsApp / social shares
├── favicon.ico, favicon-*.png, apple-touch-icon.png, android-chrome-*.png
├── site.webmanifest
├── robots.txt
├── .nojekyll           # tells GitHub Pages to serve files as-is
└── photos/             # salon photos go here
```

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy (GitHub Pages)

1. Go to **Settings → Pages** in this repo.
2. Under **Branch**, pick `main` and `/ (root)`, then **Save**.
3. Wait 1–2 minutes. The site goes live at the link above.

Every push to `main` updates the live site.

## Common edits

**Change the WhatsApp / phone number**
Edit `WHATSAPP` at the top of `booking.js` (country code + number, no `+`, no spaces).
Then search all files for `254726246681` and `0726 246 681` and replace them.

**Add gallery photos**
Put photos in `photos/` (JPG or WEBP, under 500 KB each). Then swap a placeholder in `index.html`:

```html
<div class="tile">Gallery photo 1</div>
```

becomes

```html
<div class="tile"><img src="photos/nails-1.jpg" alt="Gel nails with gold tips" loading="lazy"></div>
```
