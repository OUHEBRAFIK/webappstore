import { CATEGORIES } from @shared/schema";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function CategoryFilters({ 
  active, 
  onSelect,
  activeRating,
  onRatingSelect,
  counts = {},
  categories = []
}: { 
  active?: string, 
  onSelect: (c: string | undefined) => void,
  activeRating?: number,
  onRatingSelect: (r: number | undefined) => void,
  counts?: Record<string, number>,
  categories?: string[]
}) {
  const displayCategories = categories.length > 0 ? categories : CATEGORIES;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Categories</p>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1 -mx-1 scroll-smooth">
          <Badge 
            variant={!active ? "default" : "outline"}
            className="cursor-pointer px-4 sm:px-5 py-2.5 sm:py-2 rounded-full border-0 shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 text-sm sm:text-xs"
            onClick={() => onSelect(undefined)}
            data-testid="filter-category-all"
          >
            Tout
          </Badge>
          {displayCategories.map(c => (
            <Badge 
              key={c}
              variant={active === c ? "default" : "outline"}
              className={`cursor-pointer px-4 sm:px-5 py-2.5 sm:py-2 rounded-full border-0 shadow-sm transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 text-sm sm:text-xs ${
                active === c ? "" : "bg-card hover:bg-accent"
              }`}
              onClick={() => onSelect(c)}
              data-testid={`filter-category-${c.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {c} <span className="ml-1.5 opacity-50 text-[10px]">{counts[c] || 0}</span>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Note Minimale</p>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1 -mx-1">
          {[undefined, 4, 3].map(r => (
            <Badge
              key={String(r)}
              variant={activeRating === r ? "default" : "outline"}
              className={`cursor-pointer px-4 sm:px-5 py-2.5 sm:py-2 rounded-full border-0 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shrink-0 text-sm sm:text-xs ${
                activeRating === r ? "" : "bg-card hover:bg-accent"
              }`}
              onClick={() => onRatingSelect(r)}
              data-testid={`filter-rating-${r || 'all'}`}
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
