
import { Card } from "@/components/ui/card";

export default function SubmitApp() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 rounded-[1.5rem] border-none shadow-[0_4px_12px_rgba(0,0,0,0.02)] bg-white">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">Soumettre une application</h1>
        <p className="text-slate-500 mb-8">Proposez votre outil web à la communauté WebStore Central.</p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <p className="text-sm font-medium text-slate-600 italic">Fonctionnalité en cours de déploiement...</p>
        </div>
        
        <Link href="/" className="mt-8 block text-center">
          <Button variant="ghost" className="font-bold">Retour à l'accueil</Button>
        </Link>
      </Card>
    </div>
  );
}
