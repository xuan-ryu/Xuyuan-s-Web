import next from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "scripts/**",
      "public/**",
      "next-env.d.ts",
      // local working snapshots — not app code, keep them out of the lint signal
      "backups/**",
      "assets-backup/**",
    ],
  },
  ...next,
  {
    // React 19's set-state-in-effect rule flags legitimate one-time init
    // patterns (loader sessionStorage read, header close-on-route) — keep it
    // visible as a warning rather than failing the whole lint.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // The three ported Framer WebGL scenes are @ts-nocheck and intentionally
    // loose; keep them out of the strict app-code lint signal.
    files: [
      "components/hero-scene.tsx",
      "components/koi-pond.tsx",
      "components/hongyadong.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "prefer-const": "off",
    },
  },
];

export default config;
