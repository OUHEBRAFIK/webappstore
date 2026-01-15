import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { api, buildUrl } from "@shared/routes";
import { Star, ArrowLeft, Send, Sparkles, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const categoryColors: Record<string, string> = {
  "IA": "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
  "Productivité": "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300",
  "Design": "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
  "Jeux": "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300",
  "Développement": "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300",
  "Réseaux Sociaux": "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300",
  "Outils": "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300",
  "Divers": "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300",
};

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

  useEffect(() => {
    if (app) {
      document.title = `${app.name} - Avis et details | WebAppStore`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `Decouvrez ${app.name} : ${app.description}. Consultez les avis de la communaute.`);
      }
    }
  }, [app]);

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
      toast({ title: "Avis publie", description: "Merci pour votre retour !" });
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
      <div className="min-h-screen bg-background mesh-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">Chargement des details...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-background mesh-gradient flex flex-col items-center justify-center gap-6 p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-4xl">X</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Application introuvable</h2>
        <p className="text-muted-foreground max-w-md">L'application que vous recherchez n'existe pas ou a ete supprimee.</p>
        <Link href="/">
          <Button className="rounded-full px-8 h-12 font-bold shadow-lg" data-testid="button-back-home">Retour a l'accueil</Button>
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

  const isWhatsApp = app?.name === "WhatsApp Web";
  const logoUrl = isWhatsApp 
    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png"
    : `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  return (
    <div className="min-h-screen bg-background mesh-gradient flex flex-col">
      <header className="bg-background/80 dark:bg-background/90 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-back">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="font-bold text-xl text-foreground">{app.name}</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <Card className="p-8 rounded-[24px] border-0 bento-card text-center sticky top-24">
              <div className="w-28 h-28 rounded-[24px] mx-auto mb-5 shadow-lg bg-background dark:bg-card flex items-center justify-center overflow-hidden border border-border/30">
                <img 
                  src={logoUrl}
                  alt={app.name || "App"}
                  className="w-full h-full p-3 object-contain"
                  onError={(e) => {
                    if (!isWhatsApp) {
                      e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(app.name || 'App') + '&background=random&size=128';
                    }
                  }}
                />
              </div>
              
              <Badge className={`mb-4 border-0 shadow-sm text-[10px] font-semibold px-3 py-1 rounded-full ${categoryColors[app.category || "Divers"]}`}>
                {app.category || "Divers"}
              </Badge>
              
              <h2 className="text-2xl font-bold mb-2 tracking-tight text-foreground">{app.name || "App"}</h2>
              <p className="text-xs text-muted-foreground mb-2">{hostname}</p>
              
              <div className="my-6 py-6 border-t border-b border-border/50">
                {isNew ? (
                  <div className="flex flex-col items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                      <Sparkles size={12} className="mr-1" /> Nouveau
                    </Badge>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Pas encore d'avis</p>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl font-black text-foreground tracking-tighter">
                      {displayRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center my-3 gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={18} className={s <= Math.round(displayRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"} />
                      ))}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {hasCommunityReviews ? "Note Communaute" : "Score Global"}
                      </span>
                      <div className="text-xs font-bold text-muted-foreground/60">{votes} avis</div>
                    </div>
                  </>
                )}
              </div>
              
              <Button 
                className="w-full rounded-[16px] h-14 font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-95" 
                onClick={() => app.url && window.open(app.url, '_blank')}
                data-testid="button-launch-app"
              >
                <ExternalLink size={18} className="mr-2" />
                Lancer l'application
              </Button>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            <Card className="p-6 sm:p-8 rounded-[24px] border-0 bento-card">
              <h3 className="text-lg font-bold mb-4 tracking-tight text-foreground">A propos</h3>
              <p className="text-muted-foreground leading-relaxed">{app.description || "Aucune description disponible."}</p>
            </Card>

            <Card className="p-6 sm:p-8 rounded-[24px] border-0 bento-card">
              <h3 className="text-lg font-bold mb-6 tracking-tight text-foreground">Laisser un avis</h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Votre Note</Label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <Star 
                        key={s} 
                        size={32} 
                        className={`cursor-pointer transition-all duration-200 ${
                          s <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400 scale-110" : "text-muted-foreground/20 hover:scale-105"
                        }`}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        data-testid={`star-rating-${s}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Votre Nom</Label>
                  <Input 
                    placeholder="Ex: Jean Dupont" 
                    className="h-12 rounded-[12px] bg-secondary border-0 focus-visible:ring-primary/20"
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    data-testid="input-username"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Commentaire</Label>
                  <Textarea 
                    placeholder="Partagez votre experience avec cet outil..." 
                    className="min-h-[100px] rounded-[12px] bg-secondary border-0 focus-visible:ring-primary/20 resize-none"
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    data-testid="textarea-comment"
                  />
                </div>

                <Button 
                  className="w-full h-12 rounded-[12px] font-bold shadow-lg shadow-primary/10 transition-all active:scale-95" 
                  disabled={!rating || !username || !comment || reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate()}
                  data-testid="button-submit-review"
                >
                  <Send size={16} className="mr-2" />
                  {reviewMutation.isPending ? "Publication..." : "Publier l'avis"}
                </Button>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground px-1">Avis des utilisateurs</h3>
              {(!app.reviews || app.reviews.length === 0) ? (
                <Card className="p-10 rounded-[24px] border-2 border-dashed border-border bg-transparent text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl text-muted-foreground">...</span>
                  </div>
                  <p className="text-muted-foreground font-medium">Aucun avis pour le moment. Soyez le premier !</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {app.reviews.map((r: any) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-5 rounded-[20px] border-0 bento-card" data-testid={`review-${r.id}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-bold text-foreground block">{r.username || "Anonyme"}</span>
                            <div className="flex gap-0.5 mt-1">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} size={10} className={s <= (Number(r.rating) || 0) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"} />
                              ))}
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            {r.createdAt ? format(new Date(r.createdAt), "d MMMM yyyy", { locale: fr }) : ""}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{r.comment || ""}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border bg-card/50 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/icon.png" alt="WebAppStore" className="w-8 h-8 rounded-lg" />
            <h4 className="font-bold text-foreground tracking-tight">WebAppStore</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4 font-medium">Version MVP</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:webappstore.contact@gmail.com" 
              className="text-sm font-bold text-primary hover:underline transition-all"
            >
              webappstore.contact@gmail.com
            </a>
            <a 
              href="https://ko-fi.com/webappstore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-accent transition-all text-sm font-bold text-foreground active:scale-95"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse-soft" />
              Soutenir le projet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
