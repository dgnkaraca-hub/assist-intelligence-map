# Assist Intelligence

> **Devralan agent buradan başla → [`HANDOFF.md`](HANDOFF.md)** (mimari, veri modeli,
> etkileşim/tasarım sistemi, "nasıl eklerim", TODO'lar ve doğrulama gotcha'ları).

Doğan Karaca için tasarlanmış, **sakin ve premium bir kişisel AI işletim sistemi /
second-brain arayüzü**. Ortada bir **Assist Core** (Context Orchestration Hub) ve
etrafında altıgen **bilgi hücreleri** olan bir honeycomb bilgi grafiği. İnce holografik
node'lar, tipli bağlantılar, tıklanınca sağda açılan **sekmeli hücre katmanı**
(Overview/Items/Relations/Actions) ve operasyonel bir konsol. Yön: **ince, sakin,
premium, spatial, okunabilir** — oyun HUD'u / neon cyberpunk değil.

Saf siyah bir hex-devre alanının merkezinde parlayan bir **Assist Core** orb durur;
çevresinde sekiz **honeycomb hücre** (Memory · Tasks · Research · Knowledge · Studio
· Decisions · Agents · Inbox) hex hücreleri olarak yerleşir ve Core'a hex-hizalı,
akan kesikli **devre izleriyle** bağlanır.

**Tıklanabilir hücreler (detay paneli):** her hücre (ve Core) tıklanabilir bir
*bilgi hücresi*dir. Tıklayınca:
- hücre **seçili** kalır, **ilişkili hücreleri** haritada parlak akan izlerle
  vurgulanır, ilgisiz hücreler sönükleşir;
- konsol tarzı bir **detay paneli** açılır — masaüstünde sağ rayda bir çekmece
  (drawer, non-modal), mobilde karartılmış arka plan üzerinde bir **bottom sheet**
  (modal: odak içeride hapsolur, Esc/X/arka plana dokunma kapatır);
- panel tamamen veriden render edilir: ikon · başlık · kategori · durum rozeti ·
  son güncelleme · açıklama · detaylar · metrik kartları · ilişkili hücreler · etiketler
  · **Open / Add Note / Connect Node** aksiyonları · numaralı "Suggested next" listesi.

Paneldeki **ilişkili hücreye** tıklayınca panel o hücreye geçer. Merkez **Core**
da bir hücredir → "Main Console" görünümünü açar (tüm devre aydınlanır).
Kapatma: X · `Esc` · boş haritaya tıklama (masaüstü) · arka plana dokunma (mobil).
`?node=<id>` ile doğrudan bir hücreye derin bağlantı verilebilir (örn. `/?node=research`).
Yanda (seçim yokken) glassmorphism **Assist Console** + öneri rayı yüzer.

- Bağımsız proje — `dgn-karaca` ve samal-network ile bağı yok (referans tasarımlar
  yalnızca ilham içindir).
- React 18 + TypeScript (strict) + Vite 5 + Tailwind 3 + lucide-react. Animasyon
  kütüphanesi yok — tüm hareket `tailwind.config.js` içindeki CSS keyframe'leri ile;
  `prefers-reduced-motion` desteklenir.

## Çalıştırma

```bash
cd /Users/yontem/Desktop/karaca-dgn/assist-intelligence
npm install
npm run dev          # http://localhost:5190  (strictPort)
```

| Script              | Ne yapar                                  |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Vite dev sunucusu, port **5190**          |
| `npm run build`     | `tsc -b && vite build` → `dist/`          |
| `npm run preview`   | Production build önizleme, port 5190      |
| `npm run typecheck` | `tsc --noEmit` (app projesi)              |

## Yapı

```
src/
  App.tsx                    # kokpit: seçim state'i + harita + ray/sheet + Esc + deep-link
  index.css                  # CSS-var tokenlar + .hex-* / .glass / .trace
  types.ts                   # Honeycomb modeli + paylaşılan tipler
  data/
    coreData.ts              # Core + 8 hücre + edge'ler + honeycombById lookup
    panels.ts                # console transcript + öneriler
  lib/
    layout.ts                # hex lattice geometrisi (layoutCircuit + hex yardımcıları)
    scene.ts                 # buildScene: seçim/ilişki/hover'a göre {frames, traces}
    accents.ts               # accent → tam Tailwind class map (violet dahil)
    icons.tsx                # iconFor() (lucide-react)
  components/
    HoneycombMap.tsx         # ölçülen sahne: ConnectionMap + AssistCore + HoneycombNode
    HoneycombNode.tsx        # tıklanabilir hücre chip'i (selected/related/dimmed/hover)
    AssistCore.tsx           # merkez orb hücresi (breathing + orbital ringler)
    ConnectionMap.tsx        # Scene üzerinden çizen SVG honeycomb/trace/frame katmanı
    HoneycombDetailPanel.tsx # konsol tarzı detay paneli (panel | sheet variant)
    MetricCard.tsx           # tek metrik kartı
    RelatedNodeList.tsx      # ilişkili hücre chip'leri (tıkla → panel o hücreye geçer)
    NodeActionButtons.tsx    # Open / Add Note / Connect Node
    GlassPanel.tsx           # glassmorphism panel
    AssistConsole.tsx        # agent chat / I/O paneli (seçim yokken)
```

Tüm hücre içeriği `src/data/coreData.ts`'te ve `src/types.ts` (`Honeycomb`) ile
tiplenir — panel hiçbir içeriği JSX'e gömmez, hepsi veriden render edilir. Geometri
tamamen `src/lib/layout.ts`'te (React/DOM bilmez); seçim/ilişki vurgusu
`src/lib/scene.ts`'te hesaplanır; bileşenler yalnızca çizer.

> Başlangıç notu ve tasarım briefi için bkz.
> [`AGENT_HANDOFF_PROMPT.md`](AGENT_HANDOFF_PROMPT.md).
