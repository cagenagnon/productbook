import "./content-ideas.css";
import { universes } from "./content.js";

const STORAGE_KEY = "lacrepiere-content-ideas-v1";
const allIdeas = universes.flatMap((u) => u.ideas.map((i) => ({ ...i, universe: u })));

const loadChecks = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};
const checks = loadChecks();
const saveChecks = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  } catch {
    /* stockage indisponible : les cases restent locales à la session */
  }
};

/* ---------- Gabarits ---------- */

const bottleIcon = `
  <svg viewBox="0 0 120 160" aria-hidden="true">
    <g transform="rotate(-28 60 80)">
      <rect x="42" y="36" width="36" height="104" rx="10" fill="#d6ecf2" stroke="#5a8291" stroke-width="2"/>
      <rect x="44" y="96" width="32" height="42" rx="8" fill="#6eafcd"/>
      <rect x="50" y="18" width="20" height="22" fill="#d6ecf2" stroke="#5a8291" stroke-width="2"/>
      <rect x="48" y="10" width="24" height="10" rx="3" fill="#bb6645"/>
      <rect x="42" y="62" width="36" height="18" fill="#bb6645"/>
    </g>
    <path d="M14 40 q18 -30 46 -30" fill="none" stroke="#bb6645" stroke-width="2" stroke-dasharray="4 6"/>
  </svg>`;

const shot = (s, i) => `
  <figure class="shot${s.cut ? " shot-cut" : ""}">
    <div class="shot-frame">
      ${s.img ? `<img src="/images/${s.img}" alt="" loading="lazy">` : s.bottle ? bottleIcon : `<span>CUT.</span>`}
      <b>${String(i + 1).padStart(2, "0")}</b>
    </div>
    <figcaption><strong>${s.label}</strong>${s.text}</figcaption>
  </figure>`;

const scriptLine = (l) => `
  <li class="${l.punch ? "punch" : ""}${l.action ? " action" : ""}">
    ${l.q ? `<span class="bubble bubble-q">${l.q}${l.emoji && l.a && l.q ? ` <em>${l.emoji}</em>` : ""}</span>` : ""}
    <span class="${l.action ? "stage" : "bubble bubble-a"}">${l.a}${!l.q && l.emoji ? ` <em>${l.emoji}</em>` : ""}</span>
  </li>`;

const idea = (i, n) => `
  <article class="idea reveal" id="${i.id}">
    <div class="idea-media">
      <div class="phone">
        <video src="/videos/${i.video}.mp4" poster="/videos/${i.video}.jpg" muted loop playsinline preload="none"
          aria-label="Aperçu storyboard : ${i.title} ${i.accent}"></video>
        <a class="phone-btn phone-dl" href="/videos/${i.video}.mp4" download="la-crepiere-${i.video}.mp4"
          aria-label="Télécharger la vidéo" title="Télécharger la vidéo">↓</a>
        <button class="phone-btn phone-sound" type="button" data-play aria-label="Lire / mettre en pause">❚❚</button>
      </div>
      <p class="phone-note">Aperçu animé du storyboard — le vrai tournage se fait sur place.</p>
    </div>

    <div class="idea-body">
      <p class="eyebrow"><span>Vidéo ${String(n).padStart(2, "0")}</span> · ${i.universe.title} ${i.universe.accent}</p>
      <h3>${i.title}<br><i>${i.accent}</i></h3>
      <ul class="tags">${i.tags.map((t) => `<li>${t}</li>`).join("")}</ul>

      <div class="block">
        <h4>💡 Concept</h4>
        <p>${i.concept}</p>
        ${i.place ? `<p class="place"><span>📍 Lieu</span>${i.place}</p>` : ""}
      </div>

      <div class="block">
        <h4>💬 Le script</h4>
        ${i.question ? `<p class="bubble bubble-q bubble-lead">${i.question} <em>🎤</em></p>` : ""}
        <ol class="script">${i.script.map(scriptLine).join("")}</ol>
      </div>

      <div class="block">
        <h4>🎬 Les plans</h4>
        <div class="shots">${i.shots.map(shot).join("")}</div>
      </div>

      <div class="idea-foot">
        <div class="block checklist">
          <h4>✅ Tournage</h4>
          <ul>${i.shoot
            .map((s, k) => {
              const key = `${i.id}-${k}`;
              return `<li><label><input type="checkbox" data-check="${key}" ${checks[key] ? "checked" : ""}><span>${s}</span></label></li>`;
            })
            .join("")}</ul>
        </div>
        <div class="goal">
          <span>🎯 Objectif</span>
          <p>${i.goal}</p>
        </div>
      </div>
      ${i.note ? `<aside class="note"><span>✦</span><p>${i.note}</p></aside>` : ""}
    </div>
  </article>`;

