// Modèle financier de La Crêpière Enagnon — 12 mois, 3 scénarios.
// Toutes les valeurs par défaut ci-dessous sont des HYPOTHÈSES de travail
// (aucune donnée réelle) : elles sont modifiables depuis la page et doivent
// être remplacées par les chiffres réels dès qu'ils sont connus.
// Montants en FCFA (XOF), hors taxes.

export const MONTHS = 12;

export const SCENARIOS = [
  { key: "prudent", label: "Prudent" },
  { key: "realiste", label: "Réaliste" },
  { key: "croissance", label: "Croissance" },
];

export const DEFAULTS = {
  // Grille de prix : prix de vente, coût matière unitaire et part des ventes (mix %).
  // group : "crepes" (crêpes individuelles) ou "sides" (boissons & accompagnements).
  products: [
    { name: "Crêpe classique (nature, sucre)", price: 1000, cost: 300, mix: 20, group: "crepes" },
    { name: "Crêpe gourmande (chocolat, banane, caramel)", price: 2000, cost: 650, mix: 35, group: "crepes" },
    { name: "Crêpe premium (fraise, combo, rose, deluxe)", price: 3000, cost: 1100, mix: 15, group: "crepes" },
    { name: "Mille crêpes / Crêp'rolls (part)", price: 2500, cost: 900, mix: 5, group: "crepes" },
    { name: "Crêpe salée fromage & herbes", price: 2000, cost: 700, mix: 5, group: "crepes" },
    { name: "Jus de fruits (bouteille)", price: 1000, cost: 400, mix: 12, group: "sides" },
    { name: "Popcorn caramel / chocolat (sachet)", price: 1000, cost: 300, mix: 8, group: "sides" },
  ],
  // Hypothèses communes aux trois scénarios.
  shared: {
    itemsPerOrder: 2, // articles par commande en ligne
    packagingPerOrder: 200, // emballage par commande en ligne
    deliveryFeeBilled: 0, // frais de livraison facturés au client, par commande (0 : réglés directement au coursier)
    deliveryCost: 0, // coût de la livraison supporté par l'entreprise, par commande
    paymentFeeRate: 1.5, // commission paiement mobile / carte, % du CA
    platterPrice: 20000, // prix moyen d'une box ou d'un plateau
    boxShare: 50, // part des box gourmandes dans les ventes box & plateaux, % (le reste : plateaux)
    platterCostRate: 30, // coût matière d'un plateau, % du prix
    platterPackaging: 1500, // emballage par plateau
    parlorPrice: 100000, // prix moyen d'une prestation PARLOR OF CRÊPES
    parlorCostRate: 35, // coûts directs d'une prestation (matières, extras, transport), % du prix
    b2bCostRate: 35, // coûts directs des collaborations & ventes B2B, % du CA
  },
  // Charges fixes mensuelles.
  fixed: [
    { key: "rent", name: "Atelier / cuisine (loyer)", value: 0 },
    { key: "staff", name: "Salaires & rémunérations", value: 35000 },
    { key: "energy", name: "Énergie (gaz, électricité, eau)", value: 10000 },
    { key: "telecom", name: "Internet, téléphone, logiciels", value: 5000 },
    { key: "maintenance", name: "Entretien & petit matériel", value: 5000 },
    { key: "admin", name: "Administratif, comptabilité, assurance", value: 2500 },
    { key: "marketing", name: "Marketing (réseaux sociaux, contenus, dégustations)", value: 15000 },
    { key: "other", name: "Autres charges", value: 2500 },
  ],
  // Capital initial de lancement : apport unique versé une fois (pas une dépense annuelle), en deux versions.
  // value = version basse (2,5 M), high = version haute (4 M).
  // working : le fonds de roulement reste en trésorerie, il n'est pas dépensé au démarrage.
  investments: [
    { name: "Matériel de cuisine (crêpières, froid, blender…)", value: 150000, high: 150000 },
    { name: "Stand PARLOR OF CRÊPES (structure, déco, signalétique)", value: 80000, high: 80000 },
    { name: "Stock initial & emballages", value: 30000, high: 30000 },
    { name: "Identité visuelle, photos, site web", value: 20000, high: 20000 },
    { name: "Installation & aménagement de l'atelier", value: 900000, high: 1500000 },
    { name: "Packaging box & plateaux (stock de lancement)", value: 300000, high: 500000 },
    { name: "Communication de lancement", value: 300000, high: 500000 },
    { name: "Fonds de roulement", value: 720000, high: 1220000, working: true },
  ],
  // Hypothèses propres à chaque scénario.
  scenarios: {
    // Calibrés pour une activité en démarrage (100 % en ligne).
    prudent: { orders: 80, growth: 4, platters: 2, parlor: 0.5, b2b: 0, b2bStart: 13 },
    realiste: { orders: 110, growth: 5, platters: 3, parlor: 1, b2b: 50000, b2bStart: 5 },
    croissance: { orders: 140, growth: 6, platters: 4, parlor: 1.5, b2b: 75000, b2bStart: 4 },
  },
};

