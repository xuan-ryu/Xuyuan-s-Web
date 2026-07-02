import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type CtaVariant = "solid" | "line" | "quiet";

type CtaProps = {
  href: string;
  children: ReactNode;
  /** emphasis ladder — solid (primary) → line (secondary) → quiet (contextual) */
  variant?: CtaVariant;
  /** bump the label from --text-label to --text-meta for prominent placements */
  large?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

// The site's single call-to-action affordance. No arrows — the shape (lozenge /
// pill) or the seal-red rule carries the affordance. See docs/design-system.md
// "Call to action". For an action nested inside another link (e.g. a label in a
// row that is itself a link), apply the `cta cta--quiet` classes to a span
// instead of nesting this component.
export function Cta({
  href,
  children,
  variant = "line",
  large = false,
  className,
  ...rest
}: CtaProps) {
  const cls = ["cta", `cta--${variant}`, large ? "cta--lg" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