const universe = (u, start) => `
  <section class="universe universe-${u.id}" id="${u.id}" style="--wash:${u.wash}">
    <header class="universe-head reveal">
      <p class="eyebrow">${u.eyebrow}</p>
      <h2>${u.title} <i>${u.accent}</i></h2>
      <p class="lead">${u.intro}</p>
    </header>
    ${u.ideas.map((i, k) => idea({ ...i, universe: u }, start + k + 1)).join("")}
  </section>`;

const hero = () => `
  <section class="hero">
    <span class="wash wash-a"></span><span class="wash wash-b"></span>
    <div class="hero-copy reveal">
      <p class="eyebrow">Carnet privé · <span>Idées de contenu</span></p>
      <h1>Des vidéos qui<br>se tournent<br><i>en 10 minutes.</i></h1>
      <p class="lead">Quatre formats courts pour La Crêpière et le Parlor of Crêpes : simples à filmer, sans scénario à apprendre, pensés pour Reels et TikTok.</p>
      <dl class="hero-stats">
        <div><dt>${allIdeas.length}</dt><dd>idées de vidéos</dd></div>
        <div><dt>2</dt><dd>univers : l'event &amp; la marque</dd></div>
        <div><dt>0</dt><dd>texte à apprendre par cœur</dd></div>
      </dl>
    </div>
    <div class="hero-phones reveal" aria-hidden="true">
      ${allIdeas
        .slice(0, 3)
        .map((i) => `<a class="mini-phone" href="#${i.id}"><img src="/videos/${i.video}.jpg" alt=""></a>`)
        .join("")}
    </div>
  </section>`;

const nav = () => `
  <nav class="topbar">
    <a class="brand" href="#top" aria-label="Haut de page"><img src="/logo/logo crèpière (2).png" alt="La Crêpière Enagnon"></a>
    <div class="topbar-links">
      ${universes.map((u) => `<a href="#${u.id}">${u.title} ${u.accent}</a>`).join("")}
    </div>
    <span class="private-tag">Privé</span>
  </nav>`;

const index = () => `
  <section class="index reveal" aria-label="Sommaire des idées">
    ${allIdeas
      .map(
        (i, k) => `
      <a href="#${i.id}">
        <span>${String(k + 1).padStart(2, "0")}</span>
        <strong>${i.title} <i>${i.accent}</i></strong>
        <small>${i.universe.title} ${i.universe.accent}</small>
      </a>`,
      )
      .join("")}
  </section>`;

let n = 0;
document.getElementById("content-ideas").innerHTML = `
  ${nav()}
  <main id="top">
    ${hero()}
    ${index()}
    ${universes.map((u) => { const html = universe(u, n); n += u.ideas.length; return html; }).join("")}
  </main>
  <footer class="footer">
    <img src="/logo/logo crèpière (2).png" alt="">
    <p>Carnet de tournage — usage interne, lien non partagé.</p>
    <a href="https://www.instagram.com/lacrepiere_eg" target="_blank" rel="noreferrer">@lacrepiere_enagnon ↗</a>
  </footer>`;

/* ---------- Interactions ---------- */

document.addEventListener("change", (e) => {
  const key = e.target.dataset?.check;
  if (!key) return;
  checks[key] = e.target.checked;
  saveChecks();
});

// Les vidéos ne tournent que lorsqu'elles sont visibles.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const paused = new WeakSet();
const setBtn = (video) => {
  const btn = video.parentElement.querySelector("[data-play]");
  btn.textContent = video.paused ? "▶" : "❚❚";
};
const videoObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !paused.has(target) && !reducedMotion) target.play().catch(() => {});
      else target.pause();
    }),
  { threshold: 0.35 },
);
document.querySelectorAll(".phone video").forEach((v) => {
  videoObserver.observe(v);
  v.addEventListener("play", () => setBtn(v));
  v.addEventListener("pause", () => setBtn(v));
  setBtn(v);
});
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-play]");
  if (!btn) return;
  const v = btn.parentElement.querySelector("video");
  if (v.paused) {
    paused.delete(v);
    v.play().catch(() => {});
  } else {
    paused.add(v);
    v.pause();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add("in");
        revealObserver.unobserve(target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
