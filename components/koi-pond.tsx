// @ts-nocheck — ported from Framer; original code relies on Framer runtime invariants

"use client";

import * as React from "react"
import { useEffect, useMemo, useRef } from "react"
import { stripCssComments } from "@/lib/css-sanitize"

// Home hero — the ink koi pond: a self-contained 2D-canvas island rendering
// swimming koi, food pellets and hatching eggs (lily pads exist but are
// switched off). One useEffect owns the whole simulation: device-scored
// quality tiers (DPR / fish / food caps), the dt-normalised rAF loop,
// IntersectionObserver + page-visibility pausing, and a single teardown that
// unbinds every listener it added.
// Reduced-motion contract: the loop parks after ONE finished frame; feed
// drops repaint via refreshStaticFrame() only.
// Talks to the How-I-Work overlay purely through DOM CustomEvents
// (koi:feed out, koi:how-reveal in) — no React props cross that boundary.
// Deliberately untyped (@ts-nocheck) and untokenised: physics and geometry
// literals are tuned values from the Framer original; do not "clean up".

type Props = {
    eyebrow: string
    titleMain: string
    titleSub: string
    tag: string
    feedText: string
    showScrollTip: boolean
    introDurationMs: number
    heroBoxXvw: number
}

export default function InkKoiEcosystem(props: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const fishCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const padCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const showLilyPads = false

    const uiBoxRef = useRef<HTMLDivElement | null>(null)
    const scrollTipRef = useRef<HTMLDivElement | null>(null)

    const feedCursorRef = useRef<HTMLDivElement | null>(null)
    const feedBtnRef = useRef<HTMLDivElement | null>(null)

    // fonts are loaded once in app/layout.tsx (consolidated injector)

    useEffect(() => {
        const container = containerRef.current
        const canvas = fishCanvasRef.current
        const padCanvas = padCanvasRef.current

        const uiBox = uiBoxRef.current
        const scrollTip = scrollTipRef.current

        const feedCursor = feedCursorRef.current
        const feedBtn = feedBtnRef.current

        if (
            !container ||
            !canvas ||
            !padCanvas ||
            !uiBox ||
            !feedCursor ||
            !feedBtn
        )
            return

        /* ---- text scramble intro ---- */
        // 🌟 乱码解码涌现动效 (Text Scramble)
        const doScramble = (el: HTMLElement) => {
            const original = el.getAttribute("data-text") || el.innerText
            if (!el.getAttribute("data-text"))
                el.setAttribute("data-text", original)
            const chars = "01X*$%&?<>[]+/"
            let frame = 0
            const maxFrames = 25
            const tick = () => {
                // 如果已经触发跳过，直接显示原文并终止
                if (el.getAttribute("data-skip") === "true") {
                    el.innerText = original
                    return
                }
                let current = ""
                for (let i = 0; i < original.length; i++) {
                    if (original[i] === " ") {
                        current += " "
                        continue
                    }
                    if (frame > maxFrames * (i / original.length)) {
                        current += original[i]
                    } else {
                        current +=
                            chars[Math.floor(Math.random() * chars.length)]
                    }
                }
                el.innerText = current
                frame++
                if (frame <= maxFrames) requestAnimationFrame(tick)
                else el.innerText = original
            }
            tick()
        }

        // 入场时触发乱码动画
        setTimeout(() => {
            if (uiBoxRef.current) {
                const scrambleEls =
                    uiBoxRef.current.querySelectorAll(".koi-scramble")
                scrambleEls.forEach((el) => doScramble(el as HTMLElement))
            }
        }, 500)

        /* ---- math utils ---- */
        // =========================
        // Utils
        // =========================
        const TWO_PI = Math.PI * 2
        const clamp = (v: number, a: number, b: number) =>
            Math.max(a, Math.min(b, v))
        const rand = (a: number, b: number) => a + Math.random() * (b - a)
        const dist = (ax: number, ay: number, bx: number, by: number) =>
            Math.hypot(ax - bx, ay - by)

        function angleDelta(a: number, b: number) {
            let d = b - a
            if (d > Math.PI) d -= TWO_PI
            if (d < -Math.PI) d += TWO_PI
            return d
        }
        function lerpAngle(a: number, b: number, t: number) {
            return a + angleDelta(a, b) * t
        }

        /* ---- intro reveal ---- */
        // =========================
        // Intro animation (JS Driven)
        // =========================
        function updateScrollEffects(scrollY: number) {
            const fishProgress = clamp(scrollY / 100, 0, 1)
            canvas.style.opacity = String(1 - Math.pow(1 - fishProgress, 2))

            if (showLilyPads) {
                const padProgress = clamp(scrollY / 160, 0, 1)
                padCanvas.style.opacity = String(1 - Math.pow(1 - padProgress, 2))
            } else {
                padCanvas.style.opacity = "0"
            }

            if (scrollTip)
                scrollTip.style.opacity = String(Math.max(0, 1 - scrollY / 120))
        }

        /* ---- intro skip ---- */
        // =========================
        // ✨ 新增：跳过动画逻辑
        // =========================
        let introSkipped = false
        const forceSkipIntro = () => {
            if (introSkipped) return
            introSkipped = true
            // 强制将滚动效果拉满 (280)
            updateScrollEffects(280)
            // 强制结束乱码
            if (uiBoxRef.current) {
                const scrambleEls =
                    uiBoxRef.current.querySelectorAll(".koi-scramble")
                scrambleEls.forEach((el) => {
                    el.setAttribute("data-skip", "true")
                    const original = el.getAttribute("data-text")
                    if (original) el.innerHTML = original
                })
            }
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                // feed mode first: Escape is the keyboard way OUT of feeding
                // (Enter/Space on the focused chip drops pellets, see
                // onFeedKeyDown), then falls through to the intro skip.
                if (feedMode) {
                    feedMode = false
                    syncFeedUi()
                    return
                }
                forceSkipIntro()
            }
        }
        window.addEventListener("keydown", handleKeyDown)

        /* ---- feed mode + dock ---- */
        // =========================
        // Feed mode
        // =========================
        let feedMode = false
        let feedCount = 0
        // Dock state: after the first feed (or when the How-I-Work overlay
        // surfaces) the centered tip collapses into a small chip on the left
        // edge. Transform-only: JS measures the dock delta into CSS vars.
        let tipDocked = false
        const DOCK_INSET = 24
        // 1 (no scale-down): the docked chip must match the How-I-Work toggle
        // exactly — same 14px label, same box — so the left-edge pair reads
        // as one control group; compaction happens in the .dismissed CSS
        // instead (owner report 2026-07-08)
        const DOCK_SCALE = 1
        const updateDockVars = () => {
            if (!tipDocked) return
            const rect = container.getBoundingClientRect()
            // Measure the chip at its SETTLED docked size: the .dock-measure
            // class applies the compact paddings and hides the sub line with
            // transitions off, so the dock delta lands the compact chip's
            // left edge exactly on DOCK_INSET (measuring the wide pre-dock
            // box parked it ~58px off the toggle's edge).
            uiBox.classList.add("dock-measure")
            const chipW = uiBox.offsetWidth // layout width, unaffected by transform
            uiBox.classList.remove("dock-measure")
            const dockX = DOCK_INSET + (chipW * DOCK_SCALE) / 2 - rect.width / 2
            uiBox.style.setProperty("--dock-x", dockX.toFixed(1) + "px")
            // desktop: park at ~26% of the band's height — the left-column
            // slot between the How-I-Work title and card 2 (a centre-left
            // dock sat exactly on the PROTOTYPE card). Phones keep the
            // x-only dock (their band hosts the stacked cards below).
            const phone = window.matchMedia("(max-width: 740px)").matches
            const dockY = phone ? 0 : rect.height * 0.26 - rect.height / 2
            uiBox.style.setProperty("--dock-y", dockY.toFixed(1) + "px")
            uiBox.style.setProperty("--dock-s", String(DOCK_SCALE))
        }
        const dockTip = () => {
            if (tipDocked) return
            tipDocked = true
            updateDockVars()
            uiBox.classList.add("dismissed")
        }
        // The overlay reveals after enough feed drops — dock the tip then as
        // well so the cards never rise under the centered pill, and retire
        // the "three drops" hint (its promise is fulfilled on screen).
        const onHowReveal = () => {
            dockTip()
            container.classList.add("how-revealed")
            // the sub line just left the layout — re-derive the dock delta
            updateDockVars()
        }
        window.addEventListener("koi:how-reveal", onHowReveal)
        const syncFeedUi = () => {
            container.classList.toggle("feed-mode", feedMode)
            feedBtn.setAttribute("aria-pressed", String(feedMode))
            feedCursor.style.display = feedMode ? "block" : "none"
            feedCursor.style.opacity = feedMode ? "1" : "0"
        }
        const setFeedCursorPosition = (x: number, y: number) => {
            feedCursor.style.left = x + "px"
            feedCursor.style.top = y + "px"
        }
        const onFeedClick = (e: Event) => {
            e.stopPropagation()
            if (!tipDocked) {
                dockTip()
                feedMode = true
            } else {
                feedMode = !feedMode
            }
            syncFeedUi()
            if (feedMode) setFeedCursorPosition(target.x, target.y)
        }
        const onFeedPointerDown = (e: PointerEvent) => {
            e.stopPropagation()
        }
        // Keyboard feeding — pointer users get pointerdown-anywhere once feed
        // mode is armed; the keyboard equivalent lives on the (focusable)
        // chip: first Enter/Space arms feed mode, every further Enter/Space
        // drops one pellet at the feed-cursor position (pond centre until a
        // pointer has moved), through the SAME spawn + koi:feed count chain
        // as a pointer drop. Escape (window handler above) disarms.
        const onFeedKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                e.preventDefault()
                e.stopPropagation()
                if (!feedMode) {
                    onFeedClick(e)
                } else {
                    dropFeedAt(target.x, target.y)
                }
            }
        }
        feedBtn.addEventListener("click", onFeedClick)
        feedBtn.addEventListener("pointerdown", onFeedPointerDown)
        feedBtn.addEventListener("keydown", onFeedKeyDown)

        /* ---- canvas quality tiers ---- */
        // =========================
        // Canvas setup + quality
        // =========================
        const ctx = canvas.getContext("2d", { alpha: false })
        const padCtx = padCanvas.getContext("2d", { alpha: true })
        if (!ctx || !padCtx) return

        const hwCores = navigator.hardwareConcurrency || 4
        const deviceMemory =
            "deviceMemory" in navigator
                ? (navigator as any).deviceMemory || 4
                : 4
        const connection =
            "connection" in navigator
                ? (navigator as any).connection
                : undefined
        const saveData = !!connection?.saveData
        const isMobile = /Mobi|Android/i.test(navigator.userAgent)
        const prefersReduce =
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const viewportArea = window.innerWidth * window.innerHeight
        let qualityTier: 0 | 1 | 2 = 2

        {
            let score = 0
            if (!isMobile)          score += 2
            if (hwCores >= 8)       score += 2
            else if (hwCores >= 6)  score += 1
            if (deviceMemory >= 8)      score += 2
            else if (deviceMemory >= 6) score += 1
            if (viewportArea <= 2_000_000) score += 1

            if (prefersReduce || saveData) {
                qualityTier = 0
            } else if (score >= 6) {
                qualityTier = 2
            } else if (score >= 3) {
                qualityTier = 1
            } else {
                qualityTier = 0
            }
        }

        let width = 0,
            height = 0,
            centerX = 0,
            centerY = 0,
            DPR = 1,
            viewScale = 1

        function applyCanvasFilter() {
            // DPR 已降低（tier2: 1.2, tier1: 0.9），物理像素更少，相同 blur 半径 GPU 工作量大幅减少
            // blur 从原来 3.2px 降到 1.5px，配合低 DPR，视觉模糊感相近但开销约少 5×
            canvas.style.filter =
                qualityTier >= 2
                    ? "blur(1.2px) contrast(1.18) brightness(1.08) saturate(1.08)"
                    : qualityTier === 1
                      ? "blur(0.6px) contrast(1.14) brightness(1.06) saturate(1.06)"
                      : "contrast(1.1) brightness(1.04) saturate(1.04)"
        }

        /* ---- lily pad layout ---- */
        // =========================
        // Lily pads
        // =========================
        let lilyPads: any[] = []
        const lilyConfig = [
            // — right-top-center (偏内侧上方) —
            { x: 0.70, y: 0.04, r: 0.130, alpha: 0.44, rot: -0.28, seed: 27.7 },
            { x: 0.78, y: 0.13, r: 0.100, alpha: 0.38, rot: 0.32,  seed: 52.1 },
            { x: 0.65, y: 0.20, r: 0.080, alpha: 0.32, rot: -0.12, seed: 63.4 },
            { x: 0.73, y: 0.27, r: 0.064, alpha: 0.26, rot: 0.20,  seed: 41.6 },
            { x: 0.62, y: 0.32, r: 0.050, alpha: 0.21, rot: -0.42, seed: 92.3 },
            { x: 0.69, y: 0.38, r: 0.040, alpha: 0.16, rot: 0.14,  seed: 84.5 },
            // — right-top-corner (贴右上角) —
            { x: 0.93, y: 0.04, r: 0.110, alpha: 0.42, rot: 0.16,  seed: 11.2 },
            { x: 0.99, y: 0.13, r: 0.086, alpha: 0.36, rot: -0.38, seed: 44.8 },
            { x: 0.87, y: 0.19, r: 0.068, alpha: 0.30, rot: 0.44,  seed: 88.6 },
            { x: 0.95, y: 0.26, r: 0.054, alpha: 0.24, rot: -0.18, seed: 73.2 },
            { x: 0.84, y: 0.31, r: 0.042, alpha: 0.19, rot: 0.56,  seed: 18.9 },
            { x: 0.92, y: 0.37, r: 0.032, alpha: 0.14, rot: -0.30, seed: 35.7 },
            // — right-edge (右侧中部) —
            { x: 0.92, y: 0.42, r: 0.116, alpha: 0.40, rot: 0.48,  seed: 19.1 },
            { x: 0.99, y: 0.51, r: 0.090, alpha: 0.34, rot: -0.08, seed: 37.5 },
            { x: 0.86, y: 0.57, r: 0.072, alpha: 0.28, rot: 0.22,  seed: 15.6 },
            { x: 0.94, y: 0.64, r: 0.058, alpha: 0.22, rot: -0.34, seed: 56.4 },
            { x: 0.82, y: 0.69, r: 0.046, alpha: 0.17, rot: 0.38,  seed: 29.7 },
            { x: 0.89, y: 0.74, r: 0.034, alpha: 0.13, rot: -0.22, seed: 66.1 },
            // — right-bottom-corner (右下角) —
            { x: 0.90, y: 0.79, r: 0.112, alpha: 0.40, rot: 0.40,  seed: 77.3 },
            { x: 0.97, y: 0.88, r: 0.088, alpha: 0.34, rot: -0.20, seed: 71.9 },
            { x: 0.85, y: 0.93, r: 0.070, alpha: 0.28, rot: 0.18,  seed: 33.3 },
            { x: 0.99, y: 0.97, r: 0.056, alpha: 0.22, rot: -0.44, seed: 62.8 },
            { x: 0.81, y: 0.87, r: 0.044, alpha: 0.17, rot: 0.26,  seed: 47.1 },
            { x: 0.93, y: 0.98, r: 0.034, alpha: 0.13, rot: -0.12, seed: 53.9 },
        ]

        function rebuildLilyPads() {
            lilyPads = []
            const base = Math.min(width, height)
            for (const c of lilyConfig) {
                const r = base * c.r
                const rippleMax = 1.045
                const shadowFactor =
                    qualityTier >= 2 ? 0.18 : qualityTier === 1 ? 0.12 : 0.08
                const xEdgeInset = r * 0.92
                const yEdgeInsetRaw = r * (rippleMax + shadowFactor) + 2
                const yEdgeInset = Math.min(
                    Math.max(2, yEdgeInsetRaw),
                    Math.max(2, height * 0.5 - 2)
                )
                lilyPads.push({
                    x: clamp(width * c.x, xEdgeInset, width - xEdgeInset),
                    y: clamp(height * c.y, yEdgeInset, height - yEdgeInset),
                    r,
                    alpha: c.alpha,
                    phase: rand(0, TWO_PI),
                    speed: rand(0.0012, 0.0022),
                    seed: c.seed,
                    rotation: c.rot,
                    xMin: xEdgeInset,
                    xMax: width - xEdgeInset,
                    yMin: yEdgeInset,
                    yMax: height - yEdgeInset,
                })
            }

            for (let pass = 0; pass < 8; pass++) {
                for (let i = 0; i < lilyPads.length; i++) {
                    const a = lilyPads[i]
                    for (let j = i + 1; j < lilyPads.length; j++) {
                        const b = lilyPads[j]
                        const dx = b.x - a.x,
                            dy = b.y - a.y,
                            d = Math.hypot(dx, dy),
                            minD = (a.r + b.r) * 0.96
                        if (d >= minD) continue
                        let ux = 1,
                            uy = 0
                        if (d > 1e-4) {
                            ux = dx / d
                            uy = dy / d
                        } else {
                            const ang = rand(0, TWO_PI)
                            ux = Math.cos(ang)
                            uy = Math.sin(ang)
                        }
                        const push = (minD - d) * 0.5
                        a.x -= ux * push
                        a.y -= uy * push
                        b.x += ux * push
                        b.y += uy * push
                    }
                }
                for (const p of lilyPads) {
                    p.x = clamp(p.x, p.xMin, p.xMax)
                    p.y = clamp(p.y, p.yMin, p.yMax)
                }
            }
        }

        /* ---- resize + pointer tracking ---- */
        function resize() {
            const prevW = width, prevH = height

            // 降 DPR 上限：CSS 将画布拉伸到 100%，浏览器双线性插值产生自然柔化，替代原来的 CSS blur
            DPR =
                qualityTier >= 2
                    ? Math.min(1.2, window.devicePixelRatio || 1)
                    : qualityTier === 1
                      ? Math.min(0.9, window.devicePixelRatio || 1)
                      : 0.75
            const r = container.getBoundingClientRect()
            width = r.width
            height = r.height
            viewScale = Math.min(1.8, Math.max(0.45, Math.min(width, height) / 700))
            canvas.width = Math.floor(width * DPR)
            canvas.height = Math.floor(height * DPR)
            canvas.style.width = width + "px"
            canvas.style.height = height + "px"
            padCanvas.width = Math.floor(width * DPR)
            padCanvas.height = Math.floor(height * DPR)
            padCanvas.style.width = width + "px"
            padCanvas.style.height = height + "px"
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
            padCtx.setTransform(DPR, 0, 0, DPR, 0, 0)
            centerX = width / 2
            centerY = height / 2
            applyCanvasFilter()

            // 按比例重算所有活跃实体的位置（首次调用时 prevW=0，跳过）
            if (prevW > 0 && prevH > 0) {
                const rx = width / prevW, ry = height / prevH
                for (const f of fishes)        { f.x *= rx; f.y *= ry }
                for (const p of foodParticles) { p.x *= rx; p.y *= ry }
                for (const e of eggs)          { e.x *= rx; e.y *= ry }
            }

            rebuildLilyPads()
            updateDockVars()
        }

        const onResize = () => resize()
        window.addEventListener("resize", onResize, { passive: true })
        resize()

        let target = { x: centerX, y: centerY, hasMoved: false }
        const getPointerPos = (clientX: number, clientY: number) => {
            const rect = container.getBoundingClientRect()
            return { x: clientX - rect.left, y: clientY - rect.top }
        }
        const onPointerMove = (e: PointerEvent) => {
            const pos = getPointerPos(e.clientX, e.clientY)
            target.x = pos.x
            target.y = pos.y
            target.hasMoved = true
            if (feedMode) {
                feedCursor.style.opacity = "1"
                setFeedCursorPosition(pos.x, pos.y)
            }
        }
        const onPointerLeave = () => {
            if (feedMode) feedCursor.style.opacity = "0"
        }
        container.addEventListener("pointermove", onPointerMove, {
            passive: true,
        })
        container.addEventListener("pointerleave", onPointerLeave)

        /* ---- water current + food particles ---- */
        const currentAt = (now: number, x: number, y: number) => {
            const t = now * 0.001
            const cx =
                Math.sin(t * 0.35 + x * 0.003) * 0.22 +
                Math.sin(t * 0.12 + y * 0.002) * 0.12
            const cy =
                Math.cos(t * 0.28 + y * 0.003) * 0.1 +
                Math.sin(t * 0.15 + x * 0.002) * 0.06
            return { cx, cy }
        }

        class FoodParticle {
            x: number
            y: number
            vx: number
            vy: number
            r: number
            wob: number
            alive: boolean
            dropScale: number
            birthTime: number
            lifeMs: number
            constructor(x: number, y: number) {
                this.x = x
                this.y = y
                this.vx = rand(-0.65, 0.65)
                this.vy = rand(0.55, 1.65)
                this.r = rand(2.8, 4.2)
                this.wob = rand(0, TWO_PI)
                this.alive = true
                this.dropScale = 2.5
                this.birthTime = performance.now()
                this.lifeMs = rand(7000, 11000)
            }
            update(now: number, dt: number) {
                this.wob += 0.05 * dt
                const c = currentAt(now, this.x, this.y)
                this.vx += (Math.sin(this.wob) * 0.01 + c.cx * 0.06) * dt
                this.vy += c.cy * 0.02 * dt
                this.vx *= 1 - (1 - 0.965) * dt
                this.vy *= 1 - (1 - 0.965) * dt
                this.vy += 0.012 * dt
                this.x += this.vx * dt
                this.y += (this.vy + Math.sin(this.wob) * 0.05) * dt
                if (this.dropScale > 1.0) this.dropScale -= 0.1 * dt
                if (this.y > height - 18) {
                    this.y = height - 18
                    this.vy *= 0.25
                    this.vx *= 0.85
                }
                if (this.x < 16) {
                    this.x = 16
                    this.vx *= -0.25
                }
                if (this.x > width - 16) {
                    this.x = width - 16
                    this.vx *= -0.25
                }
                if (now - this.birthTime > this.lifeMs) this.alive = false
            }
            draw(now: number) {
                if (!this.alive) return
                const currentR = this.r * Math.max(1, this.dropScale),
                    age = now - this.birthTime
                const fade = clamp(
                    1 - (age - (this.lifeMs - 1200)) / 1200,
                    0,
                    1
                )
                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                ctx.globalAlpha = 0.92 * fade
                ctx.fillStyle = "#d0d0d0"
                ctx.beginPath()
                ctx.arc(this.x, this.y, currentR, 0, TWO_PI)
                ctx.fill()
                ctx.globalAlpha = 0.72 * fade
                ctx.fillStyle = "#ffffff"
                ctx.beginPath()
                ctx.arc(
                    this.x - currentR * 0.25,
                    this.y - currentR * 0.3,
                    currentR * 0.4,
                    0,
                    TWO_PI
                )
                ctx.fill()
                ctx.restore()
            }
        }

        /* ---- egg entity ---- */
        class Egg {
            x: number
            y: number
            r: number
            vx: number
            vy: number
            wob: number
            typeHint: string
            pulse: number
            birthTime: number
            constructor(x: number, y: number, typeHint = "yamabuki") {
                this.x = x
                this.y = y
                this.r = rand(10, 14)
                this.vx = rand(-0.08, 0.08)
                this.vy = rand(-0.1, 0.12)
                this.wob = rand(0, TWO_PI)
                this.typeHint = typeHint
                this.pulse = rand(0, TWO_PI)
                this.birthTime = performance.now()
            }
            hitTest(px: number, py: number) {
                return dist(this.x, this.y, px, py) <= this.r * 2.0
            }
            update() {
                this.wob += 0.02
                this.pulse += 0.045
                this.x += this.vx + Math.sin(this.wob) * 0.08
                this.y += this.vy + Math.cos(this.wob) * 0.06
                const m = 50
                this.x = clamp(this.x, m, width - m)
                this.y = clamp(this.y, m, height - m)
            }
            draw() {
                const glow = 0.35 + 0.2 * Math.sin(this.pulse)
                ctx.save()
                ctx.globalCompositeOperation = "screen"
                ctx.fillStyle = `rgba(240, 235, 225, ${0.1 + glow * 0.1})`
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.r * 2.1, 0, TWO_PI)
                ctx.fill()
                ctx.globalCompositeOperation = "source-over"
                ctx.fillStyle = `rgba(235, 232, 225, 0.55)`
                ctx.strokeStyle = `rgba(255,255,255, ${0.18 + glow * 0.08})`
                ctx.lineWidth = 1.1
                ctx.beginPath()
                ctx.ellipse(
                    this.x,
                    this.y,
                    this.r * 1.05,
                    this.r * 0.85,
                    0.2,
                    0,
                    TWO_PI
                )
                ctx.fill()
                ctx.stroke()
                ctx.globalCompositeOperation = "screen"
                ctx.fillStyle = `rgba(220, 220, 220, ${0.1 + glow * 0.1})`
                ctx.beginPath()
                ctx.ellipse(
                    this.x + this.r * 0.15,
                    this.y + this.r * 0.1,
                    this.r * 0.52,
                    this.r * 0.4,
                    -0.15,
                    0,
                    TWO_PI
                )
                ctx.fill()
                ctx.restore()
            }
        }

        /* ---- koi entity ---- */
        class Koi {
            x: number
            y: number
            angle: number
            numSegments: number
            segments: any[]
            baseScale: number
            fat: number
            fatTarget: number
            segLength: number
            baseProfile: number[]
            baseRadii: number[]
            isBig!: boolean
            isSmall!: boolean
            _bodyPts!: {x:number,y:number}[]
            _bodyPath: Path2D = new Path2D()
            _cachedRadii: number[] = []
            _lastFatForRadii: number = -999
            baseSpeed: number
            chaseSpeed: number
            currentSpeed: number
            turnLerp: number
            maxTurnPerFrame: number
            swimCycle: number
            wanderPhase: number
            targetFood: any
            eatRadius: number
            finPhase: number
            retargetTick: number
            type: string
            colors: any
            patterns: any[]
            feedingStyle: "precise" | "rush"
            missCooldown: number
            loopTimer: number
            loopDir: 1 | -1
            loopRadius: number

            constructor(x: number, y: number, type: string, scale = 1) {
                this.x = x
                this.y = y
                this.angle = Math.random() * TWO_PI
                this.numSegments = 24
                this._bodyPts = Array.from({ length: 48 }, () => ({ x: 0, y: 0 }))
                this.segments = Array.from(
                    { length: this.numSegments },
                    () => ({ x, y, angle: 0 })
                )
                this.baseScale = scale * 0.7
                this.fat = 0.92
                this.fatTarget = 0.92
                const elongation = 1 + Math.max(0, this.baseScale - 0.7) * 0.08
                this.segLength = 6.2 * this.baseScale * elongation
                // 俯视鱼形：楔形吻部 → 肩部(前1/3)最宽 → 后段长收 → 细尾柄。
                // 原轮廓中段最宽且首尾同钝，读作"白拖鞋"而不是鱼。
                this.baseProfile = [
                    4.4, 8.2, 12.4, 16.2, 19.4, 21.8, 23.2, 24.0, 24.2, 23.9,
                    23.2, 22.2, 20.9, 19.4, 17.7, 15.9, 14.0, 12.1, 10.2, 8.4,
                    6.8, 5.4, 4.2, 3.2,
                ]
                const slimMult = Math.min(0.96, 0.82 + this.baseScale * 0.18)
                this.baseRadii = this.baseProfile.map(
                    (r) => r * this.baseScale * slimMult
                )

                this.isBig   = this.baseScale >= 1.5
                this.isSmall = this.baseScale < 0.65
                this.baseSpeed  = Math.max(0.42, 1.0 - this.baseScale * 0.26)
                this.chaseSpeed = Math.max(1.5,  2.1 - this.baseScale * 0.20)
                this.currentSpeed = this.baseSpeed
                // ✨ 略微增加转身灵活性
                this.turnLerp = 0.08
                this.maxTurnPerFrame = 0.05

                this.swimCycle = Math.random() * 100
                this.wanderPhase = Math.random() * 100
                this.targetFood = null
                this.eatRadius = Math.max(12, 32 - this.baseScale * 14)
                this.finPhase = rand(0, TWO_PI)
                this.retargetTick = Math.floor(rand(0, 3))

                if (type === "kohaku") {
                    this.type = "kohaku"
                    this.colors = {
                        base: "rgba(235, 234, 228, 0.95)",
                        pattern: "rgba(195, 42, 42, 0.9)",
                        fin: "rgba(252, 252, 250, 0.58)",
                        finEdge: "rgba(255,255,255,0.25)",
                        inkEdge: "rgba(10, 14, 18, 0.20)",
                    }
                } else if (type === "sanke") {
                    this.type = "sanke"
                    this.colors = {
                        base: "rgba(240, 238, 234, 0.95)",
                        pattern: "rgba(190, 42, 42, 0.9)",
                        fin: "rgba(252, 252, 250, 0.50)",
                        finEdge: "rgba(255,255,255,0.25)",
                        inkEdge: "rgba(8, 10, 14, 0.26)",
                    }
                } else if (type === "showa") {
                    this.type = "showa"
                    this.colors = {
                        base: "rgba(22, 18, 24, 0.96)",
                        pattern: "rgba(185, 38, 38, 0.92)",
                        fin: "rgba(88, 78, 108, 0.65)",
                        finEdge: "rgba(210, 220, 240, 0.30)",
                        inkEdge: "rgba(255,255,255,0.06)",
                        rimLight: "rgba(180, 210, 255, 0.90)",
                    }
                } else {
                    this.type = "yamabuki"
                    this.colors = {
                        base: "rgba(244, 240, 232, 0.95)",
                        pattern: "rgba(215, 150, 45, 0.9)",
                        fin: "rgba(252, 252, 248, 0.58)",
                        finEdge: "rgba(255,255,255,0.25)",
                        inkEdge: "rgba(10, 14, 18, 0.18)",
                    }
                }
                this.patterns = this._genPatterns(this.type)
                this.feedingStyle = this.isBig ? "precise" : this.isSmall ? "rush" : (Math.random() < 0.55 ? "precise" : "rush")
                this.missCooldown = 0
                this.loopTimer = 0
                this.loopDir = Math.random() < 0.5 ? 1 : -1
                this.loopRadius = 60 * this.scale
            }

            _genPatterns(type: string) {
                const spots: any[] = []
                const n = Math.floor(rand(2, 5))
                for (let i = 0; i < n; i++) {
                    const zStart = 3 + (i * 16) / n
                    const segIdx = clamp(
                        Math.floor(rand(zStart, zStart + 16 / n)),
                        3,
                        19
                    )
                    const col =
                        type === "yamabuki"
                            ? "rgba(215, 150, 45, 0.9)"
                            : "rgba(195, 42, 42, 0.9)"
                    spots.push({
                        seg: segIdx,
                        size: rand(1.0, 1.6),
                        seed: rand(0, 100),
                        color: col,
                    })
                }
                if (type === "sanke") {
                    const m = Math.floor(rand(1, 3))
                    for (let i = 0; i < m; i++)
                        spots.push({
                            seg: Math.floor(rand(4, 18)),
                            size: rand(0.5, 0.85),
                            seed: rand(0, 100),
                            color: "rgba(16, 16, 22, 0.82)",
                        })
                }
                if (type === "showa") {
                    const rn = Math.floor(rand(2, 4))
                    for (let i = 0; i < rn; i++) {
                        spots.push({
                            seg: clamp(
                                Math.floor(
                                    rand(
                                        3 + (i * 14) / rn,
                                        3 + (i * 14) / rn + 14 / rn
                                    )
                                ),
                                3,
                                18
                            ),
                            size: rand(0.9, 1.6),
                            seed: rand(0, 100),
                            color: "rgba(185, 38, 38, 0.92)",
                        })
                    }
                    const yn = Math.floor(rand(1, 3))
                    for (let i = 0; i < yn; i++)
                        spots.push({
                            seg: Math.floor(rand(4, 17)),
                            size: rand(0.7, 1.2),
                            seed: rand(0, 100),
                            color: "rgba(215, 165, 30, 0.88)",
                        })
                }
                return spots
            }

            get scale() {
                return this.baseScale
            }
            get radii() {
                if (Math.abs(this.fat - this._lastFatForRadii) < 0.0015) return this._cachedRadii
                const f = this.fat,
                    n = this.numSegments - 1
                this._cachedRadii = this.baseRadii.map((r, i) => {
                    const t = i / n,
                        bodyT = clamp((t - 0.08) / 0.84, 0, 1),
                        bellyT = clamp((t - 0.22) / 0.58, 0, 1)
                    const bodyCurve = Math.sin(Math.PI * bodyT),
                        bellyCurve = Math.sin(Math.PI * bellyT)
                    const headKeep = clamp((t - 0.1) / 0.22, 0, 1)
                    // 尾柄隔离肥胖：后 40% 渐次不吃 fat，胖鱼胖在肚子不是尾巴
                    const tailKeep = 1 - clamp((t - 0.58) / 0.42, 0, 1) * 0.85
                    const fatInfluence = 0.25 + 0.75 * headKeep
                    return (
                        r *
                        (1 +
                            (f - 1) *
                                (0.42 + 0.18 * bodyCurve + 0.42 * bellyCurve) *
                                tailKeep *
                                (0.98 + fatInfluence * 0.02))
                    )
                })
                this._lastFatForRadii = this.fat
                return this._cachedRadii
            }

            chooseFood(foodParticles: any[]) {
                let best = null,
                    bestD = Infinity
                const detectRange = this.isBig ? 2400 * this.scale : this.isSmall ? 900 * this.scale : 1700 * this.scale
                for (const p of foodParticles) {
                    if (!p.alive) continue
                    const d = dist(this.x, this.y, p.x, p.y)
                    if (d < bestD && d < detectRange) {
                        bestD = d
                        best = p
                    }
                }
                return best
            }

            /* ---- koi steering + feeding update ---- */
            update(
                fishes: any[],
                foodParticles: any[],
                eggs: any[],
                now: number,
                dt: number
            ) {
                this.fat += (this.fatTarget - this.fat) * 0.04 * dt
                this.missCooldown = Math.max(0, this.missCooldown - dt)
                this.loopTimer = Math.max(0, this.loopTimer - dt)

                const tr = this.isBig
                    ? Math.max(0.018, 0.055 - this.baseScale * 0.018)
                    : this.isSmall
                        ? Math.max(0.055, 0.14 - this.baseScale * 0.04)
                        : Math.max(0.028, 0.086 - this.baseScale * 0.042)
                let desiredAngle = this.angle,
                    desiredSpeed = this.baseSpeed,
                    isHunting = false
                let edgeTurn = false
                const targetCX = centerX,
                    targetCY = centerY
                const safeMargin = Math.max(90, 120 * this.scale)
                const topSafeMargin = Math.max(safeMargin, 190 * this.scale)

                if (
                    this.x < safeMargin ||
                    this.x > width - safeMargin ||
                    this.y < topSafeMargin ||
                    this.y > height - safeMargin
                )
                    edgeTurn = true

                this.retargetTick = (this.retargetTick + 1) % 2
                if (
                    !this.targetFood ||
                    !this.targetFood.alive ||
                    this.retargetTick === 0
                ) {
                    const cand = this.chooseFood(foodParticles)
                    if (!this.targetFood || !this.targetFood.alive)
                        this.targetFood = cand
                    else if (cand && cand.alive) {
                        const curD = dist(
                            this.x,
                            this.y,
                            this.targetFood.x,
                            this.targetFood.y
                        )
                        const newD = dist(this.x, this.y, cand.x, cand.y)
                        if (newD < curD * 0.85) this.targetFood = cand
                    }
                }

                if (edgeTurn) {
                    const centerAngle = Math.atan2(
                        targetCY - this.y,
                        targetCX - this.x
                    )
                    this.maxTurnPerFrame = tr * 1.9
                    this.turnLerp = tr * 1.6
                    if (this.targetFood && this.targetFood.alive) {
                        isHunting = true
                        const foodAngle = Math.atan2(
                            this.targetFood.y - this.y,
                            this.targetFood.x - this.x
                        )
                        desiredAngle = lerpAngle(foodAngle, centerAngle, 0.35)
                        desiredSpeed = this.chaseSpeed * 0.85
                    } else {
                        desiredAngle = lerpAngle(this.angle, centerAngle, 0.15)
                        desiredSpeed = this.baseSpeed * 0.8
                    }
                } else if (this.targetFood) {
                    isHunting = true
                    const dx = this.targetFood.x - this.x,
                        dy = this.targetFood.y - this.y
                    const d = Math.hypot(dx, dy),
                        targetAngle = Math.atan2(dy, dx)
                    const farD = 520 * this.scale,
                        midD = 240 * this.scale,
                        nearD = 110 * this.scale

                    if (this.feedingStyle === "precise") {
                        const nearTurnBoost = clamp((nearD - d) / nearD, 0, 1)
                        this.maxTurnPerFrame =
                            tr * (1.35 + nearTurnBoost * 1.25)
                        this.turnLerp = tr * (1.0 + nearTurnBoost * 0.9)
                        if (d > farD) {
                            desiredAngle = targetAngle
                            desiredSpeed = this.chaseSpeed * 1.55
                        } else if (d > midD) {
                            const k = clamp((d - midD) / (farD - midD), 0, 1)
                            desiredAngle = targetAngle
                            desiredSpeed = this.chaseSpeed * (1.12 + 0.42 * k)
                        } else if (d > nearD) {
                            const k = clamp((d - nearD) / (midD - nearD), 0, 1)
                            desiredAngle = targetAngle
                            desiredSpeed = this.chaseSpeed * (0.86 + 0.38 * k)
                        } else {
                            desiredAngle =
                                targetAngle +
                                Math.sin(this.swimCycle * 1.6) * 0.06
                            desiredSpeed = Math.max(
                                this.baseSpeed * 0.35,
                                this.chaseSpeed * 0.48
                            )
                        }
                    } else {
                        if (this.loopTimer > 0) {
                            const cx = this.targetFood.x,
                                cy = this.targetFood.y
                            const angToCenter = Math.atan2(
                                this.y - cy,
                                this.x - cx
                            )
                            desiredAngle = lerpAngle(
                                angToCenter + (this.loopDir * Math.PI) / 2,
                                Math.atan2(cy - this.y, cx - this.x),
                                0.08
                            )
                            desiredSpeed = this.chaseSpeed * 1.18
                            this.maxTurnPerFrame = tr * 1.1
                            this.turnLerp = tr * 0.85
                        } else {
                            this.maxTurnPerFrame = tr * 1.05
                            this.turnLerp = tr * 0.75
                            if (d > farD) {
                                desiredAngle = targetAngle
                                desiredSpeed = this.chaseSpeed * 1.75
                            } else if (d > midD) {
                                desiredAngle = targetAngle
                                desiredSpeed =
                                    this.chaseSpeed *
                                    (1.2 +
                                        0.55 *
                                            clamp(
                                                (d - midD) / (farD - midD),
                                                0,
                                                1
                                            ))
                            } else {
                                desiredAngle = targetAngle
                                desiredSpeed = this.chaseSpeed * 1.16
                            }
                        }
                    }
                } else {
                    this.maxTurnPerFrame = tr * 0.85
                    this.turnLerp = tr * 0.7
                    const dx = target.x - this.x,
                        dy = target.y - this.y,
                        d = Math.hypot(dx, dy)
                    if (feedMode && target.hasMoved && d < 380) {
                        desiredAngle = Math.atan2(dy, dx)
                        desiredSpeed =
                            d < 90
                                ? this.baseSpeed * 0.4
                                : this.baseSpeed + 0.05
                    } else {
                        this.wanderPhase += 0.005 * dt
                        const w =
                            Math.sin(this.wanderPhase) * 0.18 +
                            Math.sin(this.wanderPhase * 0.47) * 0.1
                        desiredAngle = this.angle + w * 0.06
                        desiredSpeed = this.baseSpeed
                    }
                }

                if (this.targetFood && this.targetFood.alive) {
                    const _fd = dist(
                        this.x,
                        this.y,
                        this.targetFood.x,
                        this.targetFood.y
                    )
                    if (_fd < this.eatRadius) {
                        if (
                            this.feedingStyle === "rush" &&
                            this.missCooldown === 0
                        ) {
                            if (
                                this.currentSpeed > this.chaseSpeed * 1.15 &&
                                Math.random() < 0.55
                            ) {
                                this.loopTimer = Math.floor(rand(45, 85))
                                this.loopRadius = 60 * this.scale
                                this.missCooldown = 28
                                this.currentSpeed = Math.max(
                                    this.currentSpeed,
                                    this.chaseSpeed * 1.12
                                )
                                return
                            }
                        }
                        this.targetFood.alive = false
                        this.targetFood = null
                        const maturity = clamp(
                            (this.baseScale - 1.4) / 1.0,
                            0,
                            1
                        )
                        const fatGain =
                            rand(0.0015, 0.0045) + maturity * rand(0.007, 0.014)
                        this.fatTarget = clamp(
                            this.fatTarget + fatGain,
                            1.0,
                            1.25 + maturity * 0.95
                        )
                        this.baseScale += 0.008 / Math.max(0.8, this.baseScale)
                        this.segLength =
                            6.2 *
                            this.baseScale *
                            (1 + Math.max(0, this.baseScale - 0.7) * 0.08)

                        this.isBig   = this.baseScale >= 1.5
                        this.isSmall = this.baseScale < 0.65
                        this.baseSpeed  = Math.max(0.42, 1.0 - this.baseScale * 0.26)
                        this.chaseSpeed = Math.max(1.5,  2.1 - this.baseScale * 0.20)

                        this.eatRadius = Math.max(10, 36 - this.baseScale * 12)
                        this.baseRadii = this.baseProfile.map(
                            (r) =>
                                r *
                                this.baseScale *
                                Math.min(0.96, 0.82 + this.baseScale * 0.18)
                        )
                        this._lastFatForRadii = -999 // invalidate radii cache

                        if (this.fatTarget >= 1.18 && this.baseScale >= 0.75) {
                            const extra = clamp(
                                (this.baseScale - 0.9) / 0.45,
                                0,
                                3
                            )
                            const eggCount =
                                1 +
                                Math.floor(
                                    extra + (Math.random() < 0.6 ? 1 : 0)
                                )
                            const canAdd = Math.max(
                                0,
                                Math.min(
                                    eggCount,
                                    maxFishCount - fishes.length,
                                    eggCap - eggs.length
                                )
                            )
                            for (let k = 0; k < canAdd; k++) {
                                eggs.push(
                                    new Egg(
                                        this.x + rand(-15, 15),
                                        this.y + rand(-15, 15),
                                        this.type
                                    )
                                )
                            }
                            this.fatTarget -=
                                0.12 + 0.04 * Math.min(2, Math.floor(extra))
                        }
                    }
                }

                let sepX = 0,
                    sepY = 0,
                    sepStr = 0
                for (const other of fishes) {
                    if (other === this) continue
                    const dx = this.x - other.x, dy = this.y - other.y
                    const minD = (this.scale + other.scale) * 55
                    // AABB fast-reject: skip hypot if both axes exceed minD
                    if (Math.abs(dx) > minD && Math.abs(dy) > minD) continue
                    const d = Math.hypot(dx, dy)
                    if (d > 0 && d < minD) {
                        const s = Math.pow((minD - d) / minD, 1.5)
                        sepX += (dx / d) * s
                        sepY += (dy / d) * s
                        sepStr = Math.max(sepStr, s)
                    }
                    // Small fish flee from big fish
                    if (this.isSmall && !other.isSmall) {
                        const fleeD = (this.scale + other.scale) * 120
                        if (d > 0 && d < fleeD) {
                            const fs = Math.pow((fleeD - d) / fleeD, 1.2) * 0.6
                            sepX += (dx / d) * fs
                            sepY += (dy / d) * fs
                            sepStr = Math.max(sepStr, fs)
                        }
                    }
                }
                if (sepStr > 0) {
                    const mix = (isHunting ? 0.22 : 0.12) * (0.4 + sepStr)
                    desiredAngle = lerpAngle(
                        desiredAngle,
                        Math.atan2(sepY, sepX),
                        clamp(mix, 0, 0.26)
                    )
                    desiredSpeed *= 1 + sepStr * 0.03
                }

                const dA = angleDelta(this.angle, desiredAngle)
                this.angle += clamp(
                    dA * this.turnLerp * dt,
                    -this.maxTurnPerFrame * dt,
                    this.maxTurnPerFrame * dt
                )

                const sDiff = desiredSpeed - this.currentSpeed
                this.currentSpeed += sDiff * (sDiff > 0 ? 0.2 : 0.05) * dt

                this.x += Math.cos(this.angle) * this.currentSpeed * dt
                this.y += Math.sin(this.angle) * this.currentSpeed * dt
                this.x = clamp(this.x, -50, width + 50)
                this.y = clamp(this.y, topSafeMargin, height + 50)

                const speedRatio = clamp(
                    this.currentSpeed / this.baseSpeed,
                    0.5,
                    4.0
                )
                const tailFreq = this.isBig ? 0.75 : this.isSmall ? 1.4 : 1.0
                this.swimCycle +=
                    (isHunting ? 0.05 : 0.035) *
                    tailFreq *
                    speedRatio *
                    (1 + Math.max(0, this.fat - 1.0) * 0.55) *
                    dt

                this.segments[0].x = this.x
                this.segments[0].y = this.y
                this.segments[0].angle = this.angle

                for (let i = 1; i < this.numSegments; i++) {
                    const prev = this.segments[i - 1],
                        curr = this.segments[i],
                        t = i / (this.numSegments - 1)
                    let a = Math.atan2(prev.y - curr.y, prev.x - curr.x)
                    let bend = angleDelta(prev.angle, a),
                        MAX_BEND = Math.max(0.14, 0.3 - this.baseScale * 0.1)
                    if (Math.abs(bend) > MAX_BEND)
                        a = prev.angle + Math.sign(bend) * MAX_BEND
                    a += Math.sin(this.swimCycle - t * 3.5) * (t * 0.035)
                    curr.x = prev.x - Math.cos(a) * this.segLength
                    curr.y = prev.y - Math.sin(a) * this.segLength
                    curr.angle = a
                }
                // Cache body outline once per update — reused 2-3× in drawBody
                this._buildBodyPts()
            }

            /* ---- koi body drawing ---- */
            draw() {
                this.drawFins()
                this.drawBody()
                this.drawGillLine()
                this.drawDorsalFin()
                this.drawCaudalFin()
                this.drawEye()
            }

            drawGillLine() {
                // 鳃盖弧线：俯视时头与躯干的分界提示，两侧各一道后弯短弧
                if (qualityTier === 0) return
                const seg = this.segments[3]
                const r = (this.radii[3] || 8 * this.scale) * 0.92
                ctx.save()
                ctx.strokeStyle = this.colors.inkEdge
                ctx.globalAlpha = 1
                ctx.lineWidth = 1.1 * this.scale
                ctx.lineCap = "round"
                const bx = Math.cos(seg.angle),
                    by = Math.sin(seg.angle)
                for (const dir of [1, -1]) {
                    const a = seg.angle + (Math.PI / 2) * dir
                    const nx = Math.cos(a),
                        ny = Math.sin(a)
                    ctx.beginPath()
                    ctx.moveTo(seg.x + nx * r * 0.15, seg.y + ny * r * 0.15)
                    ctx.quadraticCurveTo(
                        seg.x + nx * r * 0.62 - bx * r * 0.1,
                        seg.y + ny * r * 0.62 - by * r * 0.1,
                        seg.x + nx * r * 0.95 - bx * r * 0.55,
                        seg.y + ny * r * 0.95 - by * r * 0.55
                    )
                    ctx.stroke()
                }
                ctx.restore()
            }

            // Build body outline points once per frame (called from update())
            _buildBodyPts() {
                const radii = this.radii
                const n = this.numSegments
                const pts = this._bodyPts
                for (let i = 0; i < n; i++) {
                    const s = this.segments[i], r = radii[i]
                    const pc = Math.cos(s.angle + Math.PI / 2)
                    const ps = Math.sin(s.angle + Math.PI / 2)
                    pts[i].x = s.x + pc * r
                    pts[i].y = s.y + ps * r
                    const li = 2 * n - 1 - i
                    pts[li].x = s.x - pc * r
                    pts[li].y = s.y - ps * r
                }
                // Build Path2D once — reused 3× in drawBody instead of _tracePath each time
                const path = new Path2D()
                const end = pts.length - 1
                path.moveTo(pts[0].x, pts[0].y)
                for (let i = 1; i < end; i++)
                    path.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i+1].x) / 2, (pts[i].y + pts[i+1].y) / 2)
                path.quadraticCurveTo(pts[end].x, pts[end].y, pts[0].x, pts[0].y)
                this._bodyPath = path
            }

