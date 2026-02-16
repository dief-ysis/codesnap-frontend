"use client";

import { useTranslations } from "next-intl";
import { Code2 } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Code2 className="h-4 w-4" />
          <span>CodeSnap</span>
        </div>
        <p className="text-sm text-muted">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
