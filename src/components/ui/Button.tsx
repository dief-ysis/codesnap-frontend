import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

/**
 * Props for the {@link Button} component, extending native button attributes
 * with design-system variants and sizes.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-surface border border-border text-foreground hover:bg-surface/80",
  ghost: "text-muted hover:text-primary hover:bg-surface",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

/**
 * Reusable button component with variant and size presets.
 * Supports `primary`, `secondary`, `ghost`, and `danger` variants.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
