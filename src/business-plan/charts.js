// Graphiques SVG légers (sans dépendance) : lignes et colonnes, avec survol.

const NS = "http://www.w3.org/2000/svg";
const PAD = { top: 18, right: 16, bottom: 30, left: 56 };

export const compact = (value) => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`;
  if (abs >= 1e3) return `${sign}${Math.round(abs / 1e3).toLocaleString("fr-FR")} k`;
  return `${sign}${Math.round(abs)}`;
};

const niceStep = (range, count) => {
  const raw = range / count;
  const power = 10 ** Math.floor(Math.log10(raw || 1));
  const unit = raw / power;
  return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10) * power;
};

const scaleY = (values, height) => {
  let min = Math.min(0, ...values);
  let max = Math.max(0, ...values);
  if (min === max) max = min + 1;
  const step = niceStep(max - min, 4);
  min = Math.floor(min / step) * step;
  max = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = min; v <= max + step / 2; v += step) ticks.push(v);
  const inner = height - PAD.top - PAD.bottom;
  return { ticks, y: (v) => PAD.top + inner - ((v - min) / (max - min)) * inner };
};

const el = (name, attrs = {}, text) => {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (text !== undefined) node.textContent = text;
  return node;
};

const frame = (container, height) => {
  container.innerHTML = "";
  container.classList.add("chart");
  const width = Math.max(280, container.clientWidth);
  const svg = el("svg", { viewBox: `0 0 ${width} ${height}`, width, height, role: "img" });
  const tip = document.createElement("div");
  tip.className = "chart-tip";
  container.append(svg, tip);
  return { svg, tip, width };
};

const axes = (svg, width, height, scale, labels, xAt) => {
  scale.ticks.forEach((t) => {
    const y = scale.y(t);
    svg.append(el("line", { x1: PAD.left, x2: width - PAD.right, y1: y, y2: y, class: t === 0 ? "axis-zero" : "grid" }));
    svg.append(el("text", { x: PAD.left - 8, y: y + 4, class: "tick", "text-anchor": "end" }, compact(t)));
  });
  const every = width < 480 ? 2 : 1;
  labels.forEach((label, i) => {
    if (i % every) return;
    svg.append(el("text", { x: xAt(i), y: height - 8, class: "tick", "text-anchor": "middle" }, label));
  });
};

const showTip = (container, tip, x, html) => {
  tip.innerHTML = html;
  tip.classList.add("visible");
  const max = container.clientWidth - tip.offsetWidth - 4;
  tip.style.left = `${Math.max(4, Math.min(max, x + 14))}px`;
  tip.style.top = "8px";
};

const tipRow = (color, name, value) =>
  `<div><i style="background:${color}"></i><span>${name}</span><b>${value}</b></div>`;

// Courbes : plusieurs séries sur un axe commun, réticule + infobulle au survol.
export const lineChart = (container, { labels, series, format, height = 260, area = false }) => {
  const { svg, tip, width } = frame(container, height);
  const scale = scaleY(series.flatMap((s) => s.values), height);
  const step = (width - PAD.left - PAD.right) / (labels.length - 1);
  const xAt = (i) => PAD.left + i * step;
  axes(svg, width, height, scale, labels, xAt);
  series.forEach((s) => {
    const points = s.values.map((v, i) => `${xAt(i)},${scale.y(v)}`).join(" ");
    if (area) {
      const base = scale.y(0);
      svg.append(el("polygon", { points: `${xAt(0)},${base} ${points} ${xAt(labels.length - 1)},${base}`, fill: s.color, opacity: 0.1 }));
    }
    svg.append(el("polyline", { points, fill: "none", stroke: s.color, class: "line" }));
    const last = s.values.length - 1;
    svg.append(el("circle", { cx: xAt(last), cy: scale.y(s.values[last]), r: 4.5, fill: s.color, class: "dot" }));
  });
  const cross = el("line", { y1: PAD.top, y2: height - PAD.bottom, class: "crosshair" });
  const dots = series.map((s) => el("circle", { r: 4.5, fill: s.color, class: "dot hover-dot" }));
  svg.append(cross, ...dots);
  const hit = el("rect", { x: PAD.left - step / 2, y: 0, width: width - PAD.left - PAD.right + step, height, fill: "transparent" });
  svg.append(hit);
  const move = (event) => {
    const box = svg.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * width;
    const i = Math.max(0, Math.min(labels.length - 1, Math.round((x - PAD.left) / step)));
    cross.setAttribute("x1", xAt(i));
    cross.setAttribute("x2", xAt(i));
    svg.classList.add("hovering");
    series.forEach((s, k) => {
      dots[k].setAttribute("cx", xAt(i));
      dots[k].setAttribute("cy", scale.y(s.values[i]));
    });
    showTip(container, tip, (xAt(i) / width) * box.width, `<strong>${labels[i]}</strong>${series.map((s) => tipRow(s.color, s.name, format(s.values[i]))).join("")}`);
  };
  hit.addEventListener("pointermove", move);
  hit.addEventListener("pointerleave", () => {
    svg.classList.remove("hovering");
    tip.classList.remove("visible");
  });
};

// Colonnes : empilées (plusieurs séries) ou simples, avec valeurs négatives possibles.
export const barChart = (container, { labels, series, format, height = 260 }) => {
  const { svg, tip, width } = frame(container, height);
  const totals = labels.map((_, i) => series.reduce((t, s) => t + Math.max(0, s.values[i]), 0));
  const negatives = labels.map((_, i) => series.reduce((t, s) => t + Math.min(0, s.values[i]), 0));
  const scale = scaleY([...totals, ...negatives], height);
  const band = (width - PAD.left - PAD.right) / labels.length;
  const barW = Math.min(24, band * 0.62);
  const xAt = (i) => PAD.left + band * i + band / 2;
  axes(svg, width, height, scale, labels, xAt);
  const radius = 4;
  labels.forEach((label, i) => {
    let up = 0;
    let down = 0;
    const group = el("g", { class: "bar-group" });
    series.forEach((s, k) => {
      const v = s.values[i];
      if (!v) return;
      const from = v > 0 ? up : down;
      const to = from + v;
      if (v > 0) up = to;
      else down = to;
      const y1 = scale.y(Math.max(from, to));
      const y2 = scale.y(Math.min(from, to));
      const isEnd = v > 0 ? series.slice(k + 1).every((n) => n.values[i] <= 0) : series.slice(k + 1).every((n) => n.values[i] >= 0);
      // 2 px d'écart (couleur du fond) entre segments empilés.
      const gap = isEnd ? 0 : 2;
      const h = Math.max(1, y2 - y1 - gap);
      const x = xAt(i) - barW / 2;
      const top = v > 0 ? y1 + gap : y1;
      const r = isEnd ? Math.min(radius, h / 2) : 0;
      const d =
        v > 0
          ? `M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + h} Z`
          : `M${x},${top} V${top + h - r} Q${x},${top + h} ${x + r},${top + h} H${x + barW - r} Q${x + barW},${top + h} ${x + barW},${top + h - r} V${top} Z`;
      group.append(el("path", { d, fill: s.color }));
    });
    const hit = el("rect", { x: xAt(i) - band / 2, y: 0, width: band, height, fill: "transparent" });
    hit.addEventListener("pointermove", () => {
      const box = svg.getBoundingClientRect();
      svg.querySelectorAll(".bar-group").forEach((g) => g.classList.toggle("dim", g !== group));
      const total = series.reduce((t, s) => t + s.values[i], 0);
      const rows = series.map((s) => tipRow(s.color, s.name, format(s.values[i]))).join("");
      showTip(container, tip, (xAt(i) / width) * box.width, `<strong>${label}</strong>${rows}${series.length > 1 ? `<div class="tip-total"><span>Total</span><b>${format(total)}</b></div>` : ""}`);
    });
    hit.addEventListener("pointerleave", () => {
      svg.querySelectorAll(".bar-group").forEach((g) => g.classList.remove("dim"));
      tip.classList.remove("visible");
    });
    svg.append(group, hit);
  });
};

export const legend = (series) =>
  `<ul class="legend">${series.map((s) => `<li><i style="background:${s.color}"></i>${s.name}</li>`).join("")}</ul>`;
