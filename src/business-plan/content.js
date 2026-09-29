// Contenu rédactionnel du Business Plan, partagé par la page web et l'export PDF.
// Les éléments marqués TODO sont à compléter avec les informations réelles de l'entreprise.

export const TODO = "À compléter";

// Passer à true une fois les données de marché renseignées.
export const showMarketData = false;

export const company = {
  name: "La Crêpière Enagnon",
  tagline: "Food & lifestyle gourmand, né à Cotonou",
  year: "2026",
  identity: [
    ["Nom commercial", "La Crêpière Enagnon"],
    ["Activité", "Crêpes, douceurs, boissons et animations gourmandes pour événements"],
    ["Localisation", "Cotonou, Bénin"],
    ["Modèle", "100 % en ligne aujourd'hui (livraison et prestations sur site), avec l'ambition de s'implanter physiquement"],
    // À compléter puis décommenter :
    // ["Forme juridique", TODO],
    // ["Date de création", TODO],
    // ["Dirigeant·e", TODO],
    // ["Effectif", TODO],
  ],
  website: "https://lacrepiere.netlify.app/",
  // [libellé, valeur affichée, lien facultatif]
  contacts: [
    ["Site web", "lacrepiere.netlify.app", "https://lacrepiere.netlify.app/"],
    ["Instagram", "@lacrepiere_enagnon", "https://www.instagram.com/lacrepiere_eg"],
    ["Boutique", "lacrepiere.store"],
    ["Adresse", "Cotonou, Bénin"],
    // À compléter puis décommenter :
    // ["Téléphone / WhatsApp", TODO],
    // ["E-mail", TODO],
  ],
};

export const summary =
  "La Crêpière Enagnon est une marque gourmande de Cotonou qui prépare à la minute des crêpes sucrées et salées, des jus de fruits et des douceurs, livrées encore tièdes. 100 % en ligne aujourd'hui, elle ambitionne de s'implanter physiquement. Au-delà des crêpes à l'unité, elle vend des box gourmandes et des plateaux, et s'invite dans les anniversaires, mariages et rencontres professionnelles avec son concept événementiel PARLOR OF CRÊPES. Ce business plan montre comment un capital initial de 2,5 à 4 millions FCFA, investi une seule fois, met en place une activité génératrice de revenus récurrents, permet une récupération progressive du capital puis finance la croissance.";

export const vision = [
  {
    label: "Vision",
    text: "Devenir la référence food & lifestyle de la crêpe au Bénin : la marque à laquelle on pense pour se faire plaisir comme pour rassembler autour d'un moment gourmand.",
  },
  {
    label: "Mission",
    text: "Servir une crêpe aussi belle que gourmande, préparée à la commande avec des ingrédients frais, livrée où que vous soyez et mise en scène pour vos événements.",
  },
  {
    label: "Positionnement",
    text: "Une gourmandise premium mais accessible, qui marie le savoir-faire de la crêpe à une identité africaine contemporaine, chaleureuse et soignée.",
  },
];

export const values = ["Fraîcheur", "Préparé à la minute", "Gourmandise avant tout", "Accueil chaleureux", "Soin du détail"];

