import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { AppCard } from "@/components/AppCard";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Heart, Search, ChevronRight, ChevronLeft, Sparkles, Gamepad2, Palette, Briefcase, Code, Wrench, Users } from "lucide-react";
import type { App } from "@shared/schema";

const categoryIcons: Record<string, any> = {
  "IA": Sparkles,
  "Jeux": Gamepad2,
  "Design": Palette,
  "Productivité": Briefcase,
  "Développement": Code,
  "Outils": Wrench,
  "Réseaux Sociaux": Users,
};

const categoryColors: Record<string, string> = {
  "IA": "from-violet-500 to-purple-600",
  "Jeux": "from-orange-500 to-red-500",
  "Design": "from-pink-500 to-rose-500",
  "Productivité": "from-blue-500 to-cyan-500",
  "Développement": "from-green-500 to-emerald-500",
  "Outils": "from-gray-500 to-slate-600",
  "Réseaux Sociaux": "from-sky-500 to-blue-600",
};

function CategorySection({ category, apps, total, onSelectCategory }: { category: string; apps: App[]; total: number; onSelectCategory: (cat: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [apps]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const Icon = categoryIcons[category] || Sparkles;
  const colorGradient = categoryColors[category] || "from-gray-500 to-gray-600";

  return (
    <section className="mb-10 sm:mb-14">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {category}
            </h2>
            <p className="text-xs text-muted-foreground">{total} applications</p>
          </div>
        </div>
        <button 
          onClick={() => onSelectCategory(category)}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          data-testid={`button-voir-tout-${category}`}
        >
          Voir tout
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative group">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/90 dark:bg-background/80 backdrop-blur-sm rounded-full shadow-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
            data-testid={`button-scroll-left-${category}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-3 px-3 sm:-mx-6 sm:px-6 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[280px] sm:w-[300px]"
            >
              <AppCard app={app} />
            </motion.div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/90 dark:bg-background/80 backdrop-blur-sm rounded-full shadow-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
            data-testid={`button-scroll-right-${category}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </section>
  );
}

function SearchResultsView({ search, category }: { search: string; category?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: [api.apps.list.path, search, category],
    queryFn: async () => {
      const url = new URL(api.apps.list.path, window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (category) url.searchParams.set("category", category);
      const res = await fetch(url.toString());
      return res.json();
    }
  });

  const apps = data?.apps || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="h-[280px] bg-card rounded-[24px] shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-32 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Aucun résultat</h3>
        <p className="text-muted-foreground">Essayez de modifier votre recherche.</p>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {category || "Résultats"} 
          <span className="ml-2 opacity-50">({apps.length})</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {apps.map((app: App) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [location] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("category");
    setCategory(catParam || undefined);
  }, [location]);

  useEffect(() => {
    document.title = "WebAppStore - Le meilleur des outils en ligne";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Découvrez, comparez et évaluez les meilleures applications et outils web. Trouvez l'outil parfait pour booster votre productivité, design et IA.");
    }
  }, []);

  const { data: homepageData, isLoading } = useQuery({
    queryKey: ["/api/apps/homepage"],
    queryFn: async () => {
      const res = await fetch("/api/apps/homepage");
      return res.json();
    },
    enabled: !search && !category
  });

  const categories = homepageData?.categories || [];
  const isSearchMode = !!search || !!category;

  const handleClearFilters = () => {
    setSearch("");
    setCategory(undefined);
    window.history.pushState({}, "", "/");
  };

  const handleSelectCategory = (cat: string) => {
    setCategory(cat);
    window.history.pushState({}, "", `/?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient text-foreground font-sans selection:bg-primary/10 flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-2xl border-b border-border/50 px-4">
        <div className="max-w-[1400px] mx-auto h-auto sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-0">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link href="/" onClick={handleClearFilters} className="flex items-center gap-2" data-testid="link-home">
              <img src="/icon.png" alt="WebAppStore" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground/60 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                WebAppStore
              </span>
            </Link>
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full sm:flex-1 sm:max-w-xl"
          >
            <SearchBar value={search} onChange={setSearch} />
          </motion.div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6 sm:py-12 flex-1 w-full">
        {isSearchMode && (
          <div className="mb-6">
            <button
              onClick={handleClearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              data-testid="button-clear-filters"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour à l'accueil
            </button>
          </div>
        )}

        {isSearchMode ? (
          <SearchResultsView search={search} category={category} />
        ) : isLoading ? (
          <div className="space-y-14">
            {Array(4).fill(0).map((_, i) => (
              <div key={i}>
                <div className="h-10 w-48 bg-muted rounded-lg mb-6 animate-pulse" />
                <div className="flex gap-4 overflow-hidden">
                  {Array(4).fill(0).map((_, j) => (
                    <div key={j} className="flex-shrink-0 w-[300px] h-[280px] bg-card rounded-[24px] animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 sm:mb-14"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Découvrez les meilleures apps
              </h1>
              <p className="text-muted-foreground">
                Top 10 de chaque catégorie, triés par note. Utilisez la recherche pour explorer les {categories.reduce((sum: number, c: any) => sum + c.total, 0)} applications.
              </p>
            </motion.div>

            {categories.map((cat: { category: string; apps: App[]; total: number }, index: number) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategorySection 
                  category={cat.category} 
                  apps={cat.apps} 
                  total={cat.total}
                  onSelectCategory={handleSelectCategory}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-border bg-card/50 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/icon.png" alt="WebAppStore" className="w-8 h-8 rounded-lg" />
            <h4 className="font-bold text-foreground tracking-tight">WebAppStore</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4 font-medium">Version MVP</p>
          <div className="h-px w-12 bg-border mx-auto mb-4" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Une question ou un retour ?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <a 
              href="mailto:webappstore.contact@gmail.com" 
              className="text-sm font-bold text-primary hover:underline transition-all"
              data-testid="link-contact-email"
            >
              webappstore.contact@gmail.com
            </a>
            <a 
              href="https://ko-fi.com/webappstore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-accent transition-all text-sm font-bold text-foreground active:scale-95"
              data-testid="link-kofi-support"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse-soft" />
              Soutenir le projet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
