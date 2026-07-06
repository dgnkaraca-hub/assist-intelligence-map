# Assist Intelligence — Agent Handoff

> Bu dosyayı **yeni bir Claude Code sohbetine** (bu klasörün kökünde:
> `/Users/yontem/Desktop/karaca-dgn/assist-intelligence`) ilk mesaj olarak ver.
> Amaç: mevcut ürünü sıfırdan kurmak DEĞİL, **var olan uygulamayı sürdürmek**.
> Tasarım yönü: **sakin, premium, ince, holografik bir kişisel AI OS / second brain** —
> oyun HUD'u / neon cyberpunk DEĞİL.

---

## 0) TL;DR — ne bu?

**Assist Intelligence**, Doğan Karaca için tasarlanmış, karanlık ve sakin bir **kişisel AI
işletim sistemi / second-brain arayüzü**. Ortada bir **Assist Core** (Context Orchestration
Hub) ve etrafında altıgen **bilgi hücreleri** (Memory · Tasks · Research · Knowledge · Studio
· Decisions · Agents · Inbox) olan bir **honeycomb bilgi grafiği**. Her hücre tıklanınca sağda
**sekmeli bir hücre katmanı** açılır (Overview / Items / Relations / Actions); "Focus" ile hücre
merkeze geçip **alt hücrelerine** ayrılır. Sağda operasyonel bir **konsol** (bugün neye dikkat?
+ öneriler + "Ask the core" yakalama çubuğu) durur.

React 18 + TypeScript (strict) + Vite 5 + Tailwind 3 + lucide-react. Animasyon kütüphanesi yok
(sadece CSS keyframe). `prefers-reduced-motion` destekli. Tüm UI **veriden** render edilir.

---

## 1) Çalıştırma & doğrulama

```bash
cd /Users/yontem/Desktop/karaca-dgn/assist-intelligence
npm install
npm run dev          # http://localhost:5190  (strictPort)
```

| Script              | Ne yapar                                   |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Vite dev sunucusu, port **5190**           |
| `npm run build`     | `tsc -b && vite build` → `dist/` (yeşil olmalı) |
| `npm run preview`   | Production önizleme, 5190                   |
| `npm run typecheck` | `tsc --noEmit -p tsconfig.app.json`        |

