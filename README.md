# Vaelro Website

Marketing site for [vaelro.co](https://vaelro.co) — a two-person AI automation
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

- **Portfolio projects** — edit [`src/data/projects.ts`](src/data/projects.ts).
  Add an object to the array; leave `image` empty for a designed placeholder
  card. No component changes needed.
- **Testimonials** — edit
  [`src/data/testimonials.ts`](src/data/testimonials.ts). Set
  `testimonialsArePlaceholders` to `false` once real reviews are in to hide
  the placeholder footnote.
- **Booking URL** — replace the `PLACEHOLDER` Google Calendar appointment URL
  in [`src/components/sections/BookingEmbed.tsx`](src/components/sections/BookingEmbed.tsx).
- **Contact form** — currently logs to the console. Wire the submit handler in
  [`src/components/sections/ContactForm.tsx`](src/components/sections/ContactForm.tsx)
  to the n8n webhook.

## Deploy (Netlify)

Connect the GitHub repo in Netlify. `netlify.toml` already sets the build
command (`npm run build`), publish directory (`dist`), and the SPA redirect.

Custom domain: add `vaelro.co` in Netlify Domain settings, then point DNS at
Wix (CNAME `www` → the Netlify site, A records per Netlify's instructions).
SSL is auto-provisioned.
