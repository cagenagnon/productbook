// Idées de contenu : une entrée par vidéo, regroupées par univers.
export const universes = [
  {
    id: "parlor",
    eyebrow: "L'événement à venir",
    title: "Parlor of",
    accent: "Crêpes",
    intro:
      "Deux formats ultra-légers pour teaser l'événement : on filme sur place, avec ce qui est déjà prêt, en quelques minutes. Rien à produire spécialement pour la caméra.",
    wash: "#e5eadb",
    ideas: [
      {
        id: "tu-choisis-quoi",
        video: "parlor-tu-choisis-quoi",
        title: "Tu choisis",
        accent: "quoi ?",
        tags: ["≈ 15 s", "1 personne", "1 seul lieu", "Facile"],
        concept:
          "Une personne est face à plusieurs choix et doit trancher très vite. On enchaîne les duels, puis la question finale qui invite à venir.",
        script: [
          { q: "Crêpe ou popcorn ?", emoji: "🥞🍿", a: "Elle choisit.", action: true },
          { q: "Jus ou fruits ?", emoji: "🧃🍊", a: "Elle choisit.", action: true },
          { q: "PARLOR OF CRÊPES : tu viens ou pas ?", emoji: "👀", a: "« Évidemment ! »", punch: true },
        ],
        shots: [
          { img: "product14.jpeg", label: "Duel 1", text: "Crêpe vs popcorn, posés devant elle" },
          { img: "jusdefruits.png", label: "Duel 2", text: "Jus vs fruits, même cadre" },
          { img: "event06.jpeg", label: "La question", text: "Plan serré, suspense d'une seconde" },
          { img: "Crêpes1.jpeg", label: "Réponse", text: "« Évidemment ! », regard caméra" },
        ],
        shoot: [
          "Une seule personne",
          "Un seul endroit",
          "Les produits sont simplement posés devant elle",
          "Plans très courts",
          "Aucun produit supplémentaire à préparer",
        ],
        goal: "Présenter les différentes choses disponibles de manière ludique et rapide.",
      },
      {
        id: "en-premier",
        video: "parlor-en-premier",
        title: "Crêpe, popcorn",
        accent: "ou jus ?",
        tags: ["≈ 15 s", "4 à 6 personnes", "Micro-trottoir", "Facile"],
        concept:
          "On filme plusieurs personnes et on leur pose simplement la même question. Chacun répond spontanément, en un mot. La dernière réponse fait la chute.",
        question: "Au PARLOR OF CRÊPES, tu prends quoi en premier ?",
        script: [
          { a: "« Crêpe ! »", emoji: "🥞" },
          { a: "« Popcorn ! »", emoji: "🍿" },
          { a: "« Le jus ! »", emoji: "🧃" },
          { a: "« Les fruits ! »", emoji: "🍊" },
          { a: "« Tout. »", emoji: "😂", punch: true },
        ],
        shots: [
          { img: "Crêpes4.jpeg", label: "Personne 1", text: "« Crêpe ! »" },
          { img: "Popcorn01.jpeg", label: "Personne 2", text: "« Popcorn ! »" },
          { img: "jusdefruits.png", label: "Personne 3", text: "« Le jus ! »" },
          { img: "event05.jpeg", label: "Personne 4", text: "« Les fruits ! »" },
          { img: "event02.jpeg", label: "La chute", text: "« Tout. » 😂" },
        ],
        shoot: [
          "4 à 6 personnes maximum",
          "Une question par personne",
          "Une réponse très courte",
          "Aucun scénario à apprendre",
          "Tout le monde filmé au même endroit, en quelques minutes",
        ],
        goal:
          "Créer une vidéo spontanée qui présente l'offre du PARLOR sans avoir besoin de produire quoi que ce soit spécialement pour le contenu.",
      },
    ],
  },
  {
    id: "crepiere",
    eyebrow: "La marque au quotidien",
    title: "La",
    accent: "Crêpière",
    intro:
      "Deux formats qui jouent sur les codes des réseaux (challenge, avant/après) pour rendre La Crêpière immédiatement reconnaissable — sans gros scénario.",
    wash: "#eedfd6",
    ideas: [
      {
        id: "bottle-challenge",
        video: "crepiere-bottle-challenge",
        title: "Bottle",
        accent: "Challenge",
        tags: ["≈ 15–20 s", "3 personnes +", "Extérieur", "Fun"],
        place:
          "Un espace extérieur sympa : parking propre, terrasse, espace urbain avec un joli fond, ou tout lieu avec assez d'espace pour filmer.",
        concept:
          "On reprend le principe du Bottle Challenge des réseaux sociaux, version La Crêpière. Une personne lance une bouteille d'eau : si elle retombe debout, elle gagne le droit de manger une crêpe. Puis une deuxième tente sa chance, puis une troisième…",
        script: [
          { q: "Lancer n°1", a: "La bouteille retombe debout → crêpe gagnée ! 🥞", action: true },
          { q: "Lancer n°2", a: "Elle tombe sur le côté… raté 😭", action: true },
          { q: "Lancer n°3", a: "Réussi → encore une crêpe gagnée ! 🎉", action: true },
        ],
        shots: [
          { img: "Crêpes6.jpeg", label: "Suspense", text: "Réaction avant le lancer" },
          { img: null, bottle: true, label: "Gros plan", text: "La bouteille en l'air, puis l'atterrissage" },
          { img: "Crêpes3.jpeg", label: "Récompense", text: "Plan sur la crêpe gagnée" },
          { img: "product9.jpeg", label: "Réactions", text: "Joie, déception, rires naturels" },
        ],
        shoot: [
          "Plans courts et dynamiques",
          "Gros plan sur la bouteille",
          "Réaction de la personne avant / après le lancer",
          "Plans sur les crêpes",
          "Réactions naturelles des participants",
          "Petit suspense avant chaque lancer",
        ],
        goal:
          "Créer une vidéo fun, spontanée et facilement identifiable comme contenu de La Crêpière, sans avoir besoin d'un gros scénario.",
      },
      {
        id: "commande-vs-recu",
        video: "crepiere-commande-vs-recu",
        title: "Ce que tu commandes",
        accent: "vs ce que tu reçois",
        tags: ["≈ 12 s", "1 personne", "Humour", "Mise en valeur produit"],
        concept:
          "Pas le classique « avant / après ». Une personne commande tranquillement… et reçoit une box bien garnie. Elle regarde la quantité, puis la caméra, complètement surprise.",
        script: [
          { q: "La commande", a: "« Une petite crêpe tranquille. »" },
          { q: "CUT.", a: "Elle reçoit une belle box / un plateau bien garni, regarde la quantité…", action: true },
          { q: "Regard caméra", emoji: "😭", a: "« Petite ? »", punch: true },
        ],
        shots: [
          { img: "Crêpe03.png", label: "Plan 1", text: "La personne passe sa commande" },
          { img: null, cut: true, label: "Cut", text: "Coupe sèche, aucun effet" },
          { img: "event06.jpeg", label: "Plan 2", text: "Arrivée de la box" },
          { img: "Crêpes10.jpeg", label: "Gros plan", text: "Les crêpes et le contenu" },
          { img: "event04.jpeg", label: "Final", text: "Réaction + regard caméra" },
        ],
        shoot: [
          "Plan 1 : la personne passe sa commande",
          "Cut rapide",
          "Plan 2 : arrivée de la box",
          "Gros plan sur les crêpes et le contenu",
          "Réaction de la personne",
          "Regard caméra final",
        ],
        goal: "Jouer sur l'humour et la surprise tout en mettant naturellement les produits en valeur.",
        note:
          "Le plus important : garder les réactions naturelles. Pas besoin de surjouer — c'est justement le côté « je ne m'attendais pas à ça » qui doit faire rire.",
      },
    ],
  },
];
