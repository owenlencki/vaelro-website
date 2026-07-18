# Vaelro Website

Marketing site for [vaelro.co](https://vaelro.co), a two-person AI automation
and web agency in Waupaca, WI.

React 19 · Vite · TypeScript · Tailwind CSS v4 · React Three Fiber · Framer
Motion · Lenis · React Router v7

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build locally
```

## Editing content

- **Portfolio projects**: edit [`src/data/projects.ts`](src/data/projects.ts).
  Add an object to the array; leave `image` empty for a designed placeholder
  card. No component changes needed.
- **Testimonials**: edit
  [`src/data/testimonials.ts`](src/data/testimonials.ts). Set
  `testimonialsArePlaceholders` to `false` once real reviews are in to hide
  the placeholder footnote.
- **Booking URL**: replace the `PLACEHOLDER` Google Calendar appointment URL
  in [`src/components/sections/BookingEmbed.tsx`](src/components/sections/BookingEmbed.tsx).
- **Contact flow**: the multi-step conversational lead form lives in
  [`src/components/sections/ContactFlow.tsx`](src/components/sections/ContactFlow.tsx).
  It POSTs to a Google Apps Script Web App (source of truth:
  [`backend/apps-script/Code.gs`](backend/apps-script/Code.gs)) which appends a
  row to the "Vaelro Website Leads" Sheet and emails hello@vaelro.co. Set
  `APPS_SCRIPT_URL` and `TURNSTILE_SITE_KEY` at the top of `ContactFlow.tsx`
  (local dev uses Cloudflare's public Turnstile test key). Spam is blocked by a
  honeypot field plus Cloudflare Turnstile, verified server-side in `Code.gs`
  against the `TURNSTILE_SECRET` script property.

## Deploy (Netlify)

Connect the GitHub repo in Netlify. `netlify.toml` already sets the build
command (`npm run build`), publish directory (`dist`), and the SPA redirect.
The contact flow submits directly to Apps Script, so no Netlify Forms
configuration is required.

Custom domain: add `vaelro.co` in Netlify Domain settings, then point DNS at
Wix (CNAME `www` → the Netlify site, A records per Netlify's instructions).
SSL is auto-provisioned.
