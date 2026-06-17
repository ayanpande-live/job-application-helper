import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent/90 disabled:bg-accent/35",
  secondary:
    "border border-line bg-surface text-ink hover:bg-soft disabled:text-muted disabled:bg-surface",
  ghost: "text-ink hover:bg-soft disabled:text-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-[13px]",
  md: "px-4 py-2.5 text-[14px]",
  lg: "px-5 py-3.5 text-[15px]",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-[12px] font-extrabold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
