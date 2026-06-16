"use client";

import dynamic from "next/dynamic";

// Code-split the heavy WebGL koi scene out of the home page's initial bundle.
// It lives below the fold, so deferring its chunk trims first-load JS / TTI.
// ssr:false because it is a client-only canvas/WebGL scene (nothing to SSR).
const KoiPondScene = dynamic(() => import("./koi-pond"), { ssr: false });

export default KoiPondScene;
