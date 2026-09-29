import "./business-plan.css";
import {
  DEFAULTS,
  SCENARIOS,
  SCENARIO_FIELDS,
  SHARED_FIELDS,
  REVENUE_STREAMS,
  MONTHS,
  clone,
  computeAll,
  productMix,
} from "./model.js";
import * as C from "./content.js";
import { lineChart, barChart, legend, compact } from "./charts.js";

// Couleurs de données (palette validée : bande de luminosité, chroma, daltonisme).
export const SCENARIO_COLORS = { prudent: "#A2461F", realiste: "#F39200", croissance: "#C80666" };
// Six sources de revenus, ordre fixe validé (CVD ΔE ≥ 11 entre voisins, fond #FFFBF6).
export const STREAM_COLORS = { crepes: "#A2461F", sides: "#0F9A74", box: "#F39200", plateaux: "#2E6DB4", events: "#C80666", b2b: "#4A3AA7" };

// Clé versionnée : l'augmenter quand les hypothèses par défaut changent.
const STORAGE_KEY = "lacrepiere-business-plan-v7";
const monthLabels = Array.from({ length: MONTHS }, (_, i) => `M${i + 1}`);

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const fcfa = (v) => (Number.isFinite(v) ? `${nf.format(Math.round(v))} FCFA` : "Non atteint");
const pct = (v) => `${(v * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
const monthText = (m) => (m ? `Mois ${m}` : "> 12 mois");
const recoveryText = ({ month, estimated }) => (month ? `${estimated ? "≈ " : ""}Mois ${month}` : "Non atteint");

const loadHypotheses = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.products && saved?.scenarios) return saved;
  } catch {
    /* stockage indisponible : on repart des hypothèses par défaut */
  }
  return clone(DEFAULTS);
};
const saveHypotheses = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.h));
  } catch {
    /* ignoré */
  }
};

export const state = { h: loadHypotheses(), scenario: "realiste" };

/* ---------- Gabarits ---------- */

const heading = (_id, index, eyebrow, title, accent, intro = "") => `
  <header class="bp-heading reveal">
    <p class="eyebrow"><span>${String(index).padStart(2, "0")}</span> ${eyebrow}</p>
    <h2>${title}${accent ? `<br><i>${accent}</i>` : ""}</h2>
    ${intro ? `<p class="bp-lead">${intro}</p>` : ""}
  </header>`;

const todo = (value) => (value === C.TODO ? `<span class="todo">${C.TODO}</span>` : value);
const list = (items) => `<ul class="bp-list">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const secIndex = (id) => C.sections.findIndex(([key]) => key === id) + 1;

const hero = () => `
  <section class="bp-hero" id="top">
    <div class="hero-wash wash-a"></div><div class="hero-wash wash-b"></div>
    <div class="hero-copy reveal">
      <p class="eyebrow">La Crêpière <span>Enagnon</span> · Business Plan ${C.company.year}</p>
      <h1>Plus qu'une crêpe,<br><i>une marque gourmande.</i></h1>
      <p class="bp-lead">${C.summary}</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-pdf>Télécharger le Business Plan PDF <span>↓</span></button>
        <a class="btn btn-ghost" href="#finances">Voir les projections <span>→</span></a>
        <a class="btn btn-ghost" href="${C.company.website}" target="_blank" rel="noreferrer">Découvrir La Crêpière <span>↗</span></a>
      </div>
    </div>
    <div class="hero-visual reveal">
      <img src="/images/event06.jpeg" alt="Grand plateau festin de La Crêpière Enagnon">
      <img class="hero-inset" src="/images/product9.jpeg" alt="Crêpe fraise délice">
    </div>
    <div class="hero-kpis" data-hero-kpis></div>
  </section>`;

const presentation = () => `
  <section class="bp-section" id="presentation">
    ${heading("presentation", secIndex("presentation"), "Présentation de l'entreprise", "Qui sommes-", "nous ?", "Une marque de crêpes pensée comme une entreprise food & lifestyle : production à la minute, livraison, événements et collaborations.")}
    <div class="grid-2">
      <div class="card reveal">
        <h3>Fiche d'identité</h3>
        <dl class="facts">${C.company.identity.map(([k, v]) => `<dt>${k}</dt><dd>${todo(v)}</dd>`).join("")}</dl>
      </div>
      <div class="card card-dark reveal">
        <h3>En résumé</h3>
        <p>${C.summary}</p>
        <div class="chips">${C.values.map((v) => `<span>${v}</span>`).join("")}</div>
      </div>
    </div>
  </section>`;

const vision = () => `
  <section class="bp-section tint" id="vision">
    ${heading("vision", secIndex("vision"), "Vision, mission, positionnement", "Là où nous", "allons.")}
    <div class="grid-3">
      ${C.vision.map((v, i) => `<article class="card pillar reveal" style="--d:${i}"><span class="pillar-n">0${i + 1}</span><h3>${v.label}</h3><p>${v.text}</p></article>`).join("")}
    </div>
    <div class="position-map card reveal">
      <h3>Carte de positionnement</h3>
      <div class="map">
        <span class="axis-x">Prix accessible → Premium</span><span class="axis-y">Produit simple → Expérience</span>
        <b class="pt" style="--x:22%;--y:78%">Vendeurs de rue</b>
        <b class="pt" style="--x:55%;--y:62%">Pâtisseries</b>
        <b class="pt" style="--x:72%;--y:38%">Traiteurs</b>
        <b class="pt pt-us" style="--x:62%;--y:18%">La Crêpière Enagnon</b>
      </div>
      <p class="note">Positionnement qualitatif, à valider par une étude terrain.</p>
    </div>
  </section>`;

