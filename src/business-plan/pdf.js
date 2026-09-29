// Export du Business Plan en véritable document A4 (texte, tableaux et graphiques vectoriels).
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SCENARIOS, SCENARIO_FIELDS, SHARED_FIELDS, REVENUE_STREAMS, MONTHS } from "./model.js";
import * as C from "./content.js";

const INK = "#2B1B12";
const COCOA = "#824634";
const ORANGE = "#F39200";
const MAGENTA = "#C80666";
const CREAM = "#F7EFE7";
const SAND = "#EFE2D4";
const MUTED = "#6B5A4F";

const W = 210;
const H = 297;
const M = 18; // marge
const CW = W - 2 * M; // largeur utile

// Les polices standard du PDF couvrent le jeu WinAnsi : on remplace les rares signes hors jeu.
export const clean = (text) =>
  String(text)
    .replace(/[   ]/g, " ")
    .replace(/−/g, "-")
    .replace(/≈/g, "env.")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/↓|↗/g, "")
    .replace(/∞/g, "n.d.")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/·/g, "-");

export const money = (v) =>
  Number.isFinite(v) ? `${v < 0 ? "-" : ""}${Math.abs(Math.round(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}` : "n.d.";
const fcfa = (v) => (Number.isFinite(v) ? `${money(v)} FCFA` : "Non atteint");
const pct = (v) => `${(v * 100).toFixed(1).replace(".", ",")} %`;
const compact = (v) => {
  const a = Math.abs(v);
  const s = v < 0 ? "-" : "";
  if (a >= 1e6) return `${s}${(a / 1e6).toFixed(1).replace(".", ",").replace(",0", "")} M`;
  if (a >= 1e3) return `${s}${Math.round(a / 1e3)} k`;
  return `${s}${Math.round(a)}`;
};
const plain = (v) => {
  const [int, dec] = String(v).split(".");
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (dec ? `,${dec}` : "");
};
const monthText = (m) => (m ? `Mois ${m}` : "Au-delà de 12 mois");
const recoveryText = ({ month, estimated }) => (month ? `${estimated ? "env. " : ""}Mois ${month}` : "Non atteint");

const loadImage = async (src) => {
  try {
    const blob = await (await fetch(encodeURI(src))).blob();
    const url = URL.createObjectURL(blob);
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1400 / Math.max(img.width, img.height));
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    const isPng = /\.png$/i.test(src);
    return { data: canvas.toDataURL(isPng ? "image/png" : "image/jpeg", 0.86), format: isPng ? "PNG" : "JPEG", ratio: canvas.width / canvas.height };
  } catch {
    return null;
  }
};

// Image recadrée pour remplir un cadre (object-fit: cover).
const coverImage = (doc, image, x, y, w, h) => {
  if (!image) {
    doc.setFillColor(SAND);
    doc.rect(x, y, w, h, "F");
    return;
  }
  let dw = w;
  let dh = w / image.ratio;
  if (dh < h) {
    dh = h;
    dw = h * image.ratio;
  }
  doc.saveGraphicsState();
  doc.rect(x, y, w, h, null);
  doc.clip();
  doc.discardPath();
  doc.addImage(image.data, image.format, x - (dw - w) / 2, y - (dh - h) / 2, dw, dh);
  doc.restoreGraphicsState();
};

