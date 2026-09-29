import homeTemplate from "./views/Home.html?raw";
import "./style.css";

const products = [
  {
    key: "banana",
    number: "01",
    eyebrow: "La douceur généreuse",
    name: "Crêpe Banana<br>Lover",
    description:
      "Une crêpe dorée à la minute, drapée d'un voile de chocolat fondant et couronnée de fines rondelles de banane fraîche. Le duo banane-chocolat dans sa version la plus pure — gourmande, réconfortante, évidente.",
    image: "/images/product2.jpeg",
    folio: "04",
    quote:
      "Chocolat et banane : l'un des accords les plus anciens de la pâtisserie de rue.",
  },
  // {
  //   key: "mini",
  //   number: "02",
  //   eyebrow: "Le format signature",
  //   name: "Choco Fondant<br>Mini",
  //   description:
  //     "Des rubans de crêpe effilés, empilés avec espièglerie et noyés sous un chocolat chaud qui coule encore. Le format idéal pour une pause gourmande en solo.",
  //   image: "/images/product14.jpeg",
  //   folio: "05",
  //   quote:
  //     "Une bonne pâte à crêpe repose au moins 30 minutes avant la cuisson, pour plus de moelleux.",
  // },
  {
    key: "medium",
    number: "03",
    eyebrow: "Pour les grandes faims",
    name: "Choco Fondant<br>Moyenne",
    description:
      "La même générosité chocolatée, en format XL. Des rubans de crêpe empilés, noyés de chocolat fondant — parfaite à partager, ou pas.",
    image: "/images/product11.jpeg",
    folio: "06",
    quote: "Plus généreuse, pour les grandes faims ou les grands partages.",
  },
  {
    key: "strawberry",
    number: "04",
    eyebrow: "La star de la saison",
    name: "Crêpe Fraise<br>Délice",
    description:
      "Une crêpe pliée avec soin, généreusement garnie de fraises fraîches tranchées et nappée d'un filet de chocolat. Fraîche, légère, irrésistiblement gourmande — la préférée du mois.",
    image: "/images/product9.jpeg",
    folio: "07",
    quote:
      "La fraise atteint son pic de douceur en fin de saison chaude — d’où sa place de star du mois.",
  },
  {
    key: "mille",
    number: "05",
    eyebrow: "L'élégance couche après couche",
    name: "Mille Crêpes",
    description:
      "Des dizaines de crêpes fines empilées à la main, séparées d'une crème pâtissière au chocolat soyeuse. Chaque part dévoile ses fines strates dorées — un dessert de pâtissier, taillé pour les grandes occasions.",
    image: "/images/product5.jpeg",
    folio: "08",
    quote:
      "Un vrai mille-crêpe compte au moins 20 couches — la patience se lit dans chaque tranche.",
  },
  {
    key: "buche",
    number: "06",
    eyebrow: "La gourmandise qui fait sourire",
    name: "Crêp'rolls",
    description:
      "Un biscuit roulé moelleux, généreusement garni d'une crème chocolat aérienne et surmonté d'un petit ourson gourmand. Le dessert qui rassemble petits et grands autour de la table.",
    image: "/images/product1.jpeg",
    folio: "09",
    quote:
      "Un roulé bien réussi se roule tant que le biscuit est encore tiède et souple.",
  },
  {
    key: "crêpe caramel",
    number: "07",
    eyebrow: "Le plaisir tout simple",
    name: "Crêpes Caramel",
    description:
      "Une crêpe dorée à la poêle, pliée et nappée d'un caramel fondant maison. Le dessert qui rappelle les goûters d'enfance, avec un soupçon de gourmandise en plus.",
    image: "/images/Crêpe02.jpeg",
    folio: "10",
    quote:
      // "Le secret d'un bon beignet : une pâte reposée et une huile à la bonne température.",
      "Le caramel maison se prépare avec patience, à feu doux, pour un goût riche et une texture fondante.",
  },
  {
    key: "galette",
    number: "08",
    eyebrow: "Une pause salée, tout aussi gourmande",
    name: "Crêpes <br>Fromage & Herbes",
    description:
      "Une galette pliée et dorée à la poêle, fondante de fromage à cœur et relevée d'herbes fraîches. Pour celles et ceux qui préfèrent leur crêpe version salée, sans sacrifier le plaisir.",
    image: "/images/product3.jpeg",
    folio: "11",
    quote:
      "Le salé a aussi sa place à la crêpière : une crêpe bien dorée n'a rien à envier au sucré.",
  },
  {
    key: "rose",
    number: "09",
    eyebrow: "L'élégance en rose",
    name: "Crêpe Rose<br>Suprême",
    description:
      "Une pâte rose délicate, pliée en triangles et rayée d'un filet de chocolat noir, puis parée de framboises fraîches et d'une feuille de menthe. Une crêpe pensée pour surprendre autant que pour régaler.",
    image: "/images/Crêpes13.jpeg",
    folio: "12",
    quote:
      "La framboise et le chocolat noir : un contraste qui ne trompe jamais.",
  },
  {
    key: "combo",
    number: "10",
    eyebrow: "Le trio qui fait l'unanimité",
    name: "Crêpe Combo<br>Paradise",
    description:
      "Trois gourmandises dans une seule crêpe : chocolat fondant, bananes et fraises fraîches, pliés ensemble pour un mariage de saveurs et de couleurs. Le choix de celles et ceux qui ne veulent choisir qu'une chose : tout.",
    image: "/images/Crêpes2.jpeg",
    folio: "13",
    quote:
      "Chocolat, banane, fraise : le trio que personne ne songe à départager.",
  },
  {
    key: "bananadeluxe",
    number: "11",
    eyebrow: "La banane, version signature",
    name: "Crêpe Banana<br>Choco Deluxe",
    description:
      "Une crêpe roulée avec soin, garnie de rondelles de banane et de chocolat fondant, puis sublimée d'un filet de chocolat et d'un voile de sucre glace. La banane-chocolat dans sa version la plus élégante.",
    image: "/images/Crêpes3.jpeg",
    folio: "14",
    quote:
      "Une touche de sucre glace suffit à transformer un dessert du quotidien en pièce de fête.",
  },
  {
    key: "nature",
    number: "12",
    eyebrow: "La simplicité qui régale",
    name: "Crêpe Gourmande<br>Nature",
    description:
      "Des crêpes toutes simples, dorées à la poêle et servies encore chaudes dans leur boîte, avec un peu de sucre à saupoudrer soi-même. La gourmandise brute, sans artifice, pour les amateurs de crêpe pure.",
    image: "/images/Crêpe03.png",
    folio: "15",
    quote:
      "La meilleure garniture d'une bonne crêpe reste parfois... juste un peu de sucre.",
  },
    {
    key: "jusdefruits",
    number: "14",
    eyebrow: "Le craquant qui change tout",
    name: "Jus<br>fruits",
    description:
          "Du jus de fruits avec des morceaux de fruit frais, préparé en petites fournées pour rester frais jusqu'à la dernière gorgée. Une pause fruitée, parfaite pour grignoter entre deux crêpes.",
        image: "/images/jusdefruits.png",
    folio: "17",
    quote: "Le secret du jus de fruits : un enrobage fin, jamais collant.",
  },
  {
    key: "popcorn",
    number: "13",
    eyebrow: "Le craquant qui change tout",
    name: "Popcorn<br>Caramel",
    description:
      "Du popcorn soufflé et enrobé d'un caramel craquant, préparé en petites fournées pour rester croustillant jusqu'à la dernière bouchée. Une pause salée-sucrée, parfaite pour grignoter entre deux crêpes.",
    image: "/images/Popcorn01.jpeg",
    folio: "16",
    quote: "Le secret du popcorn caramel : un enrobage fin, jamais collant.",
  },
   {
    key: "popcorn",
    number: "14",
    eyebrow: "Le craquant qui change tout",
    name: "Popcorn<br>Chocolat",
    description:
      "Du popcorn soufflé et enrobé d'un chocolat craquant, préparé en petites fournées pour rester croustillant jusqu'à la dernière bouchée. Une pause salée-sucrée, parfaite pour grignoter entre deux crêpes.",
    image: "/images/PopcornChocolat.png",
    folio: "17",
    quote: "Le secret du popcorn chocolat : un enrobage fin, jamais collant.",
  }


];

