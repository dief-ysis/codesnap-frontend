"use client";

import { LazyMotion, domAnimation } from "motion/react";

/**
 * Lazy-loads the Motion (framer-motion) DOM animation features to reduce the
 * initial bundle size. Wraps children with `LazyMotion`.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
