// @ts-nocheck — ported from Framer; original code relies on Framer runtime invariants

"use client";

import * as React from "react"
import { useEffect, useRef } from "react"
// NOTE: three.js is NOT imported statically — it's lazily `await import`ed inside
// init3D() so mobile/low-end devices (which early-return to the CSS/SVG ink
// fallback before init3D ever runs) never download or parse the ~150KB engine.
import { subscribeLenis } from "@/lib/lenis-bus"
import { Wordmark } from "@/components/wordmark"
import { stripCssComments } from "@/lib/css-sanitize"


type BirdDatum = {
    baseX: number
    baseY: number
    baseZ: number
    speed: number
    scatterVX: number
    scatterVY: number
    scatterVZ: number
    scatterX: number
    scatterY: number
    scatterZ: number
}

type Props = {
    mobileBgUrl?: string
    liteMode?: boolean
    heroWord1: string
    heroWord2: string
    heroWord3: string
    heroSubtitle: string
    quoteLine: string
    scrollHint: string
    page2Title?: string
    page2Subtitle?: string
    page2BrandLine?: string
    page2Footer?: string
    photoUrl?: string
    photoComponent?: React.ReactNode
    isLoaded?: boolean
    scrollDemo?: number
}

function round3(value: number) {
    return Math.round(value * 1000) / 1000
}

function setInlineStyle(
    el: HTMLElement | null,
    property: string,
    value: string
) {
    if (!el) return
    if (el.style.getPropertyValue(property) !== value) {
        el.style.setProperty(property, value)
    }
}

function setClassState(
    el: Element | null,
    className: string,
    enabled: boolean
) {
    if (!el) return
    if (el.classList.contains(className) !== enabled) {
        el.classList.toggle(className, enabled)
    }
}

// 顶点着色器 — 墨山粒子：云海涌动 + 鼠标聚光
const mountainVert = `
  precision mediump float;
  uniform float uTime;
  uniform float uScroll;
  uniform float uVelocity;
  uniform vec2 uMouse;
  uniform vec2 uMouseVel;
  uniform float uMouseActive;
  uniform float uFlatMode;
  uniform sampler2D uFlow;
  attribute float aSize;
  attribute float aAlpha;
  attribute float aRidge;
  varying float vAlpha;
  varying float vSpotlight;
  varying float vLocalScroll;

  void main() {
    vec3 pos = position;
    // the ridge spine holds still; the body/slope grains move a lot more
    float bodyMove = mix(2.0, 0.06, clamp(aRidge, 0.0, 1.0));
    // 压成2D — flatten the 3D depth toward a single plane: far layers (z<0)
    // ride up and near layers (z>0) drop, and the depth itself is squeezed, so
    // the terrain reads as a layered 2D ink painting instead of a receding 3D
    // scene. uFlatMode keeps the mobile/flat path untouched.
    if (uFlatMode < 0.5) {
      pos.y += -position.z * 0.26;
      pos.z *= 0.30;
    }
    // left→right sweep: left columns transition before right ones, so the
    // collapse / darken / black→white inversion reads as moving across screen
    vec4 origWorldPos = modelMatrix * vec4(position, 1.0);
    float normX = clamp((origWorldPos.x + 2400.0) / 4800.0, 0.0, 1.0);
    float localScroll = clamp(uScroll + (0.5 - normX) * 0.14, 0.0, 1.0);
    vLocalScroll = localScroll;
    float randVal = fract(sin(dot(pos.xz, vec2(12.9898, 78.233))) * 43758.5453);
    float phase = randVal * 6.2831;
    float twinkle = uFlatMode > 0.5 ? 1.0 : (0.6 + 0.8 * sin(uTime * 1.3 + phase));
    if (uFlatMode < 0.5) pos.y += bodyMove * (
        sin(uTime * 0.4 + pos.x * 0.008) * 7.0
      + cos(uTime * 0.3 + pos.z * 0.006) * 3.0);

    float normY = clamp((position.y + 520.0) / 1050.0, 0.0, 1.0);
    // the foot of the mountain also stirs — drift grows toward the base so the
    // bottom isn't static (still gated by bodyMove, so the ridge holds)
    if (uFlatMode < 0.5) {
      float baseDrift = (1.0 - normY) * bodyMove;
      pos.x += sin(uTime * 0.33 + position.z * 0.011 + phase) * 16.0 * baseDrift;
      pos.y += cos(uTime * 0.27 + position.x * 0.009 + phase * 0.5) * 11.0 * baseDrift;
    }
    float dRand = fract(sin(dot(position.xz, vec2(127.1, 311.7))) * 43758.5453);
    // Thanos-dust disperse along the X axis: dissolveStart ramps with normX so
    // the disintegration sweeps left → right (left grains go first, right last);
    // a small dRand keeps the wavefront a ragged band of grains dusting one by
    // one, rather than a hard vertical line.
    float dissolveStart = 0.55 + normX * 0.16 + dRand * 0.06;
    float dissolveT = smoothstep(dissolveStart, dissolveStart + 0.14, localScroll);
    float scatter = smoothstep(0.0, 1.0, dissolveT);

    // no downward sink — the mountain holds its place and simply disperses; the
    // dispersal (grains drifting out to the star field) is the whole collapse

    // dust lifts off LOCALLY and upward: each grain drifts up near its own x/z
    // (no random screen-wide scatter — that read as "各处都在飞散") and never
    // downward, so the disintegration sweeps up in place, left to right
    float hashX = fract(sin(dot(position.xz, vec2(45.1, 91.7))) * 43758.5453);
    float hashZ = fract(sin(dot(position.xz, vec2(23.3, 67.9))) * 43758.5453);
    float starTargetX = position.x + (hashX * 2.0 - 1.0) * 300.0;
    float starTargetY = position.y + 320.0 + dRand * 600.0;
    float starTargetZ = position.z + (hashZ - 0.5) * 400.0;

    // pow(scatter, 1.5) 产生加速升华感
    float lift = pow(scatter, 1.5);
    pos.y = mix(pos.y, starTargetY, lift);
    pos.x = mix(pos.x, starTargetX, lift);
    pos.z = mix(pos.z, starTargetZ, lift);

    // 用原始坐标计算遮罩（不受偏移影响；origWorldPos 已在顶部计算）
    float valleyMask = 1.0 - smoothstep(-200.0, 100.0, origWorldPos.z);
    // 云海起伏 — layered waves at different frequencies/speeds/phases so the
    // waterline undulates irregularly (organic swell) rather than one tidy sine
    float sx = origWorldPos.x * 0.002;
    float sz = origWorldPos.z * 0.0016;
    float seaWave =
          sin(sx + uTime * 0.45) * cos(sz + uTime * 0.11)
        + sin(sx * 2.1 + sz * 1.3 - uTime * 0.27 + 1.3) * 0.55
        + sin(sx * 0.55 - sz * 0.8 + uTime * 0.19 + 3.1) * 0.7
        + cos(sx * 3.4 + sz * 0.6 + uTime * 0.13) * 0.3;
    // cloud-sea swell halves once the scene flips to black (calmer night sea)
    float seaAmp = mix(330.0, 165.0, smoothstep(0.16, 0.32, localScroll));
    float seaLevel = uFlatMode > 0.5 ? 100.0 : (100.0 + seaWave * seaAmp);
    float bottomFade = smoothstep(seaLevel - 60.0, seaLevel + 120.0, origWorldPos.y);
    // keep the cloud sea (云海) alive through the colour change and the night
    // hold — it only releases as the mountain disperses into the star field
    // (the atmospheric FogExp2 mist is a separate effect, kept throughout).
    bottomFade = mix(bottomFade, 1.0, smoothstep(0.45, 0.8, scatter));
    // cloud-sea mask switches OFF as the scene turns black (night): the mountains
    // then show their full feet with no waterline masking.
    bottomFade = mix(bottomFade, 1.0, smoothstep(0.20, 0.34, localScroll));

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 拨开云海 — the cursor parts the mist locally: particles within a soft
    // radius of the pointer have their cloud-sea suppression lifted, opening a
    // clearing that reveals the ink mountain beneath. One distance, no trails.
    vec2 screenPos = gl_Position.xy / gl_Position.w;
    float mouseNear = (uFlatMode > 0.5) ? 0.0
        : uMouseActive * (1.0 - smoothstep(0.0, 0.22, length(screenPos - uMouse)));
    bottomFade = mix(bottomFade, 1.0, mouseNear * (1.0 - scatter) * 0.7);
    // 流场位移 — sample the dissipating velocity field (flowmap) at this grain's
    // screen position and drift along it: the cursor stirs the ink like water
    // and the motion LINGERS, then settles (izanami-style fluid wake).
    vec2 flowUv = screenPos * 0.5 + 0.5;
    vec2 flow = texture2D(uFlow, flowUv).xy;
    gl_Position.xy += flow * (1.0 - scatter) * bodyMove * 0.12 * gl_Position.w;

    float scatterShrink = mix(1.0, 0.15 + dRand * 0.15, scatter);
    float size = aSize * (1000.0 / -mvPosition.z);
    float maxSz = mix(42.0, 8.0, scatter);
    float computedSize = clamp(size * scatterShrink * (uFlatMode > 0.5 ? 1.0 : twinkle), 0.5, maxSz);

    // 山体底座随黑夜消散，但已升华的粒子（散射=星星）保持完整
    float baseFade = smoothstep(0.82, 0.94, localScroll);
    // dispersing grains now FADE OUT as they fully scatter (dust dissipating)
    // rather than persisting — they crossfade into the dedicated star field that
    // fades in over the same window, so the dust visually becomes the night sky
    float currentFade = max(baseFade, smoothstep(0.45, 1.0, scatter));

    // 网格物理边缘羽化：仅作用于未散射粒子，散开的星星不受边界裁切
    // edge0 < edge1 确保 Apple M 系 GPU 无未定义行为
    float edgeMaskZ = 1.0 - smoothstep(700.0, 1200.0, origWorldPos.z);
    float edgeMaskX = 1.0 - smoothstep(1800.0, 2500.0, abs(origWorldPos.x));
    float edgeMask = edgeMaskZ * edgeMaskX;
    float finalEdge = mix(edgeMask, 1.0, scatter);

    vAlpha = aAlpha * mix(1.0, bottomFade, valleyMask * (1.0 - scatter)) * (1.0 - currentFade) * finalEdge;
    // the mountain is a faint ink-wash; when it whitens it would read dim on
    // black, so boost opacity through the white phase (fades as it scatters)
    float whiteBoost = smoothstep(0.14, 0.28, localScroll) * (1.0 - scatter);
    vAlpha = clamp(vAlpha * (1.0 + whiteBoost * 1.4), 0.0, 1.0);

    gl_PointSize = vAlpha < 0.02 ? 0.0 : computedSize;

    vSpotlight = (uFlatMode > 0.5) ? 0.0
        : uMouseActive * (1.0 - scatter) * (1.0 - smoothstep(0.02, 0.18, length(screenPos - uMouse)));
  }
`

const mountainFrag = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uScroll;
  varying float vAlpha;
  varying float vSpotlight;
  varying float vLocalScroll;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float shape = 1.0 - smoothstep(0.14, 0.5, d);
    float a = clamp(vAlpha * shape + vSpotlight * 0.45 * shape, 0.0, 1.0);
    if (a < 0.02) discard;

    // black→white flips together with the sky and the text (same window) — one
    // unified negative. Mountain, sky and copy invert as one, then hold, then sink.
    float colorMix = smoothstep(0.14, 0.28, vLocalScroll);
    // 纯白星光色 — 散射粒子过渡到星星外观
    vec3 targetColor = vec3(1.0, 1.0, 1.0);
    vec3 finalColor = mix(uColor, targetColor, colorMix) + vSpotlight * 0.08;
    // 预乘 Alpha：防止透明画布在黑背景上产生边缘杂色
    gl_FragColor = vec4(finalColor * a, a);
  }