const eventPlatters = [
  // {
  //   key: "plateau-sale",
  //   number: "P1",
  //   eyebrow: "Pour vos réceptions",
  //   name: "Plateau Salé<br>Cocktail",
  //   description:
  //     "Mini burgers au saumon, samoussas croustillants, wraps roulés, petits pains garnis et mini brioches dorées. Un plateau salé généreux, pensé pour les cocktails, les pots de départ et les rencontres professionnelles.",
  //   image: "/images/event01.jpeg",
  //   quote: "Un bon buffet salé se partage en une bouchée, sans couverts ni assiette.",
  //   deco: "🥪",
  // },
  {
    key: "plateau-gourmand",
    number: "P2",
    eyebrow: "Le plateau des gourmands",
    name: "Plateau Crêpes<br>Gourmand",
    description:
      "Des crêpes roulées saupoudrées de sucre glace, entourées de fraises, bananes, amandes, noix et carrés de chocolat blanc et noir, avec pâte à tartiner et crème à tremper. Chacun compose sa bouchée.",
    image: "/images/event02.jpeg",
    quote: "Le plaisir du plateau : chacun y trouve sa crêpe idéale.",
  },
  {
    key: "plateau-pancakes",
    number: "P3",
    eyebrow: "Le brunch en version mini",
    name: "Plateau Mini<br>Pancakes",
    description:
      "Des mini pancakes moelleux, des fraises fraîches, des barres chocolatées, un pot de confiture et des crèmes à tartiner. Un plateau coloré, idéal pour un brunch entre amis ou une pause d'équipe.",
    image: "/images/event04.jpeg",
    quote: "Les mini pancakes : la taille parfaite pour goûter à tout.",
    deco: "🍓",
  },
  {
    key: "plateau-exotique",
    number: "P4",
    eyebrow: "Une touche tropicale",
    name: "Plateau Crêpes<br>& Fruits Exotiques",
    description:
      "Des crêpes pliées accompagnées d'ananas, de fruit du dragon, de fraises, de myrtilles, de banane et de kiwi, avec miel et chocolat fondant. Frais, coloré, parfait pour un moment chill au soleil.",
    image: "/images/event05.jpeg",
    quote: "Ananas, kiwi, banane : les fruits d'ici font les plus beaux plateaux.",
    deco: "🍍",
  },
  {
    key: "plateau-festin",
    number: "P5",
    eyebrow: "Le grand format des anniversaires",
    name: "Grand Plateau<br>Festin",
    description:
      "Crêpes aux pépites de chocolat, fruits rouges, bananes, sauce chocolat, chantilly, glace, part de gâteau et sirop : le plateau qui fait l'effet d'un buffet à lui tout seul. Pour les anniversaires et les grandes tablées.",
    image: "/images/event06.jpeg",
    quote: "Un anniversaire réussi se mesure au nombre de doigts plongés dans le chocolat.",
    deco: "🎉",
  },
  {
    key: "plateau-elegance",
    number: "P6",
    eyebrow: "Pour les grandes occasions",
    name: "Plateau Brunch<br>Élégance",
    description:
      "Des crêpes fines pliées en triangles et voilées de sucre glace, entourées de fraises, framboises, myrtilles, ananas, kiwi et banane, avec miel, amandes effilées, noix de coco et chantilly. Le plateau raffiné des mariages et des réceptions.",
    image: "/images/event07.jpeg",
    quote: "Sur un plateau de fête, les couleurs comptent autant que les saveurs.",
    deco: "💐",
  },
];

