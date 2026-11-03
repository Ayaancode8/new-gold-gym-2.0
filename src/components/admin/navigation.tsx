"use client";

import { useSyncExternalStore, type ComponentProps } from "react";

/** All record routes live inside one static document, including newly created IDs. */
export function adminHref(href: string): string {
  if (href === "/admin" || href.startsWith("/admin?") || href.startsWith("/admin/")) {
    if (href.startsWith("/admin/#") || href.startsWith("/admin/login")) return href;
    const suffix = href.slice(6);
    return "/admin/#" + (suffix.startsWith("/") ? suffix : "/" + suffix);
  }
  return href;
}

// Hold the rendered form while a rejected browser Back/Forward is being reversed.
let heldRoute: string | undefined;
export function holdAdminRoute(route?: string) { heldRoute = route; }
export function readAdminRoute(): string {
  if (heldRoute) return heldRoute;
  const hash = window.location.hash.slice(1);
  return hash.startsWith("/") ? "/admin" + (hash === "/" ? "" : hash.startsWith("/?") ? hash.slice(1) : hash) : "/admin";
}

type Entry = { route: string; scrollY: number; index: number; parent?: Entry };
type NavigationOptions = { root?: boolean; confirmed?: boolean };
export const BEFORE_ADMIN_NAVIGATE = "admin:before-navigate";
export type NavigationRequest = CustomEvent<{ proceed: () => void }>;
const STATE_KEY = "gymAdminNavigation";

/** Only accept local register routes, including when history state is restored. */
function isAdminRoute(route: unknown): route is string {
  return typeof route === "string" && /^\/admin(?:\?|\/(?!\/)|$)/.test(route)
    && !/[\\#\u0000-\u001f]/.test(route) && !route.startsWith("/admin/login");
}
function validEntry(value: unknown, depth = 0): Entry | undefined {
  if (!value || typeof value !== "object" || depth > 20) return;
  const entry = value as Entry;
  if (!isAdminRoute(entry.route) || !Number.isFinite(entry.scrollY) || !Number.isInteger(entry.index)) return;
  return { route: entry.route, scrollY: Math.max(0, entry.scrollY), index: entry.index, parent: validEntry(entry.parent, depth + 1) };
}
export function readAdminEntry(): Entry {
  const entry = validEntry(window.history.state?.[STATE_KEY]);
  return entry?.route === readAdminRoute() ? entry : { route: readAdminRoute(), scrollY: 0, index: 0 };
}
function writeEntry(entry: Entry, replace = true) {
  const state = replace ? window.history.state : null;
  window.history[replace ? "replaceState" : "pushState"]({ ...state, [STATE_KEY]: entry }, "", adminHref(entry.route));
}
export function rememberAdminScroll() {
  writeEntry({ ...readAdminEntry(), scrollY: window.scrollY });
}

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  window.addEventListener("admin:navigate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
    window.removeEventListener("admin:navigate", callback);
  };
}

function requestNavigation(proceed: () => void, confirmed = false) {
  const request = new CustomEvent("admin:before-navigate", { cancelable: true, detail: { proceed } });
  if (confirmed || window.dispatchEvent(request)) proceed();
}
function announceNavigation() { window.dispatchEvent(new Event("admin:navigate")); }
function navigate(href: string, replace = false, options: NavigationOptions = {}) {
  const target = adminHref(href);
  requestNavigation(() => {
    if (!target.startsWith("/admin/#") || window.location.pathname.replace(/\/$/, "") !== "/admin") {
      if (replace) window.location.replace(target); else window.location.assign(target);
      return;
    }
    const suffix = target.slice("/admin/#".length);
    const route = "/admin" + (suffix === "/" ? "" : suffix.startsWith("/?") ? suffix.slice(1) : suffix);
    if (!isAdminRoute(route)) return;
    const current = { ...readAdminEntry(), scrollY: window.scrollY };
    writeEntry(current);
    const sameScreen = current.route.split("?")[0] === route.split("?")[0];
    writeEntry({ route, index: current.index + (replace ? 0 : 1), scrollY: replace && sameScreen ? current.scrollY : 0,
      parent: options.root ? undefined : replace ? current.parent : current }, replace);
    announceNavigation();
  }, options.confirmed);
}
function restoreEntry(entry: Entry, confirmed = false) {
  requestNavigation(() => {
    const current = readAdminEntry();
    rememberAdminScroll();
    if (entry.index < current.index) window.history.go(entry.index - current.index);
    else {
      writeEntry({ ...entry, index: current.index + 1 }, false);
      announceNavigation();
    }
  }, confirmed);
}