`

const birdVert = `
  attribute float aSize;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  varying float vDepth;
  varying float vSpotlight;
  varying float vFlap;
  void main(){
    vec3 pos = position;
    pos.y += sin(uTime * 3.0 + pos.x * 0.05) * 8.0;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = smoothstep(-2500.0, -500.0, mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    float size = aSize * (1000.0 / -mvPosition.z);
    gl_PointSize = clamp(size, 0.5, 150.0);
    vec2 screenPos = gl_Position.xy / gl_Position.w;
    float distToMouse = length(screenPos - uMouse);
    vSpotlight = uMouseActive * (1.0 - smoothstep(0.03, 0.25, distToMouse));
    // steady wingbeat. Phase offset comes from aSize (constant per bird) — NOT
    // pos.x, which changes as the bird flies and would couple the beat to flight
    // speed (a fast flutter instead of a clean flap).
    vFlap = sin(uTime * 9.0 + aSize * 11.0) * 0.5 + 0.5;
  }
`

// Distant crane (仙鹤) silhouette: broad shallow wings lifting on vFlap, over a
// long horizontal body — the neck stretched forward (the flight direction)
// tapering to a fine point, short legs trailing behind. Reads elongated and
// graceful, not a compact gull V.
const birdFrag = `
  uniform vec3 uColor;
  uniform float uScroll;
  varying float vDepth;
  varying float vSpotlight;
  varying float vFlap;
  void main(){
    vec2 uv = gl_PointCoord - vec2(0.5);
    float ax = abs(uv.x);
    // WINGS: broad shallow upward V, lifting/lowering on vFlap (gl_PointCoord.y
    // points down, so a more-negative line sits higher on screen)
    float lift = mix(0.5, 1.0, vFlap);
    float wing = -lift * ax + 0.3 * lift * ax * ax;
    float wd = abs(uv.y - 0.05 - wing);
    float wt = mix(0.062, 0.015, smoothstep(0.0, 0.5, ax));  // taper to fine tips
    float wings = (1.0 - smoothstep(wt * 0.4, wt, wd)) * (1.0 - smoothstep(0.46, 0.5, ax));
    // BODY: long horizontal spine — crane neck stretched forward (+x = flight
    // direction) tapering to a point, short thin legs trailing behind (-x)
    float sy = abs(uv.y - 0.05);
    float reach, thick;
    if (uv.x > 0.0) {            // neck + head, forward
        reach = 1.0 - smoothstep(0.34, 0.46, uv.x);
        thick = 0.018 * (1.0 - smoothstep(0.26, 0.45, uv.x) * 0.7);
    } else {                    // legs, trailing
        reach = 1.0 - smoothstep(0.20, 0.30, -uv.x);
        thick = 0.012;
    }
    float body = (1.0 - smoothstep(thick * 0.5, thick, sy)) * reach;
    float shape = max(wings, body);
    if (shape < 0.02) discard;
    // invert black->white together with the sky/mountain/text flip (same window)
    float colorMix = smoothstep(0.12, 0.28, uScroll);
    vec3 targetColor = vec3(0.95, 0.95, 0.98);
    vec3 finalColor = mix(uColor, targetColor, colorMix);
    float scatterDim = 1.0 - vSpotlight * 0.3;
    float birdA = mix(0.2, 0.9, vDepth) * scatterDim;
    // birds stay through the night (white on black) and only dissolve as the
    // mountain disperses into the star field
    float dissolveTB = smoothstep(0.80, 0.92, uScroll);
    birdA *= (1.0 - dissolveTB);
    gl_FragColor = vec4(finalColor, shape * birdA);
  }
`

const starVert = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  varying float vStarA;
  void main() {
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.1 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // 点亮 — stars within a soft radius of the cursor flare brighter and a
    // touch larger, like fanning embers in the night sky
    vec2 screenPos = gl_Position.xy / gl_Position.w;
    float near = uMouseActive * (1.0 - smoothstep(0.0, 0.14, length(screenPos - uMouse)));
    // 固定像素大小：星星不随距离缩放（天体效果）
    gl_PointSize = clamp(aSize * twinkle * (1.0 + near * 0.9), 1.0, 12.0);
    // gated behind the night overlay (0.65-0.85): stars only on a dark sky
    float starT = smoothstep(0.55, 0.85, uScroll);
    vStarA = starT * twinkle * (1.0 + near * 2.2);
  }
`

const starFrag = `
  varying float vStarA;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float shape = 1.0 - smoothstep(0.08, 0.5, d);
    float a = vStarA * shape;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vec3(1.0) * a, a);
  }
`

// ——— flowmap (流场) — a low-res velocity field the cursor stirs and that
// dissipates over time; the mountain samples it to drift like fluid (izanami-
// style). Update pass: previous field * dissipation + a velocity splat at the
// cursor.
const flowVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
const flowFrag = `
  precision highp float;
  uniform sampler2D tPrev;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uAspect;
  uniform float uFalloff;
  uniform float uDissipation;
  varying vec2 vUv;
  void main() {
    vec2 prevVel = texture2D(tPrev, vUv).xy;
    // advect the field along its own velocity — the disturbance propagates and
    // spreads like water (水波), so the whole drag path keeps flowing
    vec2 advected = texture2D(tPrev, vUv - prevVel * 0.004).xy;
    vec2 vel = advected * uDissipation;
    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    float splat = exp(-dot(d, d) / uFalloff);
    vel += uVel * splat;
    vel = clamp(vel, -1.2, 1.2);
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`

// ——— 雾气层 (mist) — a soft ink-cloud whose UVs are warped by the flowmap, so
// the cursor pushes the mist around like water while the mountains and text
// behind it stay sharp (izanami-style fluid distortion of a mask layer).
const mistFrag = `
  precision highp float;
  uniform sampler2D uFlow;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uDistort;
  uniform float uAspect;
  varying vec2 vUv;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x),
               mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int k = 0; k < 5; k++){ v += a * n(p); p = p * 2.03 + 7.0; a *= 0.5; }
    return v;
  }
  void main(){
    vec2 flow = texture2D(uFlow, vUv).xy;
    vec2 uv = vUv;
    uv.x *= uAspect;
    uv -= flow * uDistort;                 // warp the mist UVs by the flow
    float m = fbm(uv * 2.6 + vec2(uTime * 0.015, uTime * 0.008));
    m = smoothstep(0.46, 0.92, m);
    // keep the mist mostly low (a drifting bank), fading toward the top
    m *= smoothstep(0.05, 0.55, vUv.y) * (1.0 - smoothstep(0.62, 1.0, vUv.y));
    gl_FragColor = vec4(uColor, m * uOpacity);
  }
`

function hash(n: number) {
    return Math.abs(Math.sin(n) * 10000.0) % 1.0
}
function mixF(a: number, b: number, t: number) {
    return a + (b - a) * t
}
function clampF(x: number, a: number, b: number) {
    return x < a ? a : x > b ? b : x
}
function smoothstepF(edge0: number, edge1: number, x: number) {
    let t = (x - edge0) / (edge1 - edge0)
    if (t < 0) t = 0
    else if (t > 1) t = 1
    return t * t * (3 - 2 * t)
}
// Horizontal-locked FOV: three.js PerspectiveCamera takes a VERTICAL fov, so a
// fixed 54° makes wide viewports reveal ever more horizontally (panorama) and
// narrow ones crop the side peaks — the composition drifts with window size.
// Instead we lock the HORIZONTAL world span (calibrated so a 16:9 frame keeps
// the original 54°) and derive the vertical fov from the aspect, clamped so the
// extremes stay sane. Same mountains stay framed at any width.
const FOV_HALF_TAN = Math.tan((54 * Math.PI) / 360) * (16 / 9)
function fovForAspect(aspect: number) {
    return clampF(
        (2 * Math.atan(FOV_HALF_TAN / aspect) * 180) / Math.PI,
        40,
        66
    )
}
function noise2D(x: number, z: number) {
    const ix = Math.floor(x),
        iz = Math.floor(z),
        fx = x - ix,
        fz = z - iz,
        ux = fx * fx * (3.0 - 2.0 * fx)
    const k = ix + iz * 57,
        n00 = hash(k),
        n10 = hash(k + 1),
        n01 = hash(k + 57),
        n11 = hash(k + 58)
    return mixF(mixF(n00, n10, ux), mixF(n01, n11, ux), fz)
}
function fbm(x: number, z: number, oct: number) {
    let v = 0,
        a = 0.5
    for (let i = 0; i < oct; i++) {
        v += a * noise2D(x, z)
        x = x * 2.05 + 100
        z = z * 2.25 + 100
        a *= 0.5
    }
    return v
}
function ridge1D(x: number) {
    let n = fbm(x * 0.0012, 10.0, 5),
        r = 1.0 - Math.abs(n - 0.5) * 2.0
    // smoothstep rounds the triangular ridge into a soft hump (flat top =
    // rounded peak) instead of pow(), which kept a sharp apex
    r = r > 0 ? r * r * (3.0 - 2.0 * r) : 0
    let cut = fbm(x * 0.004, 200.0, 3)
    cut = smoothstepF(0.25, 0.75, cut)
    return r * cut
}
function bandMask(z: number, center: number, width: number) {
    let d = Math.abs(z - center) / width
    d = 1.0 - d
    return d > 0 ? d * d : 0
}
function centralMistFactor(x: number) {
    const r = x / 520.0
    return 1.0 - Math.exp(-(r * r))
}
function computeXCache(x: number) {
    return {
        fgCut: smoothstepF(100.0, 1200.0, x),
        rightBank: Math.max(0, 1.0 - Math.pow((x - 1000) / 900, 2)) * 230.0,
        sFg: ridge1D(x - 900) * 120,
        sNear: ridge1D(x + 80) * 240,
        sMid: ridge1D(x - 220) * 720,
        sFar: ridge1D(x + 520) * 420,
        cm: centralMistFactor(x),
    }
}
const _td = { h: 0, ridge: 0, cm: 0, fg: 0, far: 0 }
function getTerrainData(
    x: number,
    z: number,
    xc?: ReturnType<typeof computeXCache>
) {
    const fg = bandMask(z, 1000, 350),
        near = bandMask(z, 220, 460),
        mid = bandMask(z, -160, 560),
        far = bandMask(z, -720, 720)
    let fgCut: number,
        sFg: number,
        sNear: number,
        sMid: number,
        sFar: number,
        cm: number
    if (xc) {
        fgCut = xc.fgCut
        sFg = xc.sFg + xc.rightBank
        sNear = xc.sNear
        sMid = xc.sMid
        sFar = xc.sFar
        cm = xc.cm
    } else {
        fgCut = smoothstepF(100.0, 1200.0, x)
        const rightBank =
            Math.max(0, 1.0 - Math.pow((x - 1000) / 900, 2)) * 230.0
        sFg = ridge1D(x - 900) * 120 + rightBank
        sNear = ridge1D(x + 80) * 240
        sMid = ridge1D(x - 220) * 720
        sFar = ridge1D(x + 520) * 420
        cm = centralMistFactor(x)
    }
    let texN = fbm(x * 0.003, z * 0.004, 4),
        texR = 1.0 - Math.abs(texN - 0.5) * 2.0
    texR = texR > 0 ? Math.pow(texR, 2.8) : 0
    // texR's contribution to HEIGHT is reduced (less jagged silhouette); texR is
    // still returned as _td.ridge below to drive the ridge ink density
    let h =
        fg * fgCut * (sFg + texR * 70) +
        near * (sNear + texR * 80) +
        mid * (sMid + texR * 130) +
        far * (sFar + texR * 70)
    // full mountain height (no trim); the 2D-planar look is done in the shader
    const cmFinal = mixF(cm, 1.0, fg * 0.8)
    h *= cmFinal * 0.65 + 0.35
    h -= z * 0.25
    let baseH = h - 520.0
    baseH += fg * fgCut * 350.0
    _td.h = baseH
    _td.ridge = texR
    _td.cm = cm
    _td.fg = fg * fgCut
    _td.far = far
    return _td
}

// One-shot GPU probe. CPU cores / deviceMemory say nothing about the GPU, yet
// the point cloud is GPU-bound — so an 8-core laptop with an Intel iGPU, or a
// browser with hardware acceleration disabled (→ software WebGL), would score a
// high tier and then stutter. Read the real renderer string and classify it.
function detectGPU(): { isSoftware: boolean; isIntegrated: boolean; name: string } {
    try {
        const c = document.createElement("canvas")
        const gl = (c.getContext("webgl") ||
            c.getContext("experimental-webgl")) as WebGLRenderingContext | null
        if (!gl) return { isSoftware: true, isIntegrated: true, name: "no-webgl" }
        const ext = gl.getExtension("WEBGL_debug_renderer_info")
        const name = String(
            (ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) ||
                gl.getParameter(gl.RENDERER) ||
                ""
        )
        // free the probe context immediately (browsers cap live GL contexts)
        gl.getExtension("WEBGL_lose_context")?.loseContext()
        const n = name.toLowerCase()
        const isSoftware =
            /swiftshader|llvmpipe|software|basic render|microsoft basic|warp/.test(n)
        // Apple Silicon ("Apple GPU") is strong — deliberately NOT integrated.
        const isIntegrated =
            !isSoftware &&
            /intel|hd graphics|uhd|iris|mali|adreno|powervr|videocore|vivante/.test(n)
        return { isSoftware, isIntegrated, name }
    } catch {
        return { isSoftware: false, isIntegrated: false, name: "unknown" }
    }
}

export default function DigitalLandscape(props: Props) {
    // de-framered: this never runs inside the Framer canvas anymore
    const isCanvas = false
    const enableMouseSpotlight = true
    const {
        mobileBgUrl,
        liteMode = false,
        heroWord1,
        heroWord2,
        heroWord3,
        heroSubtitle,
        isLoaded = true,
        quoteLine,
        scrollHint,
        scrollDemo,
        page2Title = "",
        page2Subtitle = "",
        page2BrandLine = "",
        page2Footer = "",
        photoUrl,
        photoComponent,
    } = props

    const scrollDemoRef = useRef<number | undefined>(scrollDemo)

    const backgroundRef = useRef<HTMLDivElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const mountRef = useRef<HTMLDivElement | null>(null)
    const uiRef = useRef<HTMLDivElement | null>(null)
    const wordmarkRef = useRef<HTMLDivElement | null>(null)
    const nightOverlayRef = useRef<HTMLDivElement | null>(null)
    const blackPageRef = useRef<HTMLDivElement | null>(null)
    const page2ActiveRef = useRef(false)
    const photoWrapperRef = useRef<HTMLDivElement | null>(null)
    const page2TextRef = useRef<HTMLDivElement | null>(null)
    const sceneReadyRef = useRef(false)
    const isLoadedRef = useRef(isLoaded !== false)
    const fontsReadyRef = useRef(false)
    const mobileBgRef = useRef(mobileBgUrl)

    // fonts are loaded once in app/layout.tsx (consolidated injector)

    useEffect(() => {
        isLoadedRef.current = isLoaded !== false
        if (
            isLoadedRef.current &&
            sceneReadyRef.current &&
            fontsReadyRef.current
        ) {
            uiRef.current?.classList.add("scene-loaded")
            wordmarkRef.current?.classList.add("scene-loaded")
        }
    }, [isLoaded])

    useEffect(() => {
        scrollDemoRef.current = scrollDemo
        // In Framer canvas, window.scrollY is always 0 — sync night overlay manually
        if (isCanvas && scrollDemo !== undefined && nightOverlayRef.current) {
            const nightT = smoothstepF(0.65, 0.85, scrollDemo)
            setInlineStyle(
                nightOverlayRef.current,
                "opacity",
                String(round3(nightT))
            )
        }
        // Also sync DOM state (hero fade + profile) that handleScroll normally drives
        if (isCanvas && scrollDemo !== undefined) {
            const p = scrollDemo
            const winH = window.innerHeight
            // scrollDemo is progress 0→1 = equivalent to 0→winH px scroll
            const scrollY = p * winH
            if (uiRef.current)
                setInlineStyle(
                    uiRef.current,
                    "opacity",
                    String(round3(Math.max(1 - p * 1.8, 0)))
                )
            if (blackPageRef.current) {
                const p2Opacity = Math.max(
                    0,
                    Math.min(1, (scrollY - (winH * 0.28 + 590)) / 350)
                )
                setInlineStyle(
                    blackPageRef.current,
                    "opacity",
                    String(round3(p2Opacity))
                )
                setInlineStyle(
                    blackPageRef.current,
                    "pointer-events",
                    p2Opacity > 0.01 ? "auto" : "none"
                )
            }
        }
    }, [isCanvas, scrollDemo])

    useEffect(() => {
        if (typeof window === "undefined") return
        let isMounted = true
        let animationFrameId = 0
        let cleanupAnimation: (() => void) | undefined = undefined
        // assigned by init3D's dynamic `await import("three")`; shared so both
        // init3D and startAnimation (effect-scope siblings) close over the same
        // lazily-loaded engine. Never touched on the mobile early-return path.
        let THREE: typeof import("three")


        // Fonts + loader gate: ensure web fonts are loaded before text
        // animations fire, but never let a missed loaderFinished event trap
        // the hero in its hidden pre-reveal state.
        let loaderRevealArmed = false
        let loaderRevealFallback = 0
        const revealHeroText = () => {
            if (!isMounted) return
            uiRef.current?.classList.add("scene-loaded")
            wordmarkRef.current?.classList.add("scene-loaded")
        }
        const revealAfterLoader = () => {
            window.removeEventListener("loaderFinished", revealAfterLoader)
            loaderRevealArmed = false
            if (loaderRevealFallback) {
                window.clearTimeout(loaderRevealFallback)
                loaderRevealFallback = 0
            }
            revealHeroText()
        }
        const tryReveal = () => {
            if (
                sceneReadyRef.current &&
                isLoadedRef.current &&
                fontsReadyRef.current
            ) {
                // the session loader replays on every refresh: while it still
                // covers the screen, hold the text entrance until it leaves
                if (document.querySelector("[data-app-loader]")) {
                    if (!loaderRevealArmed) {
                        loaderRevealArmed = true
                        window.addEventListener(
                            "loaderFinished",
                            revealAfterLoader,
                            { once: true }
                        )
                        loaderRevealFallback = window.setTimeout(
                            revealAfterLoader,
                            2400
                        )
                    }
                    return
                }
                revealHeroText()
            }
        }
        const fontRevealFallback = window.setTimeout(() => {
            if (!isMounted || fontsReadyRef.current) return
            fontsReadyRef.current = true
            tryReveal()
        }, 1200)

        if (document.fonts) {
            document.fonts.ready.then(() => {
                if (!isMounted) return
                window.clearTimeout(fontRevealFallback)
                fontsReadyRef.current = true
                tryReveal()
            })
        } else {
            window.clearTimeout(fontRevealFallback)
            fontsReadyRef.current = true
        }

        // If isLoaded is false, wait for loader to signal completion
        const onLoaderDone = () => {
            isLoadedRef.current = true
            tryReveal()
        }
        if (!isLoadedRef.current) {
            window.addEventListener("loaderFinished", onLoaderDone, {
                once: true,
            })
        }

        let scene: THREE.Scene,
            camera: THREE.PerspectiveCamera,
            renderer: THREE.WebGLRenderer
        // flowmap (流场) — ping-pong velocity field stirred by the cursor
        let flowRTa: THREE.WebGLRenderTarget | null = null,
            flowRTb: THREE.WebGLRenderTarget | null = null,
            flowMat: THREE.ShaderMaterial | null = null,
            flowScene: THREE.Scene | null = null,
            flowCam: THREE.OrthographicCamera | null = null
        // 雾气层 — flowmap-warped ink mist composited over the mountains
        let mistMat: THREE.ShaderMaterial | null = null,
            mistScene: THREE.Scene | null = null,
            mistCam: THREE.OrthographicCamera | null = null
        let mountainMat: THREE.ShaderMaterial, mountain: THREE.Points
        let starMesh: THREE.Points
        let birdGeo: THREE.BufferGeometry,
            birdMesh: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>
        const birdData: BirdDatum[] = []
        let scrollProgress = 0
        let isSceneVisible = true
        let winHeight = window.innerHeight
        let winWidth = window.innerWidth
        let resumeSceneAnimation: (() => void) | null = null

        const mouseNDC = { x: 0, y: 0 }
        // smoothed cursor velocity (NDC/frame) — drives the "sliding water" wake
        const prevMouseNDC = { x: 0, y: 0 }
        const mouseVel = { x: 0, y: 0 }
        let mouseActive = 0,
            pendingMouse = false
        let lastClientX = 0,
            lastClientY = 0

        const handleMouseMove = (e: MouseEvent) => {
            // keep reacting to the mouse through the day scene, the black/white
            // flip and the hold — the cloud-piercing spotlight stays alive until
            // the mountain begins to collapse (~0.72)
            if (scrollProgress > 0.52) {
                mouseActive = 0
                return
            }
            lastClientX = e.clientX
            lastClientY = e.clientY
            mouseActive = 1
            if (pendingMouse) return
            pendingMouse = true
            requestAnimationFrame(() => {
                pendingMouse = false
                mouseNDC.x = (lastClientX / winWidth) * 2 - 1
                mouseNDC.y = -(lastClientY / winHeight) * 2 + 1
            })
        }
        const handleMouseLeave = () => {
            mouseActive = 0
        }
        if (enableMouseSpotlight) {
            window.addEventListener("mousemove", handleMouseMove, {
                passive: true,
            })
            window.addEventListener("mouseleave", handleMouseLeave, {
                passive: true,
            })
        }

        // Shared scroll value: handleScroll writes this, animation loop reads it.
        // Decouples the animation loop from getScrollY() — which may return 0
        // when isCanvas is misdetected in Framer live-preview frames.
        const scrollForAnimation = { current: 0 }

        // 一旦确认 window.scrollY 可用，永久走快路径跳过昂贵的 fallback
        let _scrollFast = false
        const getScrollY = (): number => {
            if (_scrollFast) {
                return (
                    window.scrollY ||
                    window.pageYOffset ||
                    (document.documentElement &&
                        document.documentElement.scrollTop) ||
                    (document.body && document.body.scrollTop) ||
                    0
                )
            }
            // 1. window scroll — Framer Fixed overlay + standard browsers
            const winY =
                window.scrollY ||
                window.pageYOffset ||
                (document.documentElement &&
                    document.documentElement.scrollTop) ||
                (document.body && document.body.scrollTop) ||
                0
            if (winY > 0) {
                _scrollFast = true // 发布版走这里，后续跳过所有 fallback
                return winY
            }
            // 2. getBoundingClientRect — component in document flow
            if (backgroundRef.current) {
                const top = backgroundRef.current.getBoundingClientRect().top
                if (top < -1) return -top
            }
            // 3. scan ancestor scrollTop — Framer div scroll container
            if (backgroundRef.current) {
                let el: Element | null = backgroundRef.current.parentElement
                while (el && el !== document.documentElement) {
                    if (el.scrollTop > 0) return el.scrollTop
                    el = el.parentElement
                }
            }
            return 0
        }

        // The night card sits at a fixed doc position: spacer(136vh−911px)
        // + card top within the zone (2152px−136vh) — the vh terms cancel.
        const PAGE2_DOC_TOP = 1241

        // Mobile bg-image fallback only: the fixed night overlay (z0) sits
        // BEHIND the opaque hero image (wrapper z1), so it can never darken
        // the scene — the white page-2 copy was rendering white-on-white at
        // 390px. This in-mount veil (set up in the low-end branch below)
        // mirrors the overlay's opacity so phones get the same night backdrop.
        let mobileVeilEl: HTMLElement | null = null

        // All late-scroll timing (pin, fades, release) anchors to the roof
        // transition's actual doc position — pure viewport-height multiples
        // break on short (~750) and tall (1300+) windows.
        let roofSectionEl: HTMLElement | null = null
        const getRoofTop = () => {
            if (!roofSectionEl || !roofSectionEl.isConnected) {
                roofSectionEl = document.querySelector(".home-roof-transition")
            }
            return roofSectionEl
                ? roofSectionEl.offsetTop
                : winHeight * 3 -
                      911 +
                      Math.max(0, 2152 - winHeight * 1.55)
        }

        const handleScroll = () => {
            if (!isMounted) return
            const componentTop =
                backgroundRef.current?.getBoundingClientRect().top ?? 0
            const viewportFollowY = Math.max(0, -componentTop)
            const fallbackScrollY = getScrollY()
            const currentScrollY =
                viewportFollowY > 0.5
                    ? viewportFollowY
                    : componentTop > 0
                      ? 0
                      : fallbackScrollY
            const progress = Math.min(currentScrollY / (winHeight * 1.0), 1)
            scrollProgress = progress
            scrollForAnimation.current = progress
            const wrapperEl = wrapperRef.current
            const uiEl = uiRef.current
            const overlayEl = nightOverlayRef.current
            const blackPageEl = blackPageRef.current
            const roofTop = getRoofTop()

            // page2: fade in profile once stars are mostly formed. Pushed later
            // (590 → 850) for a longer night-sky pause after the dust dispersal,
            // and a slower fade (350 → 540) so the avatar eases in instead of
            // snapping on.
            const p2Reveal = Math.max(
                0,
                Math.min(
                    1,
                    (currentScrollY - (winHeight * 0.28 + 850)) / 540
                )
            )
            // safety fade once the card is fully behind the roof wall
            const p2LateFade =
                1 -
                smoothstepF(
                    roofTop + winHeight * 0.3,
                    roofTop + winHeight * 0.45,
                    currentScrollY
                )
            const p2Opacity = p2Reveal * p2LateFade
            // moonset: pin the night card so the AVATAR hangs at ~12% viewport
            // height (the card content is shifted up by the CSS translateY on
            // .page2-center-container — compensate or the avatar hits the top
            // edge on tall screens), then the rising roof transition slides
            // over it and the content sets behind the eave line like a moon
            const pinShift = winHeight > 850 ? 110 : 30
            const moonPin = clampF(
                currentScrollY -
                    (PAGE2_DOC_TOP - winHeight * 0.12 - pinShift),
                0,
                Math.max(0, roofTop + 500 - PAGE2_DOC_TOP)
            )
            if (blackPageEl) {
                setInlineStyle(
                    blackPageEl,
                    "opacity",
                    String(round3(p2Opacity))
                )
                setInlineStyle(
                    blackPageEl,
                    "transform",
                    // subpixel: Math.round here stair-steps the pin ±1px every
                    // frame under smooth scroll → visible avatar shimmer
                    `translateY(${moonPin.toFixed(2)}px)`
                )
                setInlineStyle(
                    blackPageEl,
                    "pointer-events",
                    p2Opacity > 0.01 ? "auto" : "none"
                )
            }
            // name/intro copy bows out before the roofline reaches it —
            // otherwise fragments peek through the sky gaps between roofs
            if (page2TextRef.current) {
                const textFade =
                    1 -
                    smoothstepF(
                        roofTop - winHeight * 0.55,
                        roofTop - winHeight * 0.15,
                        currentScrollY
                    )
                setInlineStyle(
                    page2TextRef.current,
                    "opacity",
                    String(round3(textFade))
                )
            }
            if (!page2ActiveRef.current && p2Opacity > 0) {
                page2ActiveRef.current = true
                if (blackPageEl)
                    setClassState(blackPageEl, "page2-active", true)
            }

            if (wrapperEl) {
                if (componentTop > winHeight) {
                    // 组件完全在视口下方（尚未滚动到），隐藏 fixed canvas 避免叠在其他页面内容上
                    setInlineStyle(wrapperEl, "opacity", "0")
                } else {
                    // keep the starfield up through the moonset — it dims
                    // away as the roofline takes over the viewport
                    const canvasFadeStart = roofTop - winHeight * 0.3
                    const canvasFadeEnd = roofTop + winHeight * 0.3
                    const canvasFade =
                        currentScrollY <= canvasFadeStart
                            ? 1
                            : Math.max(
                                  0,
                                  1 -
                                      (currentScrollY - canvasFadeStart) /
                                          (canvasFadeEnd - canvasFadeStart)
                              )
                    setInlineStyle(
                        wrapperEl,
                        "opacity",
                        String(round3(canvasFade))
                    )
                }
            }
            if (uiEl) {
                // the hero copy HOLDS in place — white — through the day scene,
                // the black/white flip AND the whole mountain collapse; it only
                // floats up and fades once the collapse has fully finished (~0.86),
                // just before the avatar card arrives.
                const textInvert = smoothstepF(0.12, 0.28, progress)
                const releaseY = Math.max(0, currentScrollY - winHeight * 0.86)
                setInlineStyle(
                    uiEl,
                    "opacity",
                    String(round3(1 - smoothstepF(0.86, 0.95, progress)))
                )
                setInlineStyle(uiEl, "filter", `invert(${textInvert.toFixed(3)})`)
                // pinned (translateY 0) until the collapse, then scrolls away 1:1
                setInlineStyle(
                    uiEl,
                    "transform",
                    `translateY(${(-releaseY).toFixed(2)}px)`
                )
            }
            // Wordmark rides the day→night flip: DIFFERENCE blend by day (reads
            // black on the white page, mountains carve through it), switching to
            // NORMAL once night sets (clean solid white on black), then floats
            // out before page-2 arrives.
            if (wordmarkRef.current) {
                // ink colour rides the day→night flip: near-black on the white
                // page → white once the scene turns black (the red O is fixed).
                const nightT = smoothstepF(0.12, 0.28, progress)
                const g = Math.round(22 + (255 - 22) * nightT)
                setInlineStyle(
                    wordmarkRef.current,
                    "--wm-ink",
                    `rgb(${g}, ${g}, ${g})`
                )
                // exit: as you scroll into the night the block lifts up, blurs
                // and dissolves away (like the ink letting go).
                const exit = smoothstepF(0.3, 0.5, progress)
                setInlineStyle(
                    wordmarkRef.current,
                    "transform",
                    `translateY(${(-exit * 9).toFixed(2)}vh)`
                )
                setInlineStyle(
                    wordmarkRef.current,
                    "filter",
                    exit > 0.001 ? `blur(${(exit * 6).toFixed(1)}px)` : "none"
                )
                setInlineStyle(
                    wordmarkRef.current,
                    "opacity",
                    String(round3(1 - exit))
                )
                // once the user scrolls off the top, drop the name's hover
                // hit-cells so they don't block page-2 underneath
                setClassState(wordmarkRef.current, "wm-faded", progress > 0.06)
            }

            // Smooth day→night — opacity overlay（compositor-only，不触发 repaint）
            // fades back out once the roof transition's white wall owns the
            // viewport (the overlay is fixed and would otherwise linger)
            // whole screen darkens uniformly as you scroll — the left→right
            // motion lives in the mountain collapse, not the sky. Darkens a touch
            // early so the sky is already dark when the white collapse plays out.
            const nightT = smoothstepF(0.12, 0.28, progress)
            // Release when the roof section's BOTTOM nears mid-viewport (the
            // white wall owns the frame). Was a hardcoded roofTop+900, tuned
            // on the 1327px desktop roof (equivalent to this formula ±4px);
            // on tablet shells the roof is only ~730px tall, so +900 landed
            // past the section and the night never lifted until Selected
            // Work — white gables floating on black, then a black band
            // chasing the ridge out of the viewport. Phones keep the legacy
            // +900: their single-ridge composition stays on the night the
            // whole way (an early dawn behind the crest reads wrong there).
            const roofHeight =
                roofSectionEl?.offsetHeight ?? winHeight * 1.47
            const nightReleaseStart =
                window.innerWidth > 740
                    ? roofTop + Math.max(0, roofHeight - winHeight * 0.47)
                    : roofTop + 900
            const nightRelease =
                1 -
                smoothstepF(
                    nightReleaseStart,
                    nightReleaseStart + winHeight * 0.35,
                    currentScrollY
                )
            if (overlayEl)
                setInlineStyle(
                    overlayEl,
                    "opacity",
                    String(round3(nightT * nightRelease))
                )
            if (mountRef.current?.dataset.liteFallback === "true") {
                setInlineStyle(
                    mountRef.current,
                    "filter",
                    `invert(${nightT.toFixed(3)})`
                )
            }
            // mobile bg image: darken IN FRONT of the opaque photo (see the
            // mobileVeilEl note above) — same curve as the night overlay
            if (mobileVeilEl)
                setInlineStyle(
                    mobileVeilEl,
                    "opacity",
                    String(round3(nightT * nightRelease))
                )

            const wasSceneVisible = isSceneVisible
            isSceneVisible = currentScrollY < roofTop + winHeight * 0.5
            if (isSceneVisible && !wasSceneVisible) {
                resumeSceneAnimation?.()
            }

            // Flag the dark-night window for the fixed header. Tie it to the
            // ACTUAL darkness behind the nav — the night overlay (nightT *
            // nightRelease) stays opaque through the dark roof transition, well
            // past the point where the scene stops being "visible". Using
            // isSceneVisible here flipped the nav black-on-black over the roof.
            setClassState(
                document.body,
                "hero-night",
                nightT * nightRelease > 0.5
            )

            // Hide the fixed canvas entirely when past the Three.js zone
            // Prevents the last rendered star frame from bleeding into work cards / other pages
            if (wrapperEl) {
                setInlineStyle(
                    wrapperEl,
                    "visibility",
                    isSceneVisible ? "" : "hidden"
                )
            }
        }

        // Scroll source for the pin/fade transforms. Two drivers, mutually
        // exclusive per frame:
        //
        //  • Lenis (smooth scroll): the moon card is `position:absolute`, so it
        //    scrolls with the page while a counter-translate pins it. The DOM
        //    `scroll` event fires BEFORE Lenis's rAF each frame, so a transform
        //    computed there reflects the PREVIOUS frame's scroll while the page
        //    paints THIS frame's — a one-frame desync that makes the avatar
        //    jitter. Lenis emits its own 'scroll' synchronously inside the same
        //    rAF, right after it applies the scroll, so a transform computed
        //    there paints in-sync. When Lenis is present we drive off that and
        //    suppress the stale DOM path.
        //  • No Lenis (reduced-motion / pre-mount / Framer canvas): fall back to
        //    the DOM scroll event.
        let lenisActive = false
        const onScrollRaf = () => {
            if (lenisActive) return
            handleScroll()
        }
        document.addEventListener("scroll", onScrollRaf, {
            passive: true,
            capture: true,
        })
        let lenisDetach: (() => void) | null = null
        const onLenisScroll = () => handleScroll()
        const unsubLenis = subscribeLenis((lenis) => {
            lenisDetach?.()
            lenisDetach = null
            if (lenis) {
                lenisActive = true
                lenis.on("scroll", onLenisScroll)
                lenisDetach = () => lenis.off("scroll", onLenisScroll)
            } else {
                lenisActive = false
            }
            handleScroll()
        })
        handleScroll()

        // ── RAF poll: Framer published/preview never fires DOM scroll events.
        //    Read getBoundingClientRect at ~30fps — works with any scroll container.
        //    Stops automatically once window.scrollY is confirmed working (_scrollFast).
        let scrollPollRaf = 0
        let lastPollY = -1
        let lastBcrTime = 0
        let compInView = true // controlled by IO below
        const scrollPollFn = () => {
            scrollPollRaf = 0
            if (!isMounted || isCanvas || document.hidden || !compInView) return
            if (_scrollFast) return // window.scroll event handles it; stop poll
            scrollPollRaf = requestAnimationFrame(scrollPollFn)
            const now = performance.now()
            if (now - lastBcrTime < 33) return // ~30fps throttle
            lastBcrTime = now
            const currentTop =
                backgroundRef.current?.getBoundingClientRect().top ?? 0
            if (Math.abs(currentTop - lastPollY) > 0.5) {
                lastPollY = currentTop
                handleScroll()
            }
        }
        scrollPollRaf = requestAnimationFrame(scrollPollFn)

        // Resume scroll poll when page becomes visible again or regains focus
        const resumeScrollPoll = () => {
            if (!document.hidden && compInView && !scrollPollRaf && !isCanvas) {
                lastPollY = -1 // force re-check scroll position
                scrollPollRaf = requestAnimationFrame(scrollPollFn)
            }
        }
        document.addEventListener("visibilitychange", resumeScrollPoll)
        window.addEventListener("focus", resumeScrollPoll, { passive: true })

        // Stop scroll poll when component exits viewport entirely (e.g. user on different page)
        const pollIO =
            typeof IntersectionObserver !== "undefined" && backgroundRef.current
                ? new IntersectionObserver(
                      (entries) => {
                          compInView = !!entries[0]?.isIntersecting
                          if (compInView) resumeScrollPoll()
                      },
                      { threshold: 0 }
                  )
                : null
        if (pollIO && backgroundRef.current)
            pollIO.observe(backgroundRef.current)

        // ── Mobile / 低端设备: skip Three.js entirely, use CSS ink fallback ──
        // Software WebGL (HW-accel off / SwiftShader / llvmpipe) can't push the
        // point cloud — route it to the CSS ink fallback too.
        // Reduced-motion also lands here: instead of a merely slowed-down
        // point cloud it gets a genuinely static scene — desktop RM takes the
        // SVG ink fallback, phone RM keeps the (already static) photo bg.
        const gpu = detectGPU()
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
        const isLowEndDevice =
            liteMode ||
            prefersReducedMotion ||
            window.innerWidth <= 768 ||
            (navigator.hardwareConcurrency || 4) <= 2 ||
            ((navigator as any).deviceMemory || 4) <= 2 ||
            gpu.isSoftware
        if (isLowEndDevice) {
            if (mountRef.current) {
                const bg = mobileBgRef.current
                const useLiteInkFallback =
                    liteMode ||
                    !bg ||
                    (prefersReducedMotion && window.innerWidth > 768)
                mountRef.current.dataset.liteFallback = useLiteInkFallback
                    ? "true"
                    : "false"
                mountRef.current.style.background = useLiteInkFallback
                    ? "#fff"
                    : "transparent"
                mountRef.current.style.filter = "invert(0)"
                mountRef.current.innerHTML = !useLiteInkFallback && bg
                    ? // presentation contrast lift (CSS only, source PNG
                      // untouched): the stippled mountains read as barely-there
                      // dust on phone screens. brightness(b) followed by
                      // contrast(0.5/(b-0.5)) darkens the light-gray stipple a
                      // full step while mapping white back to white — a plain
                      // contrast() boost pushes light grays LIGHTER and erases
                      // the mountains instead.
                      `<img src="${bg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 60%;filter:brightness(0.75) contrast(2);" /><div data-hero-mobile-veil style="position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;"></div>`
                    : `<svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice"
                         style="position:absolute;inset:0;width:100%;height:100%">
                        <defs>
                          <filter id="inkblur"><feGaussianBlur stdDeviation="3"/></filter>
                          <filter id="inkblur2"><feGaussianBlur stdDeviation="1.5"/></filter>
                        </defs>
                        <path class="ink-layer ink-far"
                          d="M0,400 Q120,240 280,300 Q440,160 600,210 Q760,110 920,155 Q1060,80 1200,115 L1200,600 L0,600 Z"
                          fill="#2a2a2a" opacity="0.07" filter="url(#inkblur)"/>
                        <path class="ink-layer ink-mid"
                          d="M0,450 Q100,310 260,360 Q420,240 580,290 Q720,190 900,240 Q1050,170 1200,205 L1200,600 L0,600 Z"
                          fill="#1a1a1a" opacity="0.13" filter="url(#inkblur2)"/>
                        <path class="ink-layer ink-near"
                          d="M0,505 Q80,430 210,460 Q380,390 540,420 Q700,370 870,400 Q1020,360 1200,380 L1200,600 L0,600 Z"
                          fill="#111" opacity="0.22"/>
                        <path class="ink-layer ink-fg"
                          d="M-20,560 Q60,530 180,548 Q340,518 520,538 Q700,510 900,528 Q1060,508 1220,520 L1220,600 L-20,600 Z"
                          fill="#0d0d0d" opacity="0.32"/>
                      </svg>`
                mountRef.current.style.opacity = "1"
                mobileVeilEl = mountRef.current.querySelector<HTMLElement>(
                    "[data-hero-mobile-veil]"
                )
                // sync the veil to the current scroll position right away
                if (mobileVeilEl) handleScroll()
            }
            sceneReadyRef.current = true
            tryReveal()
            return () => {
                // Must mirror the full-path teardown below: the Lenis
                // subscription outlives route changes, so leaking it keeps
                // handleScroll toggling body.hero-night on other pages.
                isMounted = false
                document.body.classList.remove("hero-night")
                cancelAnimationFrame(scrollPollRaf)
                unsubLenis?.()
                lenisDetach?.()
                document.removeEventListener("scroll", onScrollRaf, {
                    capture: true,
                })
                document.removeEventListener(
                    "visibilitychange",
                    resumeScrollPoll
                )
                window.removeEventListener("focus", resumeScrollPoll)
                pollIO?.disconnect()
                if (enableMouseSpotlight) {
                    window.removeEventListener("mousemove", handleMouseMove)
                    window.removeEventListener("mouseleave", handleMouseLeave)
                }
                window.removeEventListener("loaderFinished", onLoaderDone)
                window.removeEventListener("loaderFinished", revealAfterLoader)
                if (loaderRevealFallback)
                    window.clearTimeout(loaderRevealFallback)
                window.clearTimeout(fontRevealFallback)
            }
        }

        async function init3D() {
            try {
                // lazy-load the engine here so it lands in its own chunk,
                // fetched only by devices that actually render the 3D scene
                THREE = await import("three")
                if (!isMounted) return
                scene = new THREE.Scene()
                scene.fog = new THREE.FogExp2(0xffffff, 0.0001)
                const containerW =
                    mountRef.current?.offsetWidth || window.innerWidth
                camera = new THREE.PerspectiveCamera(
                    fovForAspect(containerW / window.innerHeight),
                    containerW / window.innerHeight,
                    1,
                    7000
                )
                camera.position.set(0, 200, 2200)

                const isMobile = window.innerWidth <= 768
                const hwCores = navigator.hardwareConcurrency || 4
                const deviceMemory = (navigator as any).deviceMemory || 4
                // 低端设备已被早返回拦截；此处 isLowEnd 仅作防御性一致
                const isLowEnd = isMobile || hwCores <= 2 || deviceMemory <= 2
                // 0 = mobile/low-end (handled by early return above), 1 = mid/canvas, 2 = high-end desktop
                const baseTier: 0 | 1 | 2 = isLowEnd
                    ? 0
                    : isCanvas || hwCores <= 4 || deviceMemory <= 4
                      ? 1
                      : 2
                // GPU-aware cap: an 8-core laptop with an integrated GPU scores
                // tier 2 on cores/RAM but chokes on 220k points — pin it to tier 1.
                const qualityTier: 0 | 1 | 2 =
                    gpu.isIntegrated && baseTier > 1 ? 1 : baseTier
                if (process.env.NODE_ENV !== "production")
                    console.info(`[hero] GPU="${gpu.name}" → tier ${qualityTier}`)

                renderer = new THREE.WebGLRenderer({
                    antialias: false,
                    alpha: true,
                    powerPreference:
                        qualityTier === 0 ? "default" : "high-performance",
                })
                renderer.setPixelRatio(
                    Math.min(
                        qualityTier === 0
                            ? 0.6
                            : qualityTier === 1
                              ? 1.0
                              : 1.25,
                        window.devicePixelRatio || 1
                    )
                )
                renderer.setSize(containerW, window.innerHeight)
                renderer.setClearColor(0xffffff, 0)
                // defensive sweep: any stale canvas (HMR ghosts, interrupted
                // unmounts) would push the live one below the fold
                mountRef.current
                    ?.querySelectorAll("canvas")
                    .forEach((c) => c.remove())
                mountRef.current?.appendChild(renderer.domElement)

                // star density tracks the initial viewport's pixel area
                const pixelAreaRatio = clampF(
                    (containerW * window.innerHeight) / (1920 * 1080),
                    0.3,
                    1.8
                )
                // Re-runnable particle-field builder. Resize rebuilds the field
                // for the new width (debounced) instead of stretching the
                // original, so the point count tracks screen size and the
                // mountains refill the viewport (no white gaps when widened).
                let lastBuiltW = containerW
                let mtnRebuildTimer = 0
                let mtnBuildToken = 0
                const buildMountainGeometry = async (containerW: number) => {
                const myToken = ++mtnBuildToken
                // 响应式地形：X 范围跟视口宽高比，粒子上限跟分辨率
                const terrainAspect = containerW / window.innerHeight
                const aspectScale = clampF(terrainAspect / (16 / 9), 0.55, 1.55)
                // narrow viewports pack the SAME particle count into far fewer
                // pixels, so the points pile up (NormalBlending accumulates)
                // into a heavy black mass — lowering alpha alone can't undo the
                // pile-up. So scale BOTH: inkCount thins the particle count
                // (de-blobs the overlap), inkAlpha gently lifts what's left.
                // Full strength on a wide canvas, progressively airier as it
                // narrows.
                const inkCount = clampF(containerW / 1400, 0.82, 1.0)
                const inkAlpha = 0.85 + 0.15 * inkCount
                const lx = -0.8,
                    ly = 0.4,
                    lz = -0.4,
                    extX =
                        qualityTier === 0
                            ? 1200
                            : Math.round(2600 * aspectScale),
                    minZ = -1200,
                    maxZ = 1200
                const cellSize =
                    qualityTier === 0 ? 40.0 : qualityTier === 1 ? 24.0 : 18.0
                const density =
                    qualityTier === 0 ? 3.0 : qualityTier === 1 ? 15.0 : 24.0
                // measured demand (uncapped): ~280k at tier 2 across common
                // viewports — demand does NOT scale with pixel area (terrain
                // width grows as windows get SHORTER), so an area-scaled cap
                // silently truncated the last-generated columns: the bottom-
                // right foreground bank appeared or vanished depending on
                // window chrome. Flat caps with headroom instead.
                const maxPoints =
                    qualityTier === 0
                        ? 8000
                        : qualityTier === 1
                          ? 90000
                          : 220000
                const yieldInterval =
                    qualityTier === 0 ? 14 : qualityTier === 1 ? 20 : 24
                const positions = new Float32Array(maxPoints * 3)
                const sizes = new Float32Array(maxPoints)
                const alphas = new Float32Array(maxPoints)
                // per-particle ridge-ness (0 = slope/body, 1 = ridge spine):
                // the ridge holds still, the body flows
                const ridges = new Float32Array(maxPoints)
                let pIdx = 0
                let lastYield = performance.now()

                for (let cx = -extX; cx <= extX; cx += cellSize) {
                    if (!isMounted || myToken !== mtnBuildToken) return null
                    const tx = cx + cellSize / 2
                    const xc = computeXCache(tx)
                    const eps = 4.0
                    for (let cz = minZ; cz <= maxZ; cz += cellSize) {
                        const tz = cz + cellSize / 2
                        const t = getTerrainData(tx, tz, xc)
                        const th = t.h,
                            tRidge = t.ridge,
                            tCm = t.cm,
                            tFg = t.fg
                        if (th < -330 && tFg < 0.1) continue
                        const hx = getTerrainData(tx + eps, tz, xc).h
                        const hz = getTerrainData(tx, tz + eps, xc).h
                        let nx = -(hx - th) / eps,
                            nz = -(hz - th) / eps,
                            ny = 1.0
                        const nlen = Math.sqrt(nx * nx + ny * ny + nz * nz)
                        nx /= nlen
                        ny /= nlen
                        nz /= nlen
                        const dotLight = nx * lx + ny * ly + nz * lz
                        const shadow = Math.pow(
                            smoothstepF(0.1, -0.6, dotLight),
                            2.5
                        )
                        const depth = smoothstepF(minZ, maxZ, cz)
                        let count = 0
                        if (tFg > 0.05) {
                            const vegetation =
                                smoothstepF(50, 400, th) *
                                smoothstepF(0.85, 0.98, ny)
                            let prob =
                                shadow * 1.3 +
                                Math.pow(tRidge, 3.0) * 1.5 +
                                vegetation * 3.0
                            prob *=
                                1.0 - smoothstepF(-0.1, 0.5, dotLight) * 0.95
                            prob *= mixF(0.1, 1.4, depth) * tFg * 1.5
                            count = Math.min(
                                Math.floor(prob * density * 1.2 * inkCount),
                                qualityTier === 0
                                    ? 10
                                    : qualityTier === 1
                                      ? 26
                                      : 40
                            )
                            const sizeBase =
                                mixF(1.5, 4.5, depth) +
                                shadow * 2.0 +
                                vegetation * 6.0
                            const alphaBase =
                                mixF(0.5, 1.0, depth * Math.min(prob, 1.2)) *
                                inkAlpha
                            for (let p = 0; p < count; p++) {
                                if (pIdx >= maxPoints) break
                                const px = cx + Math.random() * cellSize,
                                    pz = cz + Math.random() * cellSize
                                positions[pIdx * 3] = px
                                positions[pIdx * 3 + 1] = getTerrainData(
                                    px,
                                    pz,
                                    xc
                                ).h
                                positions[pIdx * 3 + 2] = pz
                                sizes[pIdx] = sizeBase
                                alphas[pIdx] = alphaBase
                                ridges[pIdx] = tRidge
                                pIdx++
                            }
                        } else {
                            const farFactor = smoothstepF(-100.0, -1000.0, cz),
                                isPeak = smoothstepF(100.0, 500.0, th)
                            // ink spread across the WHOLE mountain body, not
                            // pinned to the ridge line. A low tRidge exponent
                            // keeps the crest a touch denser while letting the
                            // ink fall off gradually down the slopes — so peaks
                            // read as soft masses, not dark wires/points.
                            // ridge carries more ink than before: a lower
                            // exponent broadens the crest's dense band and a
                            // higher weight packs more grains onto the spine, so
                            // the 山脊 reads as a concentrated ink mass (owner
                            // 2026-07-08). Still × depth below, so far ranges
                            // stay a pale wash — no dark wire at the horizon.
                            let probStructure =
                                Math.pow(tRidge, 1.45) * 3.2 + shadow * 1.2
                            probStructure *= 0.5 + 0.5 * tCm
                            probStructure *=
                                mixF(0.3, 1.1, depth) *
                                mixF(0.55, 1.0, smoothstepF(-260, 220, th))
                            probStructure *= 1.0 + farFactor * isPeak * 3.0
                            count = Math.min(
                                Math.floor(probStructure * density * inkCount),
                                qualityTier === 0
                                    ? 6
                                    : qualityTier === 1
                                      ? 18
                                      : 26
                            )
                            let sBase =
                                mixF(1.2, 3.6, depth) +
                                shadow * 2.0 +
                                Math.pow(tRidge, 1.7) * 1.0
                            if (farFactor > 0.1)
                                sBase += 10.0 * farFactor * isPeak
                            // ridge a bit darker than the slopes, but a gentle
                            // exponent keeps the transition broad (no 1px black
                            // crest wire); distant peaks stay misty, not bold
                            let aBase =
                                mixF(0.44, 1.0, depth) *
                                (0.72 + 0.28 * tCm) *
                                mixF(0.9, 1.0, shadow) *
                                // crest darkening fades with distance: near
                                // ridges keep their ink bones, far ranges melt
                                // into a pale wash so no dark wire floats at the
                                // horizon
                                (1.0 + Math.pow(tRidge, 1.5) * 1.18 * depth)
                            if (farFactor > 0.1)
                                aBase += 0.55 * farFactor * isPeak
                            for (let p = 0; p < count; p++) {
                                if (pIdx >= maxPoints) break
                                const sid =
                                    (Math.floor(tx / 18) +
                                        Math.floor(tz / 18) * 911) *
                                        37.1 +
                                    p * 13.7
                                const px = cx + hash(sid * 1.3) * cellSize,
                                    pz = cz + hash(sid * 7.9) * cellSize
                                positions[pIdx * 3] = px
                                positions[pIdx * 3 + 1] = getTerrainData(
                                    px,
                                    pz,
                                    xc
                                ).h
                                positions[pIdx * 3 + 2] = pz
                                sizes[pIdx] = sBase
                                alphas[pIdx] = clampF(
                                    aBase * inkAlpha,
                                    0.05,
                                    1.0
                                )
                                ridges[pIdx] = tRidge
                                pIdx++
                            }
                            // — 点苔 ——————————————————————————————
                            // Ink-painters punctuate a ridge with bold dark
                            // moss dabs — but only on the NEAR mountains: 近点
                            // 远无. A depth gate keeps far peaks clean (a stray
                            // dark dot on a distant ridge just reads as a speck),
                            // while the nearest ridges carry visible, deliberate
                            // dabs. Same geometry/shader as the mountain, so they
                            // scatter and collapse right along with it.
                            const nearGate = smoothstepF(0.3, 0.58, depth)
                            const mStep = Math.max(44, cellSize * 2.4)
                            const onGridX =
                                Math.abs(tx - Math.round(tx / mStep) * mStep) <
                                cellSize * 0.5
                            const onGridZ =
                                Math.abs(tz - Math.round(tz / mStep) * mStep) <
                                cellSize * 0.5
                            if (onGridX && onGridZ) {
                                const bx = Math.round(tx / mStep),
                                    bz = Math.round(tz / mStep)
                                const g = hash(bx * 73.7 + bz * 191.3)
                                const onSpine = Math.pow(tRidge, 2.4)
                                const onCrest = smoothstepF(-120, 240, th)
                                const lit =
                                    1.0 -
                                    smoothstepF(-0.1, 0.5, dotLight) * 0.35
                                const mossProb =
                                    onSpine * onCrest * lit * nearGate * tCm
                                if (
                                    g < mossProb * 1.35 * inkCount &&
                                    pIdx < maxPoints
                                ) {
                                    const dots = qualityTier === 1 ? 5 : 8
                                    const cxm =
                                        tx + (hash(g * 3.1) - 0.5) * cellSize
                                    const czm =
                                        tz + (hash(g * 9.7) - 0.5) * cellSize
                                    // near peaks only, so the dab can be bold &
                                    // tight — a deliberate moss point — while
                                    // still sitting ON the slope, not poking up
                                    const spread = mixF(6.0, 9.0, depth)
                                    for (let m = 0; m < dots; m++) {
                                        if (pIdx >= maxPoints) break
                                        const mx =
                                            cxm +
                                            (hash(g * 13.3 + m * 2.1) - 0.5) *
                                                spread
                                        const mz =
                                            czm +
                                            (hash(g * 29.1 + m * 1.7) - 0.5) *
                                                spread
                                        positions[pIdx * 3] = mx
                                        positions[pIdx * 3 + 1] =
                                            getTerrainData(mx, mz, xc).h - 1.0
                                        positions[pIdx * 3 + 2] = mz
                                        // bold on the near peaks so the dab
                                        // clearly registers as 点苔, tapering
                                        // with depth and narrow viewports
                                        sizes[pIdx] =
                                            mixF(5.0, 10.5, depth) *
                                            (0.85 + 0.45 * hash(g * 5.5 + m)) *
                                            (0.6 + 0.4 * inkCount)
                                        alphas[pIdx] = clampF(
                                            (0.92 + 0.08 * hash(g * 7.7 + m)) *
                                                inkAlpha,
                                            0.05,
                                            1.0
                                        )
                                        ridges[pIdx] = 1.0
                                        pIdx++
                                    }
                                }
                            }
                        }
                    }

                    // 🌟 极速生成，不再渲染任何 Loading 界面，仅仅是防止主线程卡死
                    if (performance.now() - lastYield > yieldInterval) {
                        await new Promise((r) => requestAnimationFrame(r))
                        if (!isMounted || myToken !== mtnBuildToken) return null
                        lastYield = performance.now()
                    }
                }

                if (!isMounted || myToken !== mtnBuildToken) return null

                const geo = new THREE.BufferGeometry()
                geo.setAttribute(
                    "position",
                    new THREE.BufferAttribute(positions.slice(0, pIdx * 3), 3)
                )
                geo.setAttribute(
                    "aSize",
                    new THREE.BufferAttribute(sizes.slice(0, pIdx), 1)
                )
                geo.setAttribute(
                    "aAlpha",
                    new THREE.BufferAttribute(alphas.slice(0, pIdx), 1)
                )
                geo.setAttribute(
                    "aRidge",
                    new THREE.BufferAttribute(ridges.slice(0, pIdx), 1)
                )

                return geo
                }

                const geo = await buildMountainGeometry(containerW)
                if (!geo || !isMounted) return
                lastBuiltW = containerW

                mountainMat = new THREE.ShaderMaterial({
                    vertexShader: mountainVert,
                    fragmentShader: mountainFrag,
                    uniforms: {
                        uTime: { value: 0 },
                        uColor: { value: new THREE.Color(0x1c1c1c) },
                        uScroll: { value: 0 },
                        uVelocity: { value: 0 },
                        uMouse: { value: new THREE.Vector2(0, 0) },
                        uMouseVel: { value: new THREE.Vector2(0, 0) },
                        uMouseActive: { value: 0 },
                        uFlatMode: { value: 0.0 }, // mobile handled by early return above
                        uFlow: { value: null },
                    },
                    transparent: true,
                    blending: THREE.NormalBlending,
                    depthWrite: false,
                })
                mountain = new THREE.Points(geo, mountainMat)
                mountain.renderOrder = 30
                mountain.frustumCulled = false
                scene.add(mountain)

                // Debounced field rebuild on resize (called by handleResize).
                // Fires only after the drag settles; an in-flight build is
                // cancelled via the token, and the swap disposes the old buffers.
                scheduleMountainRebuild = (w: number) => {
                    if (mtnRebuildTimer) clearTimeout(mtnRebuildTimer)
                    mtnRebuildTimer = window.setTimeout(async () => {
                        if (!isMounted || !mountain) return
                        if (Math.abs(w - lastBuiltW) < 80) return
                        const newGeo = await buildMountainGeometry(w)
                        if (!newGeo || !isMounted || !mountain) {
                            if (newGeo) newGeo.dispose()
                            return
                        }
                        const oldGeo = mountain.geometry
                        mountain.geometry = newGeo
                        oldGeo.dispose()
                        lastBuiltW = w
                    }, 380)
                }

                // — Flowmap (流场) ————————————————————————————————————
                // a low-res velocity field the cursor stirs; it dissipates each
                // frame, and the mountain samples it to drift like fluid
                {
                    const fw = 220
                    const fh = Math.max(
                        120,
                        Math.round((fw * window.innerHeight) / containerW)
                    )
                    const rtOpts = {
                        type: THREE.HalfFloatType,
                        depthBuffer: false,
                        stencilBuffer: false,
                    }
                    flowRTa = new THREE.WebGLRenderTarget(fw, fh, rtOpts)
                    flowRTb = new THREE.WebGLRenderTarget(fw, fh, rtOpts)
                    flowMat = new THREE.ShaderMaterial({
                        vertexShader: flowVert,
                        fragmentShader: flowFrag,
                        uniforms: {
                            tPrev: { value: null },
                            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                            uVel: { value: new THREE.Vector2(0, 0) },
                            uAspect: { value: fw / fh },
                            uFalloff: { value: 0.0011 },
                            uDissipation: { value: 0.965 },
                        },
                        depthTest: false,
                        depthWrite: false,
                    })
                    flowScene = new THREE.Scene()
                    flowScene.add(
                        new THREE.Mesh(new THREE.PlaneGeometry(2, 2), flowMat)
                    )
                    flowCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

                    // mist layer — procedural ink-cloud, UVs warped by the flow
                    mistMat = new THREE.ShaderMaterial({
                        vertexShader: flowVert,
                        fragmentShader: mistFrag,
                        uniforms: {
                            uFlow: { value: null },
                            uTime: { value: 0 },
                            uColor: { value: new THREE.Color(0x1c1c1c) },
                            uOpacity: { value: 0.34 },
                            uDistort: { value: 0.22 },
                            uAspect: { value: containerW / window.innerHeight },
                        },
                        transparent: true,
                        depthTest: false,
                        depthWrite: false,
                    })
                    mistScene = new THREE.Scene()
                    mistScene.add(
                        new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mistMat)
                    )
                    mistCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
                }

                // — Star field ——————————————————————————————————————
                const starCount =
                    qualityTier === 1
                        ? Math.round(700 * pixelAreaRatio)
                        : Math.round(1400 * pixelAreaRatio)
                const starPos = new Float32Array(starCount * 3)
                const starSizes = new Float32Array(starCount)
                const starPhases = new Float32Array(starCount)
                // 相机最终位置: Z=1940, Y=360；stars 中心对齐头像屏幕位置
                const targetCamZ = 1940,
                    targetCamY = 360
                const aspect = containerW / window.innerHeight
                for (let i = 0; i < starCount; i++) {
                    const z = -100 - Math.random() * 1800
                    const depth = targetCamZ - z
                    const halfH = depth * 0.5095
                    const halfW = halfH * aspect
                    const ndcY = (Math.random() - 0.5) * 2.6
                    const ndcX = (Math.random() - 0.5) * 2.6
                    starPos[i * 3] = ndcX * halfW
                    starPos[i * 3 + 1] = targetCamY + ndcY * halfH
                    starPos[i * 3 + 2] = z
                    starSizes[i] =
                        Math.random() < 0.75
                            ? 1.5 + Math.random() * 2.0
                            : 3.5 + Math.random() * 3.0
                    starPhases[i] = Math.random() * 6.2831
                }
                const starGeo = new THREE.BufferGeometry()
                starGeo.setAttribute(
                    "position",
                    new THREE.BufferAttribute(starPos, 3)
                )
                starGeo.setAttribute(
                    "aSize",
                    new THREE.BufferAttribute(starSizes, 1)
                )
                starGeo.setAttribute(
                    "aPhase",
                    new THREE.BufferAttribute(starPhases, 1)
                )
                const starMat = new THREE.ShaderMaterial({
                    vertexShader: starVert,
                    fragmentShader: starFrag,
                    uniforms: {
                        uTime: { value: 0 },
                        uScroll: { value: 0 },
                        uMouse: { value: new THREE.Vector2(0, 0) },
                        uMouseActive: { value: 0 },
                    },
                    transparent: true,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                })
                starMesh = new THREE.Points(starGeo, starMat)
                starMesh.renderOrder = 40
                starMesh.frustumCulled = false
                scene.add(starMesh)
                // ——————————————————————————————————————————————————

                const flockCount =
                        qualityTier === 0 ? 0 : qualityTier === 1 ? 2 : 3,
                    birdsPerFlock = 15,
                    totalBirds = flockCount * birdsPerFlock
                const bPos = new Float32Array(totalBirds * 3),
                    bSize = new Float32Array(totalBirds)
                for (let f = 0; f < flockCount; f++) {
                    const flockZ = -500 - Math.random() * 1500,
                        flockY = 300 + Math.random() * 400
                    const flockSpeed = 0.8 + Math.random() * 0.5,
                        // first flock starts in-frame so birds are visible at
                        // load; later flocks stream in from the left
                        startXOffset = f * 3200
                    for (let b = 0; b < birdsPerFlock; b++) {
                        const offsetX = b * (30 + Math.random() * 20),
                            offsetZ =
                                (Math.random() - 0.5) * 150 * (b * 0.1 + 1)
                        // bigger so they read at distance (was 15 + rand*10)
                        bSize[f * birdsPerFlock + b] = 38 + Math.random() * 24
                        birdData.push({
                            baseX: -200 - startXOffset + offsetX,
                            baseY: flockY + (Math.random() - 0.5) * 50,
                            baseZ: flockZ + offsetZ,
                            speed: flockSpeed,
                            scatterVX: 0,
                            scatterVY: 0,
                            scatterVZ: 0,
                            scatterX: 0,
                            scatterY: 0,
                            scatterZ: 0,
                        })
                    }
                }
                birdGeo = new THREE.BufferGeometry()
                if (totalBirds > 0) {
                    birdGeo.setAttribute(
                        "position",
                        new THREE.BufferAttribute(bPos, 3).setUsage(
                            THREE.DynamicDrawUsage
                        )
                    )
                    birdGeo.setAttribute(
                        "aSize",
                        new THREE.BufferAttribute(bSize, 1)
                    )
                }

                const birdMat = new THREE.ShaderMaterial({
                    vertexShader: birdVert,
                    fragmentShader: birdFrag,
                    uniforms: {
                        uColor: { value: new THREE.Color(0x111111) },
                        uTime: { value: 0 },
                        uScroll: { value: 0 },
                        uMouse: { value: new THREE.Vector2(0, 0) },
                        uMouseActive: { value: 0 },
                    },
                    transparent: true,
                    depthWrite: false,
                })
                birdMesh = new THREE.Points(birdGeo, birdMat)
                birdMesh.renderOrder = 90
                birdMesh.frustumCulled = false
                scene.add(birdMesh)

                // 生成完毕，显示画布并触发文字入场
                if (mountRef.current) mountRef.current.style.opacity = "1"
                sceneReadyRef.current = true
                tryReveal()

                cleanupAnimation = startAnimation(
                    scene,
                    camera,
                    renderer,
                    mountainMat,
                    mountain,
                    birdMesh,
                    birdGeo,
                    birdData,
                    () =>
                        isCanvas
                            ? (scrollDemoRef.current ?? 0) > 0
                                ? (scrollDemoRef.current ?? 0)
                                : scrollForAnimation.current
                            : scrollForAnimation.current,
                    () => isSceneVisible,
                    () =>
                        // cloud-piercing spotlight active through both the white
                        // (day) and black (night) phases, until the collapse
                        enableMouseSpotlight && scrollProgress < 0.52
                            ? mouseActive
                            : 0,
                    qualityTier,
                    false, // forceVisible: use IO — pauses WebGL when component exits viewport
                    () => isCanvas,
                    backgroundRef.current,
                    starMat
                )
                if (!isMounted) {
                    cleanupAnimation()
                    cleanupAnimation = undefined
                }
            } catch (e) {
                console.error("Three.js Error:", e)
            }
        }

        function startAnimation(
            sceneArg: any,
            cameraArg: any,
            rendererArg: any,
            mountainMatArg: any,
            mountainMeshArg: any,
            birdMeshArg: any,
            birdGeoArg: any,
            birdDataArg: BirdDatum[],
            getScroll: () => number,
            getVisible: () => boolean,
            getMouseActive: () => number,
            qualityTierArg: number,
            forceVisible: boolean,
            getIsDemo: () => boolean,
            backgroundEl: HTMLElement | null,
            starMatArg: any
        ): () => void {
            const baseFogColor = new THREE.Color(0xffffff)
            const targetFogColor = new THREE.Color(0x000000) // pure black — 水墨夜
            let lastTime = performance.now()
            let lastRenderTime = 0
            let lastFogScroll = -1
            let smoothScroll = 0
            let scrollSpring = 0
            let flowEnergy = 0.01
            const scatterRadius = 0.4,
                scatterForce = 80,
                scatterDamping = 0.92,
                returnForce = 0.035,
                maxScatter = 120,
                maxVelocity = 8
            const scatterRadiusSq = scatterRadius * scatterRadius
            const maxScatterSq = maxScatter * maxScatter
            const maxVelocitySq = maxVelocity * maxVelocity
            const projVec = new THREE.Vector4(),
                vpMatrix = new THREE.Matrix4()

            // ── Adaptive pixelRatio ────────────────────────────────────────
            // If the device can't hold pace in the heavy mountain zone, step the
            // pixelRatio down (fill cost ∝ DPR²) — the cheapest real-time lever.
            // Downgrade-only (never upgrades → no oscillation/flicker). Free on
            // capable GPUs: they never miss the budget, so it never fires.
            let curPR = rendererArg.getPixelRatio()
            const minPR = Math.max(0.5, curPR * 0.5)
            const adaptCapMs =
                qualityTierArg >= 2
                    ? 1000 / 60
                    : qualityTierArg === 1
                      ? 1000 / 45
                      : 1000 / 30
            const slowMs = adaptCapMs * 1.7 // sustained slower than this = struggling
            let slowAccum = 0
            let adaptCooldown = 0

            // ── Visibility / pause system ──────────────────────────────────
            let isRunning = false
            let isPageVisible =
                !document.hidden && document.visibilityState === "visible"
            let isInViewport = true // optimistic start; IO will pause if out of view

            const updateState = () => {
                const shouldRun = isPageVisible && isInViewport
                if (shouldRun === isRunning) return
                isRunning = shouldRun
                if (isRunning) {
                    lastTime = performance.now()
                    animationFrameId = requestAnimationFrame(animate)
                } else {
                    cancelAnimationFrame(animationFrameId)
                    animationFrameId = 0
                }
            }
            // returning to the tab: don't trust the old RAF state — a hidden
            // tab can kill the loop silently (GPU context loss, throttling),
            // leaving isRunning=true with no live frame callback
            const hardRekick = () => {
                cancelAnimationFrame(animationFrameId)
                animationFrameId = 0
                isRunning = false
                updateState()
            }
            const onVisChange = () => {
                isPageVisible =
                    !document.hidden && document.visibilityState === "visible"
                if (isPageVisible) hardRekick()
                else updateState()
            }
            const onBlur = () => {
                isPageVisible = false
                updateState()
            }
            const onFocus = () => {
                isPageVisible =
                    !document.hidden && document.visibilityState === "visible"
                if (isPageVisible) hardRekick()
                else updateState()
            }
            const onPageHide = () => {
                isPageVisible = false
                updateState()
            }
            const onPageShow = () => {
                isPageVisible =
                    !document.hidden && document.visibilityState === "visible"
                updateState()
            }
            document.addEventListener("visibilitychange", onVisChange)
            window.addEventListener("blur", onBlur, { passive: true })
            window.addEventListener("focus", onFocus, { passive: true })
            window.addEventListener("pagehide", onPageHide, { passive: true })
            window.addEventListener("pageshow", onPageShow, { passive: true })

            // background tabs can lose the WebGL context entirely; without
            // preventDefault the browser never restores it → blank hero
            const canvasEl = rendererArg.domElement as HTMLCanvasElement
            const onCtxLost = (e: Event) => {
                e.preventDefault()
            }
            const onCtxRestored = () => {
                hardRekick()
            }
            canvasEl.addEventListener("webglcontextlost", onCtxLost)
            canvasEl.addEventListener("webglcontextrestored", onCtxRestored)

            // watchdog: if the loop should be running but hasn't ticked in
            // 3s (silent death of any kind), restart it
            const watchdogId = window.setInterval(() => {
                if (!isPageVisible || !isInViewport || !getVisible()) return
                if (performance.now() - lastTime > 3000) hardRekick()
            }, 2500)

            let io: IntersectionObserver | null = null
            if (
                !forceVisible &&
                "IntersectionObserver" in window &&
                backgroundEl
            ) {
                io = new IntersectionObserver(
                    (entries) => {
                        isInViewport = !!entries[0] && entries[0].isIntersecting
                        updateState()
                    },
                    { threshold: 0 }
                )
                io.observe(backgroundEl)
            }
            const ensureRunning = () => {
                if (!getVisible()) return
                updateState()
            }
            resumeSceneAnimation = ensureRunning
            // Pre-compile shaders before first render — eliminates first-frame GPU compile stutter
            renderer.compile(scene, camera)
            // Start immediately — IO will pause if scrolled out of view
            updateState()
            // ──────────────────────────────────────────────────────────────

            function animate() {
                if (!isRunning) return
                // Check scroll-based visibility BEFORE scheduling — stops RAF entirely
                // past 320vh instead of looping with early returns every frame.
                // The IO (enabled by forceVisible:false) will restart via updateState().
                if (!getVisible()) {
                    isRunning = false
                    animationFrameId = 0
                    return
                }
                animationFrameId = requestAnimationFrame(animate)
                const now = performance.now()
                const dt = Math.min(0.033, (now - lastTime) / 1000)
                lastTime = now
                const scrollNow = getScroll()
                // Frame-rate independent spring: stable on 60/120/144Hz panels.
                const fpsRatio = Math.min(dt / 0.01666, 3.0)
                if (getIsDemo()) {
                    smoothScroll = scrollNow
                    scrollSpring = 0
                } else {
                    scrollSpring +=
                        (scrollNow - smoothScroll) * (0.14 * fpsRatio)
                    scrollSpring *= Math.pow(0.3, fpsRatio)
                    smoothScroll = Math.min(
                        Math.max(smoothScroll + scrollSpring, 0),
                        1
                    )
                }
                const sceneTransitionScroll = smoothScroll
                const velMag = Math.min(Math.abs(scrollSpring) * 30, 1.0)

                // Throttle to ~30fps during the dark reading zone (scroll > 72%)
                if (
                    scrollNow > 0.72 &&
                    scrollNow < 0.95 &&
                    now - lastRenderTime < 33
                )
                    return
                // Cap even high-end GPUs. On 144Hz+ panels, uncapped WebGL
                // burns frames the page cannot visually use and can make Chrome
                // feel sticky while compositing.
                const fpsCap =
                    qualityTierArg >= 2 ? 1000 / 60 :
                    qualityTierArg === 1 ? 1000 / 45 :
                    1000 / 30
                if (fpsCap > 0 && now - lastRenderTime < fpsCap) return
                const interRender = now - lastRenderTime
                lastRenderTime = now
                // Sample only in the heavy mountain zone (scroll < 0.6); the
                // dark-reading zone is throttled to 30fps on purpose, which would
                // otherwise read as "struggling". Ignore >1.5s gaps (tab-return).
                if (curPR > minPR && scrollNow < 0.6 && adaptCooldown <= 0) {
                    if (interRender > slowMs && interRender < 1500) {
                        if (++slowAccum >= 14) {
                            curPR = Math.max(minPR, curPR * 0.82)
                            rendererArg.setPixelRatio(curPR)
                            slowAccum = 0
                            adaptCooldown = 30 // settle before re-measuring
                        }
                    } else if (interRender <= slowMs) {
                        slowAccum = slowAccum > 0 ? slowAccum - 1 : 0
                    }
                } else if (adaptCooldown > 0) {
                    adaptCooldown--
                }
                const t = now * 0.001

                const activeMouse =
                    enableMouseSpotlight && getMouseActive() > 0.5 ? 1 : 0
                // smoothed cursor velocity (NDC delta), eased so it builds while
                // sliding and decays to 0 the moment the cursor stops
                mouseVel.x += (mouseNDC.x - prevMouseNDC.x - mouseVel.x) * 0.35
                mouseVel.y += (mouseNDC.y - prevMouseNDC.y - mouseVel.y) * 0.35
                prevMouseNDC.x = mouseNDC.x
                prevMouseNDC.y = mouseNDC.y
                // 山粒子 alphaFade 在 scroll=0.75 全部归零 — 提前隐藏 mesh 跳过 GPU vertex shader
                const mountainFullyGone = sceneTransitionScroll >= 0.94
                if (mountainMeshArg.visible === mountainFullyGone) {
                    mountainMeshArg.visible = !mountainFullyGone
                }
                if (!mountainFullyGone) {
                    mountainMatArg.uniforms.uTime.value = t
                    mountainMatArg.uniforms.uScroll.value =
                        sceneTransitionScroll
                    mountainMatArg.uniforms.uVelocity.value = velMag
                    mountainMatArg.uniforms.uMouse.value.set(
                        mouseNDC.x,
                        mouseNDC.y
                    )
                    mountainMatArg.uniforms.uMouseVel.value.set(
                        mouseVel.x,
                        mouseVel.y
                    )
                    mountainMatArg.uniforms.uMouseActive.value = activeMouse
                }
                starMatArg.uniforms.uTime.value = t
                starMatArg.uniforms.uScroll.value = sceneTransitionScroll
                starMatArg.uniforms.uMouse.value.set(mouseNDC.x, mouseNDC.y)
                starMatArg.uniforms.uMouseActive.value = activeMouse

                const active = activeMouse > 0.5
                if (active) {
                    vpMatrix.multiplyMatrices(
                        cameraArg.projectionMatrix,
                        cameraArg.matrixWorldInverse
                    )
                }

                // Birds fly through the night and only dissolve as the mountain
                // disperses (~0.92) — skip CPU physics + GPU upload after that
                const birdsGone =
                    birdDataArg.length === 0 || sceneTransitionScroll >= 0.92
                if (birdMeshArg.visible === birdsGone)
                    birdMeshArg.visible = !birdsGone
                if (!birdsGone) {
                    const posArr = birdGeoArg.attributes.position
                        .array as Float32Array
                    for (let i = 0; i < birdDataArg.length; i++) {
                        const i3 = i * 3
                        const d = birdDataArg[i]
                        d.baseX += d.speed * dt * 60.0
                        if (d.baseX > 2500)
                            d.baseX = -2800 - Math.random() * 2200

                        if (qualityTierArg >= 1 && active) {
                            const bx = d.baseX + d.scatterX,
                                by = d.baseY + d.scatterY,
                                bz = d.baseZ + d.scatterZ
                            projVec.set(bx, by, bz, 1.0).applyMatrix4(vpMatrix)
                            if (projVec.w > 0) {
                                const ndcX = projVec.x / projVec.w,
                                    ndcY = projVec.y / projVec.w
                                const sdx = ndcX - mouseNDC.x,
                                    sdy = ndcY - mouseNDC.y
                                const screenDistSq = sdx * sdx + sdy * sdy
                                if (screenDistSq < scatterRadiusSq) {
                                    const screenDist = Math.sqrt(screenDistSq)
                                    const ndcLen = screenDist || 0.001
                                    const dirX = sdx / ndcLen,
                                        dirY = sdy / ndcLen
                                    const proximity =
                                        1.0 - screenDist / scatterRadius
                                    const strength =
                                        scatterForce *
                                        proximity *
                                        proximity *
                                        dt
                                    d.scatterVX += dirX * strength * 1.5
                                    d.scatterVY +=
                                        dirY * strength * 1.2 + strength * 0.2
                                    d.scatterVZ +=
                                        (Math.random() - 0.5) * strength * 0.4
                                }
                            }
                        }
                        d.scatterVX *= scatterDamping
                        d.scatterVY *= scatterDamping
                        d.scatterVZ *= scatterDamping
                        const velSq =
                            d.scatterVX * d.scatterVX +
                            d.scatterVY * d.scatterVY +
                            d.scatterVZ * d.scatterVZ
                        if (velSq > maxVelocitySq) {
                            const vel = Math.sqrt(velSq)
                            const s = maxVelocity / vel
                            d.scatterVX *= s
                            d.scatterVY *= s
                            d.scatterVZ *= s
                        }
                        d.scatterVX -= d.scatterX * returnForce
                        d.scatterVY -= d.scatterY * returnForce
                        d.scatterVZ -= d.scatterZ * returnForce
                        d.scatterX += d.scatterVX
                        d.scatterY += d.scatterVY
                        d.scatterZ += d.scatterVZ
                        const dispSq =
                            d.scatterX * d.scatterX +
                            d.scatterY * d.scatterY +
                            d.scatterZ * d.scatterZ
                        if (dispSq > maxScatterSq) {
                            const disp = Math.sqrt(dispSq)
                            const cs = maxScatter / disp
                            d.scatterX *= cs
                            d.scatterY *= cs
                            d.scatterZ *= cs
                            d.scatterVX *= 0.5
                            d.scatterVY *= 0.5
                            d.scatterVZ *= 0.5
                        }
                        posArr[i3] = d.baseX + d.scatterX
                        posArr[i3 + 1] = d.baseY + d.scatterY
                        posArr[i3 + 2] = d.baseZ + d.scatterZ
                    }
                    birdGeoArg.attributes.position.needsUpdate = true
                    birdMeshArg.material.uniforms.uTime.value = t
                    birdMeshArg.material.uniforms.uScroll.value =
                        sceneTransitionScroll
                    birdMeshArg.material.uniforms.uMouse.value.set(
                        mouseNDC.x,
                        mouseNDC.y
                    )
                    birdMeshArg.material.uniforms.uMouseActive.value =
                        activeMouse
                } // end if (!birdsGone)
                if (Math.abs(sceneTransitionScroll - lastFogScroll) > 0.004) {
                    sceneArg.fog.color
                        .copy(baseFogColor)
                        .lerp(
                            targetFogColor,
                            smoothstepF(0.45, 0.70, sceneTransitionScroll)
                        )
                    lastFogScroll = sceneTransitionScroll
                }

                // Cinematic camera: mouse parallax tilt only through the day scene
                // and the black/white flip (camera held still — no movement during
                // the inversion), then a slight rise once the collapse begins.
                // camera fully still through the whole hero — no dolly and no
                // vertical lift (the lift made the scene appear to sink while the
                // mountain was dispersing)
                const targetZ = 2200
                const targetY = 200
                const targetX = scrollNow < 0.10 ? mouseNDC.x * 38 : 0
                cameraArg.position.x += (targetX - cameraArg.position.x) * 0.04
                cameraArg.position.y += (targetY - cameraArg.position.y) * 0.055
                cameraArg.position.z += (targetZ - cameraArg.position.z) * 0.055

                // 流场更新 — stir the velocity field with the cursor, dissipate,
                // ping-pong, then hand the current field to the mountain shader
                if (activeMouse) {
                    flowEnergy = Math.min(
                        1,
                        flowEnergy +
                            Math.min(
                                0.35,
                                Math.hypot(mouseVel.x, mouseVel.y) * 8 + 0.02
                            )
                    )
                } else {
                    flowEnergy *= 0.92
                    if (flowEnergy < 0.002) flowEnergy = 0
                }

                if (
                    flowEnergy > 0 &&
                    flowRTa &&
                    flowRTb &&
                    flowMat &&
                    flowScene &&
                    flowCam
                ) {
                    flowMat.uniforms.tPrev.value = flowRTa.texture
                    flowMat.uniforms.uMouse.value.set(
                        mouseNDC.x * 0.5 + 0.5,
                        mouseNDC.y * 0.5 + 0.5
                    )
                    flowMat.uniforms.uVel.value.set(
                        activeMouse ? mouseVel.x * 5 : 0,
                        activeMouse ? mouseVel.y * 5 : 0
                    )
                    rendererArg.setRenderTarget(flowRTb)
                    rendererArg.render(flowScene, flowCam)
                    rendererArg.setRenderTarget(null)
                    const tmp = flowRTa
                    flowRTa = flowRTb
                    flowRTb = tmp
                    if (mountainMatArg.uniforms.uFlow)
                        mountainMatArg.uniforms.uFlow.value = flowRTa.texture
                }

                rendererArg.render(sceneArg, cameraArg)
                // (procedural mist layer removed — it read as a muddy smudge;
                //  the flowmap stays, ready for a real ink-mist texture later)
            }

            return () => {
                cancelAnimationFrame(animationFrameId)
                animationFrameId = 0
                document.removeEventListener("visibilitychange", onVisChange)
                window.removeEventListener("blur", onBlur)
                window.removeEventListener("focus", onFocus)
                window.removeEventListener("pagehide", onPageHide)
                window.removeEventListener("pageshow", onPageShow)
                canvasEl.removeEventListener("webglcontextlost", onCtxLost)
                canvasEl.removeEventListener("webglcontextrestored", onCtxRestored)
                window.clearInterval(watchdogId)
                io?.disconnect()
                if (resumeSceneAnimation === ensureRunning) {
                    resumeSceneAnimation = null
                }
            }
        }

        let resizeRaf = 0
        let scheduleMountainRebuild: ((w: number) => void) | null = null
        const handleResize = () => {
            if (resizeRaf) return
            resizeRaf = requestAnimationFrame(() => {
                resizeRaf = 0
                winHeight = window.innerHeight
                winWidth = window.innerWidth
                if (!camera || !renderer) return
                const containerW = mountRef.current?.offsetWidth || winWidth
                camera.aspect = containerW / winHeight
                camera.fov = fovForAspect(camera.aspect)
                camera.updateProjectionMatrix()
                renderer.setSize(containerW, winHeight)
                scheduleMountainRebuild?.(containerW)
            })
        }

        window.addEventListener("resize", handleResize, { passive: true })
        init3D()

        return () => {
            isMounted = false
            document.body.classList.remove("hero-night")
            cancelAnimationFrame(scrollPollRaf)
            unsubLenis?.()
            lenisDetach?.()
            document.removeEventListener("scroll", onScrollRaf, {
                capture: true,
            })
            document.removeEventListener("visibilitychange", resumeScrollPoll)
            window.removeEventListener("focus", resumeScrollPoll)
            pollIO?.disconnect()
            if (enableMouseSpotlight) {
                window.removeEventListener("mousemove", handleMouseMove)
                window.removeEventListener("mouseleave", handleMouseLeave)
            }
            window.removeEventListener("loaderFinished", onLoaderDone)
            window.removeEventListener("resize", handleResize)
            if (resizeRaf) cancelAnimationFrame(resizeRaf)
            cancelAnimationFrame(animationFrameId)
            cleanupAnimation?.()
            // mountRef.current is already null during unmount cleanup (React
            // detaches refs first) — remove via the canvas itself, or stale
            // canvases pile up in the mount and push the live one out of view
            renderer?.domElement?.remove()
            mountain?.geometry.dispose()
            mountain?.material.dispose()
            flowRTa?.dispose()
            flowRTb?.dispose()
            flowMat?.dispose()
            mistMat?.dispose()
            starMesh?.geometry.dispose()
            ;(starMesh?.material as THREE.ShaderMaterial | undefined)?.dispose()
            birdMesh?.geometry.dispose()
            birdMesh?.material.dispose()
            renderer?.dispose()
            window.removeEventListener("loaderFinished", revealAfterLoader)
            if (loaderRevealFallback) window.clearTimeout(loaderRevealFallback)
        }
    }, [enableMouseSpotlight, isCanvas, liteMode])

    return (
        <div
            ref={backgroundRef}
            data-hero-bg
            style={{
                width: "100%",
                // live: hero+page2 flow = 300vh − 911px (measured at viewport
                // heights 1000 and 750; only coincides with 209vh at 1000)
                position: "relative",
                minHeight: "calc(300vh - 911px)",
                backgroundColor: "#FFFFFF",
            }}
        >
            <style
                dangerouslySetInnerHTML={{
                    __html: stripCssComments(`
            *, *::before, *::after { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; box-sizing: border-box; }
            
            .noise-overlay {
                position: absolute; inset: 0; z-index: 10; pointer-events: none;
                background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
                opacity: 0.05; 
            }

            /* ── Page 1 hero text — the wordmark itself now lives in the
               <Wordmark/> component (SVG); only the scroll hint / side
               inscription styles remain below. ── */
            .framer-xy-sub {
                font-family: var(--font-sans);
                font-size: var(--text-meta); color: #707070; letter-spacing: 0.01em; line-height: 1.6; max-width: 360px; font-weight: 300; white-space: pre-line;
                margin-top: 28px;
                opacity: 0; transform: translateY(7px); filter: blur(4px);
                will-change: transform, opacity, filter;
            }
            .scene-loaded .framer-xy-sub { animation: appleRevealSub 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards; }

            @keyframes appleRevealSub {
                to { opacity: 1; transform: translateY(0); filter: blur(0px); }
            }

            /* Quote, scroll-hint, right vertical — gated the same way */
            .hero-quote { opacity: 0; transform: translateY(6px); filter: blur(3px); }
            .scene-loaded .hero-quote { animation: appleRevealHint 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards; }
            /* a caption, not a control (owner 2026-07-12): it names the
               gesture — the gesture itself is the interaction */
            .hero-scroll-hint { opacity: 0; transform: translateY(4px); }
            .scene-loaded .hero-scroll-hint { animation: appleRevealHint 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
            .hero-scroll-hint-rule {
                width: 40px; height: 1px; flex-shrink: 0;
                background: #888; opacity: 0.5;
            }
            @keyframes appleRevealHint {
                to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }

            /* 朱红落款印 — the site's single red accent, set against the ink */
            .hero-seal {
                width: clamp(46px, 3.3vw, 58px);
                height: clamp(46px, 3.3vw, 58px);
                background: var(--accent-red);
                color: #fff;
                border-radius: 7px;
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                font-family: var(--font-brush);
                font-size: clamp(18px, 1.5vw, 23px);
                line-height: 0.96;
                transform: rotate(-2deg);
                box-shadow: 0 5px 20px rgba(230, 0, 18, 0.18);
                opacity: 0;
                transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.7s;
            }
            .scene-loaded .hero-seal { opacity: 0.96; }
            
            /* Page 2 — centered layout, generous spacing */
            .page2-center-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                gap: 0;
                width: 100%;
                max-width: 960px;
                margin: 0 auto;
                transform: translateY(-110px);
            }
            /* short windows: the card pins near the viewport top — the big
               upward shift would clip the avatar above the screen */
            @media (max-height: 850px) {
                .page2-center-container { transform: translateY(-30px); }
            }

            /* Sky wash — 全屏氛围光晕染，真实星星由 WebGL canvas 提供 */
            .page2-sky-wash {
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 2;
                background:
                    radial-gradient(ellipse 54% 36% at 50% 42%, rgba(175, 200, 255, 0.06), transparent 62%),
                    radial-gradient(ellipse 78% 60% at 50% 48%, rgba(255,255,255,0.02), transparent 58%),
                    radial-gradient(ellipse 100% 88% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.10) 72%, rgba(0,0,0,0.28) 100%);
            }

            /* Blur→sharp rise — supporting blocks materialize out of the mist */
            .p2-fade {
                opacity: 0;
                transform: translateY(26px);
                filter: blur(8px);
                transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
                            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                            filter 0.55s ease-out;
                will-change: opacity, transform, filter;
            }
            .page2-active .p2-fade { opacity: 1; transform: translateY(0); filter: blur(0); }
            /* Avatar: springier rise + subtle scale settle. No blur — a photo
               resolving out of blur reads as a loading glitch, not intent; the
               blur→sharp materialize is reserved for the text (ink). The active
               rule below is more specific so the wrapper always settles sharp. */
            .page2-photo-wrapper.p2-fade {
                transform: translateY(30px) scale(0.94);
                filter: none;
                transition: opacity 0.5s ease-out,
                            transform 1.0s cubic-bezier(0.34, 1.4, 0.5, 1);
            }
            .page2-active .page2-photo-wrapper.p2-fade { transform: translateY(0) scale(1); filter: none; }
            .delay-1 { transition-delay: 0.00s; }
            .delay-2 { transition-delay: 0.06s; }   /* avatar */
            .delay-3 { transition-delay: 0.15s; }
            .delay-4 { transition-delay: 0.26s; }
            .delay-5 { transition-delay: 0.62s; }   /* subtitle — after title wave */
            .delay-6 { transition-delay: 0.82s; }   /* brand row */
            .delay-7 { transition-delay: 0.98s; }   /* footer */

            /* Profile sticky — padding-top pulled out of inline style for responsive control */
            .profile-sticky { padding-top: 0; }

            /* Avatar wrapper */
            .page2-photo-wrapper {
                position: relative; border-radius: 50%; margin-bottom: clamp(16px, 4vh, 44px);
                padding: 0; background: none; border: none;
                pointer-events: auto; cursor: pointer;
            }

            /* Thin ring glow — fades in on hover, gentle pulse */
            @keyframes avatarRingPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
            .page2-photo-wrapper::before {
                content: '';
                position: absolute; inset: -5px; border-radius: 50%;
                border: 1px solid rgba(255,255,255,0.28);
                box-shadow: 0 0 18px rgba(255,255,255,0.08);
                opacity: 0;
                transition: opacity 0.55s ease;
                pointer-events: none;
                z-index: 3;
            }
            .page2-photo-wrapper:hover::before {
                opacity: 1;
                animation: avatarRingPulse 2.8s ease-in-out infinite;
            }

            /* Photo — lift & glow on hover.
               Avatar and title must SHRINK TOGETHER: on short windows the old
               30vh term dropped the avatar toward 160px while the 80px title
               cap held and wrapped to two lines, so the text block outgrew the
               photo (owner report 2026-07-08). 32vh here plus the vh term on
               .page2-title keep the tuned ~3.5:1 photo-to-glyph ratio on small
               windows; at 1536×960 both still resolve to 280px / 80px. */
            .page2-photo {
                width: clamp(160px, min(28vw, 32vh), 280px); height: clamp(160px, min(28vw, 32vh), 280px);
                overflow: hidden; position: relative; border-radius: 50%;
                box-shadow: 0 16px 50px rgba(0,0,0,0.65);
                filter: grayscale(10%) contrast(1.06);
                z-index: 2;
                transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                            box-shadow 0.5s ease,
                            filter 0.5s ease;
                will-change: transform;
            }
            .page2-photo-wrapper:hover .page2-photo {
                transform: scale(1.05) translateY(-6px);
                box-shadow: 0 28px 70px rgba(0,0,0,0.82), 0 0 44px rgba(255,255,255,0.09);
                filter: grayscale(0%) contrast(1.08);
            }
            .page2-photo img { object-fit: cover !important; width: 100% !important; height: 100% !important; object-position: center !important; }
            .framer-photo-container > * { width: 100% !important; height: 100% !important; border-radius: 50% !important; }

            /* Name block — title + expanding rule + subtitle as one visual unit */
            .page2-name-block { display: flex; flex-direction: column; align-items: center; gap: 0; margin-bottom: clamp(14px, 3.5vh, 36px); }

            @keyframes titleBreath { 0%,100% { text-shadow: 0 2px 12px rgba(0,0,0,0.6); } 50% { text-shadow: 0 2px 12px rgba(0,0,0,0.6), 0 0 50px rgba(255,255,255,0.06); } }
            .page2-title {
                font-family: var(--font-sans);
                /* display-3 with a vh brake (see .page2-photo note): 9.6vh
                   only undercuts the 6.5vw/80px ladder once the window is
                   shorter than ~834px, scaling the glyphs with the avatar */
                font-size: clamp(36px, min(6.5vw, 9.6vh), 80px);
                letter-spacing: 0; line-height: 1.2;
                font-weight: 300; color: #FFFFFF; text-shadow: 0 2px 12px rgba(0,0,0,0.6);
                margin-bottom: 12px;
            }
            .page2-active .page2-title { animation: titleBreath 5s ease-in-out infinite 1.6s; }

            /* Per-character wave — each glyph rises and resolves out of blur, a
               tight cascade so the whole line reads as one kinetic sweep. Words
               stay atomic (nowrap) so wrapping only ever breaks between words. */
            .page2-word { display: inline-block; margin-right: 0.26em; white-space: nowrap; }
            .page2-char {
                display: inline-block;
                opacity: 0;
                transform: translateY(0.7em);
                filter: blur(7px);
                transition: opacity 0.5s cubic-bezier(0.2, 0.85, 0.25, 1),
                            transform 0.62s cubic-bezier(0.2, 0.9, 0.3, 1),
                            filter 0.5s ease-out;
            }
            .page2-active .page2-char { opacity: 1; transform: translateY(0); filter: blur(0); }

            /* Expanding rule beneath the name */
            .page2-name-rule {
                width: 0; height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                margin-bottom: 18px;
                transition: width 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.55s;
            }
            .page2-active .page2-name-rule { width: 280px; }

            .page2-subtitle {
                font-family: var(--font-sans);
                font-size: var(--text-lead); font-weight: 300;
                letter-spacing: 0; line-height: 1.6; color: rgba(255,255,255,0.65);
                white-space: pre-line;
                /* centered to match the rest of the card (title, rule, YES
                   line, footer are all centered); left-aligned here made the
                   subtitle the one off-center element and read as broken */
                width: min(940px, 92vw);
                text-align: center;
                margin-left: auto;
                margin-right: auto;
            }

            /* Brand row */
            .page2-brand-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: clamp(10px, 2.5vh, 24px); }
            .page2-brand-line { height: 1px; width: 36px; background: linear-gradient(90deg, rgba(255,255,255,0.22), rgba(255,255,255,0)); transform-origin: left; transform: scaleX(0); transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.82s; }
            .page2-brand-line.left { background: linear-gradient(270deg, rgba(255,255,255,0.22), rgba(255,255,255,0)); transform-origin: right; }
            .page2-active .page2-brand-line { transform: scaleX(1); }
            .scramble-text { contain: layout paint; }

            /* the closing micro-line: same treatment as the page-1 scroll hint
               (uppercase, 0.2em tracking) so the two bottom-of-page hints read as
               siblings, at a legible grey instead of the near-invisible 0.32 */
            .page2-footer { font-family: var(--font-sans); font-size: var(--text-micro); font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.56); line-height: 1.8; white-space: pre-line; }

            /* iOS viewport: dvh tracks the visible area (100vh includes the URL
               bar, so a fixed full-height canvas overflows/jumps on iOS) */
            :root { --vh100: 100dvh; }
            @supports not (height: 100dvh) { :root { --vh100: 100vh; } }

            /* ─── Bridge Section ─── */
            .bridge-panel {
                position: sticky; top: 0; width: 100%; height: var(--vh100);
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                pointer-events: none; overflow: hidden;
            }

            /* Radial moonlight glow */
            .bridge-glow {
                position: absolute; inset: 0; z-index: 1; pointer-events: none;
                background: radial-gradient(ellipse 55% 38% at 50% 52%, rgba(190,210,255,0.055), transparent);
                opacity: 0;
                transition: opacity 1.8s ease;
            }
            .bridge-active .bridge-glow { opacity: 1; }

            /* Chapter label — crossfade between 01/02 */
            .ch-02 { position: absolute; right: 0; opacity: 0; transition: opacity 0.6s ease; }
            .chapter-profile .ch-01 { opacity: 0; transition: opacity 0.6s ease; }
            .chapter-profile .ch-02 { opacity: 1; }

            @keyframes glowPulse { 0%,100% { opacity:0.7; } 50% { opacity:1; } }
            .bridge-active .bridge-glow { animation: glowPulse 6s ease-in-out infinite 2s; }

            @keyframes inkBreathe {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            @keyframes inkRise {
              0% { transform: translateY(4px); }
              100% { transform: translateY(-4px); }
            }
            .ink-far  { animation: inkBreathe 8s ease-in-out infinite; }
            .ink-mid  { animation: inkBreathe 6s ease-in-out infinite 1s, inkRise 10s ease-in-out infinite alternate; }
            .ink-near { animation: inkBreathe 5s ease-in-out infinite 0.5s; }
            .ink-fg   { animation: inkRise 12s ease-in-out infinite alternate; }

            @media (max-width: 768px) {
              /* Static star field for the phone night stretch: without WebGL
                 stars the hero→profile crossing is a full viewport of flat
                 black. Pure CSS (three tiled dot layers on the night overlay's
                 own ::after — no JS, no extra element) and it inherits the
                 overlay's scroll-driven fade, so the stars rise with the
                 night and set behind the eaves like the moon does. Painted on
                 BOTH night layers: the in-wrapper veil (z1) covers the page
                 night overlay (z0) while the hero is on screen, then the
                 wrapper hides past the scene and the overlay takes over —
                 same geometry, so the field never jumps. */
              [data-night-overlay]::after,
              [data-hero-mobile-veil]::after {
                content: "";
                position: absolute;
                inset: 0;
                background-image:
                  radial-gradient(1.3px 1.3px at 22px 34px, rgba(255,255,255,0.7), transparent 100%),
                  radial-gradient(1px 1px at 141px 189px, rgba(214,228,255,0.55), transparent 100%),
                  radial-gradient(1.6px 1.6px at 87px 118px, rgba(255,255,255,0.4), transparent 100%),
                  radial-gradient(1px 1px at 199px 66px, rgba(255,255,255,0.5), transparent 100%),
                  radial-gradient(1.2px 1.2px at 55px 226px, rgba(214,228,255,0.45), transparent 100%),
                  radial-gradient(1px 1px at 246px 152px, rgba(255,255,255,0.35), transparent 100%);
                background-size: 273px 271px, 305px 299px, 337px 331px, 361px 353px, 397px 389px, 421px 409px;
                opacity: 0.85;
              }
              /* live mobile: greeting wraps inside the viewport (one phrase per
                 row-ish), container must not exceed the screen */
              .framer-xy-hero { max-width: 86vw !important; }
              /* mobile pacing (2026-07-10 owner pass): the live-measured zone
                 (1662) made the visitor scroll ~4 screens of prelude before
                 any work showed. 1150 keeps the intro-card pin readable
                 (~300px of pinned travel) but hands the saved screen to
                 Selected Work. Desktop keeps the measured flow. */
              .hero-spacer { height: 22vh !important; }
              .profile-zone { height: 1320px !important; }
              /* the wrapper's desktop min-height (300vh − 911px) scales with
                 VIEWPORT HEIGHT and swallowed the compressed flow on tall
                 phones — a 1430px-tall screen got a 3379px prelude again
                 (owner screenshot 2026-07-10). Phones pace by the spacer+zone
                 flow alone. */
              [data-hero-bg] { min-height: 0 !important; }
              .framer-xy-hero h1 { font-size: clamp(28px, 9vw, 42px); gap: 10px; margin: 0 0 14px 0; }
              .framer-xy-sub { font-size: 13px; line-height: 1.7; }
              .hero-quote { font-size: 13px; max-width: 88vw; }
              .profile-sticky { padding-top: 8vh; }
              .page2-center-container { max-width: 92vw; transform: translateY(0); }
              .page2-sky-wash {
                  background:
                      radial-gradient(ellipse 68% 40% at 50% 36%, rgba(175, 200, 255, 0.1), transparent 62%),
                      radial-gradient(ellipse 110% 88% at 50% 46%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0.5) 100%);
              }
              .page2-tag { margin-bottom: 22px; }
              .page2-photo { width: clamp(130px, 38vw, 190px); height: clamp(130px, 38vw, 190px); }
              .page2-title { margin-bottom: 12px; }
              .page2-name-rule { margin-bottom: 12px; }
              .page2-active .page2-name-rule { width: min(72vw, 260px); }
              .page2-subtitle { line-height: 1.6; }
              .page2-brand-row { gap: 10px; }
              .page2-brand-line { width: 24px; }
              .page2-footer { line-height: 1.7; }
            }
            /* 短屏幕（横屏手机 / 小笔记本）：压缩垂直间距。头像和标题必须
               一起缩 —— 此前头像压到 20vh 而标题仍是 80px 两行，文字块反而
               比头像高（owner report 2026-07-08）。24vh/8vh ≈ 基准 280/80 的
               3:1 比例。 */
            @media (max-height: 700px) {
              .profile-sticky { padding-top: 4vh; }
              .page2-photo { width: clamp(100px, 24vh, 168px) !important; height: clamp(100px, 24vh, 168px) !important; }
              .page2-title { font-size: clamp(32px, 8vh, 56px); margin-bottom: 8px; }
              .page2-name-rule { margin-bottom: 8px; }
              .page2-subtitle { line-height: 1.5; }
            }
            @media (max-height: 560px) {
              .profile-sticky { padding-top: 1vh; }
              .page2-footer { display: none; }
            }
            @media (prefers-reduced-motion: reduce) {
                .framer-xy-hero .w, .framer-xy-sub, .hero-quote, .hero-scroll-hint, .p2-fade, .page2-char { animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
                .page2-title { animation: none !important; }
                .page2-name-rule, .page2-brand-line { transition: none !important; }
                /* the static ink fallback holds one frame — no breathe/rise */
                .ink-layer { animation: none !important; }
                /* RM hero sits on the gray ink hills, not on plain white —
                   step the bottom-left column's grays down for contrast */
                .framer-xy-sub { color: #3f3f3f; }
                .hero-quote { color: #2e2e2e !important; }
                .hero-scroll-hint { color: #2e2e2e !important; }
                .hero-scroll-hint-rule { background: #2e2e2e !important; }
            }

`),
                }}
            />

            {/* Night overlay — opacity 0→1，只走 Compositor，替代 backgroundColor repaint
                fixed: doubles as the night-sky backdrop behind the roof
                transition's transparent sky, so the moon sets BEHIND the eaves */}
            <div
                ref={nightOverlayRef}
                data-night-overlay
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "#000",
                    opacity: 0,
                    pointerEvents: "none",
                    zIndex: 0,
                    willChange: "opacity",
                }}
            />

            {/* Wordmark — a fixed layer ABOVE the WebGL wrapper but at the page
                level (so it DIFFERENCE-blends against the white backgroundRef +
                the ink mountains). White text → reads black on the white page,
                flips to white exactly where the black mountains cross it, so the
                range visibly cuts through the letters while the mountains stay
                crisp (only the thin strokes blend → no grey haze). */}
            <div
                ref={wordmarkRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "var(--vh100, 100vh)",
                    // above the page-2 profile-zone (z10) so the name's hover
                    // hit-cells receive the cursor at the top of the page
                    zIndex: 11,
                    pointerEvents: "none",
                    willChange: "opacity",
                }}
            >
                <div
                    className="framer-xy-hero"
                    style={{
                        position: "absolute",
                        right: "4vw",
                        top: "23%",
                    }}
                >
                    <Wordmark style={{ fontSize: "max(96px, 16.5vw)" }} />
                </div>
            </div>

            {/* 第一页 WebGL Wrapper — fixed 跳出 Framer 祖先 layout，消除 sticky 弹跳 */}
            <div
                ref={wrapperRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "var(--vh100, 100vh)",
                    zIndex: 1,
                    willChange: "opacity",
                    pointerEvents: "none",
                    overflow: "hidden",
                }}
            >
                <div
                    ref={mountRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                        opacity: 0,
                        transition: "opacity 1.5s ease-in",
                        pointerEvents: "none",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                        maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                    }}
                />

                <div
                    ref={uiRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 6,
                        color: "#111",
                        pointerEvents: "none",
                        transition: "opacity 0.1s linear",
                        willChange: "opacity",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: "6vw",
                            // bottom-anchored column: quote on top, "scroll down
                            // to explore" hint below. Positive bottom keeps the
                            // whole column above the fold — the hint's bottom sits
                            // at vh - 30 (visible, ~30px margin) and the quote
                            // clears well above it.
                            bottom: "30px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            pointerEvents: "none",
                        }}
                    >
                        {/* Identity statement — the one first-screen line that
                            says what Xuyuan does. Reuses the ported
                            .framer-xy-sub reveal (blur-up after the loader;
                            reduced-motion shows it immediately via the RM
                            block below). */}
                        <div className="framer-xy-sub">{heroSubtitle}</div>
                        {/* 《潇湘八景图》 credit — the composition's source,
                            re-seated under the identity line (it shipped as a
                            dead prop after the earlier restraint pass). */}
                        <div
                            className="hero-quote"
                            style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "var(--text-micro)",
                                fontWeight: 300,
                                lineHeight: 1.7,
                                letterSpacing: "0.04em",
                                color: "#9a9a9a",
                                whiteSpace: "pre-line",
                                maxWidth: "360px",
                            }}
                        >
                            {quoteLine}
                        </div>
                        {/* a caption naming the gesture — deliberately NOT a
                            control (owner 2026-07-12); scrolling itself is the
                            interaction it points at */}
                        <div
                            className="hero-scroll-hint"
                            aria-hidden="true"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                fontFamily: "var(--font-sans)",
                                fontSize: "var(--text-micro)",
                                fontWeight: 300,
                                letterSpacing: "var(--track-eyebrow)",
                                color: "#888",
                                textTransform: "uppercase",
                            }}
                        >
                            <span
                                className="hero-scroll-hint-rule"
                                aria-hidden="true"
                            />
                            {scrollHint}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero spacer: with the 164vh profile zone this sums to the live
                flow height 300vh − 911px (45vh at a 1000px-tall viewport). */}
            <div
                className="hero-spacer"
                style={{
                    height: "calc(136vh - 911px)",
                    pointerEvents: "none",
                }}
            />

            {/* Profile zone: the max() bonus keeps enough night-sky runway
                between the card reveal and the roof's arrival on short
                windows (flow 300vh−911px collapses below ~800px height). */}
            <div
                className="profile-zone"
                style={{
                    position: "relative",
                    height: "calc(164vh + max(0px, 2152px - 155vh))",
                    zIndex: 10,
                    // the zone is a transparent runway over the pinned hero —
                    // it must not eat clicks meant for the hero (the scroll
                    // hint was unreachable); interactive children re-enable
                    pointerEvents: "none",
                }}
            >
                <div
                    ref={blackPageRef}
                    className="profile-sticky"
                    style={{
                        // live: page-2 copy sits at a FIXED document position
                        // (~doc y1100 content top) regardless of viewport
                        // height — not pinned. zone top = 136vh - 911px, so
                        // an absolute top of 2011px - 136vh lands there.
                        position: "absolute",
                        top: "calc(2152px - 136vh)",
                        left: 0,
                        width: "100%",
                        height: "var(--vh100, 100vh)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        color: "#F5F5F5",
                        opacity: 0,
                        pointerEvents: "none",
                        willChange: "opacity",
                        // the nowrap brand row is wider than small screens —
                        // clip horizontally only (vertical clip cuts the photo)
                        overflowX: "clip",
                        overflowY: "visible",
                    }}
                >
                    <div className="page2-sky-wash" />
                    <div className="noise-overlay" />
                    <div
                        className="page2-center-container"
                        style={{ position: "relative", zIndex: 12 }}
                    >
                        {(photoUrl || photoComponent) && (
                            <div
                                className="page2-photo-wrapper p2-fade delay-2"
                                ref={photoWrapperRef}
                            >
                                <div
                                    className="page2-photo"
                                    style={{ pointerEvents: "auto" }}
                                >
                                    {photoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element -- Framer-ported scene CSS owns this circular crop.
                                        <img
                                            className="page2-card-image"
                                            src={photoUrl}
                                            alt=""
                                            loading="eager"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div
                                            className="framer-photo-container"
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {React.isValidElement(
                                                photoComponent
                                            )
                                                ? React.cloneElement(
                                                      photoComponent as React.ReactElement<any>,
                                                      {
                                                          style: {
                                                              ...((
                                                                  photoComponent as React.ReactElement<any>
                                                              ).props?.style ||
                                                                  {}),
                                                              width: "100%",
                                                              height: "100%",
                                                              objectFit:
                                                                  "cover",
                                                              borderRadius:
                                                                  "50%",
                                                          },
                                                      }
                                                  )
                                                : photoComponent}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    {/* fades out ahead of the rising roofline so no text
                        fragments peek through the sky gaps — only the
                        avatar/moon plays the occlusion exit */}
                    <div
                        ref={page2TextRef}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            willChange: "opacity",
                        }}
                    >
                        <div className="page2-name-block">
                            <div className="page2-title">
                                {(() => {
                                    let ci = 0
                                    return page2Title
                                        .split(" ")
                                        .map((word, wi) => (
                                            <span
                                                key={wi}
                                                className="page2-word"
                                            >
                                                {word
                                                    .split("")
                                                    .map((ch, k) => (
                                                        <span
                                                            key={k}
                                                            className="page2-char"
                                                            style={{
                                                                transitionDelay: `${0.12 + ci++ * 0.02}s`,
                                                            }}
                                                        >
                                                            {ch}
                                                        </span>
                                                    ))}
                                            </span>
                                        ))
                                })()}
                            </div>
                            <div className="page2-name-rule" />
                            <div className="page2-subtitle p2-fade delay-5">
                                {page2Subtitle}
                            </div>
                        </div>
                        <div className="page2-footer p2-fade delay-6">
                            {page2Footer}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