export const offer = [
  {
    title: "Crêpes sucrées",
    image: "/images/product9.jpeg",
    text: "Banana Lover, Fraise Délice, Combo Paradise, Rose Suprême, Caramel, Nature… préparées à la commande.",
    tag: "Cœur de gamme",
  },
  {
    title: "Crêpes salées",
    image: "/images/product3.jpeg",
    text: "Galette fromage & herbes, pour une pause salée tout aussi gourmande.",
    tag: "Élargir les moments",
  },
  {
    title: "Pâtisseries de crêpes",
    image: "/images/product5.jpeg",
    text: "Mille crêpes et Crêp'rolls : des desserts de fête, à la part ou entiers.",
    tag: "Panier premium",
  },
  {
    title: "Jus de fruits & boissons",
    image: "/images/jusdefruits.png",
    text: "Jus de fruits avec morceaux de fruits frais, pour accompagner chaque commande.",
    tag: "Ventes additionnelles",
  },
  {
    title: "Snacks & douceurs",
    image: "/images/PopcornChocolat.png",
    text: "Popcorn caramel et chocolat, préparés en petites fournées.",
    tag: "Grignotage",
  },
  {
    title: "Box gourmandes",
    image: "/images/event04.jpeg",
    text: "Box à partager ou à offrir : anniversaires, brunchs, cadeaux clients et coffrets saisonniers.",
    tag: "Source stratégique",
  },
  {
    title: "Plateaux",
    image: "/images/event02.jpeg",
    text: "Plateau gourmand, mini pancakes, fruits exotiques, grand festin, brunch élégance.",
    tag: "Source stratégique",
  },
  {
    title: "PARLOR OF CRÊPES",
    image: "/images/event06.jpeg",
    text: "Le bar à crêpes événementiel : un stand installé sur place, crêpes minute et animation.",
    tag: "Signature",
  },
  {
    title: "Collaborations, brunch & catering",
    image: "/images/event07.jpeg",
    text: "Buffets pour brunchs et séminaires, partenariats avec cafés, concept-stores et marques.",
    tag: "Revenus récurrents",
  },
];

export const targets = [
  {
    title: "Jeunes actifs & étudiants",
    text: "Commandes plaisir en soirée ou le week-end, sensibles à l'esthétique et au partage sur les réseaux sociaux.",
    need: "Plaisir, rapidité, prix accessible",
  },
  {
    title: "Familles",
    text: "Goûters, dimanches gourmands et anniversaires d'enfants.",
    need: "Qualité, générosité, confiance",
  },
  {
    title: "Organisateurs d'événements privés",
    text: "Anniversaires, mariages, fiançailles, baby showers, moments chill entre amis.",
    need: "Effet waouh, service clé en main",
  },
  {
    title: "Entreprises & institutions",
    text: "Pauses d'équipe, séminaires, lancements de produits, cadeaux clients.",
    need: "Fiabilité, facturation, image soignée",
  },
  {
    title: "Partenaires food & lifestyle",
    text: "Cafés, hôtels, concept-stores, marques et influenceurs.",
    need: "Produit différenciant, co-marketing",
  },
];

export const market = {
  context: [
    "Une demande urbaine croissante pour la livraison de repas et de douceurs, portée par les commandes via WhatsApp, Instagram et les applications de livraison.",
    "Une forte culture de la célébration : anniversaires, mariages et événements familiaux ou professionnels rythment l'année et appellent des animations gourmandes.",
    "Une offre de crêpes encore peu structurée en marque premium dédiée, avec une identité visuelle forte et un service événementiel.",
  ],
  opportunities: [
    "Marché des événements privés et professionnels : panier élevé et bouche-à-oreille puissant.",
    "Réseaux sociaux : un produit très photogénique, idéal pour le contenu et l'UGC.",
    "Montée des brunchs et des pauses gourmandes en entreprise.",
    "Diversification simple : boissons, snacks, box cadeaux, formules saisonnières.",
  ],
  competitors: [
    ["Pâtisseries & boulangeries", "Large gamme, point de vente physique", "Peu spécialisées crêpe, pas d'animation sur site"],
    ["Snacks & vendeurs de rue", "Prix bas, proximité", "Image et régularité variables, peu de service événementiel"],
    ["Traiteurs événementiels", "Maîtrise des grands volumes", "Offre généraliste, dessert rarement mis en scène"],
    ["Dark kitchens & applications", "Visibilité et logistique", "Commissions élevées, peu de lien avec la marque"],
  ],
  // Données chiffrées à établir par une étude terrain : aucune valeur n'est inventée ici.
  // Section masquée tant que les valeurs ne sont pas renseignées (voir showMarketData).
  data: [
    ["Taille du marché cible (Cotonou)", TODO],
    ["Nombre d'événements privés / mois dans la zone", TODO],
    ["Prix moyen pratiqué par la concurrence", TODO],
    ["Part des commandes via réseaux sociaux", TODO],
  ],
};

