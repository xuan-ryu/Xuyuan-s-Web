// Stand-in for Framer's runtime APIs so components authored for Framer can be
// imported in a vanilla React/Next environment. None of these do anything at
// runtime — they exist only so the original component code compiles and runs.

export type ControlTypeValue = string;

export const ControlType: Record<string, ControlTypeValue> = new Proxy(
  {} as Record<string, ControlTypeValue>,
  {
    get: () => "ignored",
  },
);

export function addPropertyControls(
  _component: unknown,
  _controls?: Record<string, unknown>,
): void {
  // no-op outside Framer
}

const renderTargetSymbols = {
  preview: "preview",
  canvas: "canvas",
  thumbnail: "thumbnail",
} as const;

type RenderTargetKey = keyof typeof renderTargetSymbols;

export const RenderTarget = {
  current(): RenderTargetKey {
    return "preview";
  },
  hasRestrictions(): boolean {
    return false;
  },
  preview: renderTargetSymbols.preview,
  canvas: renderTargetSymbols.canvas,
  thumbnail: renderTargetSymbols.thumbnail,
} as const;
