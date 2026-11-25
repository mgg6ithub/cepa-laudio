/* Galeriaren datuak. Backend-ean (PHP) datu-basetik aterako dira; hemen, egungo webgunearen edukia.
   Elementu motak:
     "IMG.jpg"                                          → argazkia (FOTO_BASE + izena)
     { video: "bideoa.mp4", poster: "irudia.jpg" }       → igotako bideoa (<video>)
     { embed: "https://…/preview", poster: "…" }         → kanpoko bideoa (Drive, YouTube, Vimeo)  */
window.FOTO_BASE = "https://epalaudioamurrio.eus/img/fotos/";

/* Bideoak orrirako bideo solteak. Bideo berri bat igotzeko:
   1. Kopiatu .mp4 fitxategia (eta azal-irudia, .jpg) assets/bideoak/ karpetara.
   2. Gehitu lerro bat hemen, berriena goian. (Albumetako bideoak ere agertzen dira.) */
window.BIDEOAK = [
  { izena: "Bideo adibidea", video: "assets/bideoak/adibidea.mp4", poster: "assets/bideoak/adibidea.jpg", data: "2026-11-25" },
];

window.ALBUMAK = [
  { id: 5, izena: "Agurain-Salvatierra 2025", azala: "DSC_7383.JPG", elementuak: ["DSC_7383.JPG"] },
  { id: 8, izena: "Baiona 2026-06-11", azala: "IMG_20260611_WA0035.jpg", elementuak: [
    "20260611_113212.jpg", "20260611_113509.jpg", "20260611_114234.jpg", "20260611_115944.jpg",
    "20260611_120402.jpg", "20260611_160906.jpg", "20260611_160941.jpg", "20260611_162459.jpg",
    "20260611_164034.jpg", "20260611_165157.jpg", "IMG_9738.jpeg", "IMG_9739.jpeg",
    "IMG_9740%20%281%29.jpeg", "IMG_9744.jpeg", "IMG_9740.jpeg", "IMG_20260611_WA0038.jpg",
    "IMG_20260611_WA0035.jpg"] },
  { id: 7, izena: "Collage", azala: "27.jpg", elementuak:
    Array.from({ length: 27 }, (_, i) => `${i + 1}.jpg`) },
  { id: 2, izena: "Laburmetraia", azala: "Entrada%20para%20el%20cine%20chica%20blanco%20y%20negro%20%281%29.jpg", elementuak: [
    { embed: "https://drive.google.com/file/d/1X04oiUvuT-KpKOb7pTUjmJmYWmlWfkHT/preview",
      poster: "https://epalaudioamurrio.eus/img/noticias/DSC02071.jpg",
      izena: "«Juventud que no se atreve» laburmetraia" },
    "Cartel%20corto.jpg", "IMG_20250331_WA0015.jpg", "IMG_20250331_WA0028.jpg", "IMG_20250331_WA0010.jpg",
    "IMG_20250331_WA0021.jpg", "IMG_20250331_WA0022.jpg", "IMG_20250331_WA0017.jpg", "IMG_20250331_WA0018.jpg",
    "IMG_20250331_WA0011.jpg", "IMG_20250331_WA0012.jpg", "IMG_20250331_WA0027.jpg", "IMG_20250331_WA0026.jpg",
    "IMG_20250331_WA0025.jpg", "IMG_20250331_WA0024.jpg", "IMG_20250331_WA0023.jpg", "IMG_20250331_WA0029.jpg",
    "IMG_20250331_WA0020.jpg", "IMG_20250331_WA0014.jpg", "IMG_20250331_WA0013.jpg", "IMG_20250331_WA0016.jpg",
    "IMG_20250331_WA0009.jpg", "Entrada%20para%20el%20cine%20chica%20blanco%20y%20negro%20%281%29.jpg"] },
  { id: 3, izena: "Bilboko irteera 2025/04/01", azala: "IMG_20250403_WA0037.jpg", elementuak: [
    "IMG_20250617_WA0022.jpg", "IMG_20250617_WA0021.jpg", "IMG_20250403_WA0029.jpg", "IMG_20250403_WA0037.jpg"] },
  { id: 1, izena: "Bilboko irteera 2024/12/10", azala: "IMG_20241219_WA0024.jpg", elementuak: [
    "PXL_20241210_102321574.MP~2.jpg", "IMG_20241219_WA0021~2.jpg", "IMG_20241219_WA0024.jpg"] },
];