**Görsel doğrulama (ÖNEMLİ gotcha'lar):**
- Claude **Preview MCP** bu çalışma alanında **yanlış kardeş projeyi** açabiliyor
  (örn. `assist-intelligence-dev` isterken `colleqtor` 5188'i başlatıyor). Güvenilir yol:
  `npm run dev` (Bash) + headless Chrome ile 5190'a ekran görüntüsü:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
    --screenshot=out.png --window-size=1512,950 --force-device-scale-factor=2 \
    --virtual-time-budget=4000 --hide-scrollbars "http://localhost:5190/"
  ```
- **Tailwind config veya index.html font değişince dev sunucusunu YENİDEN BAŞLAT** (JIT eski
  konfigürasyonu tutar; yeni class'lar sessizce çalışmaz). `dist/assets/*.css`'te grep ile doğrula.
- Deep-link ile durumları görüntüle: `?node=memory` (hücre seç), `?node=rsc-sources` (Focus + alt hücre),
  `?node=core` (Main Console).

---

## 2) Dosya haritası

```
src/
  App.tsx                       # AppShell: seçim/Focus state, sağ sütun swap, Esc, deep-link, veri (itemsByCell + localStorage), MobileGrid
  index.css                     # CSS-var TOKENLAR + .glass/.surface + .hex-cell + .edge/.edge-dashed/.edge-active + reduced-motion
  types.ts                      # Accent, IconKey, NodeStatus, Metric, DataItem, SubCell, MapCell, Honeycomb, CoreData, Edge, ConsoleData, Recommendation
  data/
    coreData.ts                 # core + 8 ana hücre (Honeycomb) + edges + honeycombById Map
    subcells.ts                 # childrenByCell[mainId] = SubCell[]  + subCellParent ters harita
    items.ts                    # seedItemsByCell — kayıtlar, YAPRAK id bazlı (core + tüm alt hücre id'leri)
    panels.ts                   # attention[] (konsol feed'i) + recommendations[]
  lib/
    layout.ts                   # saf hex geometri: computeArea, hexSize, layoutCircuit, hexPath, honeycombCells, axial yardımcıları
    cells.ts                    # subCellToView(sub, parent, count) -> Honeycomb-şeklinde görünüm (detay paneli için)
    accents.ts                  # accent -> TAM Tailwind class string'leri + hex (asla concat etme; purge düşürür)
    icons.tsx                   # iconFor(IconKey) -> lucide bileşeni
  components/
    TopStatusBar.tsx            # ince üst bar (kimlik + sistem durum çipleri)
    HoneycombMap.tsx            # GraphCanvas: STATİK grafik (drift yok), tipli kenarlar, honeycomb field (radyal sönümlü), hover tooltip
    HoneycombNode.tsx           # SystemNode: ince holografik altıgen hücre (resting/hover/selected/related/dimmed)
    AssistCore.tsx              # merkez hub (kontrollü glow, "Assist Core / Context Orchestration Hub")
    HoneycombDetailPanel.tsx    # CellDetailPanel: sekmeli hücre katmanı (Overview/Items/Relations/Actions); desktop=sağ sütun, mobil=sheet
    RightConsole.tsx            # operasyonel konsol (attention + suggested + AddToCoreInput)
    AddToCoreInput.tsx          # "Ask the core…" yakalama çubuğu (hedef hücreyi çıkarır/seçtirir)
    ViewModeToggle.tsx          # Overview | Focus segmenti
    MetricCard.tsx, RelatedNodeList.tsx, NodeActionButtons.tsx   # detay paneli alt bileşenleri
main.tsx, vite.config.ts, tailwind.config.js, tsconfig*.json, .claude/launch.json
```

> Silinmiş (artık yok): `AssistConsole.tsx`, `GlassPanel.tsx`, eski `lib/scene.ts` +
> `ConnectionMap.tsx` (SVG artık HoneycombMap içinde inline). `SubNode.tsx`/`IntelligenceNode.tsx`
> eski sürümlerde kaldırılmıştı.

---

## 3) Veri modeli (nasıl çalışır)

Üç katman, hepsi `src/data/*` altında, `src/types.ts` ile tiplenir:

1. **Ana hücreler** — `coreData.ts › nodes: Honeycomb[]` (+ `core: CoreData`). Alanlar:
   `id, title, shortLabel, category, icon (IconKey), accent (Accent), status, stat, statLabel,
   description, details[], metrics[], relatedNodes[], links[], nextActions[], tags[], lastUpdated`.
   `honeycombById` ile id→Honeycomb aranır. `edges[]` sadece dinlenme görünümü için (spoke).

2. **Alt hücreler** — `subcells.ts › childrenByCell[mainId]: SubCell[]` (`{id,label,icon}`).
   `subCellParent` ile subcell id → parent id.

3. **Kayıtlar (veri)** — `items.ts › seedItemsByCell: Record<leafId, DataItem[]>` (`{id,title,note?,tag?}`).
   Anahtar = YAPRAK id (yani `core` ve her **alt hücre** id'si; ana hücreler kayıt tutmaz, drill yapar).
   Runtime'da `App.itemsByCell` state'i bunları tutar, kullanıcı ekleyip siler,
   **localStorage** (`assist-intelligence:items.v1`) ile kalıcılaşır (load'da `{...seed, ...stored}` merge).

**Görsel adaptörler:** `App`, veriden hafif **`MapCell`** (`id,label,icon,accent,stat,status,drillable`)
üretip `HoneycombMap`'e verir. Bir YAPRAK açılınca `lib/cells.ts › subCellToView(sub, parent, count)`
onu `Honeycomb`-şekline çevirir ki detay paneli aynı şekilde render etsin.

---

## 4) Etkileşim modeli (App state)

- **`focusId: string | null`** — Focus Mode: hangi ana hücre merkezde (alt hücreleri gösterilir). `null` = Overview.
- **`selectedId: string | null`** — sağda hücre katmanı açık olan hücre (core / ana hücre / alt hücre).

Kurallar:
- **Overview** (`focusId=null`): Core + 8 ana hücre. Sağ = **RightConsole**.
- **Bir hücreye tıkla** → `select(id)`: sağda **CellDetailPanel** açılır, o hücre + ilişkili hücreler +
  kenarlar vurgulanır, diğerleri hafif sönükleşir. **Grafik Overview'da kalır** (drill YOK).
- **"Focus this cell"** (detay paneli) veya **ViewModeToggle → Focus** → `enterFocus(id)`: hücre merkeze
  hub olur, alt hücreleri etrafında açılır. Breadcrumb (← Assist Core › X) / hub'a tıklama / **Overview toggle**
  / `Esc` → geri.
- Sağ sütun: `selectedId` varsa **CellDetailPanel**, yoksa **RightConsole** (swap).
- **Esc**: önce açık hücre katmanını kapatır; yoksa Focus'tan çıkar.
- Deep-link `?node=<id>`: ana hücre → seç; alt hücre → parent'ı Focus + alt hücreyi seç; `core` → seç.
- Mobil (< 980px): grafik yerine `MobileGrid` (kart ızgarası); detay **bottom sheet** (modal, focus-trap).

---

## 5) Tasarım sistemi (bunlara sadık kal — "sakin/ince/premium")

**Palet** (`index.css :root` ↔ `tailwind.config.js` colors — İKİSİNİ SENKRON TUT):
bg `#070912 / #0B1020 / #111827`; cyan `#5EEAD4` (primary), teal `#2DD4BF` (memory),
violet `#8B5CF6` (agents/2.), purple `#A78BFA` (research), amber `#FACC15` (decisions),
rose `#FB7185` (urgent); metin `#F8FAFC` / `#94A3B8`; line `rgba(148,163,184,0.16)`.
Font: **Inter** (uppercase yalnızca `.kicker` metadata'da).

**Aksan sistemi:** `lib/accents.ts` her `Accent` için TAM Tailwind class string'leri döndürür
(`text-*`, `border-*`, `bg-*/10`, `shadow-glow-*`, `dot`, `badge`, `soft`) + `hex`. Class'ları
ASLA string birleştirme ile üretme (Tailwind purge düşürür). Hücre aksan eşlemesi coreData'da:
memory=teal, tasks=cyan, research=purple, knowledge=violet, studio=purple, decisions=amber,
agents=violet, inbox=teal.

**Hareket kuralları (KRİTİK — sakin kalmalı):**
- Grafik **STATİK** — ambient drift YOK. Node pozisyonları sabit.
- Tek hareket: hover'da küçük kalkış (`translateY(-2px) scale(1.015)`), seçili hücrede
  `scale(1.04)` + 2px kalkış + tek seferlik yumuşak **haloPulse**, seçili kenarlarda hafif akış (edge-active).
- Geçişler ~180ms. Glow küçük/ölçülü (sadece aktivite/seçim/öncelik). Büyük 3D pop-out / neon huzme YOK.
- Node "ince holografik panel": `background: rgba(18,26,46,0.44)` + `backdrop-blur(12px)`, aksan
  hairline, küçük drop-shadow. Detay ASLA node'u şişirmez — sağ panelde açılır.
- **Node katman mimarisi (HoneycombNode):** `node-halo` (seçilide SVG altıgen KONTUR dalgası — asla dolu
  plaka değil) → `node-frame` (kırpılmış kabuk + glow) → `node-face` (= buton; aynı clip-path,
  `transform: scale(FACE_SCALE=0.963)` ile **eş-merkezli iç altıgen** — kutu-inset + yeniden kırpma
  KULLANMA, eğik kenarlarda paralelliği bozar) → `node-inner` (içerik güvenli alanı, `inset: 19% 4%`,
  tüm tipografi `s`'den orantılı + px tabanları, satırlar truncate/nowrap ile sınırlı).

**Token'lar** `index.css :root`: `--node-bg, --panel, --line, --line-strong, --node-radius,
--panel-radius`. `.glass` (ince), `.surface` (kart), `.hex-cell` (0.7px/0.05 alpha),
`.edge/.edge-dashed/.edge-active`. Kenar tipleri: **düz = doğrudan** (hub→hücre),
**kesikli = çıkarımsal** (hücre↔hücre); renk hücrenin aksanı.

---

## 6) Yaygın işleri nasıl yaparsın

- **Yeni ana hücre:** `coreData.ts › nodes`'a bir `Honeycomb` ekle (accent paletten, icon `IconKey`'den,
  `relatedNodes` ile bağla). İstersen `edges`'e spoke ekle. Alt hücreleri `subcells.ts`'e, tohum kayıtları
  `items.ts`'e ekle.
- **Yeni alt hücre:** `subcells.ts › childrenByCell[<mainId>]`'e `SubCell` ekle; `items.ts`'e o id için `DataItem[]` koy.
- **Yeni ikon:** `types.ts › IconKey`'e anahtar ekle + `lib/icons.tsx › ICONS`'a lucide bileşeni ekle.
- **Yeni renk/aksan:** `tailwind.config.js` colors + `index.css` token + `lib/accents.ts`'e ekle (3'ü senkron).
- **Yeni detay bölümü/sekmesi:** `HoneycombDetailPanel.tsx › TABS` + ilgili `tab === "..."` bloğu.
- **Konsol feed'i:** `data/panels.ts › attention[]` / `recommendations[]`.

---

## 7) Bilinen TODO'lar / açık uçlar

- **Ask-the-core** hedef çıkarımı basit anahtar-kelime eşleşmesi (`AddToCoreInput.inferTarget`); gerçek NL/agent'a bağlanabilir. Eklenen kayıt hep `added` etiketi alır.
- Kayıtlarda **düzenleme** yok (ekle/sil var) — inline edit eklenebilir.
- Alt-hücre detayında `relatedNodes` boş (yapraklar çapraz-bağsız); istenirse kardeş alt hücreler ilişki olarak gösterilebilir.
- **Open / Connect** action linkleri placeholder (`#`).
- İkinci seviye alt-hücre tohum verileri kısa; zenginleştirilebilir.
- Backend yok; her şey in-memory + localStorage.
- Deep-link durumu URL'e geri yazılmıyor (sadece ilk yüklemede okunuyor).

---

## 8) Son inceleme durumu (2026-07-02)

Son tur: tasarım denetimi sonrası **kompozisyon yeniden tasarımı** — `layoutCircuit` artık kafese
snap etmiyor (kusursuz simetrik yörünge, `ringR` export, n≤5 halkalar daha sıkı); haritada `.orbit-guide`
halkası; kenarlar node sınırına **kırpılıyor** (`trimSegment`; hücre 1.2s, merkez 1.28s); node'da
tepe-köşe durum ışığı (top-[9%] — %0'da clip genişliği sıfır olduğundan KASITLI) + `statLabel` birim
satırı; tüm coreData açıklamaları amaç-güdümlü yeniden yazıldı. Build + typecheck **yeşil**.

**KRİTİK RENDER DERSLERİ (tekrar ekleme!):**
1. `clip-path + backdrop-filter + transform` AYNI elemanda → Chromium backdrop'ı KIRPMADAN bounding-box
   olarak boyar (yüzey altıgen yerine blok görünür). Node face'te backdrop-filter YOK — bilerek.
2. Node face iç bükülmesi `inset` ile DEĞİL `transform: scale(FACE_SCALE=0.963)` ile (eş-merkezli benzer
   poligon; kutu-inset eğik kenarlarda paralelliği bozar).
3. Eski dekoratif `.hex-seat` yuva konturları KALDIRILDI: inline stil verilen SVG seat path'leri
   Chromium'da koordinatlarından kaymış render edildi ("altıgenden taşan mor alan" şikayetinin kaynağı).
   Geri ekleme; yapı orbit + node frame'leriyle taşınıyor.
4. Arka plan ızgara modülü node boyutundan AYRI (`fieldS = s*0.62`) — aynı boyutta olursa node'ların
   yanında "kaymış hayalet altıgen" gibi okunur.

**Sınır:** `dgn-karaca` altındaki kardeş projelere (third-brain, dogan-knowledge-map, samal vb.)
dokunma — onlar sadece referans/ilham. Bu proje bağımsız.
