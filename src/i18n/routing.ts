/**
 * @module i18n/routing
 * Defines the supported locales and default locale for next-intl routing.
 */
import { defineRouting } from "next-intl/routing";

/** Routing configuration specifying available locales (`es`, `en`) and the default locale (`es`). */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
});
