
import { storage } from "../storage";
import { InsertApp } from "@shared/schema";

const extraApps: InsertApp[] = [
  // Productivity
  { name: "Trello", url: "https://trello.com", category: "Productivity", description: "Visual boards, lists, and cards to organize and prioritize your projects in a flexible and rewarding way." },
  { name: "Asana", url: "https://asana.com", category: "Productivity", description: "The easiest way for teams to track their work and get results. Organize everything from small tasks to big pictures." },
  { name: "Monday.com", url: "https://monday.com", category: "Productivity", description: "A cloud-based platform that allows teams to create their own applications and work management software." },
  { name: "ClickUp", url: "https://clickup.com", category: "Productivity", description: "One app to replace them all. Task management, docs, reminders, goals, calendars, and even an inbox." },
  { name: "Evernote", url: "https://evernote.com", category: "Productivity", description: "The best note taking app for 2024. Organize your notes, manage your tasks, and archive your ideas." },
  { name: "Todoist", url: "https://todoist.com", category: "Productivity", description: "The world's #1 task manager and to-do list app. Regain control and focus on what matters most." },
  { name: "Pocket", url: "https://getpocket.com", category: "Productivity", description: "The best way to save and discover the best content on the web. Save articles, videos, and stories." },
  { name: "Obsidian", url: "https://obsidian.md", category: "Productivity", description: "A powerful knowledge base on top of a local folder of plain text Markdown files." },
  { name: "Roam Research", url: "https://roamresearch.com", category: "Productivity", description: "A note-taking tool for networked thought, designed to help you write and organize your research." },
  { name: "Airtable", url: "https://airtable.com", category: "Productivity", description: "Part spreadsheet, part database. The easy way to build your own custom applications for business workflows." },
  { name: "Coda", url: "https://coda.io", category: "Productivity", description: "The doc that brings it all together. Blending the flexibility of a document with the power of a database." },
  { name: "Zoom", url: "https://zoom.us", category: "Productivity", description: "Cloud platform for video and audio conferencing, collaboration, chat, and webinars across mobile, desktop, and room systems." },
  { name: "Loom", url: "https://loom.com", category: "Productivity", description: "Video messaging for work. Async video that helps you communicate more effectively and move faster." },
  { name: "Calendly", url: "https://calendly.com", category: "Productivity", description: "The modern scheduling platform that makes finding time a breeze. Book more meetings and save time." },

  // Design
  { name: "Adobe Express", url: "https://www.adobe.com/express", category: "Design", description: "Design made easy. Create social graphics, flyers, logos, and more on web and mobile." },
  { name: "Sketch", url: "https://www.sketch.com", category: "Design", description: "The digital design toolkit. Design, prototype, and collaborate with your team in one powerful app." },
  { name: "InVision", url: "https://www.invisionapp.com", category: "Design", description: "The digital product design platform used to make the world's best customer experiences." },
  { name: "Pixlr", url: "https://pixlr.com", category: "Design", description: "Free online photo editor, image animator, and design tool. Edit photos right in your browser." },
  { name: "Vectr", url: "https://vectr.com", category: "Design", description: "Free vector graphics software used to create vector graphics easily and intuitively." },
  { name: "FontAwesome", url: "https://fontawesome.com", category: "Design", description: "The world's most popular and easiest to use icon set just got an upgrade." },
  { name: "Unsplash", url: "https://unsplash.com", category: "Design", description: "The internet's source for freely usable images. Powered by creators everywhere." },
  { name: "Pexels", url: "https://pexels.com", category: "Design", description: "The best free stock photos, royalty free images & videos shared by talented creators." },
  { name: "Canva Pro", url: "https://canva.com/pro", category: "Design", description: "Unlock premium features for your design team. Access millions of stock images and templates." },
  { name: "Coolors", url: "https://coolors.co", category: "Design", description: "The super fast color palettes generator! Create, save and share perfect palettes in seconds." },

  // AI
  { name: "Claude AI", url: "https://claude.ai", category: "AI", description: "Next-generation AI assistant that is helpful, harmless, and honest. Developed by Anthropic." },
  { name: "Jasper AI", url: "https://jasper.ai", category: "AI", description: "The AI Content Generator that helps you and your team break through creative blocks to create amazing content." },
  { name: "Copy.ai", url: "https://copy.ai", category: "AI", description: "Experience the full power of an AI content generator that delivers premium results in seconds." },
  { name: "Synthesia", url: "https://synthesia.io", category: "AI", description: "The world's #1 AI video generation platform. Create videos from text in minutes." },
  { name: "Runway", url: "https://runwayml.com", category: "AI", description: "Everything you need to make anything you want. Next-generation creative tools powered by AI." },
  { name: "Perplexity AI", url: "https://perplexity.ai", category: "AI", description: "A conversational search engine that delivers accurate answers to complex questions using large language models." },
  { name: "Gamma", url: "https://gamma.app", category: "AI", description: "A new medium for presenting ideas. Create beautiful, interactive content with the power of AI." },
  { name: "Leonardo.ai", url: "https://leonardo.ai", category: "AI", description: "Generate production-quality assets for your creative projects with AI-driven speed and style-consistency." },
  { name: "Character.ai", url: "https://character.ai", category: "AI", description: "Where intelligent agents come to life. Chat with any character or create your own." },
  { name: "Krea AI", url: "https://krea.ai", category: "AI", description: "Real-time AI creative suite for image generation and enhancing. Experience the future of creativity." },

  // Development
  { name: "Stack Overflow", url: "https://stackoverflow.com", category: "Development", description: "The largest, most trusted online community for developers to learn, share their knowledge, and build their careers." },
  { name: "Netlify", url: "https://netlify.com", category: "Development", description: "Connect your repo and deploy your site in minutes. The modern web development platform." },
  { name: "Firebase", url: "https://firebase.google.com", category: "Development", description: "Google's mobile platform that helps you quickly develop high-quality apps and grow your business." },
  { name: "Supabase", url: "https://supabase.com", category: "Development", description: "The open source Firebase alternative. Build in a weekend, scale to billions." },
  { name: "Postman", url: "https://postman.com", category: "Development", description: "The collaboration platform for API development. Simplify each step of building an API." },
  { name: "Glitch", url: "https://glitch.com", category: "Development", description: "The friendly community where everyone builds the web. Create, remix, and host your apps." },
  { name: "W3Schools", url: "https://w3schools.com", category: "Development", description: "The world's largest web developer site. Learn HTML, CSS, JavaScript, and more." },
  { name: "Dev.to", url: "https://dev.to", category: "Development", description: "A constructive and inclusive social network for software developers. With you every step of your journey." },
  { name: "Hashnode", url: "https://hashnode.com", category: "Development", description: "The hassle-free blogging platform for developers. Own your content on your custom domain." },
  { name: "Railway", url: "https://railway.app", category: "Development", description: "Deploy your code without the complexity. The easiest way to ship your software." },

  // Social
  { name: "LinkedIn", url: "https://linkedin.com", category: "Social", description: "Manage your professional identity. Build and engage with your professional network." },
  { name: "Instagram", url: "https://instagram.com", category: "Social", description: "Bringing you closer to the people and things you love. Express yourself and connect with friends." },
  { name: "Pinterest", url: "https://pinterest.com", category: "Social", description: "Discover recipes, home ideas, style inspiration and other ideas to try." },
  { name: "TikTok", url: "https://tiktok.com", category: "Social", description: "The leading destination for short-form mobile video. Our mission is to inspire creativity and bring joy." },
  { name: "Twitch", url: "https://twitch.tv", category: "Social", description: "The world's leading live streaming platform for gamers and the things we love." },
  { name: "WhatsApp Web", url: "https://web.whatsapp.com", category: "Social", description: "Quickly send and receive WhatsApp messages right from your computer." },
  { name: "Telegram Web", url: "https://web.telegram.org", category: "Social", description: "Pure instant messaging — simple, fast, secure, and synced across all your devices." },
  { name: "Mastodon", url: "https://joinmastodon.org", category: "Social", description: "Social networking that's not for sale. Decenteralized, open-source social media for the future." },
  { name: "Threads", url: "https://threads.net", category: "Social", description: "Share your ideas, join conversations, and follow the people you're interested in." },

  // Games
  { name: "Roblox", url: "https://roblox.com", category: "Games", description: "The ultimate virtual universe that lets you create, share experiences with friends, and be anything you can imagine." },
  { name: "Itch.io", url: "https://itch.io", category: "Games", description: "The open marketplace for independent digital creators with a focus on indie games." },
  { name: "Steam Web", url: "https://store.steampowered.com", category: "Games", description: "The ultimate destination for playing, discussing, and creating games." },
  { name: "Epic Games", url: "https://epicgames.com", category: "Games", description: "A premier digital store for high-quality games and home to the Unreal Engine." },
  { name: "Poki", url: "https://poki.com", category: "Games", description: "Poki has the best free online games selection and offers the most fun experience to play alone or with friends." },
  { name: "CrazyGames", url: "https://crazygames.com", category: "Games", description: "Play free online games on CrazyGames, the best place for fun and high-quality browser games." },
  { name: "Agar.io", url: "https://agar.io", category: "Games", description: "The smash hit game! Control your cell and eat other players to grow larger." },
  { name: "Slither.io", url: "https://slither.io", category: "Games", description: "A simple and addictive multiplayer snake game. Grow as long as possible by eating colored dots." },
  { name: "Chess.com", url: "https://chess.com", category: "Games", description: "Play chess online with friends and opponents from around the world. Learn and improve." },
  { name: "Lichess", url: "https://lichess.org", category: "Games", description: "Free online chess server. No ads, no registration required. Open source." },

  // Other
  { name: "Wikipedia", url: "https://wikipedia.org", category: "Other", description: "The free encyclopedia that anyone can edit. A multilingual, web-based, free-content encyclopedia." },
  { name: "Google Maps", url: "https://maps.google.com", category: "Other", description: "Find local businesses, view maps and get driving directions in Google Maps." },
  { name: "SoundCloud", url: "https://soundcloud.com", category: "Other", description: "The world's largest open audio platform, powered by a connected community of creators." },
  { name: "Spotify Web", url: "https://open.spotify.com", category: "Other", description: "Digital music service that gives you access to millions of songs, podcasts and videos." },
  { name: "YouTube", url: "https://youtube.com", category: "Other", description: "Enjoy the videos and music you love, upload original content, and share it all with friends." },
  { name: "Netflix", url: "https://netflix.com", category: "Other", description: "Watch TV shows and movies online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more." },
  { name: "Amazon", url: "https://amazon.com", category: "Other", description: "Shop online for electronics, computers, clothing, shoes, toys, books, and more." },
  { name: "eBay", url: "https://ebay.com", category: "Other", description: "Buy and sell electronics, cars, fashion apparel, collectibles, sporting goods, digital cameras, baby items, coupons, and everything else." },
  { name: "PayPal", url: "https://paypal.com", category: "Other", description: "The safer, easier way to pay online without revealing your credit card number." },
  { name: "Stripe", url: "https://stripe.com", category: "Other", description: "Payment infrastructure for the internet. Millions of companies of all sizes use Stripe's software and APIs." },
  { name: "Webflow", url: "https://webflow.com", category: "Other", description: "Build professional websites visually. The power of code without writing it." },
  { name: "Wix", url: "https://wix.com", category: "Other", description: "Create a free website with Wix.com. Customize with our free website builder, no coding skills needed." },
  { name: "Squarespace", url: "https://squarespace.com", category: "Other", description: "Create a beautiful website, online store, or portfolio with Squarespace's all-in-one platform." },
  { name: "Medium", url: "https://medium.com", category: "Other", description: "A place to read, write, and connect. Explore the best stories from millions of writers." },
  { name: "Quora", url: "https://quora.com", category: "Other", description: "A place to share knowledge and better understand the world. Ask questions and get high-quality answers." },
  { name: "WolframAlpha", url: "https://wolframalpha.com", category: "Other", description: "Compute expert-level answers using Wolfram's breakthrough algorithms, knowledgebase and AI technology." },
  { name: "Speedtest", url: "https://speedtest.net", category: "Other", description: "Test your internet connection speed with one click. Fast, accurate and easy." },
  { name: "TinyURL", url: "https://tinyurl.com", category: "Other", description: "Shorten long URLs into manageable links. Free and easy to use." },
  { name: "Bitly", url: "https://bitly.com", category: "Other", description: "Shorten, share and track your links. The world's leading link management platform." },
  { name: "Grammarly", url: "https://grammarly.com", category: "Other", description: "Get corrections from Grammarly while you write on Gmail, Twitter, LinkedIn, and all your other favorite sites." },
  { name: "DeepL", url: "https://deepl.com", category: "Other", description: "The world's most accurate translator. Translate text and full document files instantly." },
  { name: "1Password", url: "https://1password.com", category: "Other", description: "The easiest way to store and use strong passwords. Log in to sites and fill forms securely with a single click." },
  { name: "LastPass", url: "https://lastpass.com", category: "Other", description: "The best way to manage your passwords and protect your online life." },
  { name: "Dropbox", url: "https://dropbox.com", category: "Other", description: "Keep your files safe, synced, and easy to share. Focus on what matters." },
  { name: "Google Drive", url: "https://drive.google.com", category: "Other", description: "Store, share, and collaborate on files and folders from any mobile device, tablet, or computer." },
  { name: "Microsoft 365", url: "https://office.com", category: "Other", description: "Collaborate for free with online versions of Microsoft Word, PowerPoint, Excel, and OneNote." },
  { name: "Slack (Legacy)", url: "https://slack.com", category: "Other", description: "The classic messaging app for teams that brings all your communication together." },
  { name: "HubSpot", url: "https://hubspot.com", category: "Other", description: "CRM platform with all the tools you need for marketing, sales, content management, and customer service." },
  { name: "Salesforce", url: "https://salesforce.com", category: "Other", description: "The #1 CRM platform, helping teams work from anywhere and grow their business." },
  { name: "Shopify", url: "https://shopify.com", category: "Other", description: "The ecommerce platform made for you. Start, run, and grow your business." },
  { name: "Etsy", url: "https://etsy.com", category: "Other", description: "Shop for handmade, vintage, custom, and unique gifts for everyone on the global marketplace." },
  { name: "Zapier", url: "https://zapier.com", category: "Other", description: "Connect your apps and automate workflows. Easy automation for busy people." },
  { name: "IFTTT", url: "https://ifttt.com", category: "Other", description: "Every thing works better together. Connect your apps, devices and services." },
  { name: "DuoLingo", url: "https://duolingo.com", category: "Other", description: "The world's best way to learn a language. It's free, fun and effective." },
  { name: "Coursera", url: "https://coursera.org", category: "Other", description: "Learn without limits. Start, switch, or advance your career with more than 5,000 courses." },
  { name: "Udemy", url: "https://udemy.com", category: "Other", description: "The leading global marketplace for learning and instruction. 185,000+ courses online." },
  { name: "Khan Academy", url: "https://khanacademy.org", category: "Other", description: "Build a deep, solid understanding in math, science, and more with our free online courses." }
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
