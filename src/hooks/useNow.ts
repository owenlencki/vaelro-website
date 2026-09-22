import { createContext, useContext, useState } from "react";
import { useHydrated } from "./useHydrated";

/**
 * When the page's static HTML was rendered. The prerender stamps it on #root
 * and the client entry reads it back, so both sides agree on "now".
 */
export const RenderTimeContext = createContext<number | null>(null);

/**
 * The current time, pinned for the life of the component. On the server and
 * during hydration it is the moment the page was prerendered, which keeps
 * date-driven copy (the workshop phase, the nav dot) identical to the static
 * HTML; the next render moves to the real clock. A page built before a
 * session and opened after it updates itself as soon as it hydrates.
 */
export function useNow(): number {
  const renderedAt = useContext(RenderTimeContext);
  const hydrated = useHydrated();
  const [mountedAt] = useState(() => Date.now());
  return hydrated || renderedAt === null ? mountedAt : renderedAt;
}
