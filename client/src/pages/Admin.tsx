
import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    const res = await fetch(api.admin.login.path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    
    if (res.ok) {
      setIsAuthed(true);
    } else {
      toast({ title: "Erreur", description: "Mot de passe incorrect", variant: "destructive" });
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 rounded-3xl border-none shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Administration</h1>
          <Input 
            type="password" 
            placeholder="Mot de passe" 
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={handleLogin}>Se connecter</Button>
        </Card>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleScrape = async () => {
    setLoading(true);
    try {
      const res = await fetch(api.apps.scrape.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      // For simplicity in this turn, we just show a toast
      toast({ title: "Scraping réussi", description: `App trouvée: ${data.name}` });
      // In a real app, we'd pre-fill a form
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de scraper cette URL", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
        <Card className="p-8 rounded-3xl border-none shadow-sm bg-white mb-8">
          <h2 className="text-xl font-semibold mb-4">Ajout Rapide</h2>
          <div className="flex gap-4">
            <Input 
              placeholder="URL de l'app" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleScrape} disabled={loading}>
              {loading ? "Chargement..." : "Scraper & Ajouter"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
