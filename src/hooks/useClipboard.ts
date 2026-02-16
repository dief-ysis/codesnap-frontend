"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for copying text to the clipboard with a temporary "copied" indicator.
 *
 * @param timeout - Duration in milliseconds the `copied` flag stays `true` (default: 2000)
 * @returns Object containing `copied` boolean state and a `copy` function that accepts the text to copy
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    },
    [timeout]
  );

  return { copied, copy };
}