export const valueProposition = [
  ["Fraîcheur garantie", "Chaque crêpe est cuisinée à la commande, jamais à l'avance."],
  ["Beau et bon", "Des créations pensées pour régaler autant que pour être photographiées."],
  ["Livrée encore tiède", "Un service de livraison où que vous soyez à Cotonou."],
  ["Clé en main pour vos événements", "Plateaux, box et bar à crêpes PARLOR OF CRÊPES installé sur place."],
  ["Une marque, une identité", "Premium, chaleureuse, africaine contemporaine : une expérience cohérente de la commande à la dégustation."],
];

export const canvas = [
  { key: "partners", title: "Partenaires clés", items: ["Fournisseurs de fruits & produits frais", "Livreurs / coursiers", "Organisateurs d'événements, salles, wedding planners", "Cafés, hôtels, concept-stores", "Créateurs de contenu"] },
  { key: "activities", title: "Activités clés", items: ["Production à la minute", "Livraison", "Prestations événementielles", "Création de contenu & community management", "Développement de recettes"] },
  { key: "resources", title: "Ressources clés", items: ["Savoir-faire & recettes", "Matériel de cuisine et stand PARLOR", "Marque & communauté Instagram", "Équipe"] },
  { key: "value", title: "Proposition de valeur", items: ["Crêpes fraîches, belles et gourmandes", "Livrées encore tièdes", "Animation gourmande clé en main pour événements", "Identité premium & chaleureuse"] },
  { key: "relations", title: "Relation client", items: ["Conversation directe WhatsApp / Instagram", "Devis personnalisés événements", "Fidélisation & recommandations", "Contenus et coulisses"] },
  { key: "channels", title: "Canaux", items: ["Instagram & WhatsApp", "Site web / boutique en ligne", "Bouche-à-oreille", "Salons & événements", "Partenaires"] },
  { key: "segments", title: "Segments clients", items: ["Jeunes actifs & étudiants", "Familles", "Organisateurs d'événements privés", "Entreprises", "Partenaires food & lifestyle"] },
  { key: "costs", title: "Structure de coûts", items: ["Matières premières", "Emballages", "Livraison", "Personnel", "Énergie & atelier", "Marketing"] },
  { key: "revenues", title: "Sources de revenus", items: ["Crêpes individuelles", "Box gourmandes", "Plateaux", "Commandes événementielles (PARLOR OF CRÊPES)", "Boissons & accompagnements", "Collaborations, brunch & catering"] },
];

