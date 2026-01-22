import { forwardRef } from "react";
import { App } from "../shared/schema.js";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUpRight, Sparkles } from "lucide-react";
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

const AppCardInner = forwardRef<HTMLDivElement, { app: App }>(({ app }, ref) => {
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

  return (
    <div ref={ref}>
      <Link href={`/app/${app.id}`}>
        <Card className="group h-full overflow-hidden border-0 bento-card hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] cursor-pointer flex flex-col transition-transform duration-300 hover:-translate-y-2" data-testid={`card-app-${app.id}`}>
          <div className="p-6 flex flex-col items-center text-center flex-1">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <AppLogo 
                  appName={app.name || "App"} 
                  appUrl={app.url || ""} 
                  customIconUrl={app.iconUrl}
                  size="md"
                  className="shadow-sm"
                />
              </div>
              <Badge className={`absolute -top-2 -right-2 border shadow-sm text-[9px] font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[app.category || "Divers"]}`}>
                {app.category || "Divers"}
              </Badge>
            </div>
            
            <h3 className="font-bold text-lg mb-2 tracking-tight text-foreground group-hover:text-primary transition-colors">{app.name || "Application"}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-5 px-1">
              {app.description || "Aucune description disponible."}
            </p>
            
            <div className="mt-auto flex flex-col items-center gap-3 w-full">
              <div className="flex items-center justify-between w-full px-1">
                {isNew ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                    <Sparkles size={9} /> Nouveau
                  </Badge>
                ) : (
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-full">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-foreground">
                        {(hasCommunityReviews ? communityRating : externalRating).toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tight ml-1">
                      {hasCommunityReviews ? "Communaute" : "Global"}
                    </span>
                  </div>
                )}
                
                {!isNew && (
                  <div className="text-[9px] font-bold text-muted-foreground/50">
                    {votes} avis
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-all uppercase tracking-[0.1em]">
                Explorer <ArrowUpRight size={11} />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
});

AppCardInner.displayName = "AppCardInner";

const MotionAppCard = motion.create(AppCardInner);

export function AppCard({ app }: { app: App }) {
  return (
    <MotionAppCard
      app={app}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    />
  );
}
