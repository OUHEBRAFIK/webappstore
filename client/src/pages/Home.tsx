import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { AppCard } from "@/components/AppCard";
import { FeaturedAppCard } from "@/components/FeaturedAppCard";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Search } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [minRating, setMinRating] = useState<number | undefined>();

  useEffect(() => {
    document.title = "WebAppStore - Le meilleur des outils en ligne";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Découvrez, comparez et évaluez les meilleures applications et outils web. Trouvez l'outil parfait pour booster votre productivité, design et IA.");
    }
  }, []);

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
  const categoryCounts = data?.counts || {};
  const dynamicCategories = data?.categories || [];

  const filteredApps = useMemo(() => {
    if (!apps) return [];
    if (!minRating) return apps;
    return apps.filter((app: any) => (app.rating || 0) >= minRating);
  }, [apps, minRating]);

  const featuredApp = useMemo(() => {
    if (!filteredApps.length) return null;
    const sorted = [...filteredApps].sort((a: any, b: any) => {
      const scoreA = (Number(a.rating) || 0) * (Number(a.votes) || 1);
      const scoreB = (Number(b.rating) || 0) * (Number(b.votes) || 1);
      return scoreB - scoreA;
    });
    return sorted[0];
  }, [filteredApps]);

  const regularApps = useMemo(() => {
    if (!featuredApp) return filteredApps;
    // Don't exclude featured app when search or category filter is active
    if (search || category) return filteredApps;
    return filteredApps.filter((app: any) => app.id !== featuredApp.id);
  }, [filteredApps, featuredApp, search, category]);

  return (
    <div className="min-h-screen bg-background mesh-gradient text-foreground font-sans selection:bg-primary/10 flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 dark:bg-background/90 backdrop-blur-2xl border-b border-border/50 px-4">
        <div className="max-w-[1400px] mx-auto h-auto sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-0">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground/60 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent" data-testid="link-home">
              WebAppStore
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
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-32">
              <CategoryFilters 
                active={category} 
                onSelect={setCategory} 
                activeRating={minRating}
                onRatingSelect={setMinRating}
                counts={categoryCounts}
                categories={dynamicCategories}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between mb-6 sm:mb-8 px-1 sm:px-2">
              <h2 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                {category || "Toutes les applications"} 
                {minRating && ` - ${minRating}+ Etoiles`}
                <span className="ml-2 opacity-50">({filteredApps.length})</span>
              </h2>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <motion.div 
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`h-[280px] sm:h-[320px] bg-card rounded-[24px] shadow-sm animate-pulse ${i === 0 ? 'hidden sm:block sm:col-span-2 sm:row-span-2 h-auto min-h-[400px]' : ''}`}
                    />
                  ))
                ) : (
                  <>
                    {featuredApp && !search && !category && (
                      <>
                        <FeaturedAppCard key={`featured-${featuredApp.id}`} app={featuredApp} />
                        <div className="sm:hidden">
                          <AppCard key={`mobile-featured-${featuredApp.id}`} app={featuredApp} />
                        </div>
                      </>
                    )}
                    {regularApps.map((app: any) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {!isLoading && filteredApps.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-32 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Aucun resultat</h3>
                <p className="text-muted-foreground">Essayez de modifier vos filtres ou votre recherche.</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-card/50 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <h4 className="font-bold text-foreground mb-2 tracking-tight">WebAppStore</h4>
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
