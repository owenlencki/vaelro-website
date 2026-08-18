import { useEffect } from "react";

/**
 * index.html carries the site's default description, canonical, and social
 * tags. React 19 hoists a page's own tags into <head> alongside those defaults
 * rather than replacing them, which leaves a page like /workshop advertising
 * the home page's description and two competing canonicals.
 *
 * For each selector this keeps the last match, which is the one React just
 * appended, and detaches the earlier defaults for as long as the page is
 * mounted. They go back in the same position on the way out, so every other
 * route still gets the head it had before.
 */
export function useExclusiveMeta(selectors: string[]) {
  useEffect(() => {
    const removed: Array<{ node: Element; parent: Node; next: Node | null }> =
      [];

    for (const selector of selectors) {
      const matches = Array.from(document.head.querySelectorAll(selector));
      // Everything but the last: the last one is this page's.
      for (const node of matches.slice(0, -1)) {
        removed.push({
          node,
          parent: node.parentNode!,
          next: node.nextSibling,
        });
        node.remove();
      }
    }

    return () => {
      for (const { node, parent, next } of removed) {
        parent.insertBefore(node, next);
      }
    };
  }, [selectors]);
}
