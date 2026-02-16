/**
 * @module i18n/navigation
 * Re-exports locale-aware navigation primitives (Link, redirect, usePathname,
 * useRouter, getPathname) created from the app's routing configuration.
 */
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware navigation utilities generated from the routing config. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
