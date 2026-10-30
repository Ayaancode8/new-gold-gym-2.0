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

export function readAdminRoute(): string {
  const hash = window.location.hash.slice(1);
  return hash.startsWith("/") ? "/admin" + (hash === "/" ? "" : hash.startsWith("/?") ? hash.slice(1) : hash) : "/admin";
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

function navigate(href: string, replace = false) {
  const target = adminHref(href);
  if (!target.startsWith("/admin/#")) {
    if (replace) window.location.replace(target); else window.location.assign(target);
    return;
  }
  window.history[replace ? "replaceState" : "pushState"](null, "", target);
  window.dispatchEvent(new Event("admin:navigate"));
}

export const adminRouter = {
  push: (href: string) => navigate(href),
  replace: (href: string) => navigate(href, true),
};
export function useRouter() { return adminRouter; }
export function usePathname() {
  return useSyncExternalStore(subscribe, readAdminRoute, () => "/admin").split("?")[0];
}
export function useSearchParams() {
  const route = useSyncExternalStore(subscribe, readAdminRoute, () => "/admin");
  return new URLSearchParams(route.split("?")[1] ?? "");
}
export default function AdminLink({ href = "", ...props }: ComponentProps<"a">) {
  return <a {...props} href={adminHref(href)}/>;
}
