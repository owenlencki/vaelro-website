import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False on the server and during hydration, true from the next render on.
 * Anything that only exists in the browser (the WebGL hero, layout read from
 * the viewport) waits on this, so the client's first render matches the
 * prerendered HTML exactly and React can adopt it instead of redrawing it.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