const offer = () => `
  <section class="bp-section" id="offre">
    ${heading("offre", secIndex("offre"), "Produits & services", "Une offre", "à plusieurs étages.", "Des crêpes du quotidien aux prestations événementielles : chaque ligne répond à un moment de consommation et à un niveau de panier.")}
    <div class="offer-grid">
      ${C.offer.map((o, i) => `<article class="offer-card reveal" style="--d:${i % 3}"><div class="offer-img"><img src="${o.image}" alt="${o.title}" ><span>${o.tag}</span></div><h3>${o.title}</h3><p>${o.text}</p></article>`).join("")}
    </div>
  </section>`;

const targets = () => `
  <section class="bp-section tint" id="cibles">
    ${heading("cibles", secIndex("cibles"), "Clientèles cibles", "Pour qui", "nous cuisinons.")}
    <div class="grid-auto">
      ${C.targets.map((t, i) => `<article class="card target reveal" style="--d:${i % 3}"><h3>${t.title}</h3><p>${t.text}</p><p class="need"><span>Attentes</span>${t.need}</p></article>`).join("")}
    </div>
  </section>`;

const market = () => `
  <section class="bp-section" id="marche">
    ${heading("marche", secIndex("marche"), "Analyse du marché & opportunités", "Un marché", "à saisir.")}
    <div class="grid-2">
      <div class="card reveal"><h3>Contexte</h3>${list(C.market.context)}</div>
      <div class="card card-accent reveal"><h3>Opportunités</h3>${list(C.market.opportunities)}</div>
    </div>
    <div class="card reveal">
      <h3>Paysage concurrentiel</h3>
      <div class="table-wrap"><table class="bp-table">
        <thead><tr><th>Acteur</th><th>Forces</th><th>Limites / notre différence</th></tr></thead>
        <tbody>${C.market.competitors.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>
    </div>
    ${C.showMarketData ? `<div class="card card-dashed reveal">
      <h3>Données de marché</h3>
      <dl class="facts">${C.market.data.map(([k, v]) => `<dt>${k}</dt><dd>${todo(v)}</dd>`).join("")}</dl>
    </div>` : ""}
  </section>`;

const valueProp = () => `
  <section class="bp-section tint" id="valeur">
    ${heading("valeur", secIndex("valeur"), "Proposition de valeur", "Pourquoi", "nous choisir.")}
    <div class="value-list">
      ${C.valueProposition.map(([t, d], i) => `<article class="value-item reveal" style="--d:${i}"><span>${String(i + 1).padStart(2, "0")}</span><h3>${t}</h3><p>${d}</p></article>`).join("")}
    </div>
  </section>`;

const businessModel = () => {
  const block = (key) => {
    const b = C.canvas.find((c) => c.key === key);
    return `<div class="bmc-cell bmc-${key}"><h4>${b.title}</h4>${list(b.items)}</div>`;
  };
  return `
  <section class="bp-section" id="modele">
    ${heading("modele", secIndex("modele"), "Modèle économique", "Comment l'entreprise", "crée de la valeur.")}
    <div class="bmc reveal">
      ${["partners", "activities", "resources", "value", "relations", "channels", "segments", "costs", "revenues"].map(block).join("")}
    </div>
  </section>`;
};

const capital = () => `
  <section class="bp-section tint" id="capital">
    ${heading("capital", secIndex("capital"), "Capital & revenus", "Un capital investi une fois,", "des revenus chaque mois.", C.capital.intro)}
    <div class="grid-2">
      <div class="card reveal" data-capital-table></div>
      <div class="card card-dark reveal"><h3>Ce que finance le capital</h3>${list(C.capital.uses)}</div>
    </div>
    <div class="card reveal">
      <h3>La logique de rentabilité</h3>
      <ol class="chain">${C.capital.chain.map((step, i) => `<li><span>${i + 1}</span>${step}</li>`).join("")}</ol>
    </div>
    <h3 class="sub reveal">Six sources de revenus</h3>
    <div class="grid-3">
      ${C.capital.streams.map((s, i) => `<article class="card stream reveal" style="--d:${i % 3}"><i style="background:${STREAM_COLORS[s.key]}"></i><p class="eyebrow">${s.role}</p><h3>${s.title}</h3><p>${s.text}</p><p class="driver" data-stream="${s.key}"></p></article>`).join("")}
    </div>
    <div class="card reveal" data-mix-card></div>
    <div class="card reveal" data-recovery></div>
    <h3 class="sub reveal">Croissance sur plusieurs années</h3>
    <ol class="timeline years">
      ${C.capital.years.map((yr, i) => `<li class="reveal" style="--d:${i}"><span class="period">${yr.period}</span><h3>${yr.title}</h3><p>${yr.text}</p><p class="driver" data-year="${i}"></p></li>`).join("")}
    </ol>
    <p class="note reveal">${C.capital.yearsNote}</p>
  </section>`;

const strategy = () => `
  <section class="bp-section tint" id="strategie">
    ${heading("strategie", secIndex("strategie"), "Stratégie commerciale & marketing", "Donner envie,", "faire revenir.")}
    <div class="grid-3">
      ${C.marketing.map((m, i) => `<article class="card reveal" style="--d:${i % 3}"><h3>${m.title}</h3><p>${m.text}</p></article>`).join("")}
    </div>
    <div class="card reveal">
      <h3>Politique commerciale</h3>
      <dl class="facts facts-wide">${C.commercial.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
    </div>
  </section>`;

