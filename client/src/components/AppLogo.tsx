import { useState, useMemo } from "react";

interface AppLogoProps {
  appName: string;
  appUrl: string;
  customIconUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const gradientColors = [
  { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)", text: "#1a1a2e" },
  { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #f77062 0%, #fe5196 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)", text: "#ffffff" },
  { bg: "linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)", text: "#ffffff" },
];

function getConsistentGradient(name: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return gradientColors[Math.abs(hash) % gradientColors.length];
}

function getInitials(name: string): string {
  if (!name) return "?";
  const cleanName = name.replace(/[.,-_]/g, " ").trim();
  const words = cleanName.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return "?";
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32 sm:w-40 sm:h-40",
};

const textSizeClasses = {
  sm: "text-xl font-bold",
  md: "text-3xl font-bold",
  lg: "text-5xl sm:text-6xl font-bold",
};

const imgPadding = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-4",
};

export function AppLogo({ appName, appUrl, customIconUrl, size = "md", className = "" }: AppLogoProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const gradient = useMemo(() => getConsistentGradient(appName || "App"), [appName]);
  const initials = useMemo(() => getInitials(appName || "App"), [appName]);
  
  const iconUrl = useMemo(() => {
    if (customIconUrl && customIconUrl.trim()) {
      return customIconUrl.trim();
    }
    return null;
  }, [customIconUrl]);

  const handleImageError = () => {
    setShowFallback(true);
    setImageLoaded(false);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth < 16 || img.naturalHeight < 16) {
      setShowFallback(true);
      setImageLoaded(false);
    } else {
      setImageLoaded(true);
      setShowFallback(false);
    }
  };

  if (showFallback || !iconUrl) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-[22px] flex items-center justify-center shadow-lg ring-1 ring-black/5 ${className}`}
        style={{ background: gradient.bg }}
      >
        <span 
          className={`${textSizeClasses[size]} tracking-tight drop-shadow-sm`}
          style={{ color: gradient.text }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-[22px] bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/10 ${className}`}>
      <img
        src={iconUrl}
        alt={appName || "App"}
        className={`w-full h-full ${imgPadding[size]} object-contain transition-transform duration-300 group-hover:scale-110`}
        style={{ display: imageLoaded ? 'block' : 'none' }}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
      {!imageLoaded && !showFallback && (
        <div 
          className={`${sizeClasses[size]} rounded-[22px] flex items-center justify-center absolute`}
          style={{ background: gradient.bg }}
        >
          <span 
            className={`${textSizeClasses[size]} tracking-tight drop-shadow-sm`}
            style={{ color: gradient.text }}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
