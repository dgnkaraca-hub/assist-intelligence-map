/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // JS render switch (App MOBILE_BREAKPOINT) kept in lockstep with this.
      screens: {
        cockpit: "980px",
      },
      colors: {
        // Calm premium palette. Mirrors the CSS variables in src/index.css.
        "bg-void": "#070912",
        "bg-deep": "#0B1020",
        "bg-raised": "#111827",
        cyan: "#5EEAD4", // primary
        teal: "#2DD4BF", // memory
        violet: "#8B5CF6", // agents / secondary
        purple: "#A78BFA", // research
        amber: "#FACC15", // decisions
        rose: "#FB7185", // urgent
        // legacy aliases mapped onto the new palette so nothing breaks:
        core: "#5EEAD4",
        blue: "#5EEAD4",
        star: "#F8FAFC",
        ink: "#F8FAFC", // primary text
        "ink-2": "#CBD5E1", // near-primary body text
        muted: "#94A3B8", // secondary text
        line: "rgba(148, 163, 184, 0.18)",
        "line-strong": "rgba(148, 163, 184, 0.32)",
        panel: "rgba(17, 24, 39, 0.62)",
        // Universe layer (features/universe) — kept as separate u-* tokens so the
        // layers can diverge, but currently ALIGNED to the assist palette
        // (2026-07-06 retheme; mirrors the ASSIST RETHEME block in universe.css).
        "u-bg": "#070912",
        "u-panel": "#0B1020",
        "u-ink": "#F8FAFC",
        "u-ink-2": "#CBD5E1",
        "u-muted": "#94A3B8",
        "u-line": "rgba(148, 163, 184, 0.28)",
        "u-hair": "rgba(148, 163, 184, 0.14)",
        "u-node": "#0d1424",
        "u-node-2": "#111827",
        "u-accent": "#5EEAD4",
      },
      fontFamily: {
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        ui: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        // Universe display type — aligned to assist Inter (2026-07-06 retheme;
        // restore the Instrument Serif stack here to bring the serif back).
        "u-display": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        // Restrained — glow only signals activity/selection.
        glow: "0 0 20px rgba(94, 234, 212, 0.18)",
        "glow-strong": "0 0 32px rgba(94, 234, 212, 0.3)",
        "glow-teal": "0 0 20px rgba(45, 212, 191, 0.2)",
        "glow-violet": "0 0 20px rgba(139, 92, 246, 0.2)",
        "glow-purple": "0 0 20px rgba(167, 139, 250, 0.2)",
        "glow-amber": "0 0 20px rgba(250, 204, 21, 0.2)",
        "glow-rose": "0 0 20px rgba(251, 113, 133, 0.22)",
        lift: "0 12px 32px -12px rgba(0, 0, 0, 0.7)",
      },
      backdropBlur: {
        glass: "20px",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        // The Core's controlled radial glow — a slow, quiet breath.
        corePulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.03)" },
        },
        // Status dot — a calm blink for active/alert only.
        statusBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        // Panel / sheet / list-item entrances (subtle).
        drawerIn: {
          "0%": { opacity: "0", transform: "translateX(14px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        sheetUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // A soft expanding halo behind a selected node (thin, calm — not neon).
        haloPulse: {
          "0%": { opacity: "0.4", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.16)" },
        },
      },
      animation: {
        corePulse: "corePulse 6s ease-in-out infinite",
        statusBlink: "statusBlink 2.6s ease-in-out infinite",
        drawerIn: "drawerIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        sheetUp: "sheetUp 0.36s cubic-bezier(0.22, 1, 0.36, 1) both",
        fadeIn: "fadeIn 0.3s ease-out both",
        riseIn: "riseIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        popIn: "popIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        haloPulse: "haloPulse 2.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
