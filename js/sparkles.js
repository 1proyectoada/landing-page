/* Sparkles: desktop-only pointer trail. No libraries, no build step. */
(() => {
    "use strict";

    const desktopPointer = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Keep the DOM small; each sparkle removes itself when its animation ends. */
    const MAX_SPARKLES = 24;
    const SPAWN_INTERVAL = 45;
    const MIN_MOVE = 8;
    const FALL_STEPS = ["var(--space-1)", "var(--space-2)"];
    const SIZE_STEPS = ["var(--space-1)", "var(--space-2)"];

    let layer = null;
    let listening = false;
    let active = 0;
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;
    let pending = null;

    function canRun() {
        return desktopPointer.matches && !reducedMotion.matches;
    }

    function ensureLayer() {
        if (layer || !document.body) return;
        layer = document.createElement("div");
        layer.className = "sparkle-layer";
        layer.setAttribute("aria-hidden", "true");
        document.body.appendChild(layer);
    }

    function clearSparkles() {
        if (!layer) return;
        layer.replaceChildren();
        active = 0;
    }

    function removeLayer() {
        clearSparkles();
        if (layer) {
            layer.remove();
            layer = null;
        }
    }

    function randomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function spawn(x, y) {
        if (!layer || active >= MAX_SPARKLES) return;

        const sparkle = document.createElement("span");
        sparkle.className = "sparkle";
        sparkle.setAttribute("aria-hidden", "true");
        sparkle.textContent = "✦";
        sparkle.style.setProperty("--sparkle-x", `${x}px`);
        sparkle.style.setProperty("--sparkle-y", `${y}px`);
        sparkle.style.setProperty("--sparkle-fall", randomItem(FALL_STEPS));
        sparkle.style.setProperty("--sparkle-size", randomItem(SIZE_STEPS));
        sparkle.style.setProperty("--sparkle-rotate", `${Math.round(Math.random() * 60 - 30)}deg`);

        sparkle.addEventListener("animationend", () => {
            sparkle.remove();
            active = Math.max(0, active - 1);
        }, { once: true });

        layer.appendChild(sparkle);
        active += 1;
    }

    function onPointerMove(event) {
        if (!canRun() || !event.isPrimary) return;

        const now = performance.now();
        if (now - lastTime < SPAWN_INTERVAL) return;

        const moved = Math.hypot(event.clientX - lastX, event.clientY - lastY);
        if (moved < MIN_MOVE) return;

        lastTime = now;
        lastX = event.clientX;
        lastY = event.clientY;
        pending = { x: lastX, y: lastY };

        /* One frame per batch of pointer events keeps the trail smooth and cheap. */
        if (!frame) {
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                if (pending && canRun()) {
                    spawn(pending.x, pending.y);
                }
                pending = null;
            });
        }
    }

    function start() {
        if (listening) return;
        ensureLayer();
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        listening = true;
    }

    function stop() {
        if (!listening) return;
        window.removeEventListener("pointermove", onPointerMove);
        listening = false;
        if (frame) {
            window.cancelAnimationFrame(frame);
            frame = 0;
        }
        pending = null;
        removeLayer();
    }

    function sync() {
        if (canRun()) {
            start();
        } else {
            stop();
        }
    }

    function watch(query) {
        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", sync);
        } else if (typeof query.addListener === "function") {
            query.addListener(sync);
        }
    }

    document.documentElement.addEventListener("pointerleave", clearSparkles);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) clearSparkles();
    });
    window.addEventListener("blur", clearSparkles);

    watch(desktopPointer);
    watch(reducedMotion);
    sync();
})();