export const SCENARIO_FIELDS = [
  { key: "orders", label: "Commandes en ligne au mois 1", unit: "cmd" },
  { key: "growth", label: "Croissance mensuelle des volumes", unit: "%" },
  { key: "platters", label: "Box & plateaux vendus au mois 1", unit: "u." },
  { key: "parlor", label: "Prestations PARLOR OF CRÊPES par mois (moyenne)", unit: "u.", step: 0.5 },
  { key: "b2b", label: "CA collaborations & B2B (mensuel au démarrage)", unit: "FCFA" },
  { key: "b2bStart", label: "Mois de démarrage du B2B", unit: "mois" },
];

export const SHARED_FIELDS = [
  { key: "itemsPerOrder", label: "Articles par commande", unit: "u.", step: 0.1 },
  { key: "packagingPerOrder", label: "Emballage par commande", unit: "FCFA" },
  { key: "deliveryFeeBilled", label: "Frais de livraison facturés", unit: "FCFA" },
  { key: "deliveryCost", label: "Coût réel d'une livraison", unit: "FCFA" },
  { key: "paymentFeeRate", label: "Commission de paiement", unit: "%", step: 0.1 },
  { key: "platterPrice", label: "Prix moyen d'une box / d'un plateau", unit: "FCFA" },
  { key: "boxShare", label: "Part des box dans les box & plateaux", unit: "%" },
  { key: "platterCostRate", label: "Coût matière d'une box / d'un plateau", unit: "%" },
  { key: "platterPackaging", label: "Emballage par box / plateau", unit: "FCFA" },
  { key: "parlorPrice", label: "Prix moyen d'une prestation PARLOR", unit: "FCFA" },
  { key: "parlorCostRate", label: "Coûts directs d'une prestation", unit: "%" },
  { key: "b2bCostRate", label: "Coûts directs du B2B", unit: "%" },
];

// Six sources de revenus, dans l'ordre fixe des couleurs.
export const REVENUE_STREAMS = [
  { key: "crepes", label: "Crêpes individuelles" },
  { key: "sides", label: "Boissons & accompagnements" },
  { key: "box", label: "Box gourmandes" },
  { key: "plateaux", label: "Plateaux" },
  { key: "events", label: "Commandes événementielles" },
  { key: "b2b", label: "Collaborations & catering" },
];

export const clone = (value) => JSON.parse(JSON.stringify(value));
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const sum = (list, pick = (x) => x) => list.reduce((total, item) => total + num(pick(item)), 0);

// Prix moyen et coût matière moyen d'un article, pondérés par le mix.
export const productMix = (products) => {
  const mixTotal = sum(products, (p) => p.mix);
  if (!mixTotal) return { avgPrice: 0, avgCost: 0, mixTotal };
  return {
    avgPrice: sum(products, (p) => num(p.price) * num(p.mix)) / mixTotal,
    avgCost: sum(products, (p) => num(p.cost) * num(p.mix)) / mixTotal,
    mixTotal,
  };
};

// Capital initial : total bas / haut, part dépensée au lancement et fonds de roulement conservé en trésorerie.
export const capitalPlan = (investments) => ({
  low: sum(investments, (i) => i.value),
  high: sum(investments, (i) => i.high ?? i.value),
  spent: sum(investments.filter((i) => !i.working), (i) => i.value),
  working: sum(investments.filter((i) => i.working), (i) => i.value),
  workingHigh: sum(investments.filter((i) => i.working), (i) => i.high ?? i.value),
});

// Délai de récupération d'un capital par les résultats cumulés.
// Au-delà de 12 mois, estimation prudente : le résultat du mois 12 est prolongé sans croissance.
export const recovery = (months, capital) => {
  const month = months.find((m) => m.cumulative >= capital)?.month;
  if (month) return { month, estimated: false };
  const last = months[months.length - 1];
  if (last.result <= 0) return { month: null, estimated: true };
  return { month: months.length + Math.ceil((capital - last.cumulative) / last.result), estimated: true };
};

