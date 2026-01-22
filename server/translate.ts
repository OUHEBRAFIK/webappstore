import OpenAI from "openai";
import { storage } from "./storage.js";
import { db } from "./db.js";
import { apps } from "../shared/schema.js";
import { eq } from "drizzle-orm";

// On initialise l'IA seulement si une vraie clé est présente
const hasOpenAIKey = process.env.OPENAI_API_KEY && 
                     process.env.OPENAI_API_KEY !== "" && 
                     !process.env.OPENAI_API_KEY.includes("PROJET_WEBAPPSTORE");

const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function translateDescription(text: string): Promise<string> {
  if (!openai || !text || text.trim().length === 0) return text;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un traducteur professionnel spécialisé dans la tech. Traduis la description suivante en français de manière concise et attrayante."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    return response.choices[0].message.content || text;
  } catch (error) {
    console.error("L'IA est désactivée ou en erreur, on garde le texte original.");
    return text;
  }
}

export async function translateAllDescriptions() {
  try {
    const allApps = await storage.getApps();
    for (const app of allApps) {
      const translated = await translateDescription(app.description);
      if (translated !== app.description) {
        await db.update(apps)
          .set({ description: translated })
          .where(eq(apps.id, app.id));
      }
    }
  } catch (error) {
    console.error("Erreur lors de la traduction globale:", error);
  }
}