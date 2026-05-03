import { useState, useCallback } from "react";

export type ToastKind = "info" | "success" | "warn" | "error";

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  desc?: string;
}

let _counter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (kind: ToastKind, title: string, desc?: string, durationMs = 4000) => {
      const id = `toast-${++_counter}`;
      setToasts((prev) => [...prev, { id, kind, title, desc }]);
      if (durationMs > 0) setTimeout(() => dismiss(id), durationMs);
      return id;
    },
    [dismiss],
  );

  return { toasts, toast, dismiss };
}
