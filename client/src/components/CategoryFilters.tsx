
import { CATEGORIES } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function CategoryFilters({ 
  active, 
  onSelect,
  activeRating,
  onRatingSelect
}: { 
  active?: string, 
  onSelect: (c: string | undefined) => void,
  activeRating?: number,
  onRatingSelect: (r: number | undefined) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Catégories</p>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
          <Badge 
            variant={!active ? "default" : "outline"}
            className="cursor-pointer px-5 py-2 rounded-full border-none shadow-sm transition-all hover:scale-105 active:scale-95"
            onClick={() => onSelect(undefined)}
          >
            Tout
          </Badge>
          {CATEGORIES.map(c => (
            <Badge 
              key={c}
              variant={active === c ? "default" : "outline"}
              className={`cursor-pointer px-5 py-2 rounded-full border-none shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap ${
                active === c ? "" : "bg-white hover:bg-slate-50"
              }`}
              onClick={() => onSelect(c)}
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Note Minimale</p>
        <div className="flex gap-2">
          {[undefined, 4, 3].map(r => (
            <Badge
              key={String(r)}
              variant={activeRating === r ? "default" : "outline"}
              className={`cursor-pointer px-5 py-2 rounded-full border-none shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                activeRating === r ? "" : "bg-white hover:bg-slate-50"
              }`}
              onClick={() => onRatingSelect(r)}
            >
              {!r ? "Toutes" : (
                <>
                  {r}+ <Star size={12} className={activeRating === r ? "fill-white" : "fill-yellow-400 text-yellow-400"} />
                </>
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
