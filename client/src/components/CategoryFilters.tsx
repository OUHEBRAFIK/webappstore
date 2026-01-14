
import { CATEGORIES } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export function CategoryFilters({ active, onSelect }: { active?: string, onSelect: (c: string | undefined) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      <Badge 
        variant={!active ? "default" : "outline"}
        className="cursor-pointer px-4 py-1.5 rounded-full"
        onClick={() => onSelect(undefined)}
      >
        Tout
      </Badge>
      {CATEGORIES.map(c => (
        <Badge 
          key={c}
          variant={active === c ? "default" : "outline"}
          className="cursor-pointer px-4 py-1.5 rounded-full whitespace-nowrap"
          onClick={() => onSelect(c)}
        >
          {c}
        </Badge>
      ))}
    </div>
  );
}
