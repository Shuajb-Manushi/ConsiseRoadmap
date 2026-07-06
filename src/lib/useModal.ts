import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Accessible modal behavior for a dialog rendered into the normal React tree:
 *
 * - Tab / Shift+Tab cycle only through focusable elements inside the container.
 * - Everything outside the container's ancestor chain becomes `inert`
 *   (unfocusable and hidden from assistive tech) while the modal is open.
 * - Background scrolling is locked.
 * - On unmount, focus returns to the element that was focused when the modal
 *   opened — unless `suppressRestore()` was called first, which a modal does
 *   when it closes *because of navigation* so the route-change focus handler
 *   owns focus instead of a stale trigger.
 *
 * Attach the returned `ref` to the modal's outermost element (the overlay).
 */
export function useModal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const restoreRef = useRef(true);

  const suppressRestore = useCallback(() => {
    restoreRef.current = false;
  }, []);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Make everything outside the modal inert: walk from the container to
    // <body>, marking every sibling along the way.
    const inerted: HTMLElement[] = [];
    let node: HTMLElement | null = container;
    while (node && node !== document.body) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const sib of Array.from(parent.children)) {
        if (sib !== node && sib instanceof HTMLElement && !sib.inert) {
          sib.inert = true;
          inerted.push(sib);
        }
      }
      node = parent;
    }

    // Lock background scroll.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Trap Tab / Shift+Tab inside the container.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;
      const inside = current instanceof HTMLElement && container.contains(current);
      if (e.shiftKey) {
        if (!inside || current === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      for (const el of inerted) el.inert = false;
      document.body.style.overflow = prevOverflow;
      if (restoreRef.current && opener && document.contains(opener)) {
        opener.focus();
      }
    };
  }, []);

  return { ref, suppressRestore };
}