// Section « Capital & Revenus » : logique d'investissement, sources de revenus, récupération, croissance.
export const capital = {
  intro:
    "Le capital initial de 2,5 à 4 millions FCFA est un apport unique, versé une seule fois pour mettre en place et lancer l'entreprise. Ce n'est pas une dépense annuelle : il finance l'outil de production, le lancement commercial et le fonds de roulement, puis l'activité se finance par ses propres ventes.",
  uses: [
    "Équipements de production et stand PARLOR OF CRÊPES",
    "Installation et aménagement de l'atelier",
    "Stock initial, emballages et packaging des box et plateaux",
    "Identité visuelle, site web et communication de lancement",
    "Fonds de roulement : trésorerie de sécurité pour les premiers mois",
  ],
  chain: [
    "Investissement initial",
    "Mise en place de l'activité",
    "Ventes",
    "Chiffre d'affaires",
    "Paiement des charges",
    "Résultat disponible",
    "Récupération progressive du capital",
    "Réinvestissement",
    "Croissance",
  ],
  // key : clé de calcul dans le modèle (voir capitalStreams dans main.js et pdf.js).
  streams: [
    { key: "crepes", title: "Crêpes individuelles", text: "Crêpes sucrées et salées commandées à l'unité en ligne : classiques, gourmandes, premium, mille crêpes et Crêp'rolls.", role: "Volume & fidélité" },
    { key: "box", title: "Box gourmandes", text: "Box à partager ou à offrir : anniversaires, brunchs, cadeaux clients. Un panier bien supérieur à celui d'une commande à l'unité.", role: "Source stratégique" },
    { key: "plateaux", title: "Plateaux", text: "Plateau gourmand, mini pancakes, fruits exotiques, grand festin, brunch élégance : l'offre phare des réceptions.", role: "Source stratégique" },
    { key: "events", title: "Commandes événementielles", text: "PARLOR OF CRÊPES : le bar à crêpes installé sur place pour mariages, anniversaires et événements d'entreprise.", role: "Panier élevé & visibilité" },
    { key: "sides", title: "Boissons & accompagnements", text: "Jus de fruits et popcorn proposés à chaque commande pour augmenter le panier moyen.", role: "Ventes additionnelles" },
    { key: "b2b", title: "Collaborations, brunch & catering", text: "Catering d'entreprise, brunchs, dépôt-vente chez des partenaires, co-branding.", role: "Revenus récurrents" },
  ],
  boxNote: "Box et plateaux partagent le même prix moyen et le même coût ; leur répartition suit l'hypothèse « part des box », modifiable.",
  recoveryText:
    "L'un des objectifs financiers est de permettre à l'investisseur de récupérer progressivement son capital initial grâce aux résultats de l'entreprise. Le délai ci-dessous correspond au mois où le résultat cumulé atteint le montant du capital. Il s'agit d'une projection fondée sur les hypothèses du modèle, et non d'un rendement garanti : le rythme réel dépendra des ventes effectivement réalisées.",
  recoveryNote:
    "Au-delà de 12 mois, le délai est estimé en prolongeant le résultat du mois 12 sans croissance supplémentaire (hypothèse prudente).",
  years: [
    { period: "Année 1", title: "Lancement", text: "Mise en place de l'atelier et des outils, acquisition des premiers clients et validation du modèle économique. Les résultats commencent à rembourser le capital." },
    { period: "Année 2", title: "Développement", text: "Augmentation des ventes, développement des box, des plateaux et des commandes événementielles, premiers contrats récurrents." },
    { period: "Année 3 et +", title: "Consolidation & croissance", text: "Hausse du volume de commandes, diversification de l'offre et réinvestissement des bénéfices dans la croissance, jusqu'à l'implantation physique." },
  ],
  yearsNote:
    "Le capital initial n'est investi qu'une fois : il crée une infrastructure qui continue de produire des revenus les années suivantes, sans nouvel apport annuel. Les montants des années 2 et 3 seront chiffrés à partir des résultats réels de l'année 1.",
};

export const marketing = [
  { title: "Instagram & TikTok", text: "Contenus appétissants, coulisses, recettes du mois, réels de préparation. Objectif : faire saliver et donner envie de commander." },
  { title: "WhatsApp Business", text: "Catalogue, commandes en quelques messages, statuts quotidiens, liste de diffusion des clients fidèles." },
  { title: "Produit star du mois", text: "Une création mise en avant chaque mois pour créer de la nouveauté et de l'urgence." },
  { title: "Dégustations & présence terrain", text: "Stands lors d'événements, marchés créatifs et afterworks pour faire goûter la marque." },
  { title: "Partenariats & influence", text: "Collaborations avec créateurs de contenu, wedding planners, salles de fête et entreprises." },
  { title: "Fidélisation", text: "Carte de fidélité digitale, offre anniversaire, parrainage : un client satisfait en amène un autre." },
];

export const commercial = [
  ["Prix", "Gamme lisible en trois niveaux (classique, gourmande, premium) et forfaits événementiels sur devis."],
  ["Canaux de vente", "Commandes via Instagram, WhatsApp et le site ; devis événementiels ; démarchage B2B."],
  ["Ventes additionnelles", "Jus et popcorn proposés à chaque commande pour augmenter le panier moyen."],
  ["Calendrier commercial", "Temps forts : Saint-Valentin, fête des mères, rentrée, fêtes de fin d'année, saison des mariages."],
];

