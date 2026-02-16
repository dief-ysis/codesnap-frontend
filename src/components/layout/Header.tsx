"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Code2, Menu, X, LogOut } from "lucide-react";

/**
 * Application header with responsive navigation. Shows public links for all
 * visitors and authenticated-only links (Dashboard, Collections, New Snippet)
 * when logged in. Includes theme toggle, language switcher, and mobile menu.
 */
export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/explore", label: t("explore") },
    ...(user
      ? [
          { href: "/dashboard", label: t("dashboard") },
          { href: "/collections", label: t("collections") },
          { href: "/snippets/new", label: t("newSnippet") },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Code2 className="h-6 w-6" />
          CodeSnap
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">{user.username}</span>
              <button
                onClick={logout}
                className="text-muted transition-colors hover:text-primary"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-primary"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 border-t border-border pt-3">
            <ThemeToggle />
            <LanguageSwitcher />
            {user ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="text-sm text-muted hover:text-primary"
              >
                {t("logout")}
              </button>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login" className="text-sm text-muted hover:text-primary" onClick={() => setMobileOpen(false)}>
                  {t("login")}
                </Link>
                <Link href="/auth/register" className="rounded-lg bg-primary px-3 py-1 text-sm text-white" onClick={() => setMobileOpen(false)}>
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
