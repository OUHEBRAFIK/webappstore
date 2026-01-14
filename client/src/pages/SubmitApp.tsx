
import { Card } from "@/components/ui/card";

export default function SubmitApp() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 rounded-3xl border-none shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Soumettre une application</h1>
        <p className="text-muted-foreground mb-8">Proposez votre outil web à la communauté WebStore Central.</p>
        
        <p className="text-sm italic">Fonctionnalité en cours de déploiement...</p>
      </Card>
    </div>
  );
}