export const computeScenario = (h, scenarioKey) => {
  const s = h.scenarios[scenarioKey];
  const sh = h.shared;
  const { avgPrice, avgCost } = productMix(h.products);
  const fixedTotal = sum(h.fixed, (f) => f.value);
  const marketing = num(h.fixed.find((f) => f.key === "marketing")?.value);
  const capital = capitalPlan(h.investments);
  // Ventes en ligne : part des boissons & accompagnements, selon la grille de prix et le mix.
  const onlineWeight = sum(h.products, (p) => num(p.price) * num(p.mix));
  const sidesWeight = sum(h.products.filter((p) => p.group === "sides"), (p) => num(p.price) * num(p.mix));
  const sidesShare = onlineWeight ? sidesWeight / onlineWeight : 0;
  const boxShare = Math.min(100, Math.max(0, num(sh.boxShare))) / 100;

  const months = [];
  let cumulative = 0;
  for (let m = 1; m <= MONTHS; m++) {
    const factor = (1 + num(s.growth) / 100) ** (m - 1);
    const orders = Math.round(num(s.orders) * factor);
    const items = orders * num(sh.itemsPerOrder);
    const platters = Math.round(num(s.platters) * factor);
    const parlor = num(s.parlor); // moyenne mensuelle : 0,5 = une prestation tous les deux mois
    const b2bActive = m >= num(s.b2bStart);
    const b2bFactor = (1 + num(s.growth) / 100) ** (m - num(s.b2bStart));
    const itemSales = items * avgPrice;
    const platterSales = platters * num(sh.platterPrice);
    const revenue = {
      crepes: itemSales * (1 - sidesShare) + orders * num(sh.deliveryFeeBilled),
      sides: itemSales * sidesShare,
      box: platterSales * boxShare,
      plateaux: platterSales * (1 - boxShare),
      events: parlor * num(sh.parlorPrice),
      b2b: b2bActive ? num(s.b2b) * b2bFactor : 0,
    };
    const ca = sum(Object.values(revenue));
    const raw =
      items * avgCost +
      platterSales * (num(sh.platterCostRate) / 100) +
      revenue.events * (num(sh.parlorCostRate) / 100) +
      revenue.b2b * (num(sh.b2bCostRate) / 100);
    const packaging = orders * num(sh.packagingPerOrder) + platters * num(sh.platterPackaging);
    const delivery = orders * num(sh.deliveryCost);
    const paymentFees = ca * (num(sh.paymentFeeRate) / 100);
    const variable = raw + packaging + delivery + paymentFees;
    const grossMargin = ca - raw - packaging;
    const contributionMargin = ca - variable;
    const result = contributionMargin - fixedTotal;
    cumulative += result;
    months.push({
      month: m,
      orders,
      items,
      platters,
      parlor,
      basket: orders ? (revenue.crepes + revenue.sides) / orders : 0,
      revenue,
      ca,
      raw,
      packaging,
      delivery,
      paymentFees,
      variable,
      grossMargin,
      contributionMargin,
      marketing,
      otherFixed: fixedTotal - marketing,
      fixed: fixedTotal,
      charges: variable + fixedTotal,
      result,
      cumulative,
      recovered: capital.low ? Math.min(1, Math.max(0, cumulative / capital.low)) : 0,
      recoveredHigh: capital.high ? Math.min(1, Math.max(0, cumulative / capital.high)) : 0,
      // Trésorerie : capital apporté − dépenses de lancement (= fonds de roulement) + résultats cumulés.
      cash: capital.working + cumulative,
    });
  }

  const total = (key) => sum(months, (m) => m[key]);
  const totals = Object.fromEntries(
    ["orders", "items", "platters", "parlor", "ca", "raw", "packaging", "delivery", "paymentFees", "variable", "grossMargin", "contributionMargin", "marketing", "otherFixed", "fixed", "charges", "result"].map((k) => [k, total(k)]),
  );
  totals.revenue = Object.fromEntries(REVENUE_STREAMS.map(({ key }) => [key, sum(months, (m) => m.revenue[key])]));
  const online = totals.revenue.crepes + totals.revenue.sides;
  const annual = {
    ...totals,
    online,
    grossMarginRate: totals.ca ? totals.grossMargin / totals.ca : 0,
    contributionRate: totals.ca ? totals.contributionMargin / totals.ca : 0,
    resultRate: totals.ca ? totals.result / totals.ca : 0,
    basket: totals.orders ? online / totals.orders : 0,
  };

  // Seuil de rentabilité : CA mensuel qui couvre les charges fixes au taux de marge sur coûts variables moyen.
  const breakEvenCa = annual.contributionRate > 0 ? fixedTotal / annual.contributionRate : Infinity;
  // Contribution d'une commande en ligne (après matières, emballage, livraison et commission).
  const orderContribution =
    num(sh.itemsPerOrder) * (avgPrice - avgCost) +
    num(sh.deliveryFeeBilled) -
    num(sh.packagingPerOrder) -
    num(sh.deliveryCost) -
    (num(sh.itemsPerOrder) * avgPrice + num(sh.deliveryFeeBilled)) * (num(sh.paymentFeeRate) / 100);
  const breakEvenOrders = orderContribution > 0 ? Math.ceil(fixedTotal / orderContribution) : Infinity;

  return {
    key: scenarioKey,
    months,
    annual,
    avgPrice,
    avgCost,
    fixedTotal,
    capital,
    breakEvenCa,
    orderContribution,
    breakEvenOrders,
    firstProfitableMonth: months.find((m) => m.result >= 0)?.month ?? null,
    recoveryLow: recovery(months, capital.low),
    recoveryHigh: recovery(months, capital.high),
    // Rythme annuel atteint en fin d'année 1 (CA du mois 12 × 12), point de départ de l'année 2.
    runRate: months[MONTHS - 1].ca * MONTHS,
  };
};

export const computeAll = (h) =>
  Object.fromEntries(SCENARIOS.map(({ key }) => [key, computeScenario(h, key)]));
