/**
 * Prefix a public-root path with Vite's base URL. Locally and on Netlify the
 * base is "/", but the GitHub Pages deploy builds with "/vaelro-website/",
 * where raw absolute paths like "/work/..." would 404. Kept out of
 * src/data/projects.ts so the capture script can import that file under tsx
 * (import.meta.env does not exist there).
 */
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
