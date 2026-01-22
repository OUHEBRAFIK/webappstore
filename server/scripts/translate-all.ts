import { translateDescription } from "../translate";
import { db } from "../db";
import { apps } from "../shared/schema.js";
import { eq, sql } from "drizzle-orm";

async function translateAllEnglishDescriptions() {
  console.log("🌐 Démarrage de la traduction en français...");
  
  const englishApps = await db.select().from(apps).where(
    sql`description !~ '[éèêàçùîô]'`
  );
  
  console.log(`📝 ${englishApps.length} apps à traduire...`);
  
  let translated = 0;
  let errors = 0;
  
  for (const app of englishApps) {
    if (!app.description || app.description.trim().length === 0) {
      console.log(`⏭️ ${app.name}: Description vide, ignorée`);
      continue;
    }
    
    try {
      console.log(`🔄 Traduction: ${app.name}...`);
      const translatedDesc = await translateDescription(app.description);
      
      if (translatedDesc !== app.description) {
        await db.update(apps)
          .set({ description: translatedDesc })
          .where(eq(apps.id, app.id));
        console.log(`✅ ${app.name}: Traduit`);
        translated++;
      } else {
        console.log(`ℹ️ ${app.name}: Déjà en français ou inchangé`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ ${app.name}: Erreur -`, error);
      errors++;
    }
  }
  
  console.log(`\n📊 Résultat final:`);
  console.log(`   ✅ Traduits: ${translated}`);
  console.log(`   ❌ Erreurs: ${errors}`);
  console.log(`   📝 Total traité: ${englishApps.length}`);
  
  process.exit(0);
}

translateAllEnglishDescriptions().catch(console.error);
