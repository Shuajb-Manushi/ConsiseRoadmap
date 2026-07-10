import { useEffect, useRef } from "react";
import { useModal } from "../lib/useModal";

/**
 * A small confirm step for destructive actions (reset progress). Built on
 * useModal, so it traps focus, inerts the background, locks scroll, and
 * restores focus to the trigger on close. Cancel is focused first — the safe
 * default for an alertdialog.
 */
export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { ref } = useModal<HTMLDivElement>();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onCancel();
    }
  };

  return (
    <div className="confirm-overlay" role="presentation" ref={ref} onMouseDown={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <h2 id="confirm-title" className="confirm-dialog__title">{title}</h2>
        <p id="confirm-body" className="confirm-dialog__body">{body}</p>
        <div className="confirm-dialog__actions">
          <button ref={cancelRef} className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
