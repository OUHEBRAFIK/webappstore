
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { Star, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AppDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  const { data: app, isLoading } = useQuery({
    queryKey: [api.apps.get.path, id],
    queryFn: async () => {
      const res = await fetch(buildUrl(api.apps.get.path, { id: id! }));
      return res.json();
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(buildUrl(api.reviews.create.path, { id: id! }), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, username, comment })
      });
      if (!res.ok) throw new Error("Failed to post review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.get.path, id] });
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
      toast({ title: "Avis publié", description: "Merci pour votre retour !" });
      setRating(0);
      setUsername("");
      setComment("");
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de publier l'avis.", variant: "destructive" });
    }
  });

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;
  if (!app) return <div className="p-8 text-center">App non trouvée</div>;

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-12">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">{app.name}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="p-8 rounded-3xl border-none shadow-sm bg-white text-center">
              <img 
                src={`https://www.google.com/s2/favicons?domain=${new URL(app.url).hostname}&sz=128`}
                alt={app.name}
                className="w-24 h-24 rounded-3xl mx-auto mb-4 shadow-md"
              />
              <h2 className="text-2xl font-bold mb-2">{app.name}</h2>
              <p className="text-sm text-muted-foreground mb-6">{app.description}</p>
              <Button className="w-full rounded-2xl" onClick={() => window.open(app.url, '_blank')}>
                Ouvrir l'application
              </Button>
              
              <div className="mt-8 pt-8 border-t">
                <div className="text-4xl font-bold">{(app.rating || 0).toFixed(1)}</div>
                <div className="flex justify-center my-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} className={s <= Math.round(app.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">{app.votes} avis</div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card className="p-8 rounded-3xl border-none shadow-sm bg-white">
              <h3 className="text-xl font-bold mb-6">Laisser un avis</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Note</Label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star 
                        key={s} 
                        size={32} 
                        className={`cursor-pointer transition-colors ${
                          s <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        }`}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input 
                    placeholder="Votre nom" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Commentaire</Label>
                  <Textarea 
                    placeholder="Qu'en pensez-vous ?" 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full rounded-2xl" 
                  disabled={!rating || !username || !comment || reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate()}
                >
                  <Send size={16} className="mr-2" />
                  Publier l'avis
                </Button>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Avis des utilisateurs</h3>
              {app.reviews?.length === 0 ? (
                <p className="text-muted-foreground italic">Aucun avis pour le moment.</p>
              ) : (
                app.reviews?.map((r: any) => (
                  <Card key={r.id} className="p-6 rounded-2xl border-none shadow-sm bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold block">{r.username}</span>
                        <div className="flex gap-0.5 mt-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={12} className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {format(new Date(r.createdAt), "d MMMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">{r.comment}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
