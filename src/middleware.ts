/**
 * next-intl middleware that handles automatic locale detection and URL rewriting.
 * Applied to all routes except API, static assets, and Next.js internals.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

/** Route matcher that excludes API routes, tRPC, static files, and Next.js internals. */
export const config = {
  // Negative lookahead regex: skip API routes, tRPC, Next.js internals (_next),
  // Vercel internals (_vercel), and any path with a file extension (static assets).
  // Only HTML page routes pass through to the i18n middleware for locale handling.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