const contents = [
  ["01", "Notre histoire", "03", "story"],
  ["02", "Nos créations gourmandes", "04", "catalog"],
  ["03", "Nos formules événements", "05", "events"],
  ["03", "Nos plateaux événements", "06", "plateau-sale"],
  ["04", "Crêpe Banana Lover", "06", "banana"],
  ["05", "Choco Fondant Mini", "07", "mini"],
  ["06", "Choco Fondant Moyenne", "08", "medium"],
  ["07", "Crêpe Fraise Délice", "09", "strawberry"],
  ["08", "Mille-Crêpe Chocolat Intense", "10", "mille"],
  ["09", "Bûche Roulée Ourson Choco", "11", "buche"],
  ["10", "Boules Sucrées Beignets Maison", "12", "beignet"],
  ["11", "Galette Salée Fromage & Herbes", "13", "galette"],
  ["12", "Crêpe Rose Suprême", "14", "rose"],
  ["13", "Crêpe Combo Paradise", "15", "combo"],
  ["14", "Crêpe Banana Choco Deluxe", "16", "bananadeluxe"],
  ["15", "Crêpe Gourmande Nature", "17", "nature"],
  ["16", "Popcorn Caramel", "18", "popcorn"],
  ["17", "Popcorn Chocolat", "19", "popcorn"],
  ["18", "Comment commander", "20", "steps"],
  ["19", "Nos engagements", "21", "engagements"],
  ["20", "Nous commander", "22", "closing"],
];
const eventImages = [
  "event01.jpeg",
  "event02.jpeg",
  "event03.jpeg",
  "event04.jpeg",
  "event05.jpeg",
  "event06.jpeg",
  "event07.jpeg",
];
const productGalleryImages = [
  ...Array.from({ length: 14 }, (_, index) => `product${index + 1}.jpeg`),
  "event06.jpeg",
  "event07.jpeg",
];
const visual = (image) =>
  `<div class="food-scene"><img class="food-photo" src="${image}" alt="Création gourmande La Crêpière Enagnon"><span class="food-spark spark-one">✦</span><span class="food-spark spark-two">✧</span></div>`;
