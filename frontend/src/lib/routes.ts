import type { RouteKey } from "../types";

export const navRoutes: Array<{ key: RouteKey; label: string; path: string }> = [
  { key: "chat", label: "KevinBot", path: "/" },
  { key: "archive", label: "Archive", path: "/archive/" },
  { key: "contact", label: "Contact", path: "/contact/" }
];

export function routeFromPath(pathname: string): RouteKey {
  if (pathname.startsWith("/archive")) return "archive";
  if (pathname.startsWith("/contact")) return "contact";
  return "chat";
}

export function pathForRoute(route: RouteKey): string {
  return navRoutes.find((item) => item.key === route)?.path ?? "/";
}