drawBody() {
                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                ctx.lineJoin = "round"
                ctx.lineCap = "round"
                // 1. 边缘光晕（最外层，昭和专属）
                if (this.colors.rimLight && qualityTier >= 2) {
                    ctx.save()
                    ctx.strokeStyle = this.colors.rimLight
                    ctx.lineJoin = "round"
                    ctx.lineCap = "round"
                    ctx.globalAlpha = 0.10
                    ctx.lineWidth = 10 * this.scale
                    ctx.stroke(this._bodyPath)
                    ctx.globalAlpha = 0.22
                    ctx.lineWidth = 5 * this.scale
                    ctx.stroke(this._bodyPath)
                    ctx.globalAlpha = 0.50
                    ctx.lineWidth = 2 * this.scale
                    ctx.stroke(this._bodyPath)
                    ctx.restore()
                }
                // 2. 鱼体底色
                ctx.fillStyle = this.colors.base
                ctx.fill(this._bodyPath)
                // 3. 花纹 — clip 用缓存的 Path2D，省去路径重新遍历；背景不透明故 source-atop 无效
                ctx.save()
                ctx.clip(this._bodyPath)
                const patternLimit = qualityTier === 0 ? 2 : this.patterns.length
                for (let pi = 0; pi < patternLimit; pi++) {
                    const p = this.patterns[pi]
                    ctx.fillStyle = p.color
                    this.drawOrganicSpot(this.segments[p.seg], p.size, p.seed)
                }
                // 3b. body volume — top-down, the light is the water surface, so
                // the spine reads bright and the flanks curve into soft shadow.
                // One cross-body gradient (short axis) over base AND pattern
                // turns the flat cutout into a rounded, living body.
                if (qualityTier > 0) {
                    const n = this.numSegments
                    const midIdx = Math.floor(n * 0.4)
                    const mid = this.segments[midIdx]
                    const head = this.segments[2]
                    const tailS = this.segments[Math.max(2, n - 4)]
                    const ang = Math.atan2(tailS.y - head.y, tailS.x - head.x)
                    const perp = ang + Math.PI / 2
                    const R = (this.radii[midIdx] || 10) * 1.25
                    const g = ctx.createLinearGradient(
                        mid.x + Math.cos(perp) * R,
                        mid.y + Math.sin(perp) * R,
                        mid.x - Math.cos(perp) * R,
                        mid.y - Math.sin(perp) * R
                    )
                    // dark base fish (showa) wants a lighter touch than pale ones
                    const edge = this.type === "showa" ? 0.16 : 0.24
                    g.addColorStop(0.0, `rgba(6, 10, 16, ${edge})`)
                    g.addColorStop(0.34, "rgba(255,255,255,0.045)")
                    g.addColorStop(0.5, "rgba(255,255,255,0.12)")
                    g.addColorStop(0.66, "rgba(255,255,255,0.045)")
                    g.addColorStop(1.0, `rgba(6, 10, 16, ${edge})`)
                    ctx.fillStyle = g
                    ctx.fill(this._bodyPath)
                }
                ctx.restore()
                // 4. 墨边描边
                ctx.strokeStyle = this.colors.inkEdge
                ctx.lineWidth = 1.0 * this.scale
                ctx.stroke(this._bodyPath)
                ctx.restore()
            }

            drawOrganicSpot(seg: any, sizeMult: number, seed: number) {
                // 斑块沿脊线拉长（绯盘顺着背脊铺开）——原来的三片大角度
                // 交叉椭圆会并成横向的"花瓣/爱心"，很不像鱼身花纹
                const baseSize = 13 * this.scale * sizeMult
                const ca = Math.cos(seg.angle),
                    sa = Math.sin(seg.angle)
                ctx.beginPath()
                ctx.ellipse(seg.x, seg.y, baseSize * 1.1, baseSize * 0.78, seg.angle, 0, TWO_PI)
                if (qualityTier > 0) {
                    const j = (o: number) => Math.sin(seed + o) * baseSize * 0.22
                    ctx.ellipse(
                        seg.x + ca * baseSize * 0.85 + sa * j(1),
                        seg.y + sa * baseSize * 0.85 - ca * j(1),
                        baseSize * 0.82, baseSize * 0.6,
                        seg.angle + Math.sin(seed) * 0.22, 0, TWO_PI)
                    ctx.ellipse(
                        seg.x - ca * baseSize * 0.8 + sa * j(3),
                        seg.y - sa * baseSize * 0.8 - ca * j(3),
                        baseSize * 0.75, baseSize * 0.55,
                        seg.angle - Math.sin(seed * 1.3) * 0.2, 0, TWO_PI)
                }
                ctx.fill()
            }

            finSwayAmp() {
                return (
                    0.15 +
                    clamp(
                        (this.currentSpeed - this.baseSpeed) /
                            (this.chaseSpeed - this.baseSpeed + 1e-6),
                        0,
                        1
                    ) *
                        0.2
                )
            }

            /* ---- koi fins + eye ---- */
            drawFins() {
                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                ctx.fillStyle = this.colors.fin
                ctx.strokeStyle = this.colors.finEdge
                ctx.lineWidth = 1.15 * this.scale
                ctx.lineJoin = "round"
                ctx.lineCap = "round"
                const amp = this.finSwayAmp(),
                    t = this.swimCycle,
                    ph = this.finPhase
                // 胸鳍长在鳃后（约 17% 体长）——原先在 25% 处像身体中段
                // 长出两片"肩膀"；腹鳍随之前移保持比例
                this.drawPectoralFin(this.segments[4], true, amp, ph, t)
                this.drawPectoralFin(this.segments[4], false, amp, ph, t)
                this.drawPelvicFin(this.segments[12], true, amp, ph, t)
                this.drawPelvicFin(this.segments[12], false, amp, ph, t)
                ctx.restore()
            }

            drawPectoralFin(
                seg: any,
                isRight: boolean,
                amp: number,
                ph: number,
                t: number
            ) {
                const len = 38 * this.scale * (1 + (this.fat - 1.25) * 0.65),
                    dir = isRight ? 1 : -1
                const angle =
                    seg.angle +
                    Math.PI * 0.72 * dir +
                    Math.sin(t * 1.2 + ph) * amp * dir
                const rootX = seg.x,
                    rootY = seg.y
                const leadA = angle - 0.3 * dir,
                    leadX = rootX + Math.cos(leadA) * len * 0.95,
                    leadY = rootY + Math.sin(leadA) * len * 0.95
                const cpLeadX = rootX + Math.cos(angle - 0.6 * dir) * len * 0.7,
                    cpLeadY = rootY + Math.sin(angle - 0.6 * dir) * len * 0.7
                const trailA = angle + 0.4 * dir,
                    trailX = rootX + Math.cos(trailA) * len * 0.65,
                    trailY = rootY + Math.sin(trailA) * len * 0.65
                const cpTrailX =
                        rootX + Math.cos(angle + 0.6 * dir) * len * 0.35,
                    cpTrailY = rootY + Math.sin(angle + 0.6 * dir) * len * 0.35
                const tipX = rootX + Math.cos(angle) * len * 1.1,
                    tipY = rootY + Math.sin(angle) * len * 1.1
                ctx.beginPath()
                ctx.moveTo(rootX, rootY)
                ctx.quadraticCurveTo(cpLeadX, cpLeadY, leadX, leadY)
                ctx.quadraticCurveTo(tipX, tipY, trailX, trailY)
                ctx.quadraticCurveTo(cpTrailX, cpTrailY, rootX, rootY)
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                if (qualityTier === 0) return
                ctx.save()
                ctx.globalAlpha = 0.25
                ctx.lineWidth = 1.0 * this.scale
                ctx.beginPath()
                for (let i = 0; i <= 5; i++) {
                    const rt = i / 5,
                        rayA = leadA + (trailA - leadA) * rt,
                        rayLen = len * (0.7 + Math.sin(rt * Math.PI) * 0.35)
                    const flex =
                        Math.sin(this.swimCycle * 1.5 + i * 0.2) * 0.05 * dir
                    const rx = rootX + Math.cos(rayA + flex) * rayLen,
                        ry = rootY + Math.sin(rayA + flex) * rayLen
                    ctx.moveTo(rootX, rootY)
                    ctx.quadraticCurveTo(
                        rootX + Math.cos(rayA + flex * 2) * rayLen * 0.5,
                        rootY + Math.sin(rayA + flex * 2) * rayLen * 0.5,
                        rx,
                        ry
                    )
                }
                ctx.stroke()
                ctx.restore()
            }

            drawPelvicFin(
                seg: any,
                isRight: boolean,
                amp: number,
                ph: number,
                t: number
            ) {
                const len = 26 * this.scale * (1 + (this.fat - 1.25) * 0.55),
                    dir = isRight ? 1 : -1
                const angle =
                    seg.angle +
                    Math.PI * 0.85 * dir +
                    Math.sin(t * 1.15 + ph + 0.9) * (amp * 0.55) * dir
                const rootX = seg.x,
                    rootY = seg.y,
                    leadX = rootX + Math.cos(angle - 0.25 * dir) * len,
                    leadY = rootY + Math.sin(angle - 0.25 * dir) * len
                const trailX = rootX + Math.cos(angle + 0.25 * dir) * len * 0.8,
                    trailY = rootY + Math.sin(angle + 0.25 * dir) * len * 0.8
                ctx.beginPath()
                ctx.moveTo(rootX, rootY)
                ctx.quadraticCurveTo(
                    rootX + Math.cos(angle - 0.4 * dir) * len * 0.6,
                    rootY + Math.sin(angle - 0.4 * dir) * len * 0.6,
                    leadX,
                    leadY
                )
                ctx.quadraticCurveTo(
                    rootX + Math.cos(angle) * len * 1.1,
                    rootY + Math.sin(angle) * len * 1.1,
                    trailX,
                    trailY
                )
                ctx.quadraticCurveTo(
                    rootX + Math.cos(angle + 0.4 * dir) * len * 0.4,
                    rootY + Math.sin(angle + 0.4 * dir) * len * 0.4,
                    rootX,
                    rootY
                )
                ctx.fill()
                ctx.stroke()
            }

            drawDorsalFin() {
                // 俯视角：背鳍读作贴着脊线的窄脊 + 一条脊线，
                // 不是伸向一侧的翼片（原实现把它画在鱼体左侧，破坏俯视感）
                const S0 = 8,
                    S1 = 19,
                    n = S1 - S0,
                    t = this.swimCycle
                const sway =
                    Math.sin(t * 0.95 + this.finPhase) *
                    this.finSwayAmp() *
                    0.3
                const wPro = [
                    0, 0.35, 0.7, 1.0, 0.95, 0.8, 0.65, 0.5, 0.35, 0.2, 0.08, 0,
                ]
                const maxW = 2.6 * this.scale
                ctx.save()
                ctx.fillStyle = this.colors.fin
                ctx.globalAlpha = 0.5
                ctx.beginPath()
                for (let i = 0; i <= n; i++) {
                    const seg = this.segments[S0 + i],
                        w = maxW * wPro[i],
                        a = seg.angle + Math.PI / 2 + sway * wPro[i] * 0.4
                    const x = seg.x + Math.cos(a) * w,
                        y = seg.y + Math.sin(a) * w
                    if (i === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                for (let i = n; i >= 0; i--) {
                    const seg = this.segments[S0 + i],
                        w = maxW * wPro[i],
                        a = seg.angle - Math.PI / 2 - sway * wPro[i] * 0.4
                    ctx.lineTo(
                        seg.x + Math.cos(a) * w,
                        seg.y + Math.sin(a) * w
                    )
                }
                ctx.closePath()
                ctx.fill()
                // 脊线 hairline — 俯视鱼背中线
                if (qualityTier > 0) {
                    ctx.globalAlpha = 0.5
                    ctx.strokeStyle = this.colors.inkEdge
                    ctx.lineWidth = 0.8 * this.scale
                    ctx.lineCap = "round"
                    ctx.beginPath()
                    for (let i = 0; i <= n; i++) {
                        const seg = this.segments[S0 + i]
                        if (i === 0) ctx.moveTo(seg.x, seg.y)
                        else ctx.lineTo(seg.x, seg.y)
                    }
                    ctx.stroke()
                }
                ctx.restore()
            }

            drawCaudalFin() {
                // 分叉的长尾鳍：两叶 + 后缘内凹的叉口，尾梢滞后甩动。
                // 原实现是一小片近似三角的"靴子"，是最破坏鱼形的部件。
                const tail = this.segments[this.numSegments - 1],
                    ped = this.segments[this.numSegments - 2]
                const len = 52 * this.scale,
                    wave =
                        Math.sin(this.swimCycle - 1.6) *
                        (0.12 + this.finSwayAmp() * 0.3),
                    angle = tail.angle + Math.PI + wave
                const ax = (tail.x + ped.x) * 0.5,
                    ay = (tail.y + ped.y) * 0.5
                ctx.save()
                ctx.fillStyle = this.colors.fin
                ctx.strokeStyle = this.colors.finEdge
                ctx.lineWidth = 1.1 * this.scale
                ctx.lineJoin = "round"
                const spread =
                    0.5 +
                    Math.sin(this.swimCycle * 1.05 + this.finPhase) * 0.07
                const lobeA = angle - spread * 0.55,
                    lobeB = angle + spread * 0.55
                const tipAX = ax + Math.cos(lobeA) * len,
                    tipAY = ay + Math.sin(lobeA) * len
                const tipBX = ax + Math.cos(lobeB) * len * 0.96,
                    tipBY = ay + Math.sin(lobeB) * len * 0.96
                const notchX = ax + Math.cos(angle) * len * 0.52,
                    notchY = ay + Math.sin(angle) * len * 0.52
                ctx.beginPath()
                ctx.moveTo(ax, ay)
                ctx.quadraticCurveTo(
                    ax + Math.cos(angle - spread * 1.05) * len * 0.55,
                    ay + Math.sin(angle - spread * 1.05) * len * 0.55,
                    tipAX,
                    tipAY
                )
                ctx.quadraticCurveTo(
                    ax + Math.cos(angle - spread * 0.22) * len * 0.72,
                    ay + Math.sin(angle - spread * 0.22) * len * 0.72,
                    notchX,
                    notchY
                )
                ctx.quadraticCurveTo(
                    ax + Math.cos(angle + spread * 0.22) * len * 0.72,
                    ay + Math.sin(angle + spread * 0.22) * len * 0.72,
                    tipBX,
                    tipBY
                )
                ctx.quadraticCurveTo(
                    ax + Math.cos(angle + spread * 1.05) * len * 0.55,
                    ay + Math.sin(angle + spread * 1.05) * len * 0.55,
                    ax,
                    ay
                )
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
                if (qualityTier === 0) { ctx.restore(); return }
                ctx.save()
                ctx.globalAlpha = 0.22
                ctx.lineWidth = 0.9 * this.scale
                ctx.beginPath()
                for (let i = 0; i < 7; i++) {
                    const k = i / 6,
                        a = lobeA + (lobeB - lobeA) * k,
                        // 叉尾：两叶的鳍条长，叉口处的短
                        l =
                            len *
                            (0.55 +
                                Math.abs(k - 0.5) * 0.9 +
                                Math.sin(this.swimCycle + i) * 0.015)
                    ctx.moveTo(ax, ay)
                    ctx.lineTo(ax + Math.cos(a) * l, ay + Math.sin(a) * l)
                }
                ctx.stroke()
                ctx.restore()
                ctx.restore()
            }

            drawEye() {
                // 俯视：一对眼睛对称嵌在头部两侧（单只偏置的眼读不出朝向）
                const head = this.segments[2]
                const fx = Math.cos(head.angle),
                    fy = Math.sin(head.angle)
                const px = Math.cos(head.angle + Math.PI / 2),
                    py = Math.sin(head.angle + Math.PI / 2)
                const side = (this.radii[2] || 8 * this.scale) * 0.68
                const ahead = 1.6 * this.scale
                ctx.save()
                ctx.globalCompositeOperation = "source-over"
                for (const dir of [1, -1]) {
                    const ex = head.x + fx * ahead + px * side * dir
                    const ey = head.y + fy * ahead + py * side * dir
                    ctx.fillStyle = "rgba(8, 10, 12, 0.6)"
                    ctx.beginPath()
                    ctx.arc(ex, ey, 1.5 * this.scale, 0, TWO_PI)
                    ctx.fill()
                    ctx.fillStyle = "rgba(255,255,255,0.22)"
                    ctx.beginPath()
                    ctx.arc(
                        ex - 0.5 * this.scale,
                        ey - 0.5 * this.scale,
                        0.55 * this.scale,
                        0,
                        TWO_PI
                    )
                    ctx.fill()
                }
                ctx.restore()
            }
        }

        /* ---- pond population ---- */
        const maxFishCount = qualityTier >= 2 ? 34 : qualityTier === 1 ? 24 : 16
        const eggCap = qualityTier >= 2 ? 28 : qualityTier === 1 ? 18 : 10
        const foodCap = qualityTier >= 2 ? 180 : qualityTier === 1 ? 120 : 72
        const foodBurstMin = qualityTier >= 2 ? 7 : qualityTier === 1 ? 5 : 4
        const foodBurstMax = qualityTier >= 2 ? 14 : qualityTier === 1 ? 10 : 7
        const initialFishConfigs = [
            [0.42, 0.11, "kohaku", 0.42],
            [0.56, 0.13, "sanke", 0.34],
            [0.66, 0.18, "showa", 0.46],
            [0.36, 0.23, "kohaku", 0.52],
            [0.50, 0.27, "yamabuki", 0.38],
            [0.70, 0.31, "kohaku", 0.44],
            [0.31, 0.36, "sanke", 0.36],
            [0.47, 0.39, "showa", 1.25],
            [0.60, 0.43, "kohaku", 1.12],
            [0.39, 0.47, "yamabuki", 0.56],
            [0.54, 0.50, "kohaku", 0.48],
            [0.69, 0.55, "sanke", 0.38],
            [0.34, 0.59, "showa", 0.42],
            [0.48, 0.63, "kohaku", 0.34],
            [0.63, 0.67, "yamabuki", 0.45],
            [0.40, 0.71, "sanke", 0.32],
            [0.56, 0.75, "kohaku", 0.36],
            [0.68, 0.80, "showa", 0.28],
            [0.45, 0.16, "kohaku", 0.24],
            [0.62, 0.24, "showa", 0.26],
            [0.33, 0.32, "sanke", 0.22],
            [0.72, 0.45, "kohaku", 0.24],
            [0.37, 0.55, "showa", 0.23],
            [0.59, 0.61, "sanke", 0.25],
            [0.46, 0.69, "kohaku", 0.22],
            [0.64, 0.77, "showa", 0.24],
            [0.29, 0.49, "kohaku", 0.23],
            [0.74, 0.60, "yamabuki", 0.24],
            [0.35, 0.78, "sanke", 0.22],
            [0.52, 0.84, "kohaku", 0.2],
            [0.72, 0.72, "showa", 0.21],
            [0.28, 0.67, "yamabuki", 0.2],
        ] as const
        const initialFishLimit =
            qualityTier >= 2
                ? initialFishConfigs.length
            : qualityTier === 1
                  ? 18
                  : 10
        const fishes: any[] = initialFishConfigs
            .slice(0, initialFishLimit)
            .map(
                ([fx, fy, type, scale]) =>
                    new Koi(width * fx, height * fy, type, scale * viewScale)
            )

        if (qualityTier >= 1) {
            const mat1 = new Koi(width * 0.51, height * 0.32, "kohaku", 1.32 * viewScale)
            mat1.fat = 1.12
            mat1.fatTarget = 1.28
            fishes.push(mat1)
        }
        if (qualityTier >= 2) {
            const mat2 = new Koi(width * 0.48, height * 0.48, "showa", 1.42 * viewScale)
            mat2.fat = 1.14
            mat2.fatTarget = 1.3
            fishes.push(mat2)
        }

        const foodParticles: any[] = []
        const eggs: any[] = []

        /* ---- feeding + hatching ---- */
        function spawnFoodBurst(x: number, y: number) {
            const count = Math.floor(rand(foodBurstMin, foodBurstMax))
            for (let i = 0; i < count; i++)
                foodParticles.push(
                    new FoodParticle(x + rand(-18, 18), y + rand(-12, 12))
                )
            if (foodParticles.length > foodCap)
                foodParticles.splice(0, foodParticles.length - foodCap)
        }

        // One feed drop — shared by pointerdown and the chip's keyboard path
        // (onFeedKeyDown above): spawn the burst, bump the count, and emit the
        // koi:feed CustomEvent the How-I-Work overlay listens for.
        function dropFeedAt(x: number, y: number) {
            spawnFoodBurst(x, y)
            feedCount++
            try {
                window.dispatchEvent(
                    new CustomEvent("koi:feed", {
                        detail: { count: feedCount },
                    })
                )
            } catch {
                /* CustomEvent unavailable — signal is progressive */
            }
            // reduced-motion parks the render loop after one frame — poke it
            // so the pellets from this drop still paint
            refreshStaticFrame()
        }

        function hatchEgg(egg: any) {
            const _types = ["kohaku", "yamabuki", "sanke", "showa"]
            const baby = new Koi(
                egg.x + rand(-18, 18),
                egg.y + rand(-18, 18),
                _types[Math.floor(Math.random() * 4)],
                rand(0.35, 0.45)
            )
            baby.fat = 1.25
            baby.fatTarget = 1.25
            if (fishes.length < maxFishCount) fishes.push(baby)
        }

        /* ---- pointerdown interactions ---- */
        const onPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return

            // ✨ 新增：点击屏幕跳过入场动画
            if (
                !introSkipped &&
                performance.now() - introStart < introDuration
            ) {
                forceSkipIntro()
            }

            const pos = getPointerPos(e.clientX, e.clientY)
            for (let i = eggs.length - 1; i >= 0; i--) {
                if (eggs[i].hitTest(pos.x, pos.y)) {
                    hatchEgg(eggs.splice(i, 1)[0])
                    return
                }
            }
            if (feedMode) {
                // Feed-count signal for the How-I-Work overlay (and anything
                // else outside this island — it is loaded via next/dynamic,
                // so a DOM event is cleaner than threading a callback prop).
                dropFeedAt(pos.x, pos.y)
            } else {
                for (const f of fishes) {
                    const dHead = dist(f.x, f.y, pos.x, pos.y),
                        dMid = dist(
                            f.segments[11].x,
                            f.segments[11].y,
                            pos.x,
                            pos.y
                        )
                    if (Math.min(dHead, dMid) < f.baseScale * 60 + 18) {
                        f.angle = Math.atan2(f.y - pos.y, f.x - pos.x)
                        f.currentSpeed = f.chaseSpeed * 1.6
                        f.targetFood = null
                    }
                }
            }
        }

        container.addEventListener("pointerdown", onPointerDown)

        /* ---- background + lily pad drawing ---- */
        function drawBackground() {
            ctx.globalCompositeOperation = "source-over"
            ctx.fillStyle = "#041114"
            ctx.fillRect(0, 0, width, height)
            const glow = ctx.createRadialGradient(
                centerX,
                height * 0.42,
                Math.min(width, height) * 0.08,
                centerX,
                height * 0.45,
                Math.max(width, height) * 0.68
            )
            glow.addColorStop(0, "rgba(10, 42, 48, 0.42)")
            glow.addColorStop(0.48, "rgba(5, 24, 29, 0.26)")
            glow.addColorStop(1, "rgba(2, 3, 5, 0)")
            ctx.fillStyle = glow
            ctx.fillRect(0, 0, width, height)
        }

        function drawLilyPads() {
            if (!showLilyPads) return
            padCtx.clearRect(0, 0, width, height)
            const SEGS = qualityTier >= 2 ? 52 : qualityTier === 1 ? 36 : 24
            padCtx.save()
            padCtx.globalCompositeOperation = "screen"
            const padLimit = qualityTier === 0 ? 12 : qualityTier === 1 ? 18 : lilyPads.length
            for (const pad of lilyPads.slice(0, padLimit)) {
                pad.phase += pad.speed
                padCtx.save()
                padCtx.translate(pad.x, pad.y)
                padCtx.rotate(pad.rotation)
                padCtx.fillStyle = `rgba(170,215,155,${pad.alpha})`
                padCtx.shadowColor = `rgba(170,215,155,${pad.alpha})`
                padCtx.shadowBlur = 0
                padCtx.beginPath()
                for (let i = 0; i <= SEGS; i++) {
                    const a = (i / SEGS) * TWO_PI,
                        notch = 1 - Math.pow(Math.cos(a / 2), 20) * 0.3
                    const ripple =
                        1 +
                        Math.sin(a * 4 + pad.seed + pad.phase) * 0.03 +
                        Math.sin(a * 7 + pad.seed * 1.5 - pad.phase * 0.7) *
                            0.015
                    const rr = pad.r * ripple * notch,
                        x = Math.cos(a) * rr,
                        y = Math.sin(a) * rr
                    if (i === 0) padCtx.moveTo(x, y)
                    else padCtx.lineTo(x, y)
                }
                padCtx.closePath()
                padCtx.fill()
                padCtx.shadowBlur = 0
                padCtx.lineWidth =
                    qualityTier >= 2 ? 0.55 : qualityTier === 1 ? 0.42 : 0.3
                padCtx.strokeStyle = `rgba(200,240,180,${pad.alpha * 0.55})`
                const numVeins = qualityTier === 0 ? 7 : qualityTier === 1 ? 9 : 11,
                    skipAngle = 0.42,
                    veinsSpan = TWO_PI - skipAngle * 2
                padCtx.beginPath()
                for (let v = 0; v < numVeins; v++) {
                    const va = skipAngle + ((v + 0.5) / numVeins) * veinsSpan,
                        vNotch = 1 - Math.pow(Math.cos(va / 2), 20) * 0.3
                    const vRipple =
                        1 +
                        Math.sin(va * 4 + pad.seed + pad.phase) * 0.03 +
                        Math.sin(va * 7 + pad.seed * 1.5 - pad.phase * 0.7) *
                            0.015
                    const edgeR = pad.r * vRipple * vNotch * 0.83,
                        cpA = va + Math.sin(v * 1.7 + pad.seed) * 0.07
                    padCtx.moveTo(0, 0)
                    padCtx.quadraticCurveTo(
                        Math.cos(cpA) * edgeR * 0.48,
                        Math.sin(cpA) * edgeR * 0.48,
                        Math.cos(va) * edgeR,
                        Math.sin(va) * edgeR
                    )
                }
                padCtx.stroke()
                padCtx.restore()
            }
            padCtx.restore()
        }

        /* ---- frame pacing + intro timing ---- */
        const introDuration = Math.max(200, props.introDurationMs | 0)
        const introStart = performance.now()
        // reduced-motion: the loop parks after ONE frame (see animate), so
        // that frame must already be the finished state — no fade-in ramp,
        // no scramble.
        if (prefersReduce) forceSkipIntro()
        const padFrameInterval = prefersReduce
            ? 160
            : qualityTier >= 2
              ? 56
              : qualityTier === 1
                ? 80
                : 133

        const msPerFrame = qualityTier === 0 ? 1000 / 30 : qualityTier === 1 ? 1000 / 45 : 1000 / 60
        let lastFrameTime = performance.now()
        let raf = 0,
            isRunning = false,
            isInViewport = false   // start paused; IO or fallback will start it
        let isPageVisible =
            !document.hidden && document.visibilityState === "visible"
        let lastPadDrawAt = -Infinity
        const computeViewportVisibility = () => {
            const rect = container.getBoundingClientRect()
            const visibleArea =
                Math.max(
                    0,
                    Math.min(rect.right, window.innerWidth) -
                        Math.max(rect.left, 0)
                ) *
                Math.max(
                    0,
                    Math.min(rect.bottom, window.innerHeight) -
                        Math.max(rect.top, 0)
                )
            const totalArea =
                Math.max(1, rect.width || container.clientWidth || 1) *
                Math.max(1, rect.height || container.clientHeight || 1)
            return visibleArea / totalArea > 0.08
        }
        /* ---- render loop ---- */
        function animate(now: number) {
            if (!isRunning) return
            if (msPerFrame > 0 && now - lastFrameTime < msPerFrame) {
                raf = requestAnimationFrame(animate)
                return
            }
            // Delta-time normalised to 60 fps (dt=1.0). Capped at 3× to prevent
            // position explosions after tab-switch pauses.
            const dt = Math.min((now - lastFrameTime) / 16.667, 3.0)
            lastFrameTime = now

            let t = clamp((now - introStart) / introDuration, 0, 1)

            // ✨ 新增：如果跳过了，强制 t=1
            if (introSkipped) t = 1

            updateScrollEffects(t * 280)
            drawBackground()
            for (let i = foodParticles.length - 1; i >= 0; i--) {
                const p = foodParticles[i]
                p.update(now, dt)
                if (!p.alive) foodParticles.splice(i, 1)
            }
            for (const p of foodParticles) p.draw(now)
            for (let i = eggs.length - 1; i >= 0; i--) {
                const egg = eggs[i]
                egg.update()
                egg.draw()
                if (now - egg.birthTime >= 5000) {
                    hatchEgg(egg)
                    eggs.splice(i, 1)
                }
            }
            for (const f of fishes) {
                f.update(fishes, foodParticles, eggs, now, dt)
                f.draw()
            }
            if (showLilyPads && now - lastPadDrawAt >= padFrameInterval) {
                drawLilyPads()
                lastPadDrawAt = now
            }
            if (prefersReduce) {
                // reduced-motion static degrade: this frame is the pond —
                // park the loop instead of animating at a lower fps. Feed
                // drops repaint via refreshStaticFrame(); scroll/visibility
                // events at most restart one more single frame.
                isRunning = false
                raf = 0
                return
            }
            raf = requestAnimationFrame(animate)
        }

        // Single-frame repaint for the parked reduced-motion loop (no-op
        // while the normal loop is running).
        function refreshStaticFrame() {
            if (!prefersReduce || isRunning || !isPageVisible || !isInViewport)
                return
            isRunning = true
            // rewind the frame throttle so the very next rAF tick draws
            lastFrameTime = performance.now() - msPerFrame - 1
            raf = requestAnimationFrame(animate)
        }

        /* ---- visibility + viewport pause ---- */
        const updateAnimationState = () => {
            const shouldRun = isPageVisible && isInViewport
            if (shouldRun === isRunning) return
            isRunning = shouldRun
            if (isRunning) {
                lastPadDrawAt = -Infinity
                lastFrameTime = performance.now()  // reset dt on resume to prevent spike
                raf = requestAnimationFrame(animate)
            } else if (raf) {
                cancelAnimationFrame(raf)
                raf = 0
            }
        }

        const onVisibilityChange = () => {
            isPageVisible =
                !document.hidden && document.visibilityState === "visible"
            updateAnimationState()
        }
        const onWindowBlur = () => {
            isPageVisible = false
            updateAnimationState()
        }
        const onWindowFocus = () => {
            isPageVisible =
                !document.hidden && document.visibilityState === "visible"
            isInViewport = computeViewportVisibility()
            updateAnimationState()
        }
        const onPageHide = () => {
            isPageVisible = false
            updateAnimationState()
        }
        const onPageShow = () => {
            isPageVisible =
                !document.hidden && document.visibilityState === "visible"
            isInViewport = computeViewportVisibility()
            updateAnimationState()
        }
        const onViewportChange = () => {
            isInViewport = computeViewportVisibility()
            updateAnimationState()
        }

        document.addEventListener("visibilitychange", onVisibilityChange)
        window.addEventListener("blur", onWindowBlur, { passive: true })
        window.addEventListener("focus", onWindowFocus, { passive: true })
        window.addEventListener("pagehide", onPageHide, { passive: true })
        window.addEventListener("pageshow", onPageShow, { passive: true })
        window.addEventListener("scroll", onViewportChange, { passive: true })

        let viewportObserver: IntersectionObserver | null = null
        if ("IntersectionObserver" in window) {
            viewportObserver = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0]
                    isInViewport =
                        !!entry &&
                        entry.isIntersecting &&
                        entry.intersectionRatio > 0.08
                    updateAnimationState()
                },
                { threshold: [0, 0.08, 0.2, 0.4] }
            )
            viewportObserver.observe(container)
        } else {
            // IO not supported — assume visible and start
            isInViewport = true
        }
        // Start immediately; IntersectionObserver will pause if scrolled out of view
        updateAnimationState()

        /* ---- teardown ---- */
        return () => {
            cancelAnimationFrame(raf)
            document.removeEventListener("visibilitychange", onVisibilityChange)
            window.removeEventListener("blur", onWindowBlur)
            window.removeEventListener("focus", onWindowFocus)
            window.removeEventListener("pagehide", onPageHide)
            window.removeEventListener("pageshow", onPageShow)
            window.removeEventListener("scroll", onViewportChange)
            window.removeEventListener("keydown", handleKeyDown) // ✨ 清理事件
            window.removeEventListener("koi:how-reveal", onHowReveal)
            viewportObserver?.disconnect()
            window.removeEventListener("resize", onResize)
            container.removeEventListener("pointermove", onPointerMove)
            container.removeEventListener("pointerleave", onPointerLeave)
            container.removeEventListener("pointerdown", onPointerDown)
            feedBtn.removeEventListener("click", onFeedClick)
            feedBtn.removeEventListener("pointerdown", onFeedPointerDown)
            feedBtn.removeEventListener("keydown", onFeedKeyDown)
            container.classList.remove("feed-mode")
            container.classList.remove("how-revealed")
        }
    }, [props.introDurationMs, showLilyPads])

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
                background: "#020305",
                overflow: "hidden",
                ["--koi-hero-x" as string]: String(props.heroBoxXvw),
            }}
        >
            {/* ---- scoped styles ---- */}
            <style>{stripCssComments(`
            .koi-container{
              position:absolute; inset:0; width:100%; height:100%;
              overflow:hidden; cursor:default;
              position: relative;
              /* NO z-index / isolation here: the container must NOT trap its
                 children in a private stacking context, so the feed chip
                 (z30) and feed cursor (z1000) can float ABOVE the lotus
                 banks (.koi-lotus-frame z6) while the fish canvas (z1)
                 stays beneath them */
            }
            #fishCanvas{
              position:absolute; inset:0; z-index:1;
              display:block; width:100%; height:100%;
              opacity:0; will-change: opacity;
            }
            #padCanvas{
              position:absolute; inset:0; z-index:2; width:100%; height:100%;
              display:none; pointer-events:none;
              opacity:0; will-change: opacity;
            }
            
            /* 🌟 全局薄膜噪点，增加科技水墨画的极细颗粒质感 */
            .noise-overlay {
                position: absolute; inset: 0; z-index: 10; pointer-events: none;
                background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
                opacity: 0.04; mix-blend-mode: overlay;
            }

            /* 🌟 电影级四角暗角渐晕 — 纯 CSS，无性能开销 */
            .vignette-overlay {
                position: absolute; inset: 0; z-index: 9; pointer-events: none;
                background: radial-gradient(ellipse 90% 90% at 50% 50%, transparent 38%, rgba(0,0,0,0.55) 100%);
            }

            /* Feed UI — intro center; after the first feed it docks to the
               left edge as a small chip (transform/opacity only; the dock
               delta is measured into --dock-x/--dock-s by JS). */
            #hero-ui {
              position: absolute;
              top: 50%; left: 50%;
              transform: translate(-50%, -50%);
              pointer-events: auto;
              z-index: 30;
              will-change: transform, opacity;
              transition: transform 0.8s var(--ease-silk),
                          opacity 0.65s cubic-bezier(0.4,0,0.2,1);
              animation: feedIntroAppear 0.7s 0.9s ease both;
            }
            @keyframes feedIntroAppear {
              from { opacity:0; transform: translate(-50%, -40%); }
              to   { opacity:1; transform: translate(-50%, -50%); }
            }
            #hero-ui.dismissed {
              transform: translate(
                  calc(-50% + var(--dock-x, 0px)),
                  calc(-50% + var(--dock-y, 0px))
                )
                scale(var(--dock-s, 1));
              animation: none;
            }
            @media (max-width: 740px) {
              /* phone: the pond band can grow to host the How-I-Work stack —
                 keep the tip anchored in the top water area. 220px centres it
                 in the 320px strip of open water above the stack (the strip
                 was 460px when this said 380px — the 2026-07-10 pacing pass
                 shrank it and the chip sat on the How-I-Work title). */
              #hero-ui { top: min(50%, 220px); }
            }

            #scroll-tip {
              position:absolute; bottom:36px; left:50%; transform: translateX(-50%);
              display:flex; flex-direction:column; align-items:center; gap:10px;
              pointer-events:none; z-index:20;
            }
            .scroll-tip-label {
              font-family: 'JetBrains Mono', monospace; font-size: var(--text-micro); font-weight: 300;
              letter-spacing: 0.28em; color: rgba(255,255,255,0.35); text-transform: uppercase;
              animation: scrollTipPulse 3s ease-in-out infinite;
            }
            .scroll-tip-chevron {
              display: flex; flex-direction: column; align-items: center; gap: 3px;
              animation: scrollTipDrop 3s ease-in-out infinite;
            }
            .scroll-tip-chevron span {
              display: block; width: 8px; height: 1px;
              background: rgba(255,255,255,0.45);
            }
            .scroll-tip-chevron span:nth-child(1) { transform: rotate(35deg) translateX(3px); }
            .scroll-tip-chevron span:nth-child(2) { transform: rotate(-35deg) translateX(-3px); }
            @keyframes scrollTipPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
            @keyframes scrollTipDrop {
              0%,100%{ transform: translateY(0); opacity:0.5; }
              50%     { transform: translateY(5px); opacity:1; }
            }

            /* Feed chip — quiet ink-glass control: hairline edge, 4px radius,
               uppercase label; the glowing pellets stay as the one warm accent. */
            #feed-ui {
              display: flex; align-items: center;
              gap: 14px;
              padding: 13px 20px;
              /* one ink-glass recipe across the chip family (feed chip,
                 How-I-Work toggle, case INDEX chip): 0.62 ink, 0.16 hairline */
              background: rgba(10, 10, 10, 0.62);
              backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(255,255,255,0.16);
              border-radius: var(--radius-control);
              cursor: pointer; user-select: none; pointer-events: auto;
              transition: background var(--dur-fast) ease,
                          border-color var(--dur-fast) ease,
                          padding 0.8s var(--ease-silk),
                          gap 0.8s var(--ease-silk),
                          transform var(--dur-fast) var(--ease-soft);
              box-shadow: var(--shadow-lift);
            }
            /* Docked: keep the shared chip recipe, but give the explanatory
               line its full reading width instead of clipping it to the
               shorter How-I-Work toggle. */
            #hero-ui.dismissed #feed-ui {
              padding: 12px 18px; gap: 12px;
              width: min(340px, calc(100vw - 48px));
              box-sizing: border-box; justify-content: flex-start;
            }
            #hero-ui.dismissed .feed-pellets { width: 22px; height: 22px; }
            /* measuring stub: the settled docked box, synchronously, no
               transitions — JS flips this on for one offsetWidth read */
            #hero-ui.dock-measure #feed-ui,
            #hero-ui.dock-measure .feed-pellets { transition: none !important; }
            #hero-ui.dock-measure #feed-ui {
              padding: 12px 18px; gap: 12px;
              width: min(340px, calc(100vw - 48px));
              box-sizing: border-box;
            }
            #hero-ui.dock-measure .feed-pellets { width: 22px; height: 22px; }
            #hero-ui.dock-measure .feed-sub { display: none; }
            #feed-ui:hover { background: rgba(20, 20, 20, 0.72); border-color: rgba(255,255,255,0.24); }
            /* universal depress — same 1px settle as every .cta press */
            #feed-ui:active { transform: translateY(1px) scale(0.99); }
            #feed-ui:focus-visible{outline: var(--focus-ring); outline-offset: var(--focus-offset)}

            .feed-pellets {
              position:relative; width:34px; height:34px; flex-shrink:0;
              animation: pelletGlow 4.5s ease-in-out infinite;
              transition: width 0.8s var(--ease-silk), height 0.8s var(--ease-silk);
            }
            /* Pellets scale with container via em-like ratios: base container = 40px */
            .pellet { position:absolute; border-radius:50%; background: linear-gradient(135deg, #ffe07a 0%, #d38010 100%); transition: filter 0.3s ease; }
            .pellet:nth-child(1){ width:57%; height:28%; top:3%;  left:0;    transform: rotate(-20deg); }
            .pellet:nth-child(2){ width:39%; height:21%; top:10%; left:60%;  transform: rotate(18deg); }
            .pellet:nth-child(3){ width:32%; height:18%; top:57%; left:18%;  transform: rotate(-6deg); }
            .pellet:nth-child(4){ width:25%; height:14%; top:63%; left:67%;  transform: rotate(26deg); }

            @keyframes pelletGlow{
              0%,100%{ filter: drop-shadow(0 0 3px rgba(220,155,15,0.65)) drop-shadow(0 0 8px rgba(220,155,15,0.30)); }
              50%{ filter: drop-shadow(0 0 5px rgba(255,190,30,0.85)) drop-shadow(0 0 14px rgba(220,155,15,0.50)); }
            }
            .feed-text-wrap {
              display: flex; flex-direction: column; gap: 5px;
              min-width: 0;
            }
            .feed-text {
              font-family: var(--font-sans);
              font-size: var(--text-label);
              letter-spacing: var(--track-label);
              text-transform: uppercase;
              font-weight: 500; line-height: 1;
              white-space: nowrap;
              color: rgba(255,255,255,0.78); transition: color var(--dur-fast) ease;
            }
            /* the payoff hint — names what feeding reveals (How I Work) */
            .feed-sub {
              font-size: var(--text-micro);
              letter-spacing: 0.18em;
              text-transform: uppercase;
              line-height: 1.25;
              white-space: normal;
              color: rgba(255,255,255,0.42);
            }
            /* once the method is on screen the hint has done its job */
            .koi-container.how-revealed .feed-sub { display: none; }
            #feed-ui:hover .feed-pellets { filter: drop-shadow(0 0 6px rgba(255,190,30,0.9)) drop-shadow(0 0 16px rgba(220,155,15,0.6)); animation:none; }
            #feed-ui:hover .feed-text { color:#fff; }
            .koi-container.feed-mode #feed-ui { background: rgba(20, 20, 20, 0.78); border-color: rgba(255,200,60,0.28); }
            .koi-container.feed-mode #feed-ui .feed-pellets { animation:none; filter: drop-shadow(0 0 6px rgba(255,190,30,0.9)) drop-shadow(0 0 16px rgba(220,155,15,0.6)); }
            .koi-container.feed-mode #feed-ui .feed-text { color:#fff; }
            .koi-container.feed-mode { cursor:none; }

            @media (prefers-reduced-motion: reduce) {
              #hero-ui { animation: none; opacity: 1; transition: none; }
              #feed-ui { transition: none; }
              .feed-pellets { animation: none; }
              .scroll-tip-label, .scroll-tip-chevron { animation: none; }
            }

            #feed-cursor {
              position: absolute; pointer-events:none; z-index:1000;
              width:22px; height:22px; display:none; left: 0; top: 0; transform: translate(-50%, -50%);
            }
            #feed-cursor::before {
              content:''; position:absolute; inset:0; border-radius:50%;
              border: 1.5px solid rgba(255,255,255,0.78); box-shadow: 0 0 5px rgba(255,255,255,0.28);
            }
            #feed-cursor::after {
              content:''; position:absolute; width:4px; height:4px; border-radius:50%;
              background: rgba(255,255,255,0.92); top:50%; left:50%; transform: translate(-50%,-50%);
              box-shadow: 0 0 4px rgba(255,255,255,0.45);
            }
            .koi-container.feed-mode #feed-cursor { display:block; }
            `)}</style>

            {/* ---- pond markup ---- */}
            <div className="koi-container" ref={containerRef}>
                <div className="vignette-overlay" />
                <div className="noise-overlay" />
                <canvas id="fishCanvas" ref={fishCanvasRef} />
                <canvas id="padCanvas" ref={padCanvasRef} />
                <div id="feed-cursor" ref={feedCursorRef} />

                <div id="hero-ui" ref={uiBoxRef}>
                    <div
                        id="feed-ui"
                        ref={feedBtnRef}
                        role="button"
                        tabIndex={0}
                        aria-label={
                            props.tag
                                ? `${props.feedText} — ${props.tag}`
                                : props.feedText
                        }
                        aria-pressed={false}
                    >
                        <div className="feed-pellets">
                            <span className="pellet" />
                            <span className="pellet" />
                            <span className="pellet" />
                            <span className="pellet" />
                        </div>
                        <div className="feed-text-wrap">
                            <div className="feed-text">{props.feedText}</div>
                            {props.tag ? (
                                <div className="feed-sub">{props.tag}</div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {props.showScrollTip && (
                    <div id="scroll-tip" ref={scrollTipRef}>
                        <div className="scroll-tip-label">Scroll</div>
                        <div className="scroll-tip-chevron">
                            <span /><span />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
