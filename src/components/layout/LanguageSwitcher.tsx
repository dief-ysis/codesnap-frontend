"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";

/**
 * Button that toggles the active locale between Spanish and English.
 * Uses `useTransition` to perform the route replacement without blocking the UI.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const next = locale === "es" ? "en" : "es";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:text-primary disabled:opacity-50"
      aria-label="Switch language"
    >
      <Languages className="h-4 w-4" />
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
