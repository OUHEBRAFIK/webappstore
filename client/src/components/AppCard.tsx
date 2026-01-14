
import { App } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";

export function AppCard({ app }: { app: App }) {
  const ratingMutation = useMutation({
    mutationFn: async (rating: number) => {
      const res = await fetch(buildUrl(api.apps.rate.path, { id: app.id }), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
    }
  });

  return (
    <Card 
      className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white cursor-pointer"
      onClick={() => window.open(app.url, '_blank')}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img 
            src={`https://www.google.com/s2/favicons?domain=${new URL(app.url).hostname}&sz=128`}
            alt={app.name}
            className="w-20 h-20 rounded-2xl shadow-sm group-hover:scale-105 transition-transform"
          />
          <Badge className="absolute -top-2 -right-2 bg-primary/10 text-primary border-none text-[10px] px-2 py-0">
            {app.category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg mb-1">{app.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
          {app.description}
        </p>
        
        <div className="flex items-center gap-1 mt-auto">
          {[1,2,3,4,5].map((s) => (
            <Star 
              key={s} 
              size={14} 
              className={s <= Math.round(app.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
              onClick={(e) => {
                e.stopPropagation();
                ratingMutation.mutate(s);
              }}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({app.votes})</span>
        </div>
      </div>
    </Card>
  );
}
