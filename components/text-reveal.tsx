import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealMode = "word" | "char" | "line";
type RevealDirection = "up" | "left" | "right";

type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  mode?: RevealMode;
  direction?: RevealDirection;
  delay?: number;
};

function tokenize(text: string, mode: RevealMode) {
  if (mode === "line") return [text];
  if (mode === "char") return Array.from(text);

  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  if (/\s/.test(normalized)) return normalized.split(" ");
  if (/[\u3400-\u9fff]/.test(normalized)) return Array.from(normalized);
  return [normalized];
}

export function RevealText({
  text,
  as: Tag = "span",
  className = "",
  mode = "word",
  direction = "up",
  delay = 0,
}: RevealTextProps) {
  const tokens = tokenize(text, mode);
  const classes = [
    "text-reveal",
    `text-reveal-${mode}`,
    `text-reveal-${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {tokens.map((token, index) => {
        const style = { "--reveal-index": index } as CSSProperties;
        const child: ReactNode =
          mode === "char" && token === " "
            ? "\u00A0"
            : mode === "word" && index < tokens.length - 1
              ? `${token} `
              : token;

        return (
          <span className="text-reveal-slot" key={`${token}-${index}`}>
            <span className="text-reveal-item" style={style}>
              {child}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
