"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the application with `next-themes` to enable class-based dark/light
 * theme switching. Defaults to the system preference.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
