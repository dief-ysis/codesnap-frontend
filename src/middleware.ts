/**
 * next-intl middleware that handles automatic locale detection and URL rewriting.
 * Applied to all routes except API, static assets, and Next.js internals.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

/** Route matcher that excludes API routes, tRPC, static files, and Next.js internals. */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
