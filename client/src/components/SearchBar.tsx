
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input 
        type="search"
        placeholder="Rechercher une application..."
        className="w-full pl-12 pr-4 h-12 sm:h-14 rounded-full border-none bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus-visible:ring-primary/20 text-base font-medium transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
