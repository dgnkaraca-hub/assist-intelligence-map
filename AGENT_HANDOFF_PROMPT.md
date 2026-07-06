# Assist Intelligence — Agent Handoff Prompt

> **Nasıl kullanılır:** Bu klasörde (`/Users/yontem/Desktop/karaca-dgn/assist-intelligence`)
> **yeni bir Claude Code sohbeti** aç ve aşağıdaki "PROMPT" bölümünün tamamını ilk mesaj
> olarak yapıştır. Bu sohbet `karaca-dgn`'ye bağlıdır; `dgn-karaca` ve samal-network ile
> **hiçbir bağı yoktur** — referans tasarımlar yalnızca ilham içindir, o repolara dokunma.

---

## PROMPT (kopyala-yapıştır)

Sen `assist-intelligence` adlı yeni bir projeyi sıfırdan kuracaksın. Bu, **karaca-dgn**
çalışma alanının ilk projesi ve bağımsızdır.

### Ürün konsepti
**Assist Intelligence** (tasarım teması: **"Obsidian Atrium"**) — Doğan Karaca için
tasarlanmış, karanlık ve sinematik bir **AI agent konsolu / kokpit**. İki mevcut tasarım
dilinin birleşimidir:

> ⚑ **Görsel dilin tek kaynağı [`DESIGN_LANGUAGE.md`](DESIGN_LANGUAGE.md)** — tam renk
> tokenları, tipografi, yerleşim, hareket ve bileşen spec'i oradadır. Hazır referans
> mockup: [`design-mockup.html`](design-mockup.html). Aşağıdaki özet yalnızca yönlendirme;
> çelişki olursa `DESIGN_LANGUAGE.md` geçerlidir.

1. **İkinci beyin (second brain)** — *Doğan Knowledge Map*'ten gelen **saf siyah zemin
   üzerinde geometrik hex-petek devre (honeycomb circuit)** estetiği: pointy-top hex
   lattice, hex hücreleri, 60° eksenlerde köşeli "elbow" devre izleri (traces), akan
   kesikli bağlantılar (current-on-circuit), uzay-mavisi/yıldız-beyazı paleti, yıldız
   noktası gibi parlayan düğümler.
2. **Üçüncü beyin (third brain)** — *Third Brain OS*'tan gelen **neon AI-OS dashboard**
   estetiği: merkezde parlayan bir **Core orb**, etrafında "intelligence node"lar,
   glassmorphism panelleri, parlayan kenarlıklar, radial glow'lar, cyan/mavi/amber neon
   vurgular.

**Birleşim:** Saf siyah bir hex-devre alanı üzerinde merkezde parlayan bir **"Assist
Core"** orb durur. Çevresinde, devre izleriyle (hex-aligned elbow traces) Core'a bağlı
**intelligence node**'lar hex hücreleri olarak yerleşir (örn. Memory, Tasks, Research,
Knowledge, Studio, Decisions, Agents, Inbox). Bağlantılar akan kesikli izlerle "devrede
akan akım" hissi verir. Sohbet/çıktı panelleri glassmorphism camlardır. Sonuç: ikinci
beynin devre haritası + üçüncü beynin AI-OS panelleri = tek bir agent kokpiti.

### Teknik yığın (siblings ile birebir tutarlı)
- **React 18 + TypeScript (strict) + Vite 5 + Tailwind 3 + lucide-react**
- Animasyon kütüphanesi YOK — tüm hareket `tailwind.config.js` içindeki **CSS keyframes**
  ile (third-brain kuralı). `prefers-reduced-motion` desteklenir (second-brain kuralı).
- **Dev port 5190**, `strictPort: true` (kullanımdaki portlar: dogan 5173 · samal 5185 ·
  gobeklitepe 5186 · colleqtor 5188 · third-brain 5189 → assist-intelligence = **5190**).
- `vite.config.ts`: `base: './'` (statik host dostu), `server.port: 5190`,
  `preview.port: 5190`.
