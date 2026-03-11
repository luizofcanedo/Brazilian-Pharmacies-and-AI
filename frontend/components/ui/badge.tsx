import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-secondary/60 text-secondary-foreground hover:bg-secondary",
        positive:
          "border-transparent bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
        neutral:
          "border-transparent bg-sky-500/10 text-sky-300 hover:bg-sky-500/20",
        negative:
          "border-transparent bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

