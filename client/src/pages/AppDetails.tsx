
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { Star, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

export default function AppDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");

  const { data: app, isLoading, error } = useQuery({
    queryKey: [api.apps.get.path, id],
    queryFn: async () => {
      if (!id) throw new Error("ID requis");
      const res = await fetch(buildUrl(api.apps.get.path, { id }));
      if (!res.ok) throw new Error("Application introuvable");
      return res.json();
    },
    enabled: !!id,
    retry: false
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("ID requis");
      const res = await fetch(buildUrl(api.reviews.create.path, { id }), {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center gap-6 p-4 text-center">
        <div className="text-6xl mb-2">🚫</div>
        <h2 className="text-2xl font-bold text-slate-900">Application introuvable</h2>
        <p className="text-slate-500 max-w-md">L'application que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link href="/">
          <Button className="rounded-full px-8 h-12 font-bold shadow-lg">Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  const votes = Number(app.votes) || 0;
  const hasCommunityReviews = votes > 0;
  const externalRating = Number(app.externalRating) || 0;
  const communityRating = Number(app.rating) || 0;
  
  const hasAnyRating = hasCommunityReviews || externalRating > 0;
  const isNew = !hasAnyRating;
  
  const displayRating = hasCommunityReviews ? communityRating : externalRating;
  
  let hostname = "link";
  try {
    if (app.url) hostname = new URL(app.url).hostname;
  } catch(e) {}

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
            <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white text-center">
              <img 
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`}
                alt={app.name || "App"}
                className="w-24 h-24 rounded-[1.5rem] mx-auto mb-4 shadow-md bg-white p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=replit.com&sz=128";
                }}
              />
              <h2 className="text-2xl font-bold mb-2 tracking-tight">{app.name || "App"}</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{app.description || "Aucune description."}</p>
              <Button className="w-full rounded-2xl h-12 font-bold" onClick={() => app.url && window.open(app.url, '_blank')}>
                Ouvrir l'application
              </Button>
              
              <div className="mt-8 pt-8 border-t border-slate-50">
                {isNew ? (
                  <div className="flex flex-col items-center gap-2">
                    <Badge className="bg-primary/5 text-primary border-primary/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                      <Sparkles size={12} className="mr-1" /> Nouveau
                    </Badge>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pas encore d'avis</p>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">
                      {displayRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center my-3 gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={18} className={s <= Math.round(displayRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-100"} />
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {hasCommunityReviews ? "Note Communauté" : "Score Global"}
                      </span>
                      <div className="text-xs font-bold text-slate-300">{votes} avis</div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
              <h3 className="text-xl font-bold mb-6 tracking-tight">Laisser un avis</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Votre Note</Label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <Star 
                        key={s} 
                        size={36} 
                        className={`cursor-pointer transition-all duration-200 ${
                          s <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400 scale-110" : "text-slate-100 hover:scale-105"
                        }`}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Votre Nom</Label>
                  <Input 
                    placeholder="Ex: Jean Dupont" 
                    className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary/20"
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Commentaire</Label>
                  <Textarea 
                    placeholder="Partagez votre expérience avec cet outil..." 
                    className="min-h-[120px] rounded-xl bg-slate-50 border-none focus-visible:ring-primary/20 resize-none"
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95" 
                  disabled={!rating || !username || !comment || reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate()}
                >
                  <Send size={18} className="mr-2" />
                  {reviewMutation.isPending ? "Publication..." : "Publier l'avis"}
                </Button>
              </div>
            </Card>

            <div className="space-y-6 px-2">
              <h3 className="text-xl font-bold tracking-tight">Avis des utilisateurs</h3>
              {(!app.reviews || app.reviews.length === 0) ? (
                <Card className="p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-transparent text-center">
                  <div className="text-4xl mb-4 opacity-20">💬</div>
                  <p className="text-slate-400 font-medium italic">Aucun avis pour le moment. Soyez le premier !</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {app.reviews.map((r: any) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card className="p-6 rounded-3xl border-none shadow-sm bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-bold text-slate-900 block">{r.username || "Anonyme"}</span>
                            <div className="flex gap-0.5 mt-1">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={10} className={s <= (Number(r.rating) || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-100"} />
                              ))}
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                            {r.createdAt ? format(new Date(r.createdAt), "d MMMM yyyy", { locale: fr }) : ""}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 font-medium">{r.comment || ""}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