export const organisation = {
  flow: [
    ["Commande", "Instagram, WhatsApp ou site : choix, adresse, créneau, paiement."],
    ["Préparation", "Cuisson à la minute, garniture et dressage soigné."],
    ["Emballage", "Emballage aux couleurs de la marque, adapté au transport."],
    ["Livraison", "Coursier partenaire, livraison encore tiède."],
    ["Suivi", "Message de remerciement, avis client, invitation à repartager."],
  ],
  roles: [
    ["Direction & développement", "Stratégie, partenariats, finances, devis événementiels."],
    ["Production", "Préparation des pâtes, cuisson, dressage, hygiène."],
    ["Communication & service client", "Contenus, réponses aux messages, prise de commandes."],
    ["Logistique & événements", "Livraisons, installation du stand PARLOR, extras ponctuels."],
  ],
  quality: [
    "Préparation à la commande et règles d'hygiène alimentaire strictes",
    "Fiches recettes pour une qualité constante",
    "Gestion des stocks au plus juste pour limiter les pertes",
    "Créneaux de commande pour lisser la production",
  ],
};

export const parlor = {
  pitch:
    "PARLOR OF CRÊPES est le format événementiel de La Crêpière Enagnon : un bar à crêpes installé directement sur l'événement, où les invités choisissent leurs garnitures et reçoivent une crêpe préparée sous leurs yeux. C'est à la fois une animation, un dessert et une vitrine de la marque.",
  formulas: [
    { name: "Chill", for: "Anniversaires, moments entre amis", content: "Stand compact, 3 garnitures, service sur un créneau court." },
    { name: "Célébration", for: "Mariages, fiançailles, baby showers", content: "Stand décoré aux couleurs de l'événement, garnitures premium, plateaux en complément." },
    { name: "Corporate", for: "Séminaires, lancements, afterworks", content: "Stand et supports co-brandés, facturation entreprise, service sur la durée de l'événement." },
  ],
  strategy: [
    "Construire un portfolio photo & vidéo de chaque prestation pour nourrir les réseaux sociaux.",
    "Nouer des partenariats avec wedding planners, salles de réception et agences événementielles.",
    "Proposer des devis rapides selon le nombre d'invités, avec acompte à la réservation.",
    "Associer chaque prestation à des ventes de plateaux et de box pour augmenter le panier.",
  ],
  pricingNote: "Grille tarifaire des formules à définir. Le modèle financier utilise un prix moyen de prestation modifiable.",
};

export const roadmap = [
  {
    period: "Mois 1–3",
    title: "Structurer",
    items: ["Fixer la grille de prix et les fiches recettes", "Lancer le catalogue WhatsApp et le site", "Suivre les KPI chaque semaine", "Premières prestations PARLOR OF CRÊPES"],
  },
  {
    period: "Mois 4–6",
    title: "Accélérer",
    items: ["Produit star du mois et calendrier de contenus", "Premiers contrats B2B et catering", "Partenariats wedding planners & salles", "Programme de fidélité"],
  },
  {
    period: "Mois 7–9",
    title: "Élargir",
    items: ["Box cadeaux et offres saisonnières", "Nouvelles boissons et snacks", "Deuxième kit événementiel", "Recrutement d'extras événements"],
  },
  {
    period: "Mois 10–12",
    title: "Consolider",
    items: ["Temps forts de fin d'année", "Bilan financier et ajustement des prix", "Étude d'un premier point de vente physique ou corner partenaire", "Plan de l'année 2"],
  },
  {
    period: "Année 2",
    title: "Développer",
    items: ["Augmentation des ventes en ligne", "Développement des box gourmandes et des plateaux", "Plus de commandes événementielles PARLOR OF CRÊPES", "Contrats récurrents avec les entreprises"],
  },
  {
    period: "Année 3 et +",
    title: "Consolider & grandir",
    items: ["Hausse du volume de commandes et diversification", "Bénéfices réinvestis dans la croissance", "Implantation physique : corner, kiosque ou salon PARLOR OF CRÊPES", "Présence dans d'autres villes"],
  },
];

