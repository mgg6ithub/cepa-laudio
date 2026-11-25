/* CEPA Laudio-Amurrio HHI — interakzioak (jQuery gabe) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* Menua mugikorrean */
  const btn = $(".menu-btn"), nav = $(".nav");
  btn?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "Itxi" : "Menua";
  });
  document.addEventListener("click", (e) => {
    $$(".nav details[open]").forEach((d) => { if (!d.contains(e.target)) d.open = false; });
  });

  /* Modu argia / iluna (argia lehenetsita) */
  const html = document.documentElement, mb = $(".mode-btn");
  const syncMode = () => {
    const dark = html.dataset.mode === "dark";
    mb?.setAttribute("aria-pressed", dark);
    mb?.setAttribute("aria-label", dark ? "Modu argia" : "Modu iluna");
  };
  mb?.addEventListener("click", () => {
    if (html.dataset.mode === "dark") delete html.dataset.mode; else html.dataset.mode = "dark";
    try { localStorage.setItem("modua", html.dataset.mode || "light"); } catch (e) {}
    syncMode();
  });
  syncMode();

  /* Agertze animazioak korritzean */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add("in");
    setTimeout(() => { delete el.dataset.reveal; el.style.removeProperty("--d"); }, reduce ? 0 : 900 + (+el.style.getPropertyValue("--d") || 0) * 90);
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".section-head, .news-grid > *, .centres > *, .agenda > *, .page-head .wrap > *, .prose > *, .faq, .faq-search, .link-groups > *").forEach((el) => {
    el.dataset.reveal = "";
    el.style.setProperty("--d", Math.min([...el.parentElement.children].indexOf(el), 6));
    io.observe(el);
  });

  /* "Zer ikas dezakezu": marra etena txartel batetik bestera, gezi batekin amaitua */
  const NS = "http://www.w3.org/2000/svg";
  $$(".offer").forEach((offer, k) => {
    const cards = $$(":scope > .card", offer);
    if (cards.length < 2) return;
    cards.forEach((c, i) => c.style.setProperty("--i", i));
    offer.insertAdjacentHTML("afterbegin", `<svg class="offer-path" aria-hidden="true"><defs><mask id="pen${k}" maskUnits="userSpaceOnUse"><path class="pen" pathLength="1"/></mask></defs><path class="dash" mask="url(#pen${k})"/><polygon class="head"/></svg>`);
    const svg = offer.firstElementChild, mask = $("mask", svg);
    const draw = () => {
      const o = offer.getBoundingClientRect();
      const p = cards.map((c) => { const r = c.getBoundingClientRect(); return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2, w: r.width, h: r.height }; });
      const row = (a, b) => Math.abs(a.y - b.y) < 10;
      const first = p[0], last = p[p.length - 1];
      const hStart = row(p[0], p[1]), hEnd = row(p[p.length - 2], last);
      const s = hStart ? { x: first.x - first.w / 2 - 36, y: first.y } : { x: first.x, y: first.y - first.h / 2 - 48 };
      const e = hEnd ? { x: last.x + last.w / 2 + 40, y: last.y } : { x: last.x, y: last.y + last.h / 2 + 52 };
      // Txarteletan zuzen (ezkutuan), tarteetan arku leun bat, txandaka gora eta behera
      let d = hStart
        ? `M${s.x},${s.y - 40} C${s.x + 24},${s.y - 40} ${first.x - first.w / 2 - 14},${first.y} ${first.x - first.w / 2},${first.y} L${first.x},${first.y}`
        : `M${s.x - 40},${s.y} C${s.x - 40},${s.y + 24} ${first.x},${first.y - first.h / 2 - 14} ${first.x},${first.y - first.h / 2} L${first.x},${first.y}`;
      for (let i = 1; i < p.length; i++) {
        const a = p[i - 1], b = p[i], sg = i % 2 ? -1 : 1;
        if (row(a, b)) {
          const x0 = a.x + a.w / 2, x1 = b.x - b.w / 2, g = x1 - x0, amp = sg * Math.max(32, g * .7);
          d += ` L${x0},${a.y} C${x0 + g * .45},${a.y + amp} ${x1 - g * .45},${b.y + amp} ${x1},${b.y} L${b.x},${b.y}`;
        } else if (Math.abs(a.x - b.x) < 10) {
          const y0 = a.y + a.h / 2, y1 = b.y - b.h / 2, g = y1 - y0, amp = sg * Math.max(32, g * .7);
          d += ` L${a.x},${y0} C${a.x + amp},${y0 + g * .45} ${b.x + amp},${y1 - g * .45} ${b.x},${y1} L${b.x},${b.y}`;
        } else {
          d += ` C${a.x},${a.y + (b.y - a.y) * .6} ${b.x},${b.y - (b.y - a.y) * .6} ${b.x},${b.y}`;
        }
      }
      d += hEnd ? ` L${last.x + last.w / 2},${last.y} L${e.x},${e.y}` : ` L${last.x},${last.y + last.h / 2} L${e.x},${e.y}`;
      $(".dash", svg).setAttribute("d", d);
      $(".pen", svg).setAttribute("d", d);
      ["x", "y"].forEach((a) => mask.setAttribute(a, -200));
      mask.setAttribute("width", o.width + 400); mask.setAttribute("height", o.height + 400);
      const h = hEnd ? [[e.x + 4, e.y], [e.x - 12, e.y - 8], [e.x - 12, e.y + 8]] : [[e.x, e.y + 4], [e.x - 8, e.y - 12], [e.x + 8, e.y - 12]];
      const head = $(".head", svg);
      head.setAttribute("points", h.map((q) => q.join(",")).join(" "));
      head.style.transformOrigin = `${e.x}px ${e.y}px`;
    };
    draw();
    new ResizeObserver(draw).observe(offer);
    new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { offer.classList.add("is-drawn"); ob.disconnect(); } }, { threshold: .35 }).observe(offer);
  });

  /* Cookie-oharra (egungo cookie bera: cookies_surestao) */
  const ck = $(".cookies");
  if (ck && !document.cookie.includes("cookies_surestao=")) ck.classList.add("show");
  $(".cookies button")?.addEventListener("click", () => {
    document.cookie = "cookies_surestao=aceptada; max-age=7776000; path=/; SameSite=Lax";
    ck.classList.remove("show");
  });

  /* Agenda */
  const cal = $("#cal");
  if (cal) {
    const today = new Date();
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    const months = ["urtarrila", "otsaila", "martxoa", "apirila", "maiatza", "ekaina", "uztaila", "abuztua", "iraila", "urria", "azaroa", "abendua"];
    const dows = ["Al", "Ar", "Az", "Og", "Ol", "Lr", "Ig"];
    const draw = () => {
      const y = view.getFullYear(), m = view.getMonth();
      const first = (new Date(y, m, 1).getDay() + 6) % 7;
      const days = new Date(y, m + 1, 0).getDate();
      let html = dows.map((d) => `<div class="dow">${d}</div>`).join("");
      html += "<div></div>".repeat(first);
      for (let d = 1; d <= days; d++) {
        const wd = (first + d - 1) % 7;
        const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
        html += `<div class="day${isToday ? " today" : ""}${wd > 4 ? " we" : ""}"${isToday ? ' aria-current="date"' : ""}>${d}</div>`;
      }
      $(".cal-grid", cal).innerHTML = html;
      $(".cal-head strong", cal).textContent = `${y} ${months[m]}`;
    };
    $(".prev", cal).onclick = () => { view.setMonth(view.getMonth() - 1); draw(); };
    $(".next", cal).onclick = () => { view.setMonth(view.getMonth() + 1); draw(); };
    draw();
  }

  /* Ohiko galderak: bilatzailea */
  const q = $(".faq-search");
  q?.addEventListener("input", () => {
    const t = q.value.trim().toLowerCase();
    $$(".faq details").forEach((d) => {
      const hit = !t || d.textContent.toLowerCase().includes(t);
      d.hidden = !hit;
      if (t && hit) d.open = true;
    });
  });

  /* ---------- Galeria ---------- */
  const root = $("#galeria");
  if (!root || !window.ALBUMAK) return;
  const BASE = window.FOTO_BASE;
  const norm = (el) => typeof el === "string"
    ? { mota: "img", src: BASE + el, thumb: BASE + el }
    : { mota: el.video ? "video" : "embed", src: el.video || el.embed, thumb: el.poster || "", izena: el.izena || "Bideoa", data: el.data || "" };
  const albums = window.ALBUMAK.map((a) => ({ ...a, items: a.elementuak.map(norm) }));
  const params = new URLSearchParams(location.search);
  if (params.get("ikusi") === "bideoak") { location.replace("bideoak.html"); return; }
  const albumId = Number(params.get("album"));
  const ikusi = root.dataset.ikusi;

  const tile = (it, i) => it.mota === "img"
    ? `<button class="tile" style="--d:${i}" data-i="${i}" aria-label="Ireki argazkia ${i + 1}"><img src="${esc(it.thumb)}" alt="" loading="lazy" decoding="async"></button>`
    : `<button class="tile video" style="--d:${i}" data-i="${i}" aria-label="Ikusi bideoa: ${esc(it.izena)}"><img src="${esc(it.thumb)}" alt="" loading="lazy" decoding="async"><span class="play"><span></span></span></button>`;

  let list = [];
  const album = albums.find((a) => a.id === albumId);
  if (ikusi === "bideoak") {
    list = [
      ...(window.BIDEOAK || []).map(norm).map((it) => ({ ...it, album: it.data })),
      ...albums.flatMap((a) => a.items.filter((it) => it.mota !== "img").map((it) => ({ ...it, album: a.izena }))),
    ];
    root.innerHTML = list.length
      ? `<div class="video-row">${list.map((it, i) => `<article class="card video-card" style="--d:${i}">${tile(it, i)}<div class="body"><h3>${esc(it.izena)}</h3><span class="muted">${esc(it.album)}</span></div></article>`).join("")}</div>`
      : `<p class="muted">Oraindik ez dago bideorik.</p>`;
  } else if (album) {
    document.title = `${album.izena} · Argazkiak · CEPA Laudio HHI`;
    $(".page-head h1").textContent = album.izena;
    $(".page-head p:not(.eyebrow)").textContent = `${album.items.length} elementu`;
    list = album.items.map((it) => ({ ...it, album: album.izena }));
    root.innerHTML = `<a class="back" href="argazkiak.html">← Album guztiak</a><div class="masonry">${list.map(tile).join("")}</div>`;
  } else {
    root.innerHTML = `<div class="albums">${albums.map((a, i) => {
      const v = a.items.filter((it) => it.mota !== "img").length;
      return `<a class="album" style="--d:${i}" href="?album=${a.id}"><div class="stack">${v ? `<span class="badge">▶ ${v} bideo</span>` : ""}<img src="${BASE + a.azala}" alt="" loading="lazy" decoding="async"></div>
        <h3>${esc(a.izena)}</h3><span class="count">${a.items.length - v} argazki</span></a>`;
    }).join("")}</div>`;
  }
  $$("img", root).forEach((img) => {
    const done = () => img.classList.add("loaded");
    img.complete ? done() : img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
  if (!list.length) return;

  /* Lightbox: argazkiak eta bideoak; teklatua, irristatzea eta miniaturak */
  const lb = document.createElement("dialog");
  lb.className = "lightbox";
  lb.setAttribute("aria-label", "Argazki-ikustailea");
  lb.innerHTML = `<div class="lb-top"><span class="lb-title"></span><div class="lb-actions">
      <a class="lb-btn lb-dl" target="_blank" rel="noopener" aria-label="Jatorrizkoa ireki">⤓</a>
      <button class="lb-btn lb-close" aria-label="Itxi">✕</button></div></div>
    <div class="lb-stage"><button class="lb-btn lb-prev" aria-label="Aurrekoa">‹</button><div class="lb-media"></div><button class="lb-btn lb-next" aria-label="Hurrengoa">›</button></div>
    <div class="lb-strip">${list.map((it, i) => `<button data-i="${i}" aria-label="${i + 1}"><img src="${esc(it.thumb)}" alt="" loading="lazy"></button>`).join("")}</div>`;
  document.body.append(lb);
  let cur = 0;
  const media = $(".lb-media", lb);
  const show = (i) => {
    cur = (i + list.length) % list.length;
    const it = list[cur];
    media.innerHTML = it.mota === "img" ? `<img src="${esc(it.src)}" alt="${esc(it.album)} — ${cur + 1}">`
      : it.mota === "video" ? `<video src="${esc(it.src)}" poster="${esc(it.thumb)}" controls autoplay playsinline></video>`
      : `<iframe src="${esc(it.src)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(it.izena)}"></iframe>`;
    $(".lb-title", lb).textContent = `${it.izena || it.album} · ${cur + 1} / ${list.length}`;
    $(".lb-dl", lb).href = it.src;
    $$(".lb-strip button", lb).forEach((b, j) => b.setAttribute("aria-current", j === cur));
    $(`.lb-strip button[data-i="${cur}"]`, lb).scrollIntoView({ block: "nearest", inline: "center" });
    [cur + 1, cur - 1].forEach((j) => { const n = list[(j + list.length) % list.length]; if (n.mota === "img") new Image().src = n.src; });
  };
  const open = (i) => { lb.showModal(); show(i); };
  const close = () => { lb.close(); media.innerHTML = ""; };
  root.addEventListener("click", (e) => { const t = e.target.closest(".tile"); if (t) open(+t.dataset.i); });
  $(".lb-prev", lb).onclick = () => show(cur - 1);
  $(".lb-next", lb).onclick = () => show(cur + 1);
  $(".lb-close", lb).onclick = close;
  lb.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
  $(".lb-strip", lb).addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
  let x0 = null;
  const stage = $(".lb-stage", lb);
  stage.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  stage.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });
})();
