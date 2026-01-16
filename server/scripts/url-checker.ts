import { db } from "../db";
import { apps } from "@shared/schema";
import { eq } from "drizzle-orm";
import pLimit from "p-limit";

const limit = pLimit(10);

async function checkUrl(url: string, timeout = 10000): Promise<{ accessible: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; URLChecker/1.0)",
      },
      redirect: "follow",
    });
    
    clearTimeout(timeoutId);
    
    if (response.status >= 200 && response.status < 400) {
      return { accessible: true, status: response.status };
    }
    
    if (response.status === 405) {
      const getResponse = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; URLChecker/1.0)",
        },
        redirect: "follow",
      });
      
      if (getResponse.status >= 200 && getResponse.status < 400) {
        return { accessible: true, status: getResponse.status };
      }
      return { accessible: false, status: getResponse.status };
    }
    
    return { accessible: false, status: response.status };
  } catch (error: any) {
    if (error.name === "AbortError") {
      return { accessible: false, error: "Timeout" };
    }
    return { accessible: false, error: error.message || "Unknown error" };
  }
}

async function main() {
  console.log("🔍 Démarrage de la vérification des URLs...\n");
  
  const allApps = await db.select().from(apps);
  console.log(`📊 Total d'applications à vérifier: ${allApps.length}\n`);
  
  const results: { id: number; name: string; url: string; accessible: boolean; status?: number; error?: string }[] = [];
  
  let checked = 0;
  const tasks = allApps.map((app) =>
    limit(async () => {
      const result = await checkUrl(app.url);
      checked++;
      
      const status = result.accessible ? "✅" : "❌";
      const info = result.status ? `(${result.status})` : result.error ? `(${result.error})` : "";
      console.log(`[${checked}/${allApps.length}] ${status} ${app.name} ${info}`);
      
      results.push({
        id: app.id,
        name: app.name,
        url: app.url,
        ...result,
      });
    })
  );
  
  await Promise.all(tasks);
  
  const inaccessible = results.filter((r) => !r.accessible);
  const accessible = results.filter((r) => r.accessible);
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ");
  console.log("=".repeat(60));
  console.log(`✅ Applications accessibles: ${accessible.length}`);
  console.log(`❌ Applications inaccessibles: ${inaccessible.length}`);
  
  if (inaccessible.length > 0) {
    console.log("\n🗑️ Applications à supprimer:");
    inaccessible.forEach((app) => {
      const reason = app.status ? `HTTP ${app.status}` : app.error || "Inconnu";
      console.log(`   - ${app.name} (${app.url}) - Raison: ${reason}`);
    });
    
    console.log("\n🗑️ Suppression des applications inaccessibles...");
    
    for (const app of inaccessible) {
      await db.delete(apps).where(eq(apps.id, app.id));
      console.log(`   Supprimé: ${app.name}`);
    }
    
    console.log(`\n✅ ${inaccessible.length} applications supprimées de la base de données.`);
  }
  
  const remaining = await db.select().from(apps);
  console.log(`\n📊 Applications restantes dans la base: ${remaining.length}`);
}

main()
  .then(() => {
    console.log("\n✅ Vérification terminée!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  });
