
import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { CATEGORIES, type InsertApp } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Button className="w-full" onClick={handleLogin}>Se connecter</Button>
        </Card>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [formData, setFormData] = useState<InsertApp>({
    url: "",
    name: "",
    description: "",
    category: "Autre",
    iconUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const scrapeMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch(api.apps.scrape.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      if (!res.ok) throw new Error("Scraping failed");
      return res.json();
    },
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        name: data.name || prev.name,
        description: data.description || prev.description,
        iconUrl: data.iconUrl || prev.iconUrl
      }));
      toast({ title: "Scraping réussi", description: "Les informations ont été pré-remplies." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de scraper cette URL", variant: "destructive" });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertApp) => {
      const res = await fetch(api.apps.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Creation failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
      toast({ title: "Succès", description: "L'application a été ajoutée au store." });
      setLocation("/");
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible d'ajouter l'application", variant: "destructive" });
    }
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ajouter une App</h1>
          <Button variant="ghost" onClick={() => setLocation("/")}>Retour</Button>
        </div>

        <Card className="p-8 rounded-3xl border-none shadow-sm bg-white">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>URL de l'application</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://example.com" 
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <Button 
                  variant="secondary" 
                  onClick={() => scrapeMutation.mutate(formData.url)}
                  disabled={scrapeMutation.isPending || !formData.url}
                >
                  {scrapeMutation.isPending ? "..." : "Auto-fill"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nom</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select 
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                className="h-32"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <Button 
              className="w-full h-12 text-lg rounded-2xl" 
              onClick={() => createMutation.mutate(formData)}
              disabled={createMutation.isPending || !formData.name || !formData.url}
            >
              {createMutation.isPending ? "Ajout en cours..." : "Ajouter au Store"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
