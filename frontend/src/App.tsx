import { useEffect, useState } from "react";
import { AmbientBackground } from "./components/AmbientBackground";
import { ArchivePage } from "./components/ArchivePage";
import { ChatPage } from "./components/ChatPage";
import { ContactPage } from "./components/ContactPage";
import { Footer } from "./components/Footer";
import { SiteHeader } from "./components/SiteHeader";
import { getProfile } from "./lib/api";
import { fallbackProfile } from "./lib/content";
import { pathForRoute, routeFromPath } from "./lib/routes";
import type { Profile, RouteKey } from "./types";

export function App() {
  const [route, setRoute] = useState<RouteKey>(() => routeFromPath(window.location.pathname));
  const [profile, setProfile] = useState<Profile>(fallbackProfile);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile(fallbackProfile));
  }, []);

  useEffect(() => {
    function syncRoute() {
      setRoute(routeFromPath(window.location.pathname));
    }

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  function navigate(nextRoute: RouteKey) {
    const nextPath = pathForRoute(nextRoute);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <>
      <AmbientBackground />
      <SiteHeader activeRoute={route} onNavigate={navigate} />
      <main className="app-main">
        {route === "chat" ? <ChatPage profile={profile} /> : null}
        {route === "archive" ? <ArchivePage /> : null}
        {route === "contact" ? <ContactPage /> : null}
        <Footer />
      </main>
    </>
  );
}
