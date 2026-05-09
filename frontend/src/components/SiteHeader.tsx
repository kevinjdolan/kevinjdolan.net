import type { MouseEvent } from "react";
import { navRoutes } from "../lib/routes";
import type { RouteKey } from "../types";
import { useNavThumb } from "../hooks/useNavThumb";

type SiteHeaderProps = {
  activeRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
};

export function SiteHeader({ activeRoute, onNavigate }: SiteHeaderProps) {
  const { navRef, ready, thumbStyle } = useNavThumb(activeRoute);

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>, route: RouteKey) {
    event.preventDefault();
    onNavigate(route);
  }

  return (
    <header className="site">
      <div className="header-inner">
        <a className="brand" href="/" onClick={(event) => handleNavigate(event, "chat")}>
          <span className="avatar" aria-hidden="true">
            <span className="avatar-inner">
              <img src="/assets/avatar.jpg" alt="Kevin J. Dolan" />
            </span>
          </span>
          <span className="brand-name">Kevin J. Dolan</span>
        </a>

        <nav ref={navRef} className={`primary ${ready ? "nav-ready" : ""}`} aria-label="Primary">
          <span className="nav-thumb" aria-hidden="true" style={thumbStyle} />
          {navRoutes.map((route) => (
            <a
              key={route.key}
              href={route.path}
              data-route-key={route.key}
              aria-current={activeRoute === route.key ? "page" : undefined}
              onClick={(event) => handleNavigate(event, route.key)}
            >
              {route.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
