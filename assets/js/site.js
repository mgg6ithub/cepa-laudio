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

  /* "Zer ikas dezakezu": marra etena marraz marra marrazten da; txartela agertzen da marra iritsi aurretik,
     marra txartelaren atzetik pasatzen da eta beste aldetik ateratzen da, gezi batekin amaitu arte */
  const NS = "http://www.w3.org/2000/svg", DASH = 10, GAP = 7, P = DASH + GAP;
  $$(".offer").forEach((offer, k) => {
    const cards = $$(":scope > .card", offer);
    if (cards.length < 2) return;
    offer.insertAdjacentHTML("afterbegin", `<svg class="offer-path" aria-hidden="true"><defs><mask id="pen${k}" maskUnits="userSpaceOnUse"><path class="pen"/></mask></defs><path class="dash" mask="url(#pen${k})"/><polygon class="head"/></svg>`);
    const svg = offer.firstElementChild, mask = $("mask", svg), pen = $(".pen", svg), dash = $(".dash", svg), head = $(".head", svg);
    const probe = document.createElementNS(NS, "path");
    svg.append(probe); probe.setAttribute("fill", "none");
    let total = 0, enter = [], exit = [], drawn = 0, started = false, done = false;
    const lenOf = (d) => { probe.setAttribute("d", d); return probe.getTotalLength(); };
    const build = () => {
      const o = offer.getBoundingClientRect();
      // posizioa diseinutik (offset*), ez animazioaren transformaziotik
      const p = cards.map((c) => ({ x: c.offsetLeft + c.offsetWidth / 2, y: c.offsetTop + c.offsetHeight / 2, w: c.offsetWidth, h: c.offsetHeight }));
      const row = (a, b) => Math.abs(a.y - b.y) < 10;
      const first = p[0], last = p[p.length - 1];
      const hStart = row(p[0], p[1]), hEnd = row(p[p.length - 2], last);
      // Marrazki libreagoa: tarte bakoitzak bere kurbadura, ez simetrikoa
      const bend = [[.32, .12], [-.10, -.30], [.22, .06], [-.18, -.05]];
      enter = []; exit = [];
      let d;
      if (hStart) {
        const x = first.x - first.w / 2;
        d = `M${x - 48},${first.y - 22} C${x - 28},${first.y - 22} ${x - 16},${first.y} ${x},${first.y}`;
      } else {
        const y = first.y - first.h / 2;
        d = `M${first.x - 22},${y - 64} C${first.x - 22},${y - 36} ${first.x},${y - 20} ${first.x},${y}`;
      }
      enter.push(lenOf(d));
      for (let i = 1; i < p.length; i++) {
        const a = p[i - 1], b = p[i], [c1, c2] = bend[(i - 1) % bend.length];
        if (row(a, b)) {
          const x0 = a.x + a.w / 2, x1 = b.x - b.w / 2, g = x1 - x0;
          d += ` L${x0},${a.y}`; exit.push(lenOf(d));
          d += ` C${x0 + g * .3},${a.y + g * c1} ${x1 - g * .4},${b.y + g * c2} ${x1},${b.y}`;
        } else if (Math.abs(a.x - b.x) < 10) {
          const y0 = a.y + a.h / 2, y1 = b.y - b.h / 2, g = y1 - y0;
          d += ` L${a.x},${y0}`; exit.push(lenOf(d));
          d += ` C${a.x + g * c1},${y0 + g * .3} ${b.x + g * c2},${y1 - g * .4} ${b.x},${y1}`;
        } else {
          d += ` L${a.x},${a.y}`; exit.push(lenOf(d));
          d += ` C${a.x},${a.y + (b.y - a.y) * .6} ${b.x},${b.y - (b.y - a.y) * .6} ${b.x},${b.y}`;
        }
        enter.push(lenOf(d));
      }
      let e;
      if (hEnd) { const x = last.x + last.w / 2; d += ` L${x},${last.y}`; exit.push(lenOf(d)); e = { x: x + 40, y: last.y - 8 }; d += ` C${x + 16},${last.y} ${x + 24},${e.y} ${e.x},${e.y}`; }
      else { const y = last.y + last.h / 2; d += ` L${last.x},${y}`; exit.push(lenOf(d)); e = { x: last.x + 10, y: y + 64 }; d += ` C${last.x},${y + 24} ${e.x},${y + 40} ${e.x},${e.y}`; }
      dash.setAttribute("d", d); pen.setAttribute("d", d);
      total = lenOf(d);
      ["x", "y"].forEach((a) => mask.setAttribute(a, -300));
      mask.setAttribute("width", o.width + 600); mask.setAttribute("height", o.height + 600);
      const ang = Math.atan2(hEnd ? 0 : 1, hEnd ? 1 : 0);
      const pt = (dx, dy) => `${e.x + dx * Math.cos(ang) - dy * Math.sin(ang)},${e.y + dx * Math.sin(ang) + dy * Math.cos(ang)}`;
      head.setAttribute("points", [pt(6, 0), pt(-10, -7), pt(-10, 7)].join(" "));
      head.style.transformOrigin = `${e.x}px ${e.y}px`;
      paint();
    };
    const paint = () => {
      // marra osoak bakarrik: marrazki bakoitza bat-batean agertzen da
      const shown = done ? total + P : Math.floor(drawn / P) * P + (drawn % P >= DASH * .5 ? DASH + 1.5 : 0);
      pen.style.strokeDasharray = `${shown} ${total + P}`;
      cards.forEach((c, i) => { if (done || drawn >= enter[i] - 130) c.classList.add("on"); });
      head.classList.toggle("on", done || drawn >= total - 2);
    };
    const inside = (l) => enter.some((a, i) => l >= a && l < exit[i]);
    let t0 = 0;
    const tick = (t) => {
      const dt = Math.min(.05, (t - (t0 || t)) / 1000); t0 = t;
      drawn += dt * (inside(drawn) ? 1400 : 150);
      if (drawn >= total) { drawn = total; done = true; }
      paint();
      if (!done) requestAnimationFrame(tick);
    };
    build();
    new ResizeObserver(build).observe(offer);
    new IntersectionObserver((es, ob) => {
      if (!es[0].isIntersecting || started) return;
      started = true; ob.disconnect();
      if (reduce) { done = true; paint(); } else requestAnimationFrame(tick);
    }, { threshold: .35 }).observe(offer);
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