const productMarkup = (product, index, variant = "") =>
  `<section class="page product-page ${product.key}${variant}${index % 2 ? " reverse" : ""} bg-[#fbf8f1]" id="${product.key}" data-page="${product.folio}"><div class="product-number">N°${product.number}</div><div class="product-copy"><p class="eyebrow">${product.eyebrow}</p><h2>${product.name}</h2><p class="description">${product.description}</p></div><div class="visual-wrap">${visual(product.image)}<span class="deco deco-a">${product.deco ?? "🍫"}</span><span class="deco deco-b">✦</span></div><div class="page-quote">“ ${product.quote} ”</div></section>`;
const productCatalogMarkup = productGalleryImages
  .map(
    (image, index) =>
      `<figure><img src="/images/${image}" alt="Création produit ${index + 1} La Crêpière Enagnon"><figcaption>${String(index + 1).padStart(2, "0")}</figcaption></figure>`,
  )
  .join("");
const contentsMarkup = contents
  .map(
    ([, label, , id], index) =>
      `<a href="#${id}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${label}</strong><b></b></a>`,
  )
  .join("");
const stepsMarkup = [
  [
    "🥞",
    "Choisissez<br>votre crêpe",
    "Parcourez nos créations et laissez-vous tenter.",
  ],
  [
    "📲",
    "Commandez<br>en un clic",
    "Via le site ou notre lien en bio, en quelques secondes.",
  ],
  [
    "😋",
    "Dégustez,<br>encore tiède",
    "Livrée où que vous soyez, préparée à la minute.",
  ],
]
  .map(
    ([icon, title, text]) =>
      `<div><span>${icon}</span><h3>${title}</h3><p>${text}</p></div>`,
  )
  .join("");
const engagementsMarkup = [
  ["🌿", "Fraîcheur", "Des ingrédients frais, choisis avec soin, chaque jour."],
  [
    "⏱️",
    "Préparé à la minute",
    "Jamais à l'avance — votre crêpe est cuisinée à la commande.",
  ],
  [
    "❤️",
    "Gourmandise avant tout",
    "Chaque recette est pensée pour le plaisir, sans compromis.",
  ],
]
  .map(
    ([icon, title, text]) =>
      `<div><span>${icon}</span><h3>${title}</h3><p>${text}</p></div>`,
  )
  .join("");
const eventsMarkup = eventImages
  .map(
    (image, index) =>
      `<figure><img src="/images/${image}" alt="Suggestion événementielle ${index + 1} La Crêpière Enagnon"><figcaption>${String(index + 1).padStart(2, "0")}</figcaption></figure>`,
  )
  .join("");

const app = document.querySelector("#app");
app.innerHTML = homeTemplate
  .replace("{{COVER_VISUAL}}", visual("/images/product2.jpeg"))
  .replace("{{CONTENTS}}", contentsMarkup)
  .replace("{{PRODUCT_CATALOG}}", productCatalogMarkup)
  .replace(
    "{{EVENT_PLATTERS}}",
    eventPlatters
      .map((platter, index) => productMarkup(platter, index, " platter-page"))
      .join(""),
  )
  .replace(
    "{{PRODUCTS}}",
    products.map((product, index) => productMarkup(product, index)).join(""),
  )
  .replace("{{STEPS}}", stepsMarkup)
  .replace("{{ENGAGEMENTS}}", engagementsMarkup)
  .replace("{{EVENTS}}", eventsMarkup)
  .replace("{{CLOSING_VISUAL}}", visual("/images/product2.jpeg"));

