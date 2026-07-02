import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type CtaVariant = "solid" | "line" | "quiet";

type CtaBaseProps = {
  children: ReactNode;
  /** emphasis ladder — solid (primary) → line (secondary) → quiet (contextual) */
  variant?: CtaVariant;
  /** bump the label from --text-label to --text-meta for prominent placements */
  large?: boolean;
  /** stretch to the container width (form submits) */
  full?: boolean;
  className?: string;
};

type CtaLinkProps = CtaBaseProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >;

type CtaButtonProps = CtaBaseProps & { href?: undefined } & Omit<
    ComponentProps<"button">,
    "className" | "children"
  >;

type CtaProps = CtaLinkProps | CtaButtonProps;

// The site's single call-to-action affordance: a 4px ink slab (solid), a
// hairline rectangle (line), or a label with a seal-red rule wipe (quiet).
// No arrows — see docs/design-system.md "Call to action". Renders a <Link>
// when `href` is given, otherwise a <button> (pass type="submit" for forms).
// For an action nested inside another link (e.g. a label in a row that is
// itself a link), apply the `cta cta--quiet` classes to a span instead of
// nesting this component.
export function Cta({
  children,
  variant = "line",
  large = false,
  full = false,
  className,
  ...rest
}: CtaProps) {
  const cls = [
    "cta",
    `cta--${variant}`,
    large ? "cta--lg" : "",
    full ? "cta--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest as Omit<CtaLinkProps, keyof CtaBaseProps>;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as Omit<
    CtaButtonProps,
    keyof CtaBaseProps
  >;
  return (
    <button type={type} className={cls} {...buttonRest}>
      {children}
    </button>
  );
}