- `.node-version` ve `.claude/launch.json` (`assist-intelligence-dev`, port 5190) ekle.
- **Build green olmalı:** `npm run build` (= `tsc -b && vite build`) ve `npm run typecheck`
  hatasız geçmeli.
- **tsc emit footgun'ı engelle:** `tsconfig.node.json` içinde `composite` ile birlikte
  `"outDir": "./node_modules/.tmp/node-build"` ver ki `tsc -b` köke `vite.config.js`
  yazıp config'i gölgelemesin (third-brain'de yaşanan tuzak).

### Tasarım sistemi (birleşik tokenlar)
> **Tam token seti, tipografi ve hareket spec'i için [`DESIGN_LANGUAGE.md`](DESIGN_LANGUAGE.md)
> kullan** — burada yalnızca ana hatlar var. Tüm "enerji" tek güç spektrumunda okunur:
> `--signal-blue #5b8cff` (resting/live) → `--current-cyan #22d3ee` (going live) →
> `--ice-peak #a5f3fc` (en sıcak peak). `--signal-amber #facc15` spektrum dışı TEK sıcak
> vurgudur ve ekranda ≤1–2 öğeyle sınırlı tutulur. Zemin saf siyah `#000`, ~%70 boş kalır.

CSS değişkenleri `src/index.css`'te tanımlanır; Tailwind paleti `tailwind.config.js`'te
**aynen** aynalanır (ikisini senkron tut). Çekirdek tokenlar (tamamı DESIGN_LANGUAGE.md'de):

```
--atrium-black #000000   --void-navy   #04060f   --deep-navy-2 #070a14
--panel-glass  rgba(10,15,28,.55)       --hairline rgba(120,140,180,.12)
--hex-field rgba(110,145,220,.06)  --hex-pad-base rgba(140,175,255,.18)  --hex-pad-peak rgba(178,206,255,.40)
--trace-rest #3a4a6e  --signal-blue #5b8cff  --current-cyan #22d3ee  --ice-peak #a5f3fc
--core-teal #0e3a52  --core-deep #04222e  --signal-amber #facc15  --amber-light #fde68a
--ink #e9eef9  --ink-2 #aeb9d2  --muted #7a849c  --accent-soft rgba(91,140,255,.14)
--glow-bloom rgba(91,140,255,.45)  --glow-cyan rgba(34,211,238,.35)  --glow-amber rgba(250,204,21,.30)
```

Tipografi: serif `Instrument Serif` (yalnız "Assist" wordmark + seçili düğümün dev hayalet
filigranı) · sans `Space Grotesk` (düğüm adları, başlık) · mono `JetBrains Mono` (UPPERCASE
geniş-tracking mikro-etiketler/eyebrow/status). Hareket (CSS keyframes): `core-breathe`,
`hex-pulse` (staggered), `trace-flow` (yalnız aktif iz), `glow-pulse`, `particle-stream`
(tek SMIL parçacık), `status-blink`, `focus-settle` — hepsi `prefers-reduced-motion`'a saygılı.

- **Arka plan:** `--atrium-black` (#000) üzerine merkezde radial mavi glow havuzu (`glow-pulse`).
- **Düğümler:** framed hex hücre (second brain `.hex-node`) + neon parlama + glassmorphism
  içerik (third brain). Hafif staggered `hexPulse` shimmer.
- **Bağlantılar:** tüm konnektörler `<path>`; 60° eksenlerde hex-aligned **elbow traces**;
  aktif/ilişki izleri kesikli + akan `traceFlow` (current-on-circuit).
- **Core:** merkezde nefes alan (breathing) parlayan orb; tıklanınca/aktifken yoğunlaşan
  radial glow.
- **Paneller:** glassmorphism (blur + yarı saydam + parlayan ince kenarlık).
- **Tipografi:** UI sans-serif; düğüm/rim etiketlerinde ince serif aksanı (second brain rim
  etiketi geleneği) opsiyonel.

### Mimari & konvansiyonlar
- **Tüm kod/yorum/UI metni İngilizce** (sibling kuralı). Ürün adı görünürde "Assist
  Intelligence", klasör adı `assist-intelligence` — sapma yok.
- **Data-driven:** tüm içerik `src/data/*` altında, `src/types.ts` ile tiplenir.
  - Core + intelligence node tanımları, bağlantılar (edges), ve panel içerikleri data'da.
  - Tailwind purge tuzağına karşı accent→class eşlemesi `src/lib/accents.ts`'te **tam
    string** olarak (kısmi class üretme).
  - İkonlar `src/lib/icons.tsx` içinde `iconFor()` ile (lucide-react).
- **Geometri/layout** `src/lib/layout.ts`'te: hex lattice yardımcıları (`hexSize`,
  `axialToPixel`, `pixelToAxial`, `hexPath`, `hexElbowPath`), Core merkez + node'ların iç
  halkaya hex snap'i, çakışma kaçınması.
- **Bağlantı çizimi** DOM ölçen bir `ConnectionMap`/SVG katmanı (third brain) ama
  hex-aligned elbow rotasıyla (second brain).
- İlk veriler placeholder olabilir; gerçek içerik sonra doldurulur.

### Önerilen dosya yapısı
```
assist-intelligence/
  index.html
  package.json            # name: "assist-intelligence", scripts: dev/build/preview/typecheck
  vite.config.ts          # port 5190 strict, base './'
  tailwind.config.js      # palet + keyframes (hexPulse, traceFlow, coreBreathe, glowPulse)
  postcss.config.js
  tsconfig.json / tsconfig.app.json / tsconfig.node.json
  .node-version
  .gitignore
  .claude/launch.json     # assist-intelligence-dev, 5190
  src/
    main.tsx
    App.tsx               # AssistCore + hex-circuit alanı + glass panel layout
    index.css             # CSS-var tokenlar + .hex-svg/.hex-cell/.hex-node + glass + glow
    types.ts
    data/
      coreData.ts         # Core + intelligence nodes + edges
      panels.ts           # panel içerikleri (chat, recommendations, vb.)
    lib/
      layout.ts           # hex lattice + elbow trace yardımcıları
      accents.ts          # accent→full Tailwind class map
      icons.tsx           # iconFor()
    components/
      AssistCore.tsx      # merkez orb
      IntelligenceNode.tsx# hex hücre düğüm
      ConnectionMap.tsx   # SVG elbow trace katmanı (akan dash)
      GlassPanel.tsx      # glassmorphism panel
      AssistConsole.tsx   # agent chat / I/O paneli
```

### Çalışma sırası
1. Vite + React + TS iskeletini kur, bağımlılıkları yükle, build'i yeşile al.
2. Tasarım tokenlarını (`index.css` + `tailwind.config.js`) ve keyframe'leri ekle.
3. Hex layout yardımcılarını (`layout.ts`) yaz; Core + node'ları yerleştir.
4. `ConnectionMap` ile hex-aligned akan devre izlerini çiz.
5. `AssistCore`, `IntelligenceNode`, `GlassPanel`, `AssistConsole` bileşenlerini birleştir.
6. Responsive (mobilde node grid'e düş) + `prefers-reduced-motion` ekle.
7. `npm run dev` (5190) ile doğrula; build + typecheck yeşil bıraktığından emin ol.

### Doğrulama notu
Bu sohbet `assist-intelligence` klasörünün kökünde açıldığı için preview MCP bu projeye
bağlanabilir (sibling'lerde `.claude/launch.json` bunu sağlıyor). Preview çalışmazsa
headless Chrome ile ekran görüntüsü al:
`/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless=new
--screenshot=out.png --window-size=1440,900 --virtual-time-budget=3500
http://localhost:5190/`

### Sınırlar
- `dgn-karaca` altındaki hiçbir projeye (third-brain, dogan-knowledge-map, samal vb.)
  **dokunma**; onlar sadece tasarım referansı.
- Yeni git deposu istenirse temiz başlat (remote yok); kullanıcı isterse sonra bağlanır.

İlk olarak iskeleti kurup build'i yeşile al, sonra tasarımı katman katman ekle.
