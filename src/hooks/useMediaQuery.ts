import { useCallback, useSyncExternalStore } from "react";

/**
 * matchMedia as state. The prerendered HTML and the hydration render both use
 * `serverValue`; React re-renders with the real answer straight after, and a
 * component that mounts later (client-side navigation) gets the real answer
 * on its first render.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
