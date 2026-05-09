import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RouteKey } from "../types";

export function useNavThumb(activeRoute: RouteKey) {
  const navRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const [thumbStyle, setThumbStyle] = useState<CSSProperties>({
    transform: "translateX(0px)",
    width: 0
  });

  const measure = useCallback(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLAnchorElement>(`a[data-route-key="${activeRoute}"]`);
    const thumb = nav?.querySelector<HTMLElement>(".nav-thumb");

    if (!nav || !active || !thumb) return;

    const navRect = nav.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    setThumbStyle({
      width: activeRect.width,
      transform: `translateX(${activeRect.left - navRect.left}px)`
    });
    setReady(true);
  }, [activeRoute]);

  useLayoutEffect(() => {
    measure();
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return { navRef, ready, thumbStyle };
}
