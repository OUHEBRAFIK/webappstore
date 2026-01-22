
import { storage } from "../storage";
import { InsertApp } from "../shared/schema.js";

const extraApps: InsertApp[] = [
  // Productivité
  { name: "Trello", url: "https://trello.com", category: "Productivité", description: "Tableaux, listes et cartes visuels pour organiser et hiérarchiser vos projets de manière flexible." },
  { name: "Asana", url: "https://asana.com", category: "Productivité", description: "Le moyen le plus simple pour les équipes de suivre leur travail et d'obtenir des résultats." },
  { name: "Monday.com", url: "https://monday.com", category: "Productivité", description: "Une plateforme cloud qui permet aux équipes de créer leurs propres applications et logiciels de gestion du travail." },
  { name: "ClickUp", url: "https://clickup.com", category: "Productivité", description: "Une application pour les remplacer toutes. Gestion des tâches, documents, rappels, objectifs." },
  { name: "Evernote", url: "https://evernote.com", category: "Productivité", description: "Organisez vos notes, gérez vos tâches et archivez vos idées." },
  { name: "Todoist", url: "https://todoist.com", category: "Productivité", description: "Le gestionnaire de tâches et l'application de liste de tâches numéro 1 au monde." },
  { name: "Pocket", url: "https://getpocket.com", category: "Productivité", description: "La meilleure façon de sauvegarder et de découvrir le meilleur contenu du web." },
  { name: "Obsidian", url: "https://obsidian.md", category: "Productivité", description: "Une puissante base de connaissances sur un dossier local de fichiers Markdown." },
  { name: "Roam Research", url: "https://roamresearch.com", category: "Productivité", description: "Un outil de prise de notes pour la pensée en réseau." },
  { name: "Airtable", url: "https://airtable.com", category: "Productivité", description: "Mi-tableur, mi-base de données. Le moyen facile de créer vos propres applications personnalisées." },
  { name: "Coda", url: "https://coda.io", category: "Productivité", description: "Le document qui rassemble tout. Mélangeant la flexibilité d'un document avec la puissance d'une base de données." },
  { name: "Zoom", url: "https://zoom.us", category: "Productivité", description: "Plateforme cloud pour les vidéoconférences, la collaboration, le chat et les webinaires." },
  { name: "Loom", url: "https://loom.com", category: "Productivité", description: "Messagerie vidéo pour le travail. Vidéo asynchrone qui vous aide à communiquer plus efficacement." },
  { name: "Calendly", url: "https://calendly.com", category: "Productivité", description: "La plateforme de planification moderne qui facilite la recherche de créneaux." },

  // Design
  { name: "Adobe Express", url: "https://www.adobe.com/express", category: "Design", description: "Le design simplifié. Créez des graphiques sociaux, des dépliants, des logos et plus encore." },
  { name: "Sketch", url: "https://www.sketch.com", category: "Design", description: "La boîte à outils de conception numérique. Concevez, prototypez et collaborez." },
  { name: "InVision", url: "https://www.invisionapp.com", category: "Design", description: "La plateforme de conception de produits numériques utilisée pour créer les meilleures expériences client." },
  { name: "Pixlr", url: "https://pixlr.com", category: "Design", description: "Éditeur de photos en ligne gratuit, animateur d'images et outil de conception." },
  { name: "Vectr", url: "https://vectr.com", category: "Design", description: "Logiciel de graphisme vectoriel gratuit utilisé pour créer des graphiques vectoriels facilement." },
  { name: "FontAwesome", url: "https://fontawesome.com", category: "Design", description: "Le jeu d'icônes le plus populaire et le plus facile à utiliser au monde." },
  { name: "Unsplash", url: "https://unsplash.com", category: "Design", description: "La source d'images librement utilisables sur internet. Propulsé par des créateurs du monde entier." },
  { name: "Pexels", url: "https://pexels.com", category: "Design", description: "Les meilleures photos de stock gratuites, images et vidéos libres de droits partagées par des créateurs talentueux." },
  { name: "Canva Pro", url: "https://canva.com/pro", category: "Design", description: "Débloquez des fonctionnalités premium pour votre équipe de design." },
  { name: "Coolors", url: "https://coolors.co", category: "Design", description: "Le générateur de palettes de couleurs ultra-rapide ! Créez, enregistrez et partagez." },

  // IA
  { name: "Claude AI", url: "https://claude.ai", category: "IA", description: "Assistant IA de nouvelle génération utile, inoffensif et honnête. Développé par Anthropic." },
  { name: "Jasper AI", url: "https://jasper.ai", category: "IA", description: "Le générateur de contenu IA qui vous aide à briser les blocages créatifs." },
  { name: "Copy.ai", url: "https://copy.ai", category: "IA", description: "Découvrez la pleine puissance d'un générateur de contenu IA." },
  { name: "Synthesia", url: "https://synthesia.io", category: "IA", description: "La plateforme de génération de vidéo IA numéro 1 au monde. Créez des vidéos à partir de texte." },
  { name: "Runway", url: "https://runwayml.com", category: "IA", description: "Tout ce dont vous avez besoin pour créer tout ce que vous voulez." },
  { name: "Perplexity AI", url: "https://perplexity.ai", category: "IA", description: "Un moteur de recherche conversationnel qui fournit des réponses précises." },
  { name: "Gamma", url: "https://gamma.app", category: "IA", description: "Un nouveau support pour présenter des idées. Créez du contenu interactif avec l'IA." },
  { name: "Leonardo.ai", url: "https://leonardo.ai", category: "IA", description: "Générez des actifs de qualité de production pour vos projets créatifs." },
  { name: "Character.ai", url: "https://character.ai", category: "IA", description: "Où les agents intelligents prennent vie. Discutez avec n'importe quel personnage." },
  { name: "Krea AI", url: "https://krea.ai", category: "IA", description: "Suite créative IA en temps réel pour la génération et l'amélioration d'images." },

  // Développement
  { name: "Stack Overflow", url: "https://stackoverflow.com", category: "Développement", description: "La plus grande communauté en ligne pour les développeurs pour apprendre et partager." },
  { name: "Netlify", url: "https://netlify.com", category: "Développement", description: "Connectez votre dépôt et déployez votre site en quelques minutes." },
  { name: "Firebase", url: "https://firebase.google.com", category: "Développement", description: "La plateforme mobile de Google qui vous aide à développer rapidement des applications de haute qualité." },
  { name: "Supabase", url: "https://supabase.com", category: "Développement", description: "L'alternative open source à Firebase. Construisez en un week-end, passez à l'échelle." },
  { name: "Postman", url: "https://postman.com", category: "Développement", description: "La plateforme de collaboration pour le développement d'API." },
  { name: "Glitch", url: "https://glitch.com", category: "Développement", description: "La communauté amicale où tout le monde construit le web." },
  { name: "W3Schools", url: "https://w3schools.com", category: "Développement", description: "Le plus grand site de développeurs web au monde. Apprenez le HTML, CSS, JavaScript." },
  { name: "Dev.to", url: "https://dev.to", category: "Développement", description: "Un réseau social constructif et inclusif pour les développeurs de logiciels." },
  { name: "Hashnode", url: "https://hashnode.com", category: "Développement", description: "La plateforme de blogging sans tracas pour les développeurs." },
  { name: "Railway", url: "https://railway.app", category: "Développement", description: "Déployez votre code sans la complexité. Le moyen le plus simple d'expédier votre logiciel." },

  // Réseaux Sociaux
  { name: "LinkedIn", url: "https://linkedin.com", category: "Réseaux Sociaux", description: "Gérez votre identité professionnelle. Construisez votre réseau professionnel." },
  { name: "Instagram", url: "https://instagram.com", category: "Réseaux Sociaux", description: "Rapprochez-vous des personnes et des choses que vous aimez." },
  { name: "Pinterest", url: "https://pinterest.com", category: "Réseaux Sociaux", description: "Découvrez des recettes, des idées pour la maison, de l'inspiration de style." },
  { name: "TikTok", url: "https://tiktok.com", category: "Réseaux Sociaux", description: "La destination leader pour les vidéos mobiles au format court." },
  { name: "Twitch", url: "https://twitch.tv", category: "Réseaux Sociaux", description: "La plateforme leader mondial de streaming en direct pour les joueurs." },
  { 
    name: "WhatsApp Web", 
    url: "https://web.whatsapp.com", 
    category: "Réseaux Sociaux", 
    description: "Envoyez et recevez rapidement des messages WhatsApp directement depuis votre ordinateur.",
    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png?v=2"
  },
  { name: "Telegram Web", url: "https://web.telegram.org", category: "Réseaux Sociaux", description: "Messagerie instantanée pure — simple, rapide, sécurisée et synchronisée." },
  { name: "Mastodon", url: "https://joinmastodon.org", category: "Réseaux Sociaux", description: "Réseautage social qui n'est pas à vendre. Médias sociaux décentralisés." },
  { name: "Threads", url: "https://threads.net", category: "Réseaux Sociaux", description: "Partagez vos idées, rejoignez des conversations et suivez les personnes qui vous intéressent." },

  // Jeux
  { name: "Roblox", url: "https://roblox.com", category: "Jeux", description: "L'univers virtuel ultime qui vous permet de créer et de partager des expériences avec des amis." },
  { name: "Itch.io", url: "https://itch.io", category: "Jeux", description: "Le marché ouvert pour les créateurs numériques indépendants avec un focus sur les jeux indie." },
  { name: "Steam Web", url: "https://store.steampowered.com", category: "Jeux", description: "La destination ultime pour jouer, discuter et créer des jeux." },
  { name: "Epic Games", url: "https://epicgames.com", category: "Jeux", description: "Un magasin numérique de premier plan pour des jeux de haute qualité." },
  { name: "Poki", url: "https://poki.com", category: "Jeux", description: "Poki propose la meilleure sélection de jeux en ligne gratuits." },
  { name: "CrazyGames", url: "https://crazygames.com", category: "Jeux", description: "Jouez à des jeux en ligne gratuits sur CrazyGames, le meilleur endroit pour s'amuser." },
  { name: "Agar.io", url: "https://agar.io", category: "Jeux", description: "Le jeu à succès ! Contrôlez votre cellule et mangez d'autres joueurs." },
  { name: "Slither.io", url: "https://slither.io", category: "Jeux", description: "Un jeu de serpent multijoueur simple et addictif." },
  { name: "Chess.com", url: "https://chess.com", category: "Jeux", description: "Jouez aux échecs en ligne avec des amis et des adversaires du monde entier." },
  { name: "Lichess", url: "https://lichess.org", category: "Jeux", description: "Serveur d'échecs en ligne gratuit. Pas de publicité, open source." },

  // Divers
  { name: "Wikipedia", url: "https://wikipedia.org", category: "Divers", description: "L'encyclopédie libre que tout le monde peut modifier." },
  { name: "Google Maps", url: "https://maps.google.com", category: "Divers", description: "Trouvez des entreprises locales, affichez des cartes et obtenez des itinéraires." },
  { name: "SoundCloud", url: "https://soundcloud.com", category: "Divers", description: "La plus grande plateforme audio ouverte au monde." },
  { name: "Spotify Web", url: "https://open.spotify.com", category: "Divers", description: "Service de musique numérique qui vous donne accès à des millions de chansons." },
  { name: "YouTube", url: "https://youtube.com", category: "Divers", description: "Profitez des vidéos et de la musique que vous aimez, partagez-les avec vos amis." },
  { name: "Netflix", url: "https://netflix.com", category: "Divers", description: "Regardez des émissions de télévision et des films en ligne." },
  { name: "Amazon", url: "https://amazon.com", category: "Divers", description: "Achetez en ligne de l'électronique, des ordinateurs, des vêtements et plus encore." },
  { name: "eBay", url: "https://ebay.com", category: "Divers", description: "Achetez et vendez de l'électronique, des voitures, de la mode et plus encore." },
  { name: "PayPal", url: "https://paypal.com", category: "Divers", description: "Le moyen le plus sûr et le plus facile de payer en ligne." },
  { name: "Stripe", url: "https://stripe.com", category: "Divers", description: "Infrastructure de paiement pour internet." },
  { name: "Webflow", url: "https://webflow.com", category: "Divers", description: "Créez des sites web professionnels visuellement." },
  { name: "Wix", url: "https://wix.com", category: "Divers", description: "Créez un site web gratuit avec Wix.com." },
  { name: "Squarespace", url: "https://squarespace.com", category: "Divers", description: "Créez un beau site web, une boutique en ligne ou un portfolio." },
  { name: "Medium", url: "https://medium.com", category: "Divers", description: "Un endroit pour lire, écrire et se connecter." },
  { name: "Quora", url: "https://quora.com", category: "Divers", description: "Un endroit pour partager des connaissances et mieux comprendre le monde." },
  { name: "WolframAlpha", url: "https://wolframalpha.com", category: "Divers", description: "Calculez des réponses de niveau expert en utilisant les algorithmes de Wolfram." },
  { name: "Speedtest", url: "https://speedtest.net", category: "Divers", description: "Testez votre vitesse de connexion internet en un clic." },
  { name: "TinyURL", url: "https://tinyurl.com", category: "Divers", description: "Raccourcissez les longs URL en liens gérables." },
  { name: "Bitly", url: "https://bitly.com", category: "Divers", description: "Raccourcissez, partagez et suivez vos liens." },
  { name: "Grammarly", url: "https://grammarly.com", category: "Divers", description: "Obtenez des corrections de Grammarly pendant que vous écrivez." },
  { name: "DeepL", url: "https://deepl.com", category: "Divers", description: "Le traducteur le plus précis au monde." },
  { name: "1Password", url: "https://1password.com", category: "Divers", description: "Le moyen le plus simple de stocker et d'utiliser des mots de passe forts." },
  { name: "LastPass", url: "https://lastpass.com", category: "Divers", description: "La meilleure façon de gérer vos mots de passe." },
  { name: "Dropbox", url: "https://dropbox.com", category: "Divers", description: "Gardez vos fichiers en sécurité, synchronisés et faciles à partager." },
  { name: "Google Drive", url: "https://drive.google.com", category: "Divers", description: "Stockez, partagez et collaborez sur des fichiers et dossiers." },
  { name: "Microsoft 365", url: "https://office.com", category: "Divers", description: "Collaborez gratuitement avec les versions en ligne de Word, PowerPoint, Excel." },
  { name: "Slack (Legacy)", url: "https://slack.com", category: "Divers", description: "L'application de messagerie classique pour les équipes." },
  { name: "HubSpot", url: "https://hubspot.com", category: "Divers", description: "Plateforme CRM avec tous les outils dont vous avez besoin." },
  { name: "Salesforce", url: "https://salesforce.com", category: "Divers", description: "La plateforme CRM numéro 1, aidant les équipes à travailler de n'importe où." },
  { name: "Shopify", url: "https://shopify.com", category: "Divers", description: "La plateforme d'e-commerce faite pour vous." },
  { name: "Etsy", url: "https://etsy.com", category: "Divers", description: "Achetez des cadeaux faits à la main, vintage et uniques." },
  { name: "Zapier", url: "https://zapier.com", category: "Divers", description: "Connectez vos applications et automatisez les flux de travail." },
  { name: "IFTTT", url: "https://ifttt.com", category: "Divers", description: "Tout fonctionne mieux ensemble. Connectez vos applications." },
  { name: "DuoLingo", url: "https://duolingo.com", category: "Divers", description: "La meilleure façon d'apprendre une langue au monde." },
  { name: "Coursera", url: "https://coursera.org", category: "Divers", description: "Apprenez sans limites avec plus de 5 000 cours." },
  { name: "Udemy", url: "https://udemy.com", category: "Divers", description: "Le marché mondial leader pour l'apprentissage et l'instruction." },
  { name: "Khan Academy", url: "https://khanacademy.org", category: "Divers", description: "Bâtissez une compréhension profonde et solide en mathématiques et sciences." }
];

async function seed() {
  console.log(`Starting bulk seed of ${extraApps.length} apps...`);
  try {
    await storage.bulkCreateApps(extraApps);
    console.log("Bulk seeding successful!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
