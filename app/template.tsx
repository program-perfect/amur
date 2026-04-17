/**
 * Root template — wraps every route's tree in a fresh instance on each
 * navigation, which is what lets us play an enter-animation every time
 * the user moves between pages (landing → /feed → /auth …).
 *
 * Unlike `layout.tsx`, a template re-mounts on navigation, so keyframe
 * animations attached to its children re-run automatically. We add a
 * subtle fade + upward translate so each route feels like it's being
 * gently placed on the page rather than hard-swapped.
 *
 * Keep the animation class + element extremely lightweight: the
 * template wraps every pixel of every route, so any layout or overflow
 * quirk here would cascade everywhere.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-route-in">{children}</div>
}
