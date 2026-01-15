import OpenAI from "openai";
import { storage } from "./storage";
import { db } from "./db";
import { apps } from "@shared/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function translateDescription(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return text;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un traducteur professionnel spécialisé dans la tech. Traduis la description suivante en français de manière concise et attrayante. Garde le ton professionnel et adapté à un store d'applications. Ne traduis pas les noms propres."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    return response.choices[0].message.content || text;
  } catch (error) {
    console.error("Erreur de traduction AI:", error);
    return text;
  }
}

export async function translateAllDescriptions() {
  console.log("Démarrage de la traduction des descriptions...");
  const allApps = await storage.getApps();
  
  for (const app of allApps) {
    // On ne traduit que si la description semble être en anglais ou si on veut forcer
    // Pour simplifier, on traduit tout ce qui n'a pas été marqué comme traduit ou simplement tout
    console.log(`Traduction de : ${app.name}`);
    const translated = await translateDescription(app.description);
    
    if (translated !== app.description) {
      await db.update(apps)
        .set({ description: translated })
        .where(eq(apps.id, app.id));
      console.log(`✅ Traduit : ${app.name}`);
    } else {
      console.log(`ℹ️ Déjà en français ou inchangé : ${app.name}`);
    }
  }
  console.log("Fin de la traduction.");
}