const pages = [...document.querySelectorAll(".page")];
pages.forEach((page, index) => {
  page.dataset.page = String(index + 1).padStart(2, "0");
});
document.querySelector(".total-pages").textContent =
  pages.at(-1).dataset.page;
document.querySelectorAll(".contents-list a").forEach((link) => {
  const target = document.getElementById(link.getAttribute("href").slice(1));
  if (target) link.querySelector("b").textContent = target.dataset.page;
  else link.remove();
});
const pageIndicator = document.querySelector(".current-page");
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");
let currentPage = 0;
let isTurning = false;

const showPage = (pageIndex, direction = "next") => {
  if (
    isTurning ||
    pageIndex < 0 ||
    pageIndex >= pages.length ||
    pageIndex === currentPage
  )
    return;
  isTurning = true;
  const previousPage = pages[currentPage];
  const nextPage = pages[pageIndex];
  previousPage.classList.remove("active");
  previousPage.classList.add(
    direction === "next" ? "turn-away-left" : "turn-away-right",
  );
  nextPage.classList.add(
    direction === "next" ? "turn-in-right" : "turn-in-left",
  );
  requestAnimationFrame(() => nextPage.classList.add("active"));
  window.setTimeout(() => {
    previousPage.classList.remove("turn-away-left", "turn-away-right");
    nextPage.classList.remove("turn-in-right", "turn-in-left");
    currentPage = pageIndex;
    pageIndicator.textContent = nextPage.dataset.page;
    previousButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === pages.length - 1;
    history.replaceState(null, "", `#${nextPage.id}`);
    isTurning = false;
  }, 560);
};

const initialPage = pages.findIndex(
  (page) => page.id === window.location.hash.slice(1),
);
currentPage = initialPage >= 0 ? initialPage : 0;
pages[currentPage].classList.add("active");
previousButton.disabled = currentPage === 0;
nextButton.disabled = currentPage === pages.length - 1;
pageIndicator.textContent = pages[currentPage].dataset.page;
nextButton.addEventListener("click", () => showPage(currentPage + 1));
previousButton.addEventListener("click", () =>
  showPage(currentPage - 1, "previous"),
);
document.addEventListener("keydown", (event) => {
  if (event.target.closest?.("input, dialog")) return;
  if (event.key === "ArrowRight" || event.key === " ")
    showPage(currentPage + 1);
  if (event.key === "ArrowLeft") showPage(currentPage - 1, "previous");
});
document.querySelectorAll(".contents-list a, .brand").forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetIndex = pages.findIndex(
      (page) => page.id === link.getAttribute("href").slice(1),
    );
    showPage(targetIndex, targetIndex > currentPage ? "next" : "previous");
  }),
);
document.querySelectorAll("[data-target]").forEach((button) =>
  button.addEventListener("click", () => {
    const targetIndex = pages.findIndex(
      (page) => page.id === button.dataset.target,
    );
    showPage(targetIndex, targetIndex > currentPage ? "next" : "previous");
  }),
);

// Accès discret au carnet d'idées de contenu : bouton visible au survol, protégé par un code.
const SECRET_CODE = "2105";
const SECRET_URL = "/idees-contenu-lc.html";
const secretDialog = document.querySelector("[data-secret-dialog]");
const secretInput = secretDialog.querySelector("input");
const secretError = secretDialog.querySelector("[data-secret-error]");
document.querySelector("[data-secret]").addEventListener("click", () => {
  secretInput.value = "";
  secretError.hidden = true;
  secretDialog.showModal();
});
secretDialog.querySelector("[data-secret-cancel]").addEventListener("click", () => secretDialog.close());
secretDialog.querySelector("[data-secret-form]").addEventListener("submit", (event) => {
  if (secretInput.value.trim() === SECRET_CODE) {
    window.location.href = SECRET_URL;
    return;
  }
  event.preventDefault();
  secretError.hidden = false;
  secretInput.select();
});
