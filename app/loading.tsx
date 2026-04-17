/**
 * Global route loading screen.
 *
 * Next.js App Router renders this file during the time between when a
 * user triggers navigation and when the new route's server component
 * finishes streaming. We use it to show a centered, Amur-themed
 * "heartbeat" indicator — three soft amber orbs breathing in/out of
 * phase — so every cross-route transition gets a friendly, branded
 * loading beat instead of a blank white flash.
 *
 * The outer container covers the viewport and sits atop content with
 * a soft blur so whatever route was there fades behind the indicator
 * during the handoff.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Загрузка страницы"
      /*
        Note: `fixed inset-0` breaks here because `template.tsx` wraps
        every route in a `.animate-route-in` element whose keyframes
        apply a `transform`. A transformed ancestor creates a new
        containing block for any fixed descendants — so `inset-0`
        would resolve against the template's natural (short) height
        instead of the viewport, visually pinning the indicator to
        the top. Using `min-h-dvh w-full` keeps the loader in normal
        flow and guarantees it stretches to the full viewport, so
        `items-center justify-center` can actually centre it.
      */
      className="relative z-[60] flex min-h-dvh w-full items-center justify-center bg-[#fdf7f4]/70 backdrop-blur-sm animate-loading-fade-in"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Three-dot pulse (breathing heartbeat) */}
        <div className="flex items-end gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.82 0.17 55), oklch(0.68 0.2 45))",
              boxShadow:
                "0 0 12px 0 oklch(0.78 0.2 50 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.4)",
              animation: "loading-dot 1.1s ease-in-out infinite",
              animationDelay: "0ms",
            }}
          />
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.78 0.2 45), oklch(0.62 0.22 30))",
              boxShadow:
                "0 0 12px 0 oklch(0.72 0.22 42 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.4)",
              animation: "loading-dot 1.1s ease-in-out infinite",
              animationDelay: "160ms",
            }}
          />
          <span
            className="h-3 w-3 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.82 0.17 55), oklch(0.68 0.2 45))",
              boxShadow:
                "0 0 12px 0 oklch(0.78 0.2 50 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.4)",
              animation: "loading-dot 1.1s ease-in-out infinite",
              animationDelay: "320ms",
            }}
          />
        </div>
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "oklch(0.35 0.04 25 / 0.6)" }}
        >
          Загрузка
        </span>
      </div>
    </div>
  )
}
