"""Orriak sortzen ditu: iturria/orriak/*.html + diseinu komuna -> berria/*.html
Erabilera:  python3 iturria/sortu.py
PHP-ra eramatean: GOIBURUA -> header.php, OINA -> footer.php, ZENTROAK eta albisteak -> datu-basetik."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parent.parent
LIVE = "https://epalaudioamurrio.eus/"

ORRIAK = {  # fitxategia: (izenburua, deskribapena)
    "index": ("Hasiera", "Laudio, Amurrio eta Artziniegako helduentzako ikastetxe publikoa. Ikastaro guztiak doakoak."),
    "hezkuntza-eskaintza": ("Hezkuntza eskaintza", "DBH titulua, hizkuntzak, informatika eta gehiago, doan."),
    "albisteak": ("Albisteak", "CEPA Laudio HHIko albisteak eta irteerak."),
    "matrikula": ("Matrikula", "2026-2027 ikasturteko matrikula epeak eta dokumentazioa."),
    "argazkiak": ("Argazkiak", "Irteeren, tailerren eta proiektuen argazkiak."),
    "bideoak": ("Bideoak", "Ikasleek eta irakasleek egindako bideoak eta laburmetraiak."),
    "ohiko-galderak": ("Ohiko galderak", "HHI zentroei buruzko ohiko galderak."),
    "harremana": ("Harremana", "Ikasguneen helbideak, telefonoak eta ordutegiak."),
    "estekak": ("Estekak", "Eskualdeko udal, komunikabide eta ikastetxeen estekak."),
    "elkarrekintzak": ("Elkarrekintzak", "Elkarlanean ari garen taldeak."),
}
MENUA = ["index", "hezkuntza-eskaintza", "albisteak", "matrikula", "argazkiak", "bideoak"]
BESTE = ["ohiko-galderak", "harremana", "estekak", "elkarrekintzak"]
CAS = {"index": "index.php", "hezkuntza-eskaintza": "content.php?id=2", "albisteak": "news.php", "matrikula": "content.php?id=4",
       "argazkiak": "fotos.php", "bideoak": "fotos.php", "ohiko-galderak": "faq.php", "harremana": "content.php?id=7", "estekak": "content.php?id=8",
       "elkarrekintzak": "content.php?id=18"}

# Albisteak (news.php): id, data, izenburua, irudia, laburpena, estekak
ALBISTEAK = [
    (24, "2026-10-08", "Arreta ordutegia", None, "Ikasgune bakoitzeko arreta ordutegia.",
     [("Laudio", "_wskcf/files/laudio_euskera.jpg"), ("Amurrio", "_wskcf/files/amurrio_euskera.jpg"), ("Artziniega", "_wskcf/files/artzeniega_euskera.jpg")]),
    (23, "2026-09-02", "Ikasturte honetan, Artziniegan ere bai!", "img/noticias/Artzeniega_pagina_2.jpg",
     "Ikasturte honetan, CEPA Laudio-Amurriok Artziniegan ere ikasgelak izango ditu, oinarrizko ikasketak egiteko.", []),
    (20, "2026-09-02", "2026-2027 ikasturtea hastear dago!", "img/noticias/argazki%201.jpg", "2026-2027 matrikula informazioa.", []),
    (22, "2026-06-30", "2026-2027 Egutegia", "img/noticias/26_27%20EGUTEGIA_page_0001.jpg", "Ikasturte berriko egutegia.", []),
    (19, "2026-06-29", "Collage", "img/noticias/Collage.jpg",
     "Arteko ikasleek collagea aztertu dute, haren jatorria, ezaugarri nagusiak eta eskaintzen dituen sormen-aukerak ezagutuz. Ondoren, haien konposizioak sortu dituzte.", []),
    (21, "2026-05-21", "Kultura-aniztasunaren eguna", "img/noticias/IMG_9615.jpeg", "Memoria taldeak argazki lehiaketako lehenengo saria irabazi du!", []),
    (18, "2026-03-08", "Martxoak 8.", "_wskcf/images/img_1440%283%29.png", "Gure emakumeak. Gure sustraiak.", []),
    (11, "2025-12-19", "2025-2026 ikasturteko bigarren matrikula garaian", None,
     "2025-2026 ikasturteko bigarren matrikula garaia zabalik egongo da urtarrilaren 7tik otsailaren 6ra.", []),
    (16, "2025-06-17", "Gure laburmetraiaren estreinaldia egunkarian!", "img/noticias/DSC02071.jpg",
     "Laudio eta Amurrioko EPAtako ikasleek eta irakasleek sortutako «Juventud que no se atreve» laburmetraia Aiaraldeko egunkarian!", [("Ikusi bideoa", "BIDEOA")]),
    (13, "2023-09-01", "Gela digitala", "img/noticias/gela_digitala_page_0001.jpg", "Gela digitala.", []),
    (12, "2023-06-29", "Bidartera -Lapurdi- irteera", "img/noticias/bidart.JPG",
     "Ekainean Bidart (Lapurdi) eta Oiartzungo Arditurri meategia bisitatu ditugu.", []),
    (8, "2019-11-28", "Chillida Lekura eta Oriora irteera", "img/noticias/txillida_leku4.jpeg",
     "Azaroaren 28an Chillida Leku museoaren bisita egin genuen EPA Laudio eta Amurrioko ikasleok eta irakasleok.", []),
    (3, "2018-04-10", "Markina-Xemein eta Lekeitiora kultur irteera", "img/noticias/SanMiguel_Arretxinaga2.jpg",
     "Martxoaren 21ean ikastetxeko zenbait ikasle eta irakasle Markina-Xemeinera hurbildu ziren eta bertako eraikin historikoen bisita gidatua izan zuten.", []),
    (1, "2017-12-22", "Gesaltza-Añanara eta Artiumera irteera", "img/noticias/salinas2.jpg",
     "Abenduaren 12an CEPA Laudio HHIko ikasleek eta irakasleek kultur irteera izan zuten Gesaltza-Añanara.", []),
]

ZENTROAK = [
    ("CEPA Laudio HHI", "assets/img/laudio.jpg", "Latiorro, 8 · 01400 Laudio", ["946721734", "674002617"],
     ["Astelehenetik ostegunera: 09:00–13:30", "Ostiraletan: 09:00–14:00"], None,
     "https://www.google.com/maps/place/Centro+P%C3%BAblico+de+Educaci%C3%B3n+de+Personas+Adultas+de+Laudio%2FLlodio/@43.138959,-2.957696,14z/data=!4m6!3m5!1s0xd4e52c9435dfcbd:0x37180657be9cb809!8m2!3d43.1389586!4d-2.9576965"),
    ("CEPA Amurrio HHI", "assets/img/amurrio.jpg", "Landaburu 11-13 · 01470 Amurrio", ["945892620", "674002726"],
     ["Astelehenetik ostegunera: 14:30–19:00", "Ostiraletan: 09:00–14:00"],
     "Irailaren 1etik 12ra eta ekainaren 22tik 30era: goizez (9:00–13:30/14:00)", "https://maps.app.goo.gl/hYrzrDEDuMonvF1i8"),
    ("CEPA Artziniega HHI", None, "La Bárcena kalea 1 · 01474 Artziniega", ["946721734", "674002617"],
     ["Zehazteke"], None,
     "http://google.com/maps?ll=43.118772,-3.132135&z=13&t=h&hl=es&gl=ES&mapclient=embed&cid=7247471252668431534"),
]
EMAIL = "010035aa@hezkuntza.net"
BIDEOA = "argazkiak.html?album=2"


def zentroak_html():
    out = []
    for izena, img, helb, tels, ord, oharra, mapa in ZENTROAK:
        foto = f'<img src="{img}" alt="{izena} eraikina" width="800" height="441" loading="lazy">' if img else \
            f'<div class="no-photo" aria-hidden="true">Artziniega</div>'
        tel = " · ".join(f'<a href="tel:+34{t}">{t[:3]} {t[3:6]} {t[6:]}</a>' for t in tels)
        out.append(f'''<article class="card centre">{foto}<div class="body">
  <h3>{izena}</h3><address>{helb}</address>
  <dl><dt>Telefonoa</dt><dd>{tel}</dd><dt>Emaila</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd>
  <dt>Ordutegia</dt>{"".join(f"<dd>{o}</dd>" for o in ord)}</dl>
  {f'<p class="note">{oharra}</p>' if oharra else ""}
  <div class="actions"><a class="btn btn-ghost" href="{escape(mapa)}" target="_blank" rel="noopener">Kokapena ↗</a>
  <a class="btn btn-ghost" href="tel:+34{tels[0]}">Deitu</a></div></div></article>''')
    return '<div class="centres">' + "\n".join(out) + "</div>"


def albiste_html(a, featured=False):
    nid, data, izen, img, lab, estekak = a
    url = f"{LIVE}news.php?id={nid}"
    thumb = f'<div class="thumb"><img src="{LIVE}{img}" alt="" loading="lazy" decoding="async"></div>' if img else \
        f'<div class="thumb placeholder" aria-hidden="true">{escape(izen)}</div>'
    links = "".join(f'<a href="{BIDEOA if h == "BIDEOA" else LIVE + h}">{t}</a>' for t, h in estekak)
    links = f'<div class="links-inline">{links}</div>' if links else ""
    return f'''<article class="card news{" featured" if featured else ""}">{thumb}<div class="body">
  <time datetime="{data}">{data}</time><h3><a href="{url}">{escape(izen)}</a></h3><p>{escape(lab)}</p>{links}
  <a class="more" href="{url}" aria-label="Gehiago irakurri: {escape(izen)}">Gehiago irakurri →</a></div></article>'''


def albisteak_html(n=None):
    items = sorted(ALBISTEAK, key=lambda a: a[1], reverse=True)[:n]
    return '<div class="news-grid">' + "\n".join(albiste_html(a, i == 0 and n is None) for i, a in enumerate(items)) + "</div>"


def nav_html(cur):
    li = "".join(f'<li><a href="{p}.html"{' aria-current="page"' if p == cur else ''}>{ORRIAK[p][0]}</a></li>' for p in MENUA)
    sub = "".join(f'<li><a href="{p}.html"{' aria-current="page"' if p == cur else ''}>{ORRIAK[p][0]}</a></li>' for p in BESTE)
    return f'{li}<li><details><summary>Beste batzuk</summary><ul>{sub}</ul></details></li>'


def orria(name, body):
    title, desc = ORRIAK[name]
    full = "CEPA Laudio-Amurrio HHI" if name == "index" else f"{title} · CEPA Laudio-Amurrio HHI"
    gal = '<script src="assets/js/galeria-datuak.js" defer></script>' if name in ("argazkiak", "bideoak") else ""
    return f'''<!doctype html>
<html lang="eu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0e7c86">
<link rel="icon" href="assets/img/logo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
<script>try {{ if (localStorage.getItem("modua") === "dark") document.documentElement.dataset.mode = "dark"; }} catch (e) {{}}</script>
{gal}<script src="assets/js/site.js" defer></script>
</head>
<body>
<a class="skip" href="#edukia">Edukira joan</a>
<header class="site-header"><div class="wrap">
  <a class="brand" href="index.html"><img src="assets/img/logo.jpg" alt="" width="44" height="44"><span><b>CEPA Laudio-Amurrio HHI</b><small>Helduentzako ikastetxe publikoa</small></span></a>
  <nav class="nav" id="nav" aria-label="Nagusia"><ul>{nav_html(name)}</ul></nav>
  <div class="lang" aria-label="Hizkuntza"><a href="{name}.html" aria-current="true" lang="eu">eus</a><a href="{LIVE}{CAS[name]}{"&" if "?" in CAS[name] else "?"}set_idioma=1" lang="es">cas</a></div>
  <button class="mode-btn" type="button" aria-pressed="false" aria-label="Modu iluna"><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
  <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menua</button>
</div></header>
<main id="edukia">
{body}
</main>
<footer class="site-footer"><div class="wrap">
  <div class="footer-grid">
    <div><a class="brand" href="index.html"><img src="assets/img/logo.jpg" alt="" width="44" height="44"><span><b>CEPA Laudio-Amurrio HHI</b></span></a>
      <p>Helduentzako ikastetxe publikoa. Ikastaro guztiak doakoak dira.</p><p><a href="mailto:{EMAIL}">{EMAIL}</a></p></div>
    <div><h3>Laudio</h3><ul><li>Latiorro, 8</li><li><a href="tel:+34946721734">946 721 734</a></li></ul></div>
    <div><h3>Amurrio</h3><ul><li>Landaburu 11-13</li><li><a href="tel:+34945892620">945 892 620</a></li></ul></div>
    <div><h3>Orriak</h3><ul>{"".join(f'<li><a href="{p}.html">{ORRIAK[p][0]}</a></li>' for p in ["matrikula", "ohiko-galderak", "harremana", "estekak"])}</ul></div>
  </div>
  <div class="copy"><span>© 2017–2026 CEPA Laudio-Amurrio HHI · Aiaraldeko Hezkuntza Publikoa</span><a href="{LIVE}content.php?id=9">Cookie politika</a></div>
</div></footer>
<div class="cookies card" role="region" aria-label="Cookieak"><p>Web honek cookieak erabiltzen ditu datu estatistikoak lortzeko. <a href="{LIVE}content.php?id=9">Informazio gehiago</a></p><button type="button">Ados</button></div>
</body>
</html>
'''


def main():
    for name in ORRIAK:
        body = (ROOT / "iturria" / "orriak" / f"{name}.html").read_text(encoding="utf-8")
        body = body.replace("{{ZENTROAK}}", zentroak_html()).replace("{{ALBISTEAK_3}}", albisteak_html(3)) \
                   .replace("{{ALBISTEAK}}", albisteak_html())
        (ROOT / f"{name}.html").write_text(orria(name, body), encoding="utf-8")
    print("ok:", len(ORRIAK), "orri")


if __name__ == "__main__":
    main()
