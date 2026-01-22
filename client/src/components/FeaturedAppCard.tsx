import { forwardRef } from "react";
import { App } from "../shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUpRight, Trophy, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AppLogo } from "./AppLogo";

const categoryColors: Record<string, string> = {
  "IA": "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700",
  "Productivité": "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
  "Design": "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-700",
  "Jeux": "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-700",
  "Développement": "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700",
  "Réseaux Sociaux": "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-700",
  "Outils": "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  "Divers": "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

const FeaturedAppCardInner = forwardRef<HTMLDivElement, { app: App }>(({ app }, ref) => {
  if (!app || !app.id) return null;
  
  let hostname = "link";
  try {
    if (app.url) {
      hostname = new URL(app.url).hostname;
    }
  } catch (e) {}
  
  const votes = Number(app.votes) || 0;
  const hasCommunityReviews = votes > 0;
  const externalRating = Number(app.externalRating) || 0;
  const communityRating = Number(app.rating) || 0;
  
  const hasAnyRating = hasCommunityReviews || externalRating > 0;
  const isNew = !hasAnyRating;
  const displayRating = hasCommunityReviews ? communityRating : externalRating;

  return (
    <div ref={ref} className="hidden sm:block sm:col-span-2 sm:row-span-2">
      <Link href={`/app/${app.id}`}>
        <Card className="group h-full overflow-hidden border-0 bento-card bento-featured hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col min-h-[400px] relative transition-transform duration-300 hover:-translate-y-1" data-testid={`card-featured-app-${app.id}`}>
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy size={12} />
              App de la Semaine
            </Badge>
          </div>

          <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 flex-1">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <AppLogo 
                  appName={app.name || "App"} 
                  appUrl={app.url || ""} 
                  customIconUrl={app.iconUrl}
                  size="lg"
                  className="shadow-lg"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <Badge className={`mb-3 border shadow-sm text-[10px] font-semibold px-3 py-1 rounded-full ${categoryColors[app.category || "Divers"]}`}>
                {app.category || "Divers"}
              </Badge>
              
              <h3 className="font-black text-2xl sm:text-3xl mb-3 tracking-tight text-foreground group-hover:text-primary transition-colors">{app.name || "Application"}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                {app.description || "Aucune description disponible."}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {isNew ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={12} /> Nouveau
                  </Badge>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-bold text-foreground">
                        {displayRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        {hasCommunityReviews ? "Note Communaute" : "Score Global"}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground/60">
                        {votes} avis
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 sm:px-10 pb-6 mt-auto">
            <div className="flex items-center justify-between pt-6 border-t border-border/50">
              <span className="text-xs font-medium text-muted-foreground">{hostname}</span>
              <div className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                Explorer <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
});

FeaturedAppCardInner.displayName = "FeaturedAppCardInner";

const MotionFeaturedAppCard = motion.create(FeaturedAppCardInner);

export function FeaturedAppCard({ app }: { app: App }) {
  return (
    <MotionFeaturedAppCard
      app={app}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    />
  );
}
