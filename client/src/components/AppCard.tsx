
import { App } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const categoryColors: Record<string, string> = {
  "AI": "bg-blue-50 text-blue-600 border-blue-100",
  "Productivity": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Design": "bg-purple-50 text-purple-600 border-purple-100",
  "Games": "bg-orange-50 text-orange-600 border-orange-100",
  "Development": "bg-indigo-50 text-indigo-600 border-indigo-100",
  "Social": "bg-rose-50 text-rose-600 border-rose-100",
  "Other": "bg-slate-50 text-slate-600 border-slate-100",
};

export function AppCard({ app }: { app: App }) {
  if (!app || !app.url) return null;
  
  let hostname = "";
  try {
    hostname = new URL(app.url).hostname;
  } catch (e) {
    hostname = "link";
  }
  
  const hasReviews = (app.votes || 0) > 0;
  // Note communautaire is app.rating if it has votes
  // Score global is app.rating if it has NO votes but rating > 0
  const hasExternalRating = !hasReviews && (app.rating || 0) > 0;
  const isNew = !hasReviews && !hasExternalRating;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/app/${app.id}`}>
        <Card className="group h-full overflow-hidden border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-shadow duration-500 rounded-[2rem] bg-white cursor-pointer flex flex-col">
          <div className="p-8 flex flex-col items-center text-center flex-1">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-black/5 blur-xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
                alt={app.name}
                className="w-24 h-24 rounded-[1.5rem] shadow-sm relative z-10 bg-white p-2"
              />
              <Badge className={`absolute -top-3 -right-3 border shadow-sm text-[10px] font-semibold px-3 py-1 rounded-full ${categoryColors[app.category] || categoryColors.Other}`}>
                {app.category}
              </Badge>
            </div>
            
            <h3 className="font-bold text-xl mb-2 tracking-tight text-slate-900 group-hover:text-primary transition-colors">{app.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6 px-2">
              {app.description}
            </p>
            
            <div className="mt-auto flex flex-col items-center gap-4 w-full">
              <div className="flex items-center justify-between w-full px-2">
                {isNew ? (
                  <Badge className="bg-primary/5 text-primary border-primary/10 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles size={10} /> Nouveau
                  </Badge>
                ) : (
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-slate-700">{(Number(app.rating) || 0).toFixed(1)}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                      {hasReviews ? "Note Communauté" : "Score Global"}
                    </span>
                  </div>
                )}
                
                {!isNew && (
                  <div className="text-[10px] font-bold text-slate-300">
                    {app.votes || 0} avis
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 group-hover:text-primary transition-all uppercase tracking-[0.1em]">
                Explorer <ArrowUpRight size={12} />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
