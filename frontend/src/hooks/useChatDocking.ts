import { type RefObject, useCallback, useEffect } from "react";

type UseChatDockingOptions = {
  active: boolean;
  composerRef: RefObject<HTMLElement | null>;
  heroRef: RefObject<HTMLElement | null>;
};

const DOCK_TRANSITION_MS = 760;

function removeDockingState() {
  document.body.classList.remove("chat-active", "chat-pinning");
  [
    "--src-width",
    "--header-h",
    "--composer-h",
    "--hero-top",
    "--hero-left",
    "--hero-width",
    "--dock-left",
    "--dock-top",
    "--dock-width",
    "--dock-dx",
    "--dock-dy"
  ].forEach((name) => document.body.style.removeProperty(name));
}

function getDockMetrics(composer: HTMLElement) {
  const compact = window.innerWidth <= 600;
  const dockLeft = 30;
  const dockBottom = compact ? 36 : 56;
  const dockWidth = Math.max(280, window.innerWidth - 60);
  const composerHeight = composer.offsetHeight;
  const dockTop = window.innerHeight - dockBottom - composerHeight;

  return { dockLeft, dockTop, dockWidth, composerHeight };
}

export function useChatDocking({ active, composerRef, heroRef }: UseChatDockingOptions) {
  const updateGeometry = useCallback(() => {
    const composer = composerRef.current;
    const header = document.querySelector<HTMLElement>("header.site");
    if (!composer) return;

    const { dockLeft, dockTop, dockWidth, composerHeight } = getDockMetrics(composer);
    document.body.style.setProperty("--dock-left", `${dockLeft}px`);
    document.body.style.setProperty("--dock-top", `${dockTop}px`);
    document.body.style.setProperty("--dock-width", `${dockWidth}px`);
    document.body.style.setProperty("--composer-h", `${composerHeight}px`);
    document.body.style.setProperty("--header-h", `${header?.offsetHeight ?? 88}px`);
  }, [composerRef]);

  const activate = useCallback(() => {
    const composer = composerRef.current;
    if (!composer || document.body.classList.contains("chat-active")) return false;

    const sourceRect = composer.getBoundingClientRect();
    const header = document.querySelector<HTMLElement>("header.site");
    const heroRect = heroRef.current?.getBoundingClientRect();
    const { dockLeft, dockTop, dockWidth, composerHeight } = getDockMetrics(composer);

    document.body.style.setProperty("--src-width", `${sourceRect.width}px`);
    document.body.style.setProperty("--header-h", `${header?.offsetHeight ?? 88}px`);
    document.body.style.setProperty("--composer-h", `${composerHeight}px`);
    document.body.style.setProperty("--dock-left", `${dockLeft}px`);
    document.body.style.setProperty("--dock-top", `${dockTop}px`);
    document.body.style.setProperty("--dock-width", `${dockWidth}px`);
    document.body.style.setProperty("--dock-dx", `${sourceRect.left - dockLeft}px`);
    document.body.style.setProperty("--dock-dy", `${sourceRect.top - dockTop}px`);

    if (heroRect) {
      document.body.style.setProperty("--hero-top", `${heroRect.top}px`);
      document.body.style.setProperty("--hero-left", `${heroRect.left}px`);
      document.body.style.setProperty("--hero-width", `${heroRect.width}px`);
    }

    document.body.classList.add("chat-active", "chat-pinning");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove("chat-pinning");
      });
    });

    return true;
  }, [composerRef, heroRef]);

  useEffect(() => {
    if (!active) return;

    updateGeometry();
    const composer = composerRef.current;
    if (!composer) return;

    const resizeObserver = new ResizeObserver(updateGeometry);
    resizeObserver.observe(composer);
    window.addEventListener("resize", updateGeometry);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateGeometry);
    };
  }, [active, composerRef, updateGeometry]);

  useEffect(() => removeDockingState, []);

  return { activate, resetDocking: removeDockingState, transitionMs: DOCK_TRANSITION_MS };
}
