
import { App } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export function AppCard({ app }: { app: App }) {
  return (
    <Link href={`/app/${app.id}`}>
      <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white cursor-pointer h-full">
        <div className="p-6 flex flex-col items-center text-center h-full">
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
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {app.description}
          </p>
          
          <div className="mt-auto flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{(app.rating || 0).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({app.votes} avis)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-primary font-medium uppercase tracking-wider">
              <MessageSquare size={10} />
              Voir les détails
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
