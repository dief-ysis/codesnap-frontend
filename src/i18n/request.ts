/**
 * @module i18n/request
 * Server-side request configuration for next-intl.
 * Resolves the active locale from the incoming request and dynamically
 * imports the corresponding message bundle from `messages/`.
 */
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/** Resolves the locale per request and loads the matching translation messages. */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
