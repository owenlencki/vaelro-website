import { useEffect, useRef } from "react";

/**
 * Tracks the pointer in normalized device coordinates (-1..1, y up).
 * Returned as a mutable ref so consumers can read it inside a rAF loop
 * without re-rendering. `active` flips true after the first movement.
 */
export function useMousePosition(enabled: boolean) {
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!enabled) return;

    function onPointerMove(e: PointerEvent) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current.active = true;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [enabled]);

  return mouse;
}
