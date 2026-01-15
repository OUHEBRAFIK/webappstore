
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { AppCard } from "@/components/AppCard";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SearchBar } from "@/components/SearchBar";
import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [minRating, setMinRating] = useState<number | undefined>();

  useEffect(() => {
    document.title = "WebStore Central - Le meilleur des outils en ligne";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Découvrez, comparez et évaluez les meilleures applications et outils web. Trouvez l'outil parfait pour booster votre productivité, design et IA.");
    }
  }, []);

  const { data: apps, isLoading } = useQuery({
    queryKey: [api.apps.list.path, search, category],
    queryFn: async () => {
      const url = new URL(api.apps.list.path, window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (category) url.searchParams.set("category", category);
      const res = await fetch(url.toString());
      return res.json();
    }
  });

  const filteredApps = useMemo(() => {
    if (!apps) return [];
    if (!minRating) return apps;
    return apps.filter((app: any) => (app.rating || 0) >= minRating);
  }, [apps, minRating]);

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans selection:bg-primary/10 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-4">
        <div className="max-w-[1400px] mx-auto h-auto sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-0">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              WebStore Central
            </Link>
            <div className="sm:hidden">
              <Link href="/submit">
                <Button size="sm" className="rounded-full h-9 font-bold">Soumettre</Button>
              </Link>
            </div>
          </div>
          <div className="w-full sm:flex-1 sm:max-w-xl">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/submit">
              <Button className="rounded-full px-6 h-11 font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
                Soumettre une App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-32">
              <CategoryFilters 
                active={category} 
                onSelect={setCategory} 
                activeRating={minRating}
                onRatingSelect={setMinRating}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
                {category || "Toutes les applications"} 
                {minRating && ` • ${minRating}+ Étoiles`}
                <span className="ml-2 text-slate-300">({filteredApps.length})</span>
              </h2>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <motion.div 
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-[320px] bg-white rounded-[1.5rem] shadow-sm animate-pulse" 
                    />
                  ))
                ) : (
                  filteredApps.map((app: any) => (
                    <AppCard key={app.id} app={app} />
                  ))
                )}
              </AnimatePresence>
            </motion.div>

            {!isLoading && filteredApps.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat</h3>
                <p className="text-slate-500">Essayez de modifier vos filtres ou votre recherche.</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-100 bg-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 text-center">
          <h4 className="font-bold text-slate-900 mb-2 tracking-tight">WebAppStore Central</h4>
          <p className="text-sm text-slate-500 mb-4 font-medium">Version MVP</p>
          <div className="h-px w-12 bg-slate-100 mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Une question ou un retour ?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
            <a 
              href="mailto:webappstore.contact@gmail.com" 
              className="text-sm font-bold text-primary hover:underline transition-all"
            >
              webappstore.contact@gmail.com
            </a>
            <a 
              href="https://ko-fi.com/webappstore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-all text-sm font-bold text-slate-600 active:scale-95"
            >
              <span className="text-red-500">❤️</span>
              Soutenir le projet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