const organisation = () => `
  <section class="bp-section" id="organisation">
    ${heading("organisation", secIndex("organisation"), "Organisation & fonctionnement", "De la commande", "à la dégustation.")}
    <ol class="flow reveal">
      ${C.organisation.flow.map(([t, d], i) => `<li><span>${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}
    </ol>
    <div class="grid-2">
      <div class="card reveal"><h3>Rôles clés</h3><dl class="facts facts-wide">${C.organisation.roles.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl></div>
      <div class="card reveal"><h3>Qualité & opérations</h3>${list(C.organisation.quality)}</div>
    </div>
  </section>`;

const parlor = () => `
  <section class="bp-section parlor" id="parlor">
    <div class="parlor-bg" aria-hidden="true"><img src="/images/event05.jpeg" alt=""></div>
    ${heading("parlor", secIndex("parlor"), "Stratégie événementielle", "PARLOR", "OF CRÊPES.", C.parlor.pitch)}
    <div class="grid-3">
      ${C.parlor.formulas.map((f, i) => `<article class="card parlor-card reveal" style="--d:${i}"><p class="eyebrow">Formule</p><h3>${f.name}</h3><p class="for">${f.for}</p><p>${f.content}</p><p class="price" data-parlor-price></p></article>`).join("")}
    </div>
    <div class="grid-2">
      <div class="card card-glass reveal"><h3>Stratégie de développement</h3>${list(C.parlor.strategy)}</div>
      <div class="card card-glass reveal" data-parlor-kpi></div>
    </div>
  </section>`;

const field = (path, value, { unit = "", step = 1 } = {}) =>
  `<label class="field"><input type="number" inputmode="decimal" step="${step}" min="0" data-path="${path}" value="${value}"><span>${unit}</span></label>`;

const hypothesesEditor = () => {
  const h = state.h;
  return `
  <div class="hyp" id="hypotheses">
    <div class="hyp-head">
      <div><h3>Hypothèses du modèle</h3><p class="note">Toutes les valeurs sont des <b>hypothèses de travail</b>, pas des données réelles. Remplacez-les par vos chiffres : les projections se recalculent instantanément et sont mémorisées sur cet appareil.</p></div>
      <button class="btn btn-ghost small" data-reset>Réinitialiser</button>
    </div>
    <details open>
      <summary>Hypothèses par scénario</summary>
      <div class="table-wrap"><table class="bp-table hyp-table">
        <thead><tr><th>Hypothèse</th>${SCENARIOS.map((s) => `<th><i class="dot" style="background:${SCENARIO_COLORS[s.key]}"></i>${s.label}</th>`).join("")}</tr></thead>
        <tbody>${SCENARIO_FIELDS.map((f) => `<tr><td>${f.label}</td>${SCENARIOS.map((s) => `<td>${field(`scenarios.${s.key}.${f.key}`, h.scenarios[s.key][f.key], f)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div>
    </details>
    <details>
      <summary>Grille de prix & mix de ventes</summary>
      <div class="table-wrap"><table class="bp-table hyp-table">
        <thead><tr><th>Produit</th><th>Prix de vente</th><th>Coût matière</th><th>Mix des ventes</th><th>Marge unitaire</th></tr></thead>
        <tbody>${h.products.map((p, i) => `<tr><td>${p.name}</td><td>${field(`products.${i}.price`, p.price, { unit: "FCFA", step: 50 })}</td><td>${field(`products.${i}.cost`, p.cost, { unit: "FCFA", step: 50 })}</td><td>${field(`products.${i}.mix`, p.mix, { unit: "%" })}</td><td class="num" data-unit-margin="${i}"></td></tr>`).join("")}</tbody>
        <tfoot><tr><td>Moyenne pondérée</td><td class="num" data-avg-price></td><td class="num" data-avg-cost></td><td class="num" data-mix-total></td><td></td></tr></tfoot>
      </table></div>
    </details>
    <details>
      <summary>Hypothèses communes (commandes, livraison, événements)</summary>
      <div class="field-grid">${SHARED_FIELDS.map((f) => `<div class="field-row"><span>${f.label}</span>${field(`shared.${f.key}`, h.shared[f.key], f)}</div>`).join("")}</div>
    </details>
    <details>
      <summary>Charges fixes mensuelles</summary>
      <div class="field-grid">${h.fixed.map((f, i) => `<div class="field-row"><span>${f.name}</span>${field(`fixed.${i}.value`, f.value, { unit: "FCFA", step: 5000 })}</div>`).join("")}<div class="field-row total"><span>Total charges fixes</span><b data-fixed-total></b></div></div>
    </details>
    <details>
      <summary>Capital initial (versions basse et haute)</summary>
      <div class="field-grid">${h.investments.map((f, i) => `<div class="field-row"><span>${f.name}</span>${field(`investments.${i}.value`, f.value, { unit: "bas", step: 10000 })}${field(`investments.${i}.high`, f.high ?? f.value, { unit: "haut", step: 10000 })}</div>`).join("")}
        <div class="field-row total"><span>Capital initial (bas / haut)</span><b data-capital-total></b></div>
      </div>
    </details>
  </div>`;
};

const finances = () => `
  <section class="bp-section finance" id="finances">
    ${heading("finances", secIndex("finances"), "Projections financières sur 12 mois", "Combien La Crêpière", "peut générer.", "Un modèle interactif : choisissez un scénario, ajustez les hypothèses, et suivez l'effet sur le chiffre d'affaires, les coûts, la marge, le résultat et la trésorerie.")}
    <div class="scenario-bar reveal" role="tablist" aria-label="Scénario">
      ${SCENARIOS.map((s) => `<button role="tab" data-scenario="${s.key}"><i style="background:${SCENARIO_COLORS[s.key]}"></i>${s.label}</button>`).join("")}
    </div>
    <div class="kpi-grid" data-kpis></div>
    <div class="grid-2 charts">
      <figure class="card chart-card reveal"><figcaption><h3>Chiffre d'affaires mensuel</h3><p>Les trois scénarios, en FCFA</p></figcaption><div data-legend-scenarios></div><div data-chart="ca"></div></figure>
      <figure class="card chart-card reveal"><figcaption><h3>Composition du chiffre d'affaires</h3><p data-scenario-name></p></figcaption>${legend(REVENUE_STREAMS.map((s) => ({ name: s.label, color: STREAM_COLORS[s.key] })))}<div data-chart="mix"></div></figure>
      <figure class="card chart-card reveal"><figcaption><h3>Résultat mensuel estimé</h3><p data-scenario-name></p></figcaption><div data-chart="result"></div></figure>
      <figure class="card chart-card reveal"><figcaption><h3>Trésorerie en fin de mois</h3><p data-cash-caption></p></figcaption><div data-chart="cash"></div></figure>
    </div>
    <div class="grid-2">
      <div class="card reveal" data-breakeven></div>
      <div class="card reveal" data-capital-card></div>
    </div>
    <div class="card reveal">
      <div class="card-head"><h3>Compte de résultat prévisionnel — <span data-scenario-label></span></h3><p class="note">Montants en FCFA · défilez horizontalement sur mobile</p></div>
      <div class="table-wrap"><table class="bp-table pl-table" data-pl></table></div>
    </div>
    <div class="card reveal">
      <h3>Comparaison des scénarios sur 12 mois</h3>
      <div class="table-wrap"><table class="bp-table compare-table" data-compare></table></div>
    </div>
    ${hypothesesEditor()}
    <p class="note method">Méthode : Ventes en ligne = commandes × articles par commande × prix moyen pondéré, réparties entre crêpes et boissons & accompagnements selon la grille de prix. Box & plateaux = unités × prix moyen, répartis selon la part des box. Marge brute = CA − matières premières − emballages. Résultat estimé = CA − coûts variables (matières, emballages, livraison, commissions) − charges fixes, avant impôts et amortissements. Seuil de rentabilité = charges fixes ÷ taux de marge sur coûts variables. Le capital initial est un apport unique : il n'entre pas dans les charges annuelles. Trésorerie = capital − dépenses de lancement (soit le fonds de roulement) + résultats cumulés. Capital récupéré = résultat cumulé ÷ capital initial ; au-delà de 12 mois, le délai prolonge le résultat du mois 12 sans croissance.</p>
  </section>`;

const roadmap = () => `
  <section class="bp-section tint" id="roadmap">
    ${heading("roadmap", secIndex("roadmap"), "Roadmap de développement", "Étape par", "étape.")}
    <ol class="timeline">
      ${C.roadmap.map((r, i) => `<li class="reveal" style="--d:${i}"><span class="period">${r.period}</span><h3>${r.title}</h3>${list(r.items)}</li>`).join("")}
    </ol>
  </section>`;

const risks = () => `
  <section class="bp-section" id="risques">
    ${heading("risques", secIndex("risques"), "Risques & opportunités", "Anticiper pour", "mieux grandir.")}
    <div class="swot reveal">
      <div class="swot-s"><h4>Forces</h4>${list(C.swot.strengths)}</div>
      <div class="swot-w"><h4>Faiblesses</h4>${list(C.swot.weaknesses)}</div>
      <div class="swot-o"><h4>Opportunités</h4>${list(C.swot.opportunities)}</div>
      <div class="swot-t"><h4>Menaces</h4>${list(C.swot.threats)}</div>
    </div>
    <div class="card reveal">
      <h3>Principaux risques et réponses</h3>
      <div class="table-wrap"><table class="bp-table">
        <thead><tr><th>Risque</th><th>Impact</th><th>Réponse prévue</th></tr></thead>
        <tbody>${C.risks.map(([r, i, m]) => `<tr><td>${r}</td><td><span class="level level-${i === "Élevé" ? "high" : "mid"}">${i}</span></td><td>${m}</td></tr>`).join("")}</tbody>
      </table></div>
    </div>
  </section>`;

const kpis = () => `
  <section class="bp-section tint" id="kpi">
    ${heading("kpi", secIndex("kpi"), "KPI à suivre", "Piloter", "chaque mois.", "Les objectifs indiqués sont issus du scénario sélectionné : ce sont des repères, à comparer chaque mois aux résultats réels.")}
    <div class="grid-auto" data-kpi-list></div>
  </section>`;

const conclusion = () => `
  <section class="bp-section closing" id="conclusion">
    ${heading("conclusion", secIndex("conclusion"), "Conclusion & contacts", "La suite", "vous appartient.")}
    <div class="grid-2">
      <div class="reveal"><p class="bp-lead">${C.conclusion}</p><button class="btn btn-light" data-pdf>Télécharger le Business Plan PDF <span>↓</span></button></div>
      <div class="card card-glass reveal"><h3>Coordonnées</h3><dl class="facts">${C.company.contacts.map(([k, v, url]) => `<dt>${k}</dt><dd>${url ? `<a class="contact-link" href="${url}" target="_blank" rel="noreferrer">${v} ↗</a>` : todo(v)}</dd>`).join("")}</dl></div>
    </div>
  </section>`;

const shell = () => `
  <header class="bp-topbar">
    <a class="bp-brand" href="/" aria-label="Retour au product book"><img src="/logo/logo crèpière (2).png" alt="La Crêpière Enagnon"></a>
    <a class="bp-back" href="/">← Product book</a>
    <a class="bp-site" href="${C.company.website}" target="_blank" rel="noreferrer">lacrepiere.netlify.app ↗</a>
    <button class="btn btn-primary small" data-pdf><span class="hide-sm">Télécharger le </span>PDF <span>↓</span></button>
  </header>
  <nav class="bp-nav" aria-label="Sommaire du business plan">
    <p class="eyebrow">Sommaire</p>
    <ol>${C.sections.map(([id, label], i) => `<li><a href="#${id}"><span>${String(i + 1).padStart(2, "0")}</span>${label}</a></li>`).join("")}</ol>
  </nav>
  <main class="bp-main">
    ${hero()}${presentation()}${vision()}${offer()}${targets()}${market()}${valueProp()}${businessModel()}${capital()}${strategy()}${organisation()}${parlor()}${finances()}${roadmap()}${risks()}${kpis()}${conclusion()}
    <footer class="bp-footer"><span>La Crêpière Enagnon · Cotonou, Bénin</span><span>Business Plan ${C.company.year} — projections fondées sur des hypothèses</span></footer>
  </main>
  <div class="toast" role="status" aria-live="polite"></div>`;

/* ---------- Rendu dynamique des chiffres ---------- */

const kpiTile = (label, value, detail = "", tone = "") =>
  `<div class="kpi ${tone}"><span>${label}</span><strong>${value}</strong>${detail ? `<small>${detail}</small>` : ""}</div>`;

const plRows = (r) => {
  const rows = [
    ["Commandes en ligne", (m) => m.orders, r.annual.orders, "count"],
    ["Articles vendus", (m) => m.items, r.annual.items, "count"],
    ["Panier moyen en ligne", (m) => m.basket, r.annual.basket, "money"],
    ["Box & plateaux vendus", (m) => m.platters, r.annual.platters, "count"],
    ["Prestations PARLOR", (m) => m.parlor, r.annual.parlor, "count1"],
    ["section", "Chiffre d'affaires"],
    ...REVENUE_STREAMS.map((s) => [s.label, (m) => m.revenue[s.key], r.annual.revenue[s.key], "money"]),
    ["Chiffre d'affaires total", (m) => m.ca, r.annual.ca, "money", "strong"],
    ["section", "Coûts variables"],
    ["Matières premières", (m) => -m.raw, -r.annual.raw, "money"],
    ["Emballages", (m) => -m.packaging, -r.annual.packaging, "money"],
    ["Marge brute", (m) => m.grossMargin, r.annual.grossMargin, "money", "strong"],
    ["Livraison", (m) => -m.delivery, -r.annual.delivery, "money"],
    ["Commissions de paiement", (m) => -m.paymentFees, -r.annual.paymentFees, "money"],
    ["Marge sur coûts variables", (m) => m.contributionMargin, r.annual.contributionMargin, "money", "strong"],
    ["section", "Charges fixes"],
    ["Marketing", (m) => -m.marketing, -r.annual.marketing, "money"],
    ["Autres charges fixes", (m) => -m.otherFixed, -r.annual.otherFixed, "money"],
    ["Résultat estimé", (m) => m.result, r.annual.result, "money", "total"],
    ["Résultat cumulé", (m) => m.cumulative, null, "money", "strong"],
    ["section", "Capital initial"],
    [`Capital récupéré (${compact(r.capital.low)})`, (m) => m.recovered, null, "pct"],
    [`Capital récupéré (${compact(r.capital.high)})`, (m) => m.recoveredHigh, null, "pct"],
    ["Trésorerie fin de mois", (m) => m.cash, null, "money"],
  ];
  const cell = (v, kind) => {
    if (v === null) return "—";
    if (kind === "count1") return v.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
    if (kind === "pct") return pct(v);
    return nf.format(Math.round(v) || 0);
  };
  return `<thead><tr><th></th>${monthLabels.map((m) => `<th>${m}</th>`).join("")}<th>Total</th></tr></thead><tbody>${rows
    .map((row) => {
      if (row[0] === "section") return `<tr class="section-row"><th colspan="${MONTHS + 2}">${row[1]}</th></tr>`;
      const [label, pick, total, kind, cls = ""] = row;
      return `<tr class="${cls}"><th>${label}</th>${r.months.map((m) => { const v = pick(m); return `<td class="${v < 0 ? "neg" : ""}">${cell(v, kind)}</td>`; }).join("")}<td class="${total < 0 ? "neg" : ""}">${cell(total, kind)}</td></tr>`;
    })
    .join("")}</tbody>`;
};

const compareTable = (all) => {
  const rows = [
    ["Chiffre d'affaires annuel", (r) => fcfa(r.annual.ca)],
    ["CA mensuel moyen", (r) => fcfa(r.annual.ca / MONTHS)],
    ["CA du mois 12", (r) => fcfa(r.months[MONTHS - 1].ca)],
    ["Commandes en ligne (12 mois)", (r) => nf.format(r.annual.orders)],
    ["Coûts variables", (r) => fcfa(r.annual.variable)],
    ["Charges fixes", (r) => fcfa(r.annual.fixed)],
    ["Marge brute", (r) => `${fcfa(r.annual.grossMargin)} · ${pct(r.annual.grossMarginRate)}`],
    ["Box, plateaux & événements", (r) => fcfa(r.annual.revenue.box + r.annual.revenue.plateaux + r.annual.revenue.events)],
    ["Résultat estimé", (r) => `${fcfa(r.annual.result)} · ${pct(r.annual.resultRate)}`],
    ["Premier mois bénéficiaire", (r) => monthText(r.firstProfitableMonth)],
    ["Capital de 2,5 M récupéré", (r) => recoveryText(r.recoveryLow)],
    ["Capital de 4 M récupéré", (r) => recoveryText(r.recoveryHigh)],
    ["Trésorerie fin du mois 12", (r) => fcfa(r.months[MONTHS - 1].cash)],
  ];
  return `<thead><tr><th></th>${SCENARIOS.map((s) => `<th><i class="dot" style="background:${SCENARIO_COLORS[s.key]}"></i>${s.label}</th>`).join("")}</tr></thead><tbody>${rows
    .map(([label, fn]) => `<tr><th>${label}</th>${SCENARIOS.map((s) => `<td>${fn(all[s.key])}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

// Section « Capital & revenus » : capital, sources de revenus, récupération, années.
const renderCapital = (r, name) => {
  const h = state.h;
  const cap = r.capital;
  $("[data-capital-table]").innerHTML = `
    <h3>Capital initial : ${compact(cap.low)} à ${compact(cap.high)} FCFA</h3>
    <div class="table-wrap"><table class="bp-table capital-table">
      <thead><tr><th>Poste</th><th>Version basse</th><th>Version haute</th></tr></thead>
      <tbody>${h.investments.map((i) => `<tr><td>${i.name}</td><td>${nf.format(i.value)}</td><td>${nf.format(i.high ?? i.value)}</td></tr>`).join("")}</tbody>
      <tfoot><tr><td>Capital initial (apport unique)</td><td>${nf.format(cap.low)}</td><td>${nf.format(cap.high)}</td></tr></tfoot>
    </table></div>`;

  const total = r.annual.ca || 1;
  $$("[data-stream]").forEach((n) => {
    const v = r.annual.revenue[n.dataset.stream];
    n.textContent = `${fcfa(v)} / an · ${pct(v / total)} du CA`;
  });
  const strategic = r.annual.revenue.box + r.annual.revenue.plateaux + r.annual.revenue.events;
  $("[data-mix-card]").innerHTML = `
    <h3>Répartition du CA annuel — scénario ${name}</h3>
    <div class="share-bar">${REVENUE_STREAMS.map((s) => `<span style="flex:${r.annual.revenue[s.key]};background:${STREAM_COLORS[s.key]}" title="${s.label} : ${fcfa(r.annual.revenue[s.key])}"></span>`).join("")}</div>
    <ul class="legend legend-values">${REVENUE_STREAMS.map((s) => `<li><i style="background:${STREAM_COLORS[s.key]}"></i>${s.label}<b>${pct(r.annual.revenue[s.key] / total)}</b><small>${fcfa(r.annual.revenue[s.key])}</small></li>`).join("")}</ul>
    <p class="note">Box, plateaux et commandes événementielles : <b>${fcfa(strategic)}</b> par an, soit ${pct(strategic / total)} du CA. ${C.capital.boxNote}</p>`;

  const quarters = [3, 6, 9, 12].map((m) => r.months[m - 1]);
  const upTo = (m, key) => r.months.slice(0, m.month).reduce((t, x) => t + x[key], 0);
  const tile = (capital, rec) => kpiTile(`Capital de ${compact(capital)} récupéré`, recoveryText(rec), rec.estimated ? "estimation au-delà de 12 mois" : "d'après les projections", rec.month ? "pos" : "neg");
  $("[data-recovery]").innerHTML = `
    <h3>Récupération de l'investissement — <span>scénario ${name}</span></h3>
    <p class="note">${C.capital.recoveryText}</p>
    <div class="kpi-grid kpi-grid-3">
      ${kpiTile("Résultat cumulé sur 12 mois", fcfa(r.months[MONTHS - 1].cumulative), `${pct(r.annual.resultRate)} du CA`, r.annual.result < 0 ? "neg" : "pos")}
      ${tile(cap.low, r.recoveryLow)}
      ${tile(cap.high, r.recoveryHigh)}
    </div>
    <div class="table-wrap"><table class="bp-table recovery-table">
      <thead><tr><th>Cumul à fin de</th>${quarters.map((m) => `<th>Mois ${m.month}</th>`).join("")}</tr></thead>
      <tbody>
        <tr><th>Chiffre d'affaires</th>${quarters.map((m) => `<td>${nf.format(Math.round(upTo(m, "ca")))}</td>`).join("")}</tr>
        <tr><th>Charges (variables + fixes)</th>${quarters.map((m) => `<td>${nf.format(Math.round(upTo(m, "charges")))}</td>`).join("")}</tr>
        <tr class="strong"><th>Résultat cumulé</th>${quarters.map((m) => `<td>${nf.format(Math.round(m.cumulative))}</td>`).join("")}</tr>
        <tr><th>Capital récupéré (${compact(cap.low)})</th>${quarters.map((m) => `<td>${pct(m.recovered)}</td>`).join("")}</tr>
        <tr><th>Capital récupéré (${compact(cap.high)})</th>${quarters.map((m) => `<td>${pct(m.recoveredHigh)}</td>`).join("")}</tr>
      </tbody>
    </table></div>
    <p class="note">${C.capital.recoveryNote}</p>`;

  const years = [
    `CA ${fcfa(r.annual.ca)} · résultat ${fcfa(r.annual.result)}`,
    `Point de départ : ${fcfa(r.runRate)} de CA par an au rythme du mois 12`,
    "Bénéfices réinvestis dans la croissance",
  ];
  $$("[data-year]").forEach((n) => (n.textContent = years[n.dataset.year]));
};

let results = computeAll(state.h);

const renderCharts = () => {
  const r = results[state.scenario];
  const name = SCENARIOS.find((s) => s.key === state.scenario).label;
  const scenarioSeries = SCENARIOS.map((s) => ({ name: s.label, color: SCENARIO_COLORS[s.key], values: results[s.key].months.map((m) => m.ca) }));
  $("[data-legend-scenarios]").innerHTML = legend(scenarioSeries);
  lineChart($('[data-chart="ca"]'), { labels: monthLabels, series: scenarioSeries, format: fcfa });
  barChart($('[data-chart="mix"]'), {
    labels: monthLabels,
    series: REVENUE_STREAMS.map((s) => ({ name: s.label, color: STREAM_COLORS[s.key], values: r.months.map((m) => m.revenue[s.key]) })),
    format: fcfa,
  });
  barChart($('[data-chart="result"]'), { labels: monthLabels, series: [{ name: "Résultat", color: SCENARIO_COLORS[state.scenario], values: r.months.map((m) => m.result) }], format: fcfa });
  lineChart($('[data-chart="cash"]'), { labels: monthLabels, series: [{ name: "Trésorerie", color: SCENARIO_COLORS[state.scenario], values: r.months.map((m) => m.cash) }], format: fcfa, area: true });
  $$("[data-scenario-name]").forEach((n) => (n.textContent = `Scénario ${name}, en FCFA`));
  $("[data-cash-caption]").textContent = `Scénario ${name} · fonds de roulement ${fcfa(r.capital.working)} + résultats cumulés`;
};

const render = () => {
  results = computeAll(state.h);
  const r = results[state.scenario];
  const real = results.realiste;
  const name = SCENARIOS.find((s) => s.key === state.scenario).label;
  const mix = productMix(state.h.products);
  const total = r.annual.ca || 1;

  $$("[data-scenario]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.scenario === state.scenario)));
  $$("[data-scenario-label]").forEach((n) => (n.textContent = `scénario ${name}`));

  $("[data-hero-kpis]").innerHTML = [
    kpiTile("Capital initial", `${compact(real.capital.low).replace(" M", "")}–${compact(real.capital.high)} FCFA`, "apport unique, pas une dépense annuelle"),
    kpiTile("CA annuel · réaliste", compact(real.annual.ca) + " FCFA", `${compact(results.prudent.annual.ca)} → ${compact(results.croissance.annual.ca)} selon le scénario`),
    kpiTile("Résultat annuel · réaliste", compact(real.annual.result) + " FCFA", `${pct(real.annual.resultRate)} du CA`),
    kpiTile("Capital récupéré · réaliste", real.recoveryLow.estimated || real.recoveryHigh.estimated ? `${recoveryText(real.recoveryLow)} → ${recoveryText(real.recoveryHigh).toLowerCase()}` : `Mois ${real.recoveryLow.month}–${real.recoveryHigh.month}`, `capital de ${compact(real.capital.low)} → ${compact(real.capital.high)}`),
  ].join("");

  $("[data-kpis]").innerHTML = [
    kpiTile("Chiffre d'affaires annuel", fcfa(r.annual.ca), `Mois 1 : ${fcfa(r.months[0].ca)} → mois 12 : ${fcfa(r.months[MONTHS - 1].ca)}`),
    kpiTile("Charges annuelles", fcfa(r.annual.charges), `Variables ${fcfa(r.annual.variable)} · fixes ${fcfa(r.annual.fixed)}`),
    kpiTile("Résultat estimé (12 mois)", fcfa(r.annual.result), pct(r.annual.resultRate) + " du CA", r.annual.result < 0 ? "neg" : "pos"),
    kpiTile("Marge brute", pct(r.annual.grossMarginRate), fcfa(r.annual.grossMargin)),
    kpiTile("Seuil de rentabilité", fcfa(r.breakEvenCa) + " / mois", `≈ ${Number.isFinite(r.breakEvenOrders) ? nf.format(r.breakEvenOrders) : "∞"} commandes en ligne / mois`),
    kpiTile("Capital récupéré", `${recoveryText(r.recoveryLow)} → ${recoveryText(r.recoveryHigh).toLowerCase()}`, `capital de ${compact(r.capital.low)} → ${compact(r.capital.high)}`, r.recoveryLow.month ? "pos" : "neg"),
  ].join("");

  $("[data-breakeven]").innerHTML = `
    <h3>Seuil de rentabilité & économie d'une commande</h3>
    <dl class="facts facts-num">
      <dt>Prix moyen d'un article</dt><dd>${fcfa(r.avgPrice)}</dd>
      <dt>Coût matière moyen d'un article</dt><dd>${fcfa(r.avgCost)}</dd>
      <dt>Panier moyen en ligne</dt><dd>${fcfa(r.annual.basket)}</dd>
      <dt>Contribution nette d'une commande</dt><dd>${fcfa(r.orderContribution)}</dd>
      <dt>Charges fixes mensuelles</dt><dd>${fcfa(r.fixedTotal)}</dd>
      <dt>Taux de marge sur coûts variables</dt><dd>${pct(r.annual.contributionRate)}</dd>
      <dt>CA mensuel d'équilibre</dt><dd><b>${fcfa(r.breakEvenCa)}</b></dd>
      <dt>Premier mois bénéficiaire</dt><dd><b>${monthText(r.firstProfitableMonth)}</b></dd>
    </dl>`;
  $("[data-capital-card]").innerHTML = `
    <h3>Capital initial & trésorerie</h3>
    <dl class="facts facts-num">
      <dt>Capital initial (apport unique)</dt><dd><b>${fcfa(r.capital.low)} → ${fcfa(r.capital.high)}</b></dd>
      <dt>Dont dépenses de lancement (version basse)</dt><dd>${fcfa(r.capital.spent)}</dd>
      <dt>Dont fonds de roulement (version basse)</dt><dd>${fcfa(r.capital.working)}</dd>
      <dt>Résultat cumulé sur 12 mois</dt><dd>${fcfa(r.months[MONTHS - 1].cumulative)}</dd>
      <dt>Trésorerie fin du mois 12</dt><dd>${fcfa(r.months[MONTHS - 1].cash)}</dd>
      <dt>Capital de ${compact(r.capital.low)} récupéré</dt><dd><b>${recoveryText(r.recoveryLow)}</b></dd>
      <dt>Capital de ${compact(r.capital.high)} récupéré</dt><dd><b>${recoveryText(r.recoveryHigh)}</b></dd>
    </dl>`;

  renderCapital(r, name);
  $("[data-pl]").innerHTML = plRows(r);
  $("[data-compare]").innerHTML = compareTable(results);

  // Éditeur : valeurs dérivées.
  state.h.products.forEach((p, i) => {
    const cell = $(`[data-unit-margin="${i}"]`);
    if (cell) cell.textContent = p.price ? `${fcfa(p.price - p.cost)} · ${pct((p.price - p.cost) / p.price)}` : "—";
  });
  $("[data-avg-price]").textContent = fcfa(mix.avgPrice);
  $("[data-avg-cost]").textContent = fcfa(mix.avgCost);
  const mixCell = $("[data-mix-total]");
  mixCell.textContent = `${nf.format(mix.mixTotal)} %${mix.mixTotal !== 100 ? " (ramené à 100 %)" : ""}`;
  mixCell.classList.toggle("warn", mix.mixTotal !== 100);
  $("[data-fixed-total]").textContent = fcfa(r.fixedTotal);
  $("[data-capital-total]").textContent = `${fcfa(r.capital.low)} / ${fcfa(r.capital.high)}`;

  // PARLOR : prix de référence et poids dans le modèle.
  $$("[data-parlor-price]").forEach((n) => (n.innerHTML = `Prix moyen utilisé dans le modèle : <b>${fcfa(state.h.shared.parlorPrice)}</b> <span class="todo">hypothèse</span>`));
  $("[data-parlor-kpi]").innerHTML = `
    <h3>Poids dans le modèle — scénario ${name}</h3>
    <dl class="facts facts-num">
      <dt>Prestations sur 12 mois</dt><dd>${r.annual.parlor.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}</dd>
      <dt>CA commandes événementielles</dt><dd>${fcfa(r.annual.revenue.events)}</dd>
      <dt>Part du CA total</dt><dd>${pct(r.annual.revenue.events / total)}</dd>
      <dt>CA box & plateaux</dt><dd>${fcfa(r.annual.revenue.box + r.annual.revenue.plateaux)}</dd>
    </dl>
    <p class="note">${C.parlor.pricingNote}</p>`;

  // KPI à suivre : objectifs issus du scénario.
  const strategic = r.annual.revenue.box + r.annual.revenue.plateaux + r.annual.revenue.events;
  const target = {
    orders: `${nf.format(r.months[0].orders)} → ${nf.format(r.months[MONTHS - 1].orders)} / mois`,
    basket: fcfa(r.annual.basket),
    ca: `${compact(r.months[0].ca)} → ${compact(r.months[MONTHS - 1].ca)} FCFA`,
    grossMarginRate: `≥ ${pct(r.annual.grossMarginRate)}`,
    rawRate: `≤ ${pct(r.annual.raw / total)}`,
    parlor: `${r.months[0].parlor.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} / mois`,
    cash: `≥ ${fcfa(r.capital.working)} (fonds de roulement)`,
    recovery: `${pct(r.months[MONTHS - 1].recovered)} du capital de ${compact(r.capital.low)} au mois 12`,
    strategic: `${fcfa(strategic)} / an · ${pct(strategic / total)} du CA`,
  };
  $("[data-kpi-list]").innerHTML = C.kpis
    .map((k) => `<article class="card kpi-card"><h3>${k.name}</h3><p>${k.why}</p><p class="target"><span>Objectif</span>${k.model ? target[k.model] : `<span class="todo">${C.TODO}</span>`}</p></article>`)
    .join("");

  renderCharts();
};

/* ---------- Interactions ---------- */

const setPath = (path, value) => {
  const keys = path.split(".");
  let node = state.h;
  keys.slice(0, -1).forEach((k) => (node = node[k]));
  node[keys.at(-1)] = value;
};

const toast = (message) => {
  const node = $(".toast");
  node.textContent = message;
  node.classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("visible"), 3200);
};

const init = () => {
  document.querySelector("#business-plan").innerHTML = shell();
  render();

  let frame;
  document.addEventListener("input", (event) => {
    const input = event.target.closest("[data-path]");
    if (!input) return;
    const value = input.value === "" ? 0 : Number(input.value);
    if (!Number.isFinite(value)) return;
    setPath(input.dataset.path, value);
    saveHypotheses();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  });

  document.addEventListener("click", async (event) => {
    const tab = event.target.closest("[data-scenario]");
    if (tab) {
      state.scenario = tab.dataset.scenario;
      render();
    }
    if (event.target.closest("[data-reset]")) {
      state.h = clone(DEFAULTS);
      saveHypotheses();
      const open = $$("#hypotheses details").map((d) => d.open);
      $("#hypotheses").outerHTML = hypothesesEditor();
      $$("#hypotheses details").forEach((d, i) => (d.open = open[i]));
      render();
      toast("Hypothèses par défaut rétablies.");
    }
    const pdfButton = event.target.closest("[data-pdf]");
    if (pdfButton) {
      $$("[data-pdf]").forEach((b) => (b.disabled = true));
      toast("Préparation du PDF…");
      try {
        const { exportPdf } = await import("./pdf.js");
        await exportPdf({ h: state.h, results: computeAll(state.h), scenario: state.scenario, colors: { SCENARIO_COLORS, STREAM_COLORS } });
        toast("Business Plan PDF téléchargé.");
      } catch (error) {
        console.error(error);
        toast("Le PDF n'a pas pu être généré. Réessayez.");
      } finally {
        $$("[data-pdf]").forEach((b) => (b.disabled = false));
      }
    }
  });

  // Sommaire : section active.
  const links = new Map($$(".bp-nav a").map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        const link = links.get(entry.target.id);
        if (link) {
          link.classList.add("active");
          link.scrollIntoView({ block: "nearest", inline: "center" });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  $$(".bp-section").forEach((s) => spy.observe(s));

  // Apparition discrète au défilement.
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          reveal.unobserve(entry.target);
        }
      }),
    { rootMargin: "0px 0px -8% 0px" },
  );
  $$(".reveal").forEach((n) => reveal.observe(n));

  let width = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    clearTimeout(init.resize);
    init.resize = setTimeout(renderCharts, 150);
  });
};

init();
