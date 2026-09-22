import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { RenderTimeContext } from "./hooks/useNow";
import "./index.css";

const BASE = import.meta.env.BASE_URL;

// Netlify serves /about and /about/ from the same prerendered file. Settle on
// the canonical, slash-free form before the router reads the URL, so the
// client renders exactly the page that was prerendered.
const { pathname, search, hash } = window.location;
if (pathname !== BASE && pathname.length > 1 && pathname.endsWith("/")) {
  window.history.replaceState(
    window.history.state,
    "",
    pathname.replace(/\/+$/, "") + search + hash,
  );
}

const container = document.getElementById("root")!;
const renderedAt = Number(container.dataset.renderedAt) || null;

const app = (
  <RenderTimeContext.Provider value={renderedAt}>
    {/* basename follows Vite's base: "/" locally and on Netlify,
        "/vaelro-website/" for the GitHub Pages deploy */}
    <BrowserRouter basename={BASE}>
      <App />
    </BrowserRouter>
  </RenderTimeContext.Provider>
);

// Built pages arrive prerendered (scripts/prerender.mjs), so React adopts that
// markup. The dev server serves an empty root and renders from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
