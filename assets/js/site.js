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

  /* Letra handiak zutabera doitu (kartel tipografia) */
  const fit = () => $$("[data-fit]").forEach((box) => {
    const cs = getComputedStyle(box);
    const w = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const cap = Math.max(96, Math.min(220, innerHeight * 0.24));
    $$(".fit", box).forEach((el) => {
      el.style.fontSize = "100px";
      el.style.fontSize = Math.min(cap, (100 * w) / el.offsetWidth) + "px";
    });
  });
  if ($("[data-fit]")) {
    fit();
    document.fonts?.ready.then(fit);
    new ResizeObserver(fit).observe(document.body);
  }

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

  /* ---------- Galeria: argazkiak.html (albumak) eta bideoak.html ---------- */
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
    ? `<button class="tile" data-i="${i}" aria-label="Ireki argazkia ${i + 1}"><img src="${esc(it.thumb)}" alt="" loading="lazy" decoding="async"></button>`
    : `<button class="tile video" data-i="${i}" aria-label="Ikusi bideoa: ${esc(it.izena)}"><img src="${esc(it.thumb)}" alt="" loading="lazy" decoding="async"><span class="play">Ikusi</span></button>`;

  let list = [];
  const album = albums.find((a) => a.id === albumId);
  if (ikusi === "bideoak") {
    list = [
      ...(window.BIDEOAK || []).map(norm).map((it) => ({ ...it, album: it.data })),
      ...albums.flatMap((a) => a.items.filter((it) => it.mota !== "img").map((it) => ({ ...it, album: a.izena }))),
    ];
    root.innerHTML = list.length
      ? `<div class="video-row">${list.map((it, i) => `<article class="video-card"><div class="frame">${tile(it, i)}</div><h3>${esc(it.izena)}</h3>${it.album ? `<span class="meta">${esc(it.album)}</span>` : ""}</article>`).join("")}</div>`
      : `<p class="empty">Oraindik ez dago bideorik.</p>`;
  } else if (album) {
    document.title = `${album.izena} · Argazkiak · CEPA Laudio HHI`;
    $(".page-head h1").innerHTML = `<span class="fit">${esc(album.izena)}</span>`;
    $(".page-head .lead-wrap p").textContent = `${album.items.length} elementu`;
    fit();
    list = album.items.map((it) => ({ ...it, album: album.izena }));
    root.innerHTML = `<a class="back link" href="argazkiak.html">Album guztiak</a><div class="masonry">${list.map(tile).join("")}</div>`;
  } else {
    root.innerHTML = `<div class="albums">${albums.map((a) => {
      const v = a.items.filter((it) => it.mota !== "img").length;
      return `<a class="album" href="?album=${a.id}"><div class="frame"><div class="stack"><img src="${BASE + a.azala}" alt="" loading="lazy" decoding="async"></div></div>
        <h3>${esc(a.izena)}</h3><span class="count">${a.items.length - v} argazki${v ? `, ${v} bideo` : ""}</span></a>`;
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
      <a class="lb-btn lb-dl" target="_blank" rel="noopener" aria-label="Jatorrizkoa ireki"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg></a>
      <button class="lb-btn lb-close" aria-label="Itxi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div></div>
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
