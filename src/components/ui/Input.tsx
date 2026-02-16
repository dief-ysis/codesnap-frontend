import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

/**
 * Props for the {@link Input} component, extending native input attributes
 * with an optional label and error message.
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Styled text input with optional label and inline validation error display.
 * Forwards a ref to the underlying `<input>` element.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