export const exportPdf = async ({ h, results, scenario, colors }) => {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const selected = results[scenario];
  const selectedLabel = SCENARIOS.find((s) => s.key === scenario).label;
  const [logo, coverPhoto, insetPhoto, parlorPhoto] = await Promise.all([
    loadImage("/logo/logo crèpière (2).png"),
    loadImage("/images/event06.jpeg"),
    loadImage("/images/product9.jpeg"),
    loadImage("/images/event05.jpeg"),
  ]);

  let y = M;
  const toc = [];

  /* ---------- Primitives ---------- */
  const text = (value, x, yy, opts) => doc.text(clean(value), x, yy, opts);
  const font = (family, style, size, color = INK) => {
    doc.setFont(family, style);
    doc.setFontSize(size);
    doc.setTextColor(color);
  };
  const newPage = (orientation = "portrait") => {
    doc.addPage("a4", orientation);
    y = 26;
  };
  const pageW = () => doc.internal.pageSize.getWidth();
  const ensure = (needed) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 20) newPage();
  };
  const paragraph = (value, { size = 10, color = INK, width = CW, x = M, gap = 4, style = "normal", lh = 1.45 } = {}) => {
    font("helvetica", style, size, color);
    const lines = doc.splitTextToSize(clean(value), width);
    const lineH = size * 0.3528 * lh;
    lines.forEach((line) => {
      ensure(lineH);
      doc.text(line, x, y);
      y += lineH;
    });
    y += gap;
  };
  const bullets = (items, { x = M, width = CW, size = 9.5, color = ORANGE } = {}) => {
    font("helvetica", "normal", size);
    const totalH = items.reduce((t, item) => t + doc.splitTextToSize(clean(item), width - 6).length * size * 0.3528 * 1.4 + 1, 0);
    if (totalH < 80) ensure(totalH);
    items.forEach((item) => {
      font("helvetica", "normal", size);
      const lines = doc.splitTextToSize(clean(item), width - 6);
      const lineH = size * 0.3528 * 1.4;
      ensure(lines.length * lineH + 1);
      doc.setFillColor(color);
      doc.circle(x + 1.3, y - 1.2, 0.9, "F");
      lines.forEach((line) => {
        doc.text(line, x + 5, y);
        y += lineH;
      });
      y += 1;
    });
    y += 2;
  };
  const section = (id, title, kicker) => {
    newPage();
    toc.push({ title, page: doc.getNumberOfPages() });
    const n = String(toc.length).padStart(2, "0");
    font("helvetica", "bold", 8.5, MAGENTA);
    text(`${n}  ·  ${kicker.toUpperCase()}`, M, y, { charSpace: 0.4 });
    y += 10;
    font("times", "bold", 26, INK);
    const lines = doc.splitTextToSize(clean(title), CW);
    lines.forEach((l) => {
      doc.text(l, M, y);
      y += 10;
    });
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(0.8);
    doc.line(M, y - 3, M + 22, y - 3);
    y += 6;
  };
  const subTitle = (value, { size = 13, color = INK, keep = 30 } = {}) => {
    ensure(keep);
    y += 2;
    font("times", "bold", size, color);
    text(value, M, y);
    y += 6.5;
  };
  const table = (head, body, opts = {}) => {
    // Les tableaux courts ne sont pas coupés : on passe à la page suivante s'ils ne tiennent pas.
    if (body.length <= 14) ensure(body.length * 7.5 + (head ? 8 : 0));
    autoTable(doc, {
      startY: y,
      head: head ? [head.map(clean)] : undefined,
      body: body.map((row) => row.map((c) => (typeof c === "object" && c !== null ? { ...c, content: clean(c.content) } : clean(c)))),
      margin: { left: opts.left ?? M, right: opts.right ?? M, top: 26, bottom: 20 },
      theme: "plain",
      styles: { font: "helvetica", fontSize: 8.8, textColor: INK, cellPadding: { top: 2.2, bottom: 2.2, left: 2.5, right: 2.5 }, lineColor: [230, 218, 206], lineWidth: { bottom: 0.2 }, overflow: "linebreak" },
      headStyles: { fontStyle: "bold", fontSize: 7.8, textColor: COCOA, fillColor: SAND },
      alternateRowStyles: opts.zebra ? { fillColor: [251, 246, 240] } : undefined,
      ...opts.extra,
    });
    y = doc.lastAutoTable.finalY + 7;
  };
  const keyValues = (rows, opts = {}) =>
    table(null, rows, { ...opts, extra: { columnStyles: { 0: { textColor: MUTED, cellWidth: opts.labelWidth ?? 62 }, 1: { halign: opts.alignRight ? "right" : "left", fontStyle: opts.bold ? "bold" : "normal" } }, ...opts.extra } });
  const card = (x, yy, w, hh, { fill = "#FFFBF6", stroke = [230, 218, 206] } = {}) => {
    doc.setFillColor(fill);
    doc.setDrawColor(...(Array.isArray(stroke) ? stroke : [0, 0, 0]));
    doc.setLineWidth(0.25);
    doc.roundedRect(x, yy, w, hh, 3, 3, stroke ? "FD" : "F");
  };
  const textBlockHeight = (value, size, width, lh = 1.4) => {
    font("helvetica", "normal", size);
    return doc.splitTextToSize(clean(value), width).length * size * 0.3528 * lh;
  };
  const cards = (items, { cols = 3, gap = 5, titleSize = 11.5, bodySize = 8.8, accent = ORANGE, fill } = {}) => {
    const w = (CW - gap * (cols - 1)) / cols;
    for (let i = 0; i < items.length; i += cols) {
      const row = items.slice(i, i + cols);
      const heights = row.map((it) => 14 + textBlockHeight(it.title, titleSize, w - 10, 1.2) + textBlockHeight(it.text, bodySize, w - 10) + (it.foot ? 8 : 0));
      const hh = Math.max(...heights);
      ensure(hh + gap);
      row.forEach((it, k) => {
        const x = M + k * (w + gap);
        card(x, y, w, hh, { fill });
        doc.setFillColor(it.color ?? accent);
        doc.roundedRect(x + 5, y + 5, 10, 1.4, 0.7, 0.7, "F");
        let yy = y + 12;
        font("times", "bold", titleSize);
        doc.splitTextToSize(clean(it.title), w - 10).forEach((l) => {
          doc.text(l, x + 5, yy);
          yy += titleSize * 0.3528 * 1.2;
        });
        yy += 1.5;
        font("helvetica", "normal", bodySize, MUTED);
        doc.splitTextToSize(clean(it.text), w - 10).forEach((l) => {
          doc.text(l, x + 5, yy);
          yy += bodySize * 0.3528 * 1.4;
        });
        if (it.foot) {
          font("helvetica", "bold", 8, COCOA);
          text(it.foot, x + 5, y + hh - 5);
        }
      });
      y += hh + gap;
    }
    y += 3;
  };
  const kpiTiles = (tiles, cols = 3) => {
    const gap = 4;
    const w = (CW - gap * (cols - 1)) / cols;
    const hh = 22;
    for (let i = 0; i < tiles.length; i += cols) {
      ensure(hh + gap);
      tiles.slice(i, i + cols).forEach((t, k) => {
        const x = M + k * (w + gap);
        card(x, y, w, hh);
        doc.setFillColor(t.tone === "neg" ? MAGENTA : ORANGE);
        doc.rect(x, y + 3, 1.2, hh - 6, "F");
        font("helvetica", "normal", 7.5, MUTED);
        text(t.label, x + 5, y + 6.5);
        font("helvetica", "bold", 12.5, INK);
        text(t.value, x + 5, y + 13.5);
        if (t.detail) {
          font("helvetica", "normal", 7, MUTED);
          text(doc.splitTextToSize(clean(t.detail), w - 8)[0], x + 5, y + 18.5);
        }
      });
      y += hh + gap;
    }
    y += 3;
  };

  /* ---------- Graphiques vectoriels ---------- */
  const niceTicks = (values) => {
    let min = Math.min(0, ...values);
    let max = Math.max(0, ...values);
    if (min === max) max = min + 1;
    const raw = (max - min) / 4;
    const p = 10 ** Math.floor(Math.log10(raw));
    const u = raw / p;
    const step = (u <= 1 ? 1 : u <= 2 ? 2 : u <= 2.5 ? 2.5 : u <= 5 ? 5 : 10) * p;
    min = Math.floor(min / step) * step;
    max = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = min; v <= max + step / 2; v += step) ticks.push(v);
    return { min, max, ticks };
  };
  const chartFrame = (title, subtitle, series, hh) => {
    ensure(hh + 22);
    font("times", "bold", 12);
    text(title, M, y);
    font("helvetica", "normal", 8, MUTED);
    text(subtitle, M, y + 4.5);
    y += 9;
    if (series.length > 1) {
      let lx = M;
      series.forEach((s) => {
        font("helvetica", "normal", 7.8, INK);
        const itemW = 9 + doc.getTextWidth(clean(s.name));
        if (lx > M && lx + itemW - 4 > M + CW) {
          lx = M;
          y += 4.5;
        }
        doc.setFillColor(s.color);
        doc.roundedRect(lx, y - 2.4, 3, 3, 0.6, 0.6, "F");
        font("helvetica", "normal", 7.8, INK);
        text(s.name, lx + 4.5, y);
        lx += 9 + doc.getTextWidth(clean(s.name));
      });
      y += 5;
    }
  };
  const axes = (x0, y0, w, hh, scale, labels, xAt) => {
    const yAt = (v) => y0 + hh - ((v - scale.min) / (scale.max - scale.min)) * hh;
    scale.ticks.forEach((t) => {
      doc.setDrawColor(t === 0 ? 150 : 228, t === 0 ? 135 : 220, t === 0 ? 125 : 212);
      doc.setLineWidth(t === 0 ? 0.3 : 0.15);
      doc.line(x0, yAt(t), x0 + w, yAt(t));
      font("helvetica", "normal", 6.5, MUTED);
      text(compact(t), x0 - 2, yAt(t) + 1, { align: "right" });
    });
    labels.forEach((l, i) => text(l, xAt(i), y0 + hh + 4.5, { align: "center" }));
    return yAt;
  };
  const lineChart = ({ title, subtitle, labels, series, hh = 58, area = false }) => {
    chartFrame(title, subtitle, series, hh);
    const x0 = M + 14;
    const w = CW - 16;
    const scale = niceTicks(series.flatMap((s) => s.values));
    const step = w / (labels.length - 1);
    const xAt = (i) => x0 + i * step;
    const yAt = axes(x0, y, w, hh, scale, labels, xAt);
    series.forEach((s) => {
      const pts = s.values.map((v, i) => [xAt(i), yAt(v)]);
      if (area) {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.12 }));
        doc.setFillColor(s.color);
        const base = yAt(0);
        const path = [[pts[0][0], base], ...pts, [pts.at(-1)[0], base]];
        doc.lines(path.slice(1).map((p, i) => [p[0] - path[i][0], p[1] - path[i][1]]), path[0][0], path[0][1], [1, 1], "F", true);
        doc.restoreGraphicsState();
      }
      doc.setDrawColor(s.color);
      doc.setLineWidth(0.6);
      doc.setLineJoin("round");
      doc.lines(pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]), pts[0][0], pts[0][1], [1, 1], "S");
      const last = pts.at(-1);
      doc.setFillColor(s.color);
      doc.setDrawColor("#FFFFFF");
      doc.setLineWidth(0.5);
      doc.circle(last[0], last[1], 1.2, "FD");
      font("helvetica", "bold", 6.8, INK);
      text(compact(s.values.at(-1)), last[0] + 2, last[1] + 1);
    });
    y += hh + 12;
  };
  const barChart = ({ title, subtitle, labels, series, hh = 58 }) => {
    chartFrame(title, subtitle, series, hh);
    const x0 = M + 14;
    const w = CW - 16;
    const totals = labels.map((_, i) => series.reduce((t, s) => t + Math.max(0, s.values[i]), 0));
    const negs = labels.map((_, i) => series.reduce((t, s) => t + Math.min(0, s.values[i]), 0));
    const scale = niceTicks([...totals, ...negs]);
    const band = w / labels.length;
    const bw = Math.min(7, band * 0.6);
    const xAt = (i) => x0 + band * i + band / 2;
    const yAt = axes(x0, y, w, hh, scale, labels, xAt);
    labels.forEach((_, i) => {
      let up = 0;
      let down = 0;
      series.forEach((s, k) => {
        const v = s.values[i];
        if (!v) return;
        const from = v > 0 ? up : down;
        const to = from + v;
        if (v > 0) up = to;
        else down = to;
        const top = yAt(Math.max(from, to));
        const bottom = yAt(Math.min(from, to));
        const isEnd = series.slice(k + 1).every((n) => (v > 0 ? n.values[i] <= 0 : n.values[i] >= 0));
        const gap = isEnd ? 0 : 0.5;
        doc.setFillColor(s.color);
        const hgt = Math.max(0.3, bottom - top - gap);
        const yy = v > 0 ? top + gap : top;
        if (isEnd && hgt > 2) {
          const r = 0.9;
          doc.roundedRect(xAt(i) - bw / 2, yy, bw, hgt, r, r, "F");
          // coins carrés côté base
          if (v > 0) doc.rect(xAt(i) - bw / 2, yy + hgt - r, bw, r, "F");
          else doc.rect(xAt(i) - bw / 2, yy, bw, r, "F");
        } else doc.rect(xAt(i) - bw / 2, yy, bw, hgt, "F");
      });
    });
    y += hh + 12;
  };

  /* ---------- Couverture ---------- */
  doc.setFillColor(INK);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(COCOA);
  doc.circle(W + 10, -10, 95, "F");
  doc.setFillColor(ORANGE);
  doc.circle(W - 20, 150, 4, "F");
  coverImage(doc, coverPhoto, 104, 58, 88, 118);
  doc.setDrawColor(CREAM);
  doc.setLineWidth(1.6);
  doc.rect(104, 58, 88, 118, "S");
  if (insetPhoto) {
    doc.saveGraphicsState();
    doc.circle(108, 170, 22, null);
    doc.clip();
    doc.discardPath();
    const iw = insetPhoto.ratio >= 1 ? 44 * insetPhoto.ratio : 44;
    const ih = insetPhoto.ratio >= 1 ? 44 : 44 / insetPhoto.ratio;
    doc.addImage(insetPhoto.data, insetPhoto.format, 108 - iw / 2, 170 - ih / 2, iw, ih);
    doc.restoreGraphicsState();
    doc.setDrawColor(CREAM);
    doc.setLineWidth(1.4);
    doc.circle(108, 170, 22, "S");
  }
  if (logo) {
    doc.setFillColor(CREAM);
    doc.roundedRect(M, 20, 30, 24, 3, 3, "F");
    const lh = Math.min(22, 26 / logo.ratio);
    const lw = lh * logo.ratio;
    doc.addImage(logo.data, logo.format, M + 15 - lw / 2, 32 - lh / 2, lw, lh);
  }
  font("helvetica", "bold", 9, ORANGE);
  text(`BUSINESS PLAN ${C.company.year}`, M, 70, { charSpace: 0.8 });
  font("times", "bold", 38, CREAM);
  text("La Crêpière", M, 88);
  text("Enagnon", M, 102);
  font("times", "italic", 17, ORANGE);
  text("Plus qu'une crêpe,", M, 118);
  text("une marque gourmande.", M, 126);
  font("helvetica", "normal", 9.5, CREAM);
  doc.splitTextToSize(clean(C.company.tagline + ". Capital initial, sources de revenus, projections financières sur 12 mois et récupération du capital."), 76).forEach((l, i) => doc.text(l, M, 140 + i * 5));
  doc.setDrawColor(ORANGE);
  doc.setLineWidth(0.8);
  doc.line(M, 205, M + 30, 205);
  font("helvetica", "normal", 9, CREAM);
  text("Cotonou, Bénin", M, 214);
  font("helvetica", "bold", 9, ORANGE);
  doc.textWithLink("lacrepiere.netlify.app", M, 232, { url: C.company.website });
  font("helvetica", "normal", 9, CREAM);
  text(`Édité le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`, M, 220);
  text(`Scénario de référence : ${selectedLabel}`, M, 226);
  font("helvetica", "normal", 7.5, "#BFA999");
  doc.splitTextToSize(clean("Document de travail. Les projections financières reposent sur des hypothèses explicites (prix, volumes, coûts) et ne constituent pas des données réelles. Elles sont à actualiser avec les chiffres effectifs de l'activité."), CW).forEach((l, i) => doc.text(l, M, 270 + i * 3.8));

  /* ---------- Sommaire (rempli à la fin) ---------- */
  newPage();
  const tocPage = doc.getNumberOfPages();

  /* ---------- 1. Présentation ---------- */
  section("presentation", "Présentation de l'entreprise", "Qui sommes-nous");
  paragraph(C.summary, { size: 10.5 });
  subTitle("Fiche d'identité");
  keyValues(C.company.identity);
  subTitle("Vision, mission et positionnement");
  cards(C.vision.map((v) => ({ title: v.label, text: v.text })), { cols: 3 });
  subTitle("Nos valeurs");
  paragraph(C.values.join("  -  "), { color: COCOA, style: "bold" });

  /* ---------- 2. Offre & cibles ---------- */
  section("offre", "Produits, services et clientèles", "Notre offre");
  table(["Ligne d'offre", "Description", "Rôle"], C.offer.map((o) => [o.title, o.text, o.tag]), { zebra: true, extra: { columnStyles: { 0: { fontStyle: "bold", cellWidth: 44 }, 2: { cellWidth: 34, textColor: COCOA } } } });
  subTitle("Clientèles cibles");
  table(["Segment", "Profil", "Attentes"], C.targets.map((t) => [t.title, t.text, t.need]), { zebra: true, extra: { columnStyles: { 0: { fontStyle: "bold", cellWidth: 44 }, 2: { cellWidth: 44 } } } });

  /* ---------- 3. Marché ---------- */
  section("marche", "Analyse du marché et opportunités", "Le marché");
  subTitle("Contexte");
  bullets(C.market.context);
  subTitle("Opportunités");
  bullets(C.market.opportunities, { color: MAGENTA });
  subTitle("Paysage concurrentiel");
  table(["Acteur", "Forces", "Limites / notre différence"], C.market.competitors, { zebra: true, extra: { columnStyles: { 0: { fontStyle: "bold", cellWidth: 44 } } } });
  if (C.showMarketData) {
    subTitle("Données de marché");
    keyValues(C.market.data, { labelWidth: 90 });
  }

  /* ---------- 4. Valeur & modèle économique ---------- */
  section("valeur", "Proposition de valeur et modèle économique", "Notre modèle");
  cards(C.valueProposition.map(([t, d]) => ({ title: t, text: d })), { cols: 3, titleSize: 10.5 });
  subTitle("Business Model Canvas");
  {
    const gap = 2;
    const colW = (CW - gap * 4) / 5;
    const topH = 78;
    const half = (topH - gap) / 2;
    const botH = 36;
    ensure(topH + botH + gap + 4);
    const block = (key, x, yy, w, hh, fill = "#FFFBF6", dark = false) => {
      const b = C.canvas.find((c) => c.key === key);
      card(x, yy, w, hh, { fill });
      font("helvetica", "bold", 6.5, dark ? ORANGE : COCOA);
      const titleLines = doc.splitTextToSize(clean(b.title.toUpperCase()), w - 6);
      titleLines.forEach((l, k) => doc.text(l, x + 3, yy + 5 + k * 3));
      let ly = yy + 8 + titleLines.length * 3;
      b.items.forEach((item) => {
        font("helvetica", "normal", 7, dark ? CREAM : INK);
        const lines = doc.splitTextToSize(clean(item), w - 8);
        if (ly + lines.length * 3.1 > yy + hh - 1) return;
        doc.setFillColor(dark ? ORANGE : ORANGE);
        doc.circle(x + 3.8, ly - 1, 0.6, "F");
        lines.forEach((l) => {
          doc.text(l, x + 6, ly);
          ly += 3.1;
        });
        ly += 0.8;
      });
    };
    const x = (i) => M + i * (colW + gap);
    block("partners", x(0), y, colW, topH);
    block("activities", x(1), y, colW, half);
    block("resources", x(1), y + half + gap, colW, half);
    block("value", x(2), y, colW, topH, INK, true);
    block("relations", x(3), y, colW, half);
    block("channels", x(3), y + half + gap, colW, half);
    block("segments", x(4), y, colW, topH);
    block("costs", M, y + topH + gap, (CW - gap) / 2, botH, SAND);
    block("revenues", M + (CW + gap) / 2, y + topH + gap, (CW - gap) / 2, botH, "#FFF1DC");
    y += topH + botH + gap + 8;
  }

  /* ---------- Capital & revenus ---------- */
  section("capital", "Capital et revenus", "Investissement");
  paragraph(C.capital.intro, { size: 10.5 });
  const cap = selected.capital;
  subTitle(`Capital initial : ${compact(cap.low)} à ${compact(cap.high)} FCFA`);
  table(
    ["Poste", "Version basse", "Version haute"],
    [
      ...h.investments.map((i) => [i.name, fcfa(i.value), fcfa(i.high ?? i.value)]),
      [{ content: "Capital initial (apport unique)", styles: { fontStyle: "bold" } }, { content: fcfa(cap.low), styles: { fontStyle: "bold" } }, { content: fcfa(cap.high), styles: { fontStyle: "bold" } }],
    ],
    { zebra: true, extra: { columnStyles: { 1: { halign: "right", cellWidth: 36 }, 2: { halign: "right", cellWidth: 36 } } } },
  );
  subTitle("Ce que finance le capital", { keep: 36 });
  bullets(C.capital.uses);
  subTitle("La logique de rentabilité", { keep: 30 });
  paragraph(C.capital.chain.join("  ->  "), { size: 9.5, style: "bold", color: COCOA });
  subTitle(`Six sources de revenus - scénario ${selectedLabel}`, { keep: 70 });
  {
    const total = selected.annual.ca || 1;
    const rev = selected.annual.revenue;
    cards(
      C.capital.streams.map((st) => ({
        title: st.title,
        text: st.text,
        foot: `${fcfa(rev[st.key])} / an - ${pct(rev[st.key] / total)} du CA`,
        color: colors.STREAM_COLORS[st.key],
      })),
      { cols: 3, titleSize: 10.5 },
    );
    subTitle(`Répartition du chiffre d'affaires annuel - scénario ${selectedLabel}`, { keep: 70 });
    let bx = M;
    REVENUE_STREAMS.forEach((st) => {
      const w = (rev[st.key] / total) * CW;
      if (w <= 0) return;
      doc.setFillColor(colors.STREAM_COLORS[st.key]);
      doc.rect(bx, y, Math.max(0, w - 0.6), 6, "F");
      bx += w;
    });
    y += 11;
    const strategic = rev.box + rev.plateaux + rev.events;
    table(
      ["Source de revenus", "CA annuel", "Part"],
      [
        ...REVENUE_STREAMS.map((st) => [st.label, fcfa(rev[st.key]), pct(rev[st.key] / total)]),
        [{ content: "Dont box, plateaux & événements", styles: { fontStyle: "bold" } }, { content: fcfa(strategic), styles: { fontStyle: "bold" } }, { content: pct(strategic / total), styles: { fontStyle: "bold" } }],
      ],
      {
        extra: {
          columnStyles: { 1: { halign: "right" }, 2: { halign: "right", cellWidth: 24 } },
          didDrawCell: (data) => {
            const st = REVENUE_STREAMS[data.row.index];
            if (data.section === "body" && data.column.index === 0 && st) {
              doc.setFillColor(colors.STREAM_COLORS[st.key]);
              doc.rect(data.cell.x, data.cell.y + 2, 1.2, data.cell.height - 4, "F");
            }
          },
        },
      },
    );
    paragraph(C.capital.boxNote, { size: 8.5, color: MUTED });
  }
  subTitle(`Récupération de l'investissement - scénario ${selectedLabel}`);
  paragraph(C.capital.recoveryText, { size: 9.5, color: MUTED });
  {
    const low = selected.recoveryLow;
    const high = selected.recoveryHigh;
    kpiTiles([
      { label: "Résultat cumulé sur 12 mois", value: fcfa(selected.months[MONTHS - 1].cumulative), detail: `${pct(selected.annual.resultRate)} du CA`, tone: selected.annual.result < 0 ? "neg" : "" },
      { label: `Capital de ${compact(cap.low)} récupéré`, value: recoveryText(low), detail: low.estimated ? "Estimation au-delà de 12 mois" : "D'après les projections", tone: low.month ? "" : "neg" },
      { label: `Capital de ${compact(cap.high)} récupéré`, value: recoveryText(high), detail: high.estimated ? "Estimation au-delà de 12 mois" : "D'après les projections", tone: high.month ? "" : "neg" },
    ]);
    const quarters = [3, 6, 9, 12].map((m) => selected.months[m - 1]);
    const upTo = (m, key) => selected.months.slice(0, m.month).reduce((t, x) => t + x[key], 0);
    table(
      ["Cumul à fin de", ...quarters.map((m) => `Mois ${m.month}`)],
      [
        ["Chiffre d'affaires", ...quarters.map((m) => money(upTo(m, "ca")))],
        ["Charges (variables + fixes)", ...quarters.map((m) => money(upTo(m, "charges")))],
        [{ content: "Résultat cumulé", styles: { fontStyle: "bold" } }, ...quarters.map((m) => ({ content: money(m.cumulative), styles: { fontStyle: "bold" } }))],
        [`Capital récupéré (${compact(cap.low)})`, ...quarters.map((m) => pct(m.recovered))],
        [`Capital récupéré (${compact(cap.high)})`, ...quarters.map((m) => pct(m.recoveredHigh))],
      ],
      { zebra: true, extra: { columnStyles: { 0: { cellWidth: 58 }, 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } }, headStyles: { halign: "right", fontStyle: "bold", fontSize: 7.8, textColor: COCOA, fillColor: SAND } } },
    );
    table(
      ["", ...SCENARIOS.map((sc) => sc.label)],
      [
        [`Capital de ${compact(cap.low)} récupéré`, ...SCENARIOS.map((sc) => recoveryText(results[sc.key].recoveryLow))],
        [`Capital de ${compact(cap.high)} récupéré`, ...SCENARIOS.map((sc) => recoveryText(results[sc.key].recoveryHigh))],
      ],
      { extra: { columnStyles: { 0: { cellWidth: 58, textColor: MUTED }, 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } }, headStyles: { halign: "right", fontStyle: "bold", fontSize: 7.8, textColor: COCOA, fillColor: SAND } } },
    );
    paragraph(C.capital.recoveryNote, { size: 8.5, color: MUTED });
  }
  subTitle("Croissance sur plusieurs années");
  cards(
    C.capital.years.map((yr, i) => ({
      title: `${yr.period} - ${yr.title}`,
      text: yr.text,
      foot: [`CA ${compact(selected.annual.ca)} - résultat ${compact(selected.annual.result)}`, `Départ : ${compact(selected.runRate)} / an (rythme M12)`, "Bénéfices réinvestis"][i],
      color: i === 2 ? MAGENTA : ORANGE,
    })),
    { cols: 3, titleSize: 10.5 },
  );
  paragraph(C.capital.yearsNote, { size: 8.5, color: MUTED });

  /* ---------- 5. Stratégie & organisation ---------- */
  section("strategie", "Stratégie commerciale et marketing", "Stratégie");
  cards(C.marketing.map((m) => ({ title: m.title, text: m.text })), { cols: 3, titleSize: 10.5 });
  subTitle("Politique commerciale");
  keyValues(C.commercial, { labelWidth: 42 });
  subTitle("Organisation et fonctionnement");
  {
    const steps = C.organisation.flow;
    const gap = 3;
    const w = (CW - gap * (steps.length - 1)) / steps.length;
    const hh = 34;
    ensure(hh + 6);
    steps.forEach(([t, d], i) => {
      const x = M + i * (w + gap);
      card(x, y, w, hh);
      doc.setFillColor(ORANGE);
      doc.circle(x + 6, y + 6.5, 3.3, "F");
      font("helvetica", "bold", 8, INK);
      text(String(i + 1), x + 6, y + 7.6, { align: "center" });
      font("times", "bold", 9.5);
      text(t, x + 11, y + 7.8);
      font("helvetica", "normal", 7, MUTED);
      doc.splitTextToSize(clean(d), w - 6).slice(0, 6).forEach((l, k) => doc.text(l, x + 3, y + 15 + k * 3.1));
    });
    y += hh + 7;
  }
  table(["Rôle clé", "Responsabilités"], C.organisation.roles, { zebra: true, extra: { columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 } } } });
  subTitle("Qualité et opérations");
  bullets(C.organisation.quality);

  /* ---------- 6. PARLOR OF CRÊPES ---------- */
  section("parlor", "PARLOR OF CRÊPES et stratégie événementielle", "Événementiel");
  if (parlorPhoto) {
    ensure(44);
    coverImage(doc, parlorPhoto, M, y, CW, 38);
    y += 44;
  }
  paragraph(C.parlor.pitch, { size: 10.5 });
  subTitle("Formules proposées");
  cards(C.parlor.formulas.map((f) => ({ title: f.name, text: `${f.for}. ${f.content}` })), { cols: 3, accent: MAGENTA });
  paragraph(`${C.parlor.pricingNote} Prix moyen retenu (hypothèse) : ${fcfa(h.shared.parlorPrice)} par prestation.`, { size: 8.5, color: MUTED });
  subTitle("Stratégie de développement");
  bullets(C.parlor.strategy, { color: MAGENTA });
  subTitle(`Poids dans le modèle - scénario ${selectedLabel}`);
  keyValues(
    [
      ["Prestations sur 12 mois", plain(Math.round(selected.annual.parlor * 10) / 10)],
      ["CA commandes événementielles", fcfa(selected.annual.revenue.events)],
      ["Part du CA total", pct(selected.annual.revenue.events / (selected.annual.ca || 1))],
      ["CA box & plateaux", fcfa(selected.annual.revenue.box + selected.annual.revenue.plateaux)],
    ],
    { alignRight: true, labelWidth: 90 },
  );

  /* ---------- 7. Projections financières ---------- */
  section("finances", "Projections financières sur 12 mois", "Finances");
  paragraph(
    `Trois scénarios (Prudent, Réaliste, Croissance) sont construits à partir d'hypothèses explicites, détaillées en fin de chapitre. Le scénario de référence de ce document est le scénario ${selectedLabel}. Montants en FCFA, hors taxes ; le résultat est estimé avant impôts et amortissements.`,
    { size: 9.5, color: MUTED },
  );
  kpiTiles([
    { label: "Chiffre d'affaires annuel", value: fcfa(selected.annual.ca), detail: `Mois 1 : ${compact(selected.months[0].ca)} -> mois 12 : ${compact(selected.months[MONTHS - 1].ca)}` },
    { label: "Charges annuelles", value: fcfa(selected.annual.charges), detail: `Variables ${compact(selected.annual.variable)} - fixes ${compact(selected.annual.fixed)}` },
    { label: "Résultat estimé (12 mois)", value: fcfa(selected.annual.result), detail: `${pct(selected.annual.resultRate)} du CA`, tone: selected.annual.result < 0 ? "neg" : "" },
    { label: "Marge brute", value: pct(selected.annual.grossMarginRate), detail: fcfa(selected.annual.grossMargin) },
    { label: "Seuil de rentabilité mensuel", value: fcfa(selected.breakEvenCa), detail: Number.isFinite(selected.breakEvenOrders) ? `env. ${money(selected.breakEvenOrders)} commandes en ligne / mois` : "" },
    { label: "Capital récupéré", value: `${recoveryText(selected.recoveryLow)} -> ${recoveryText(selected.recoveryHigh).toLowerCase()}`, detail: `Capital de ${compact(selected.capital.low)} -> ${compact(selected.capital.high)}`, tone: selected.recoveryLow.month ? "" : "neg" },
  ]);
  const labels = Array.from({ length: MONTHS }, (_, i) => `M${i + 1}`);
  lineChart({
    title: "Chiffre d'affaires mensuel - trois scénarios",
    subtitle: "En FCFA",
    labels,
    series: SCENARIOS.map((s) => ({ name: s.label, color: colors.SCENARIO_COLORS[s.key], values: results[s.key].months.map((m) => m.ca) })),
  });
  barChart({
    title: `Composition du chiffre d'affaires - scénario ${selectedLabel}`,
    subtitle: "En FCFA, par source de revenus",
    labels,
    series: REVENUE_STREAMS.map((s) => ({ name: s.label, color: colors.STREAM_COLORS[s.key], values: selected.months.map((m) => m.revenue[s.key]) })),
  });
  barChart({
    title: `Résultat mensuel estimé - scénario ${selectedLabel}`,
    subtitle: "En FCFA, après coûts variables et charges fixes",
    labels,
    series: [{ name: "Résultat", color: colors.SCENARIO_COLORS[scenario], values: selected.months.map((m) => m.result) }],
    hh: 48,
  });
  lineChart({
    title: `Trésorerie en fin de mois - scénario ${selectedLabel}`,
    subtitle: `En FCFA : fonds de roulement ${fcfa(selected.capital.working)} + résultats cumulés`,
    labels,
    series: [{ name: "Trésorerie", color: colors.SCENARIO_COLORS[scenario], values: selected.months.map((m) => m.cash) }],
    hh: 48,
    area: true,
  });

  subTitle("Comparaison des scénarios sur 12 mois");
  const cmp = [
    ["Chiffre d'affaires annuel", (r) => fcfa(r.annual.ca)],
    ["CA mensuel moyen", (r) => fcfa(r.annual.ca / MONTHS)],
    ["Commandes en ligne", (r) => money(r.annual.orders)],
    ["Coûts variables", (r) => fcfa(r.annual.variable)],
    ["Charges fixes", (r) => fcfa(r.annual.fixed)],
    ["Marge brute", (r) => `${fcfa(r.annual.grossMargin)} (${pct(r.annual.grossMarginRate)})`],
    ["Résultat estimé", (r) => fcfa(r.annual.result)],
    ["Seuil de rentabilité / mois", (r) => fcfa(r.breakEvenCa)],
    ["Premier mois bénéficiaire", (r) => monthText(r.firstProfitableMonth)],
    ["Box, plateaux & événements", (r) => fcfa(r.annual.revenue.box + r.annual.revenue.plateaux + r.annual.revenue.events)],
    [`Capital de ${compact(selected.capital.low)} récupéré`, (r) => recoveryText(r.recoveryLow)],
    [`Capital de ${compact(selected.capital.high)} récupéré`, (r) => recoveryText(r.recoveryHigh)],
    ["Trésorerie fin du mois 12", (r) => fcfa(r.months[MONTHS - 1].cash)],
  ];
  table(["", ...SCENARIOS.map((s) => s.label)], cmp.map(([l, fn]) => [l, ...SCENARIOS.map((s) => fn(results[s.key]))]), {
    zebra: true,
    extra: { columnStyles: { 0: { cellWidth: 48, textColor: MUTED }, 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } }, headStyles: { halign: "right", fontStyle: "bold", fontSize: 7.8, textColor: COCOA, fillColor: SAND } },
  });

  subTitle("Seuil de rentabilité, capital et trésorerie");
  keyValues(
    [
      ["Prix moyen d'un article", fcfa(selected.avgPrice)],
      ["Coût matière moyen d'un article", fcfa(selected.avgCost)],
      ["Panier moyen en ligne", fcfa(selected.annual.basket)],
      ["Contribution nette d'une commande", fcfa(selected.orderContribution)],
      ["Charges fixes mensuelles", fcfa(selected.fixedTotal)],
      ["Taux de marge sur coûts variables", pct(selected.annual.contributionRate)],
      ["CA mensuel d'équilibre", fcfa(selected.breakEvenCa)],
      ["Capital initial (apport unique)", `${fcfa(selected.capital.low)} -> ${fcfa(selected.capital.high)}`],
      ["Dont dépenses de lancement (version basse)", fcfa(selected.capital.spent)],
      ["Dont fonds de roulement (version basse)", fcfa(selected.capital.working)],
      ["Résultat cumulé sur 12 mois", fcfa(selected.months[MONTHS - 1].cumulative)],
      ["Trésorerie fin du mois 12", fcfa(selected.months[MONTHS - 1].cash)],
    ],
    { alignRight: true, labelWidth: 100 },
  );

  // Compte de résultat en format paysage.
  newPage("landscape");
  font("helvetica", "bold", 8.5, MAGENTA);
  text("FINANCES", M, y, { charSpace: 0.4 });
  y += 8;
  font("times", "bold", 18);
  text(`Compte de résultat prévisionnel - scénario ${selectedLabel}`, M, y);
  y += 5;
  font("helvetica", "normal", 8, MUTED);
  text("Montants en FCFA, hors taxes. Résultat avant impôts et amortissements.", M, y + 1);
  y += 6;
  const r = selected;
  const row = (label, pick, total, style) => [{ content: label, styles: style }, ...r.months.map((m) => ({ content: money(pick(m)), styles: style })), { content: total === null ? "-" : money(total), styles: { ...style, fontStyle: "bold" } }];
  const sectionRow = (label) => [{ content: label.toUpperCase(), colSpan: MONTHS + 2, styles: { fontStyle: "bold", textColor: COCOA, fontSize: 6.8, fillColor: SAND } }];
  const strong = { fontStyle: "bold" };
  const totalStyle = { fontStyle: "bold", fillColor: "#FFF1DC" };
  table(
    ["", ...labels, "Total"],
    [
      row("Commandes en ligne", (m) => m.orders, r.annual.orders),
      row("Articles vendus", (m) => m.items, r.annual.items),
      row("Panier moyen en ligne", (m) => m.basket, r.annual.basket),
      row("Box & plateaux vendus", (m) => m.platters, r.annual.platters),
      sectionRow("Chiffre d'affaires"),
      ...REVENUE_STREAMS.map((s) => row(s.label, (m) => m.revenue[s.key], r.annual.revenue[s.key])),
      row("Chiffre d'affaires total", (m) => m.ca, r.annual.ca, strong),
      sectionRow("Coûts variables"),
      row("Matières premières", (m) => -m.raw, -r.annual.raw),
      row("Emballages", (m) => -m.packaging, -r.annual.packaging),
      row("Marge brute", (m) => m.grossMargin, r.annual.grossMargin, strong),
      row("Livraison", (m) => -m.delivery, -r.annual.delivery),
      row("Commissions de paiement", (m) => -m.paymentFees, -r.annual.paymentFees),
      row("Marge sur coûts variables", (m) => m.contributionMargin, r.annual.contributionMargin, strong),
      sectionRow("Charges fixes"),
      row("Marketing", (m) => -m.marketing, -r.annual.marketing),
      row("Autres charges fixes", (m) => -m.otherFixed, -r.annual.otherFixed),
      row("Résultat estimé", (m) => m.result, r.annual.result, totalStyle),
      row("Résultat cumulé", (m) => m.cumulative, null, strong),
      sectionRow("Capital initial"),
      [{ content: `Capital récupéré (${compact(r.capital.low)})` }, ...r.months.map((m) => ({ content: pct(m.recovered) })), { content: "-" }],
      [{ content: `Capital récupéré (${compact(r.capital.high)})` }, ...r.months.map((m) => ({ content: pct(m.recoveredHigh) })), { content: "-" }],
      row("Trésorerie fin de mois", (m) => m.cash, null),
    ],
    {
      extra: {
        styles: { font: "helvetica", fontSize: 6.4, textColor: INK, cellPadding: { top: 1.05, bottom: 1.05, left: 1.2, right: 1.2 }, lineColor: [230, 218, 206], lineWidth: { bottom: 0.15 }, halign: "right" },
        headStyles: { fontStyle: "bold", fontSize: 6.6, textColor: COCOA, fillColor: SAND, halign: "right" },
        columnStyles: { 0: { halign: "left", cellWidth: 38 } },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index > 0 && String(data.cell.raw?.content ?? "").startsWith("-") && data.cell.raw.content !== "-") data.cell.styles.textColor = MAGENTA;
        },
      },
    },
  );

  // Hypothèses.
  newPage();
  font("helvetica", "bold", 8.5, MAGENTA);
  text("FINANCES", M, y, { charSpace: 0.4 });
  y += 9;
  font("times", "bold", 20);
  text("Hypothèses du modèle financier", M, y);
  y += 7;
  paragraph("Toutes les valeurs ci-dessous sont des hypothèses de travail et non des données réelles. Elles sont modifiables dans la version en ligne du business plan et doivent être remplacées par les chiffres effectifs dès qu'ils sont connus.", { size: 8.8, color: MUTED });
  subTitle("Hypothèses par scénario", { size: 11 });
  table(["Hypothèse", ...SCENARIOS.map((s) => s.label)], SCENARIO_FIELDS.map((f) => [`${f.label} (${f.unit})`, ...SCENARIOS.map((s) => plain(h.scenarios[s.key][f.key]))]), {
    zebra: true,
    extra: { columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } } },
  });
  subTitle("Grille de prix et mix de ventes", { size: 11 });
  table(
    ["Produit", "Prix de vente", "Coût matière", "Mix", "Marge unitaire"],
    [
      ...h.products.map((p) => [p.name, fcfa(p.price), fcfa(p.cost), `${p.mix} %`, p.price ? `${fcfa(p.price - p.cost)} (${pct((p.price - p.cost) / p.price)})` : "-"]),
      [{ content: "Moyenne pondérée", styles: { fontStyle: "bold" } }, { content: fcfa(selected.avgPrice), styles: { fontStyle: "bold" } }, { content: fcfa(selected.avgCost), styles: { fontStyle: "bold" } }, "", ""],
    ],
    { zebra: true, extra: { columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } } } },
  );
  subTitle("Hypothèses communes", { size: 11, keep: SHARED_FIELDS.length * 7.5 + 12 });
  keyValues(SHARED_FIELDS.map((f) => [f.label, `${plain(h.shared[f.key])} ${f.unit}`]), { alignRight: true, labelWidth: 100 });
  subTitle("Charges fixes mensuelles", { size: 11 });
  keyValues([...h.fixed.map((f) => [f.name, fcfa(f.value)]), [{ content: "Total", styles: { fontStyle: "bold", textColor: INK } }, { content: fcfa(selected.fixedTotal), styles: { fontStyle: "bold" } }]], { alignRight: true, labelWidth: 100 });
  subTitle("Capital initial (version basse / haute)", { size: 11 });
  keyValues(
    [...h.investments.map((f) => [f.name, `${fcfa(f.value)} / ${fcfa(f.high ?? f.value)}`]), ["Capital initial (bas / haut)", `${fcfa(selected.capital.low)} / ${fcfa(selected.capital.high)}`]],
    { alignRight: true, labelWidth: 100 },
  );
  subTitle("Méthode de calcul", { size: 11 });
  bullets([
    "Ventes en ligne = commandes x articles par commande x prix moyen pondéré, réparties entre crêpes et boissons & accompagnements selon la grille de prix.",
    "Box & plateaux = unités x prix moyen, répartis selon la part des box.",
    "Les volumes (commandes, plateaux, B2B) progressent chaque mois du taux de croissance du scénario ; les prestations PARLOR sont une moyenne mensuelle.",
    "Marge brute = CA - matières premières - emballages.",
    "Résultat estimé = CA - coûts variables (matières, emballages, livraison, commissions) - charges fixes, avant impôts et amortissements.",
    "Seuil de rentabilité = charges fixes / taux de marge sur coûts variables.",
    "Le capital initial est un apport unique : il n'entre pas dans les charges annuelles. Trésorerie = fonds de roulement + résultats cumulés.",
    "Capital récupéré = résultat cumulé / capital initial. Au-delà de 12 mois, le délai prolonge le résultat du mois 12 sans croissance.",
  ], { size: 8.5 });

  /* ---------- 8. Roadmap ---------- */
  section("roadmap", "Roadmap de développement", "Feuille de route");
  C.roadmap.forEach((step, i) => {
    const hh = 12 + step.items.length * 5.2;
    ensure(hh + 4);
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(0.5);
    if (i < C.roadmap.length - 1) doc.line(M + 4, y + 4, M + 4, y + hh + 4);
    doc.setFillColor(i === C.roadmap.length - 1 ? MAGENTA : ORANGE);
    doc.circle(M + 4, y + 3, 2.6, "F");
    font("helvetica", "bold", 8, MAGENTA);
    text(step.period.toUpperCase(), M + 12, y + 1.5);
    font("times", "bold", 15);
    text(step.title, M + 12, y + 8);
    y += 13;
    bullets(step.items, { x: M + 12, width: CW - 12, size: 9 });
    y += 1;
  });

  /* ---------- 9. Risques ---------- */
  section("risques", "Risques et opportunités", "Analyse");
  {
    const gap = 3;
    const w = (CW - gap) / 2;
    const quads = [
      ["Forces", C.swot.strengths, "#FFF1DC", INK],
      ["Faiblesses", C.swot.weaknesses, SAND, INK],
      ["Opportunités", C.swot.opportunities, INK, CREAM],
      ["Menaces", C.swot.threats, "#F9DBE8", INK],
    ];
    const hh = 38;
    ensure(hh * 2 + gap + 6);
    quads.forEach(([title, items, fill, color], i) => {
      const x = M + (i % 2) * (w + gap);
      const yy = y + Math.floor(i / 2) * (hh + gap);
      card(x, yy, w, hh, { fill, stroke: null });
      font("helvetica", "bold", 8, color === CREAM ? ORANGE : COCOA);
      text(title.toUpperCase(), x + 5, yy + 7, { charSpace: 0.3 });
      items.forEach((it, k) => {
        font("helvetica", "normal", 8.6, color);
        text(`-  ${it}`, x + 5, yy + 14 + k * 5.2);
      });
    });
    y += hh * 2 + gap + 8;
  }
  subTitle("Principaux risques et réponses");
  table(["Risque", "Impact", "Réponse prévue"], C.risks, {
    zebra: true,
    extra: {
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 52 }, 1: { cellWidth: 20 } },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 1) data.cell.styles.textColor = data.cell.raw === "Élevé" ? MAGENTA : COCOA;
      },
    },
  });

  /* ---------- 10. KPI ---------- */
  section("kpi", "KPI à suivre", "Pilotage");
  paragraph(`Objectifs issus du scénario ${selectedLabel} : ce sont des repères à comparer chaque mois aux résultats réels.`, { size: 9.5, color: MUTED });
  const total = selected.annual.ca || 1;
  const targets = {
    orders: `${money(selected.months[0].orders)} -> ${money(selected.months[MONTHS - 1].orders)} / mois`,
    basket: fcfa(selected.annual.basket),
    ca: `${compact(selected.months[0].ca)} -> ${compact(selected.months[MONTHS - 1].ca)} FCFA / mois`,
    grossMarginRate: `>= ${pct(selected.annual.grossMarginRate)}`,
    rawRate: `<= ${pct(selected.annual.raw / total)}`,
    parlor: `${plain(selected.months[0].parlor)} / mois`,
    cash: `>= ${fcfa(selected.capital.working)} (fonds de roulement)`,
    recovery: `${pct(selected.months[MONTHS - 1].recovered)} du capital de ${compact(selected.capital.low)} au mois 12`,
    strategic: `${compact(selected.annual.revenue.box + selected.annual.revenue.plateaux + selected.annual.revenue.events)} FCFA / an`,
  };
  table(["Indicateur", "Pourquoi le suivre", "Objectif"], C.kpis.map((k) => [k.name, k.why, k.model ? targets[k.model] : C.TODO]), {
    zebra: true,
    extra: { columnStyles: { 0: { fontStyle: "bold", cellWidth: 52 }, 2: { cellWidth: 52, halign: "right" } } },
  });

  /* ---------- 11. Conclusion ---------- */
  section("conclusion", "Conclusion", "Perspectives");
  paragraph(C.conclusion, { size: 11, lh: 1.55 });
  y += 4;
  card(M, y, CW, 50, { fill: INK, stroke: null });
  font("helvetica", "bold", 8, ORANGE);
  text("COORDONNÉES", M + 8, y + 10, { charSpace: 0.4 });
  C.company.contacts.forEach(([k, v, url], i) => {
    const cx = M + 8 + (i % 2) * (CW / 2);
    const cy = y + 20 + Math.floor(i / 2) * 10;
    font("helvetica", "normal", 7.5, "#BFA999");
    text(k, cx, cy);
    font("helvetica", "bold", 10, url ? ORANGE : CREAM);
    if (url) doc.textWithLink(clean(v), cx, cy + 4.5, { url });
    else text(v, cx, cy + 4.5);
  });
  y += 58;
  font("times", "italic", 13, COCOA);
  text("« Une crêpe réussie doit pouvoir se retourner d'un seul geste du poignet. »", W / 2, y + 6, { align: "center" });

  /* ---------- Sommaire ---------- */
  doc.setPage(tocPage);
  y = 30;
  font("helvetica", "bold", 8.5, MAGENTA);
  text("BUSINESS PLAN", M, y, { charSpace: 0.4 });
  y += 12;
  font("times", "bold", 30);
  text("Sommaire", M, y);
  y += 16;
  toc.forEach((entry, i) => {
    font("helvetica", "normal", 9, COCOA);
    text(String(i + 1).padStart(2, "0"), M, y);
    font("times", "normal", 14, INK);
    text(entry.title, M + 12, y);
    font("helvetica", "normal", 10, INK);
    text(String(entry.page), W - M, y, { align: "right" });
    doc.setDrawColor(225, 212, 199);
    doc.setLineWidth(0.2);
    doc.line(M, y + 4, W - M, y + 4);
    doc.link(M, y - 6, CW, 10, { pageNumber: entry.page });
    y += 13;
  });
  y += 8;
  card(M, y, CW, 34, { fill: "#FFF1DC", stroke: null });
  font("helvetica", "bold", 8, COCOA);
  text("À PROPOS DES CHIFFRES", M + 7, y + 9, { charSpace: 0.3 });
  font("helvetica", "normal", 9, INK);
  doc.splitTextToSize(clean("Les projections de ce document sont issues d'un modèle financier fondé sur des hypothèses de prix, de volumes et de coûts clairement identifiées (voir « Hypothèses du modèle financier »). Elles ne constituent pas des résultats réels et doivent être actualisées au fil de l'activité."), CW - 14).forEach((l, i) => doc.text(l, M + 7, y + 16 + i * 4.6));

  /* ---------- En-têtes et pieds de page ---------- */
  const pages = doc.getNumberOfPages();
  for (let p = 2; p <= pages; p++) {
    doc.setPage(p);
    const pw = pageW();
    const ph = doc.internal.pageSize.getHeight();
    doc.setDrawColor(225, 212, 199);
    doc.setLineWidth(0.2);
    doc.line(M, 14, pw - M, 14);
    font("helvetica", "bold", 7.5, COCOA);
    text("LA CRÊPIÈRE ENAGNON", M, 11, { charSpace: 0.3 });
    font("helvetica", "normal", 7.5, MUTED);
    text(`Business Plan ${C.company.year}`, pw - M, 11, { align: "right" });
    doc.line(M, ph - 13, pw - M, ph - 13);
    text("Cotonou, Bénin  -  projections fondées sur des hypothèses", M, ph - 8);
    text(`${p} / ${pages}`, pw - M, ph - 8, { align: "right" });
  }

  doc.setProperties({ title: "Business Plan - La Crêpière Enagnon", subject: "Business plan et projections financières sur 12 mois", author: "La Crêpière Enagnon", creator: "La Crêpière Enagnon" });
  doc.save(`Business-Plan-La-Crepiere-Enagnon-${C.company.year}.pdf`);
  return doc;
};