export function destinationLabel(route: string): string {
  const path = route.split("?")[0];
  if (path.endsWith("/edit")) return "member editing";
  if (path.startsWith("/admin/members/")) return "member profile";
  if (path.startsWith("/admin/payments/")) return "payment details";
  if (path.startsWith("/admin/reminders/review")) return "recipients";
  if (path.startsWith("/admin/reminders/batches/")) return "reminder results";
  const labels: Record<string, string> = { "/admin": "overview", "/admin/members": "members", "/admin/payments": "payments", "/admin/attendance": "attendance", "/admin/analytics": "analytics", "/admin/reminders": "reminders", "/admin/inactive": "inactive members", "/admin/archived": "archived members", "/admin/more": "More" };
  return labels[path] ?? "members";
}
export function useReturnTarget(fallback: string) {
  const serialized = useSyncExternalStore(subscribe, () => JSON.stringify(readAdminEntry()), () => "null");
  const entry = validEntry(JSON.parse(serialized));
  let parent = entry?.parent;
  // A correction opened directly from recipients still returns through its member profile.
  const path = entry?.route.split("?")[0];
  if (parent && path?.endsWith("/edit") && fallback === path.slice(0, -5) && parent.route.split("?")[0] !== fallback) {
    parent = { route: fallback, scrollY: 0, index: entry!.index, parent };
  }
  const href = parent?.route ?? fallback;
  return { href, label: `Back to ${destinationLabel(href)}`, go: () => parent ? restoreEntry(parent) : navigate(fallback, false, { root: true }) };
}

export const adminRouter = {
  push: (href: string, options?: NavigationOptions) => navigate(href, false, options),
  replace: (href: string, options?: NavigationOptions) => navigate(href, true, options),
  /** A saved task retains its origin, rather than making the form its return destination. */
  finish: (href: string) => {
    const parent = readAdminEntry().parent;
    if (parent?.route.split("?")[0] === href.split("?")[0]) restoreEntry(parent, true);
    else {
      const current = readAdminEntry();
      rememberAdminScroll();
      writeEntry({ route: href, scrollY: 0, index: current.index + 1, parent }, false);
      announceNavigation();
    }
  },
};
export function useRouter() { return adminRouter; }
export function useNavigationEntryKey() {
  return useSyncExternalStore(subscribe, () => `${readAdminEntry().index}:${readAdminRoute().split("?")[0]}`, () => "0:/admin");
}
export function usePathname() {
  return useSyncExternalStore(subscribe, readAdminRoute, () => "/admin").split("?")[0];
}
export function useSearchParams() {
  const route = useSyncExternalStore(subscribe, readAdminRoute, () => "/admin");
  return new URLSearchParams(route.split("?")[1] ?? "");
}

type AdminLinkProps = ComponentProps<"a"> & { root?: boolean; back?: boolean };
export default function AdminLink({ href = "", root = false, back = false, onClick, ...props }: AdminLinkProps) {
  const destination = useReturnTarget(href);
  return <a {...props} href={adminHref(back ? destination.href : href)} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank" || props.download !== undefined) return;
    event.preventDefault();
    if (back) destination.go(); else navigate(href, false, { root });
  }}/>;
}