export const swot = {
  strengths: ["Produit frais et photogénique", "Identité de marque forte", "Offre événementielle différenciante", "Structure légère (100 % en ligne pour démarrer)"],
  weaknesses: ["Dépendance à la livraison", "Capacité de production limitée", "Notoriété encore locale", "Données de marché à consolider"],
  opportunities: ["Marché des événements", "Brunch et catering d'entreprise", "Réseaux sociaux et UGC", "Implantation physique à terme"],
  threats: ["Hausse du prix des matières premières", "Concurrence et imitation", "Coupures d'énergie", "Aléas de livraison"],
};

export const risks = [
  ["Hausse des coûts matières", "Élevé", "Suivi mensuel des coûts, révision des prix, achats groupés"],
  ["Retards ou incidents de livraison", "Moyen", "Coursiers partenaires fiables, créneaux, emballages isothermes"],
  ["Pic de commandes non absorbé", "Moyen", "Précommandes, créneaux, extras formés pour les événements"],
  ["Coupures d'électricité ou de gaz", "Moyen", "Matériel de secours, stock de gaz, planification"],
  ["Dépendance aux réseaux sociaux", "Moyen", "Base clients WhatsApp, site, partenariats hors ligne"],
  ["Trésorerie tendue au démarrage", "Élevé", "Fonds de roulement inclus dans le capital initial, acomptes sur événements, suivi hebdomadaire de la trésorerie"],
  ["Récupération du capital plus lente que prévu", "Moyen", "Suivi mensuel du résultat cumulé, ajustement des prix et des charges, priorité aux box, plateaux et événements"],
];

export const kpis = [
  { name: "Commandes / mois", why: "Volume d'activité en ligne", model: "orders" },
  { name: "Panier moyen", why: "Efficacité des ventes additionnelles", model: "basket" },
  { name: "Chiffre d'affaires mensuel", why: "Croissance globale", model: "ca" },
  { name: "Marge brute", why: "Maîtrise des matières et emballages", model: "grossMarginRate" },
  { name: "Coût matière / CA", why: "Alerte sur la hausse des prix d'achat", model: "rawRate" },
  { name: "Prestations événementielles", why: "Développement de PARLOR OF CRÊPES", model: "parlor" },
  { name: "Taux de clients récurrents", why: "Fidélité et bouche-à-oreille", model: null },
  { name: "Note / avis clients", why: "Qualité perçue", model: null },
  { name: "Abonnés & engagement", why: "Force de la marque en ligne", model: null },
  { name: "Trésorerie disponible", why: "Capacité à tenir et à investir", model: "cash" },
  { name: "Capital récupéré", why: "Remboursement progressif de l'investisseur", model: "recovery" },
  { name: "CA box, plateaux & événements", why: "Poids des sources de revenus stratégiques", model: "strategic" },
];

export const conclusion =
  "La Crêpière Enagnon dispose d'un produit désirable, d'une identité forte et de six sources de revenus : crêpes individuelles, box gourmandes, plateaux, commandes événementielles PARLOR OF CRÊPES, boissons et collaborations. Le capital initial de 2,5 à 4 millions FCFA est investi une seule fois pour mettre l'activité en place ; ce sont ensuite les ventes qui paient les charges, dégagent un résultat, remboursent progressivement le capital puis financent la croissance. Les projections restent des hypothèses : elles seront confrontées chaque mois aux chiffres réels pour piloter l'entreprise.";

export const sections = [
  ["presentation", "Présentation"],
  ["vision", "Vision & positionnement"],
  ["offre", "Produits & services"],
  ["cibles", "Clientèles cibles"],
  ["marche", "Marché & opportunités"],
  ["valeur", "Proposition de valeur"],
  ["modele", "Modèle économique"],
  ["capital", "Capital & revenus"],
  ["strategie", "Stratégie commerciale"],
  ["organisation", "Organisation"],
  ["parlor", "PARLOR OF CRÊPES"],
  ["finances", "Projections financières"],
  ["roadmap", "Roadmap"],
  ["risques", "Risques & opportunités"],
  ["kpi", "KPI à suivre"],
  ["conclusion", "Conclusion & contacts"],
];
