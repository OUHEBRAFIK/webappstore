import { useState, useEffect, useMemo } from "react";

interface AppLogoProps {
  appName: string;
  appUrl: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const pastelColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8B500", "#00CED1", "#FF7F50", "#9370DB", "#20B2AA",
  "#FFB347", "#87CEEB", "#DDA0DD", "#98FB98", "#F0E68C",
  "#E6E6FA", "#FFE4E1", "#B0E0E6", "#FFDAB9", "#E0FFFF",
];

function getConsistentColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return pastelColors[Math.abs(hash) % pastelColors.length];
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "app";
  }
}

function getInitials(name: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

const sizeClasses = {
  sm: "w-12 h-12 text-lg",
  md: "w-20 h-20 text-2xl",
  lg: "w-32 h-32 sm:w-40 sm:h-40 text-4xl sm:text-5xl",
};

const imgPadding = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-4",
};

export function AppLogo({ appName, appUrl, size = "md", className = "" }: AppLogoProps) {
  const [logoState, setLogoState] = useState<"loading" | "clearbit" | "duckduckgo" | "google" | "fallback">("loading");
  const [currentSrc, setCurrentSrc] = useState<string>("");

  const hostname = useMemo(() => getHostname(appUrl), [appUrl]);
  const domain = useMemo(() => hostname.replace(/^www\./, ""), [hostname]);
  
  const logoSources = useMemo(() => ({
    clearbit: `https://logo.clearbit.com/${domain}`,
    duckduckgo: `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
    google: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
  }), [domain, hostname]);

  const backgroundColor = useMemo(() => getConsistentColor(appName || "App"), [appName]);
  const initials = useMemo(() => getInitials(appName || "App"), [appName]);

  useEffect(() => {
    setLogoState("loading");
    setCurrentSrc(logoSources.clearbit);
  }, [logoSources.clearbit]);

  const handleImageError = () => {
    switch (logoState) {
      case "loading":
      case "clearbit":
        setLogoState("duckduckgo");
        setCurrentSrc(logoSources.duckduckgo);
        break;
      case "duckduckgo":
        setLogoState("google");
        setCurrentSrc(logoSources.google);
        break;
      case "google":
        setLogoState("fallback");
        break;
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth < 32 || img.naturalHeight < 32) {
      handleImageError();
      return;
    }
    if (logoState === "loading") {
      setLogoState("clearbit");
    }
  };

  if (logoState === "fallback") {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-[20px] flex items-center justify-center font-bold text-white shadow-sm ${className}`}
        style={{ backgroundColor }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-[20px] bg-background dark:bg-card flex items-center justify-center overflow-hidden border border-border/30 ${className}`}>
      {currentSrc && (
        <img
          src={currentSrc}
          alt={appName || "App"}
          className={`w-full h-full ${imgPadding[size]} object-contain transition-transform duration-300 group-hover:scale-110`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      )}
    </div>
  );
}
