import type { RefObject } from "react";
import type { Profile } from "../types";

type ChatHeroProps = {
  profile: Profile;
  heroRef: RefObject<HTMLDivElement | null>;
};

export function ChatHero({ profile, heroRef }: ChatHeroProps) {
  return (
    <div className="hero" ref={heroRef}>
      <h1>
        Chat with <span className="accent">KevinBot</span>
      </h1>
      <p className="sub">{profile.summary}</p>
    </div>
  );
}
