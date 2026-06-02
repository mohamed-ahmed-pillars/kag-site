# Private Label Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or superpowers:subagent-driven-development if same-session) to implement this plan task-by-task.

**Goal:** Ship a dedicated `/private-label` page with a fresh full-screen hero, capabilities grid, process timeline, packaging cards, certifications marquee, FAQ, and CTA — styled with the same framer-motion vocabulary as `WhoWeAreSection`, fully tri-lingual (EN/AR/FR).

**Architecture:** Next.js 16 app-router page at `src/app/[locale]/private-label/page.tsx`, composed of 6 new client components in `src/components/ui/`. Heading blocks, parallax blobs, staggered child variants, and scroll-tied transforms mirror `WhoWeAreSection`/`GlobalReachSection`. The existing certifications marquee is extracted from `WhoWeAreSection` into a shared component so both pages render the same DOM. The home `PrivateLabelSection` is unchanged.

**Tech Stack:** Next.js 16 (Turbopack, app router), React 19, TypeScript 5, Tailwind v4 (brand tokens `bg-primary` #374c9b / `bg-secondary` #d5de24), framer-motion 12, next-intl 4 (`localePrefix: as-needed`), shadcn/Radix UI (`Accordion`, `Button`), lucide-react, bun.

**Verification convention:** This codebase has no unit-test runner configured, so each task's verification gate is `bun run typecheck` (must exit 0). The final task adds a full `bun run build` gate. UI behavior is verified manually in the dev server.

**Spec reference:** `docs/superpowers/specs/2026-06-02-private-label-page-design.md` — read this first if you need section-by-section design rationale, animation parameters, or acceptance criteria.

**Repo conventions (do not violate):**
- No `Co-Authored-By: Claude` trailer on commits.
- Stage with `git add .` (not file-by-file).
- Sections do not set a `bg-*` on their root — body's `/bg6.jpg` shows through.
- Section `<h2>` underline must use `bg-secondary` (lime), never primary.
- Primary CTAs use `FlowButton` from `@/components/ui/flow-button`.
- Prefer `/public/pattern/*-lime.png` icons over lucide when a brand icon fits.
- `AGENTS.md` warning: this is Next.js 16 — read `node_modules/next/dist/docs/` before reaching for old APIs.

---

## Task 1 — i18n: add `nav.privateLabel` + `privateLabelPage` namespace

**Files:**
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/ar.json`
- Modify: `src/i18n/messages/fr.json`

**Step 1.1 — Locate `nav.ourBrands` key in `en.json`**

```bash
grep -n '"ourBrands"' src/i18n/messages/en.json
```

Insert `"privateLabel": "Private Label"` as a sibling key immediately after `ourBrands` inside `nav`.

**Step 1.2 — Add `privateLabelPage` namespace at root of `en.json`**

Insert this object as a new top-level sibling (e.g., after the existing `privateLabel` namespace used by the home teaser — do not modify that namespace):

```jsonc
"privateLabelPage": {
  "hero": {
    "eyebrow": "PRIVATE LABEL",
    "heading": "Your Brand, Built in Egypt",
    "subhead": "From recipe development to export-ready cartons — we manufacture, fill, and ship your private label across the Middle East, Europe, and Africa.",
    "cta": "Explore capabilities"
  },
  "capabilities": {
    "eyebrow": "CAPABILITIES",
    "heading": "End-to-end private-label manufacturing",
    "intro": "Six pillars that take your concept from a brief on the table to cartons leaving the port.",
    "items": {
      "rnd":           { "title": "R&D & Formulation",       "description": "Hand us a flavor brief, a target market, or a competitor sample — our food technologists develop, iterate, and lock the recipe with you." },
      "manufacturing": { "title": "In-house Manufacturing",  "description": "Tomato paste, fava, jams, juices — all produced under one roof on lines built for consistency, traceability, and food safety." },
      "packaging":     { "title": "Packaging Flexibility",   "description": "Tins, glass jars, PET bottles, and pouches — pick a format and capacity that fits your shelf, your margin, and your market." },
      "regulatory":    { "title": "Regulatory & Labeling",   "description": "Country-specific labels, ingredient declarations, nutritional panels, and export documentation handled by our compliance team." },
      "qa":            { "title": "QA & Certifications",     "description": "ISO 22000, HACCP, Halal, FDA, GMP, and BRC — every batch is tested, logged, and traceable from raw input to sealed carton." },
      "logistics":     { "title": "Export Logistics",        "description": "Container loading, port handling, and Incoterms support — we get your brand from our gate to your importer's door." }
    }
  },
  "process": {
    "eyebrow": "PROCESS",
    "heading": "How a private-label project moves",
    "intro": "Six clear stages — most projects move from brief to first shipment in 12 to 16 weeks.",
    "steps": {
      "brief":      { "title": "Brief & Goals",        "description": "We align on your target market, price point, packaging format, and volume so the rest of the project is calibrated correctly." },
      "recipe":     { "title": "Recipe Development",   "description": "Our R&D team formulates to your taste profile, regulatory needs, and shelf-life targets — iterating until the spec is yours." },
      "samples":    { "title": "Samples & Sign-off",   "description": "We ship sealed samples for tasting, lab analysis, and label proofing. Nothing moves to production until you've signed off." },
      "pilot":      { "title": "Pilot Run",            "description": "A short pilot batch validates the production parameters, label artwork, and packaging integrity on the actual line." },
      "production": { "title": "Full Production",      "description": "Your order is scheduled, raw materials are released, and the line runs to spec — with QA samples pulled from every batch." },
      "shipment":   { "title": "Shipment & Aftercare", "description": "We load the container, hand over export documentation, and stay on the line for any reorder or formula tweak you need." }
    }
  },
  "packaging": {
    "eyebrow": "FORMATS",
    "heading": "Packaging that fits your market",
    "intro": "Four families of packaging, each with the capacities our retail and food-service customers ask for most.",
    "items": {
      "tin":   { "title": "Tin (Canned)",   "moq": "MOQ: 1× 20ft FCL", "capacities": ["400 g", "800 g", "2.5 kg", "4.5 kg"] },
      "glass": { "title": "Glass Jar",      "moq": "MOQ: 1× 20ft FCL", "capacities": ["250 g", "450 g", "650 g"] },
      "pet":   { "title": "PET Bottle",     "moq": "MOQ: 1× 20ft FCL", "capacities": ["250 ml", "500 ml", "1 L"] },
      "pouch": { "title": "Pouch / Stick",  "moq": "MOQ: 1× 20ft FCL", "capacities": ["80 g", "250 g"] }
    }
  },
  "certifications": { "heading": "Certified production, every batch" },
  "faq": {
    "eyebrow": "FAQ",
    "heading": "Questions we hear most",
    "items": {
      "moq":        { "question": "What are your minimum order quantities?",
                      "answer":   "We typically work in full container loads — 1× 20ft FCL is our standard MOQ. Smaller pilot runs are possible during the sampling phase." },
      "leadTime":   { "question": "How long from brief to first shipment?",
                      "answer":   "Most projects ship the first container 12 to 16 weeks after the brief is locked. Reorders move much faster — usually 4 to 6 weeks." },
      "samples":    { "question": "Do you charge for samples?",
                      "answer":   "Initial concept samples are free. Custom-formulated samples covering R&D time are quoted per project and credited against your first production order." },
      "artwork":    { "question": "Can you handle custom label artwork?",
                      "answer":   "Yes — bring us your finished artwork or work with our in-house design partner. We pre-press, proof, and validate against the destination market's labeling rules." },
      "regulatory": { "question": "Which export documents do you provide?",
                      "answer":   "Commercial invoice, packing list, certificate of origin, health certificate, halal certificate, and any destination-specific documents your importer needs." },
      "incoterms":  { "question": "Which Incoterms do you support?",
                      "answer":   "FOB Alexandria is our default, but we routinely arrange CIF, CFR, and DDP shipments to most markets we serve." }
    }
  },
  "cta": {
    "heading": "Ready to start a private-label project?",
    "sub": "Send us a brief and we'll be back within two business days with a sampling plan, indicative pricing, and a project timeline.",
    "button": "Request a quote"
  }
}
```

**Step 1.3 — Mirror into `ar.json`**

Add `"privateLabel": "العلامة الخاصة"` as a sibling of `ourBrands` inside `nav`, and add the parallel `privateLabelPage` namespace with Arabic translations. Use this copy:

```jsonc
"privateLabelPage": {
  "hero": {
    "eyebrow": "العلامة الخاصة",
    "heading": "علامتك التجارية، تُصنع في مصر",
    "subhead": "من تطوير الوصفة إلى الكراتين الجاهزة للتصدير - نُصنّع ونعبّئ ونشحن علامتك الخاصة عبر الشرق الأوسط وأوروبا وأفريقيا.",
    "cta": "استكشف القدرات"
  },
  "capabilities": {
    "eyebrow": "القدرات",
    "heading": "تصنيع العلامات الخاصة من الألف إلى الياء",
    "intro": "ست ركائز تأخذ فكرتك من الإيجاز على الطاولة إلى كراتين تغادر الميناء.",
    "items": {
      "rnd":           { "title": "البحث والتطوير وتطوير الوصفات", "description": "أعطنا ملف نكهة أو سوقًا مستهدفًا أو عينة منافسة - يقوم خبراء التغذية لدينا بتطوير الوصفة وتكرارها وتثبيتها معك." },
      "manufacturing": { "title": "التصنيع الداخلي",                "description": "صلصات الطماطم والفول والمربيات والعصائر - تُنتَج جميعها تحت سقف واحد على خطوط مصممة للثبات وقابلية التتبع وسلامة الغذاء." },
      "packaging":     { "title": "مرونة العبوات",                  "description": "علب معدنية، برطمانات زجاجية، زجاجات PET، وأكياس - اختر التنسيق والسعة التي تناسب رفك وهامش ربحك وسوقك." },
      "regulatory":    { "title": "التنظيم والملصقات",              "description": "ملصقات خاصة بكل دولة، بيانات المكونات، الجداول الغذائية، ومستندات التصدير - كلها يتولاها فريق الامتثال لدينا." },
      "qa":            { "title": "الجودة والشهادات",               "description": "ISO 22000 وHACCP وحلال وFDA وGMP وBRC - كل دفعة تُختبر وتُسجَّل وتُتتبَّع من المادة الخام إلى الكرتون المختوم." },
      "logistics":     { "title": "اللوجستيات والتصدير",            "description": "تحميل الحاويات والتعامل في الموانئ ودعم Incoterms - نوصل علامتك من بوابتنا إلى باب مستوردك." }
    }
  },
  "process": {
    "eyebrow": "العملية",
    "heading": "كيف يسير مشروع العلامة الخاصة",
    "intro": "ست مراحل واضحة - معظم المشاريع تنتقل من الإيجاز إلى أول شحنة في 12 إلى 16 أسبوعًا.",
    "steps": {
      "brief":      { "title": "الإيجاز والأهداف",       "description": "نتفق على سوقك المستهدف وسعرك وتنسيق العبوة والحجم حتى تتم معايرة باقي المشروع بشكل صحيح." },
      "recipe":     { "title": "تطوير الوصفة",           "description": "يقوم فريق البحث والتطوير لدينا بصياغة وفقًا لملف النكهة الخاص بك والاحتياجات التنظيمية وأهداف العمر الافتراضي - مع التكرار حتى تصبح المواصفات ملكك." },
      "samples":    { "title": "العينات والموافقة",      "description": "نشحن عينات مختومة للتذوق والتحليل المخبري وفحص الملصقات. لا شيء ينتقل إلى الإنتاج حتى توقع عليه." },
      "pilot":      { "title": "التشغيل التجريبي",       "description": "دفعة تجريبية قصيرة تتحقق من معايير الإنتاج وفن الملصق وسلامة العبوة على الخط الفعلي." },
      "production": { "title": "الإنتاج الكامل",         "description": "يتم جدولة طلبك وإطلاق المواد الخام وتشغيل الخط وفقًا للمواصفات - مع سحب عينات الجودة من كل دفعة." },
      "shipment":   { "title": "الشحن والمتابعة",        "description": "نحمّل الحاوية ونسلّم وثائق التصدير ونبقى على تواصل لأي طلب إعادة أو تعديل في الصيغة تحتاجه." }
    }
  },
  "packaging": {
    "eyebrow": "الأنواع",
    "heading": "عبوات تناسب سوقك",
    "intro": "أربع عائلات من العبوات، كل منها بالسعات التي يطلبها عملاؤنا في البيع بالتجزئة والخدمات الغذائية.",
    "items": {
      "tin":   { "title": "علبة معدنية",      "moq": "الحد الأدنى: حاوية 20 قدمًا واحدة", "capacities": ["400 جم", "800 جم", "2.5 كجم", "4.5 كجم"] },
      "glass": { "title": "برطمان زجاجي",     "moq": "الحد الأدنى: حاوية 20 قدمًا واحدة", "capacities": ["250 جم", "450 جم", "650 جم"] },
      "pet":   { "title": "زجاجة PET",        "moq": "الحد الأدنى: حاوية 20 قدمًا واحدة", "capacities": ["250 مل", "500 مل", "1 لتر"] },
      "pouch": { "title": "كيس / أصبع",       "moq": "الحد الأدنى: حاوية 20 قدمًا واحدة", "capacities": ["80 جم", "250 جم"] }
    }
  },
  "certifications": { "heading": "إنتاج معتمد، في كل دفعة" },
  "faq": {
    "eyebrow": "الأسئلة الشائعة",
    "heading": "أكثر الأسئلة شيوعًا",
    "items": {
      "moq":        { "question": "ما هو الحد الأدنى لكميات الطلب لديكم؟",
                      "answer":   "نعمل عادةً بحمولة حاوية كاملة - حاوية 20 قدمًا واحدة هي الحد الأدنى القياسي لدينا. التشغيلات التجريبية الأصغر ممكنة خلال مرحلة أخذ العينات." },
      "leadTime":   { "question": "كم يستغرق من الإيجاز إلى أول شحنة؟",
                      "answer":   "تشحن معظم المشاريع الحاوية الأولى بعد 12 إلى 16 أسبوعًا من تثبيت الإيجاز. إعادة الطلبات تتحرك بشكل أسرع - عادة 4 إلى 6 أسابيع." },
      "samples":    { "question": "هل تتقاضون رسومًا على العينات؟",
                      "answer":   "عينات المفاهيم الأولية مجانية. العينات المُصاغة خصيصًا التي تغطي وقت البحث والتطوير تُسعَّر لكل مشروع وتُحتسب مقابل أول طلب إنتاج." },
      "artwork":    { "question": "هل يمكنكم التعامل مع تصميم الملصقات المخصصة؟",
                      "answer":   "نعم - أحضر تصميمك الجاهز أو اعمل مع شريك التصميم الداخلي لدينا. نقوم بالتجهيز للطباعة والمراجعة والتحقق وفقًا لقواعد ملصقات السوق المستهدف." },
      "regulatory": { "question": "ما هي وثائق التصدير التي توفرونها؟",
                      "answer":   "فاتورة تجارية، قائمة تعبئة، شهادة منشأ، شهادة صحية، شهادة حلال، وأي وثائق محددة لكل وجهة يحتاجها مستوردك." },
      "incoterms":  { "question": "ما هي Incoterms التي تدعمونها؟",
                      "answer":   "FOB الإسكندرية هو خيارنا الافتراضي، لكننا نرتب بانتظام شحنات CIF وCFR وDDP إلى معظم الأسواق التي نخدمها." }
    }
  },
  "cta": {
    "heading": "جاهز لبدء مشروع علامة خاصة؟",
    "sub": "أرسل لنا إيجازًا وسنعود إليك خلال يومي عمل بخطة عينات وأسعار استرشادية وجدول زمني للمشروع.",
    "button": "اطلب عرض سعر"
  }
}
```

**Step 1.4 — Mirror into `fr.json`**

Add `"privateLabel": "Marque de Distributeur"` as a sibling of `ourBrands` inside `nav`, and add the parallel `privateLabelPage` namespace with French translations. Use this copy:

```jsonc
"privateLabelPage": {
  "hero": {
    "eyebrow": "MARQUE DE DISTRIBUTEUR",
    "heading": "Votre marque, fabriquée en Égypte",
    "subhead": "Du développement de la recette aux cartons prêts à l'export - nous fabriquons, conditionnons et expédions votre marque privée au Moyen-Orient, en Europe et en Afrique.",
    "cta": "Découvrir nos capacités"
  },
  "capabilities": {
    "eyebrow": "CAPACITÉS",
    "heading": "Fabrication de marque privée de bout en bout",
    "intro": "Six piliers qui mènent votre concept du brief sur la table aux cartons quittant le port.",
    "items": {
      "rnd":           { "title": "R&D et formulation",          "description": "Confiez-nous un profil de saveur, un marché cible ou un échantillon concurrent - nos technologues alimentaires développent, itèrent et verrouillent la recette avec vous." },
      "manufacturing": { "title": "Fabrication interne",          "description": "Concentré de tomate, fèves, confitures, jus - tout est produit sous un même toit sur des lignes conçues pour la constance, la traçabilité et la sécurité alimentaire." },
      "packaging":     { "title": "Flexibilité d'emballage",      "description": "Boîtes métalliques, pots en verre, bouteilles PET et poches - choisissez un format et une capacité qui correspondent à votre rayon, votre marge et votre marché." },
      "regulatory":    { "title": "Réglementation et étiquetage", "description": "Étiquettes spécifiques au pays, déclarations d'ingrédients, valeurs nutritionnelles et documentation d'export gérées par notre équipe conformité." },
      "qa":            { "title": "QA et certifications",         "description": "ISO 22000, HACCP, Halal, FDA, GMP et BRC - chaque lot est testé, enregistré et traçable de la matière première au carton scellé." },
      "logistics":     { "title": "Logistique d'export",          "description": "Chargement de conteneurs, manutention portuaire et accompagnement Incoterms - nous acheminons votre marque de notre porte à celle de votre importateur." }
    }
  },
  "process": {
    "eyebrow": "PROCESSUS",
    "heading": "Comment se déroule un projet de marque privée",
    "intro": "Six étapes claires - la plupart des projets passent du brief à la première expédition en 12 à 16 semaines.",
    "steps": {
      "brief":      { "title": "Brief et objectifs",            "description": "Nous alignons votre marché cible, votre prix, votre format d'emballage et votre volume afin que le reste du projet soit calibré correctement." },
      "recipe":     { "title": "Développement de la recette",   "description": "Notre R&D formule selon votre profil gustatif, vos exigences réglementaires et vos objectifs de durée de vie - en itérant jusqu'à ce que la spécification soit la vôtre." },
      "samples":    { "title": "Échantillons et validation",    "description": "Nous expédions des échantillons scellés pour dégustation, analyse en laboratoire et épreuvage des étiquettes. Rien ne passe en production tant que vous n'avez pas validé." },
      "pilot":      { "title": "Lot pilote",                    "description": "Un lot pilote court valide les paramètres de production, l'artwork de l'étiquette et l'intégrité de l'emballage sur la ligne réelle." },
      "production": { "title": "Production complète",           "description": "Votre commande est planifiée, les matières premières libérées et la ligne tourne selon la spec - avec des échantillons QA prélevés sur chaque lot." },
      "shipment":   { "title": "Expédition et suivi",           "description": "Nous chargeons le conteneur, transmettons la documentation d'export et restons disponibles pour toute réassort ou ajustement de formule." }
    }
  },
  "packaging": {
    "eyebrow": "FORMATS",
    "heading": "Un emballage adapté à votre marché",
    "intro": "Quatre familles d'emballage, chacune avec les capacités les plus demandées par nos clients retail et food-service.",
    "items": {
      "tin":   { "title": "Boîte métallique", "moq": "MOQ : 1 conteneur 20ft FCL", "capacities": ["400 g", "800 g", "2,5 kg", "4,5 kg"] },
      "glass": { "title": "Pot en verre",     "moq": "MOQ : 1 conteneur 20ft FCL", "capacities": ["250 g", "450 g", "650 g"] },
      "pet":   { "title": "Bouteille PET",    "moq": "MOQ : 1 conteneur 20ft FCL", "capacities": ["250 ml", "500 ml", "1 L"] },
      "pouch": { "title": "Poche / Stick",    "moq": "MOQ : 1 conteneur 20ft FCL", "capacities": ["80 g", "250 g"] }
    }
  },
  "certifications": { "heading": "Une production certifiée, à chaque lot" },
  "faq": {
    "eyebrow": "FAQ",
    "heading": "Les questions qui reviennent le plus",
    "items": {
      "moq":        { "question": "Quelles sont vos quantités minimales de commande ?",
                      "answer":   "Nous travaillons généralement en conteneur complet - 1 conteneur 20ft FCL est notre MOQ standard. Des séries pilotes plus petites sont possibles pendant la phase d'échantillonnage." },
      "leadTime":   { "question": "Combien de temps entre le brief et la première expédition ?",
                      "answer":   "La plupart des projets expédient le premier conteneur 12 à 16 semaines après la validation du brief. Les réassorts sont bien plus rapides - 4 à 6 semaines en général." },
      "samples":    { "question": "Les échantillons sont-ils facturés ?",
                      "answer":   "Les échantillons de concept initial sont gratuits. Les échantillons formulés sur mesure couvrant le temps R&D sont devisés au projet et crédités sur votre première commande de production." },
      "artwork":    { "question": "Pouvez-vous gérer l'artwork d'étiquette personnalisé ?",
                      "answer":   "Oui - apportez votre artwork finalisé ou travaillez avec notre partenaire design interne. Nous gérons le prépresse, l'épreuvage et la validation selon les règles d'étiquetage du marché de destination." },
      "regulatory": { "question": "Quels documents d'export fournissez-vous ?",
                      "answer":   "Facture commerciale, liste de colisage, certificat d'origine, certificat sanitaire, certificat halal, et tout document spécifique à la destination requis par votre importateur." },
      "incoterms":  { "question": "Quels Incoterms supportez-vous ?",
                      "answer":   "FOB Alexandrie est notre défaut, mais nous arrangeons régulièrement des expéditions CIF, CFR et DDP vers la plupart des marchés que nous servons." }
    }
  },
  "cta": {
    "heading": "Prêt à lancer un projet de marque privée ?",
    "sub": "Envoyez-nous un brief et nous reviendrons sous deux jours ouvrés avec un plan d'échantillonnage, un tarif indicatif et un calendrier projet.",
    "button": "Demander un devis"
  }
}
```

**Step 1.5 — Validate all three JSON files**

```bash
node -e "['en','ar','fr'].forEach(l => { JSON.parse(require('fs').readFileSync('src/i18n/messages/'+l+'.json','utf8')); console.log(l, 'OK'); })"
```
Expected: three `OK` lines.

**Step 1.6 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0, no output.

**Step 1.7 — Commit**

```bash
git add .
git commit -m "i18n(private-label-page): add privateLabelPage namespace and nav.privateLabel across en/ar/fr"
```

---

## Task 2 — Extract `CertificationsMarquee` shared component

**Files:**
- Create: `src/components/ui/certifications-marquee.tsx`
- Modify: `src/components/ui/who-we-are-section.tsx` (replace inline marquee block; remove `certifications` constant)

**Step 2.1 — Create the shared component**

`src/components/ui/certifications-marquee.tsx`:

```tsx
"use client";

const certifications = [
  { src: "/certifications/iso-22000.avif", alt: "ISO 22000" },
  { src: "/certifications/halal.avif",     alt: "Halal" },
  { src: "/certifications/fda.png",        alt: "FDA" },
  { src: "/certifications/gmp.png",        alt: "GMP" },
  { src: "/certifications/brc.png",        alt: "BRC" },
  { src: "/certifications/iso-45001.avif", alt: "ISO 45001" },
] as const;

interface CertificationsMarqueeProps {
  heading: string;
}

export default function CertificationsMarquee({ heading }: CertificationsMarqueeProps) {
  return (
    <div>
      <h3
        id="cert-marquee-heading"
        className="mb-6 text-center font-heading text-sm font-medium uppercase tracking-wider text-foreground/60"
      >
        {heading}
      </h3>

      <div
        aria-labelledby="cert-marquee-heading"
        role="region"
        className="group relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

        <div className="animate-marquee flex w-max gap-16">
          {[...certifications, ...certifications].map((cert, i) => (
            <div
              key={`${cert.alt}-${i}`}
              className="flex shrink-0 items-center justify-center px-4"
              aria-hidden={i >= certifications.length ? "true" : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.src}
                alt={i >= certifications.length ? "" : cert.alt}
                className="h-12 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2.2 — Update `who-we-are-section.tsx` to use the shared component**

In `src/components/ui/who-we-are-section.tsx`:

1. Remove the local `certifications` array (currently lines 19-26).
2. Add import at the top: `import CertificationsMarquee from "@/components/ui/certifications-marquee";`
3. Replace the inline marquee block (currently lines 275-309, the `<motion.div className="mt-24" ...>` containing the heading + region) with:

```tsx
<motion.div className="mt-24" variants={itemVariants}>
  <CertificationsMarquee heading={t("certifications.heading")} />
</motion.div>
```

**Step 2.3 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 2.4 — Manual visual check**

```bash
bun run dev
```
Open `http://localhost:3000/#who-we-are`. The certifications marquee must render identically to before (same heading, same 6 logos, same scroll animation, same edge-fade gradients). Kill the dev server (`Ctrl+C`) when verified.

**Step 2.5 — Commit**

```bash
git add .
git commit -m "refactor(certifications): extract marquee from WhoWeAreSection into shared component"
```

---

## Task 3 — Header: add `Private Label` top-level link

**Files:**
- Modify: `src/components/ui/header.tsx`

**Step 3.1 — Add desktop nav link**

Find the existing `<Link href="/products">` ghost button in the desktop nav block (sibling of `Our Brands`). Immediately after it, insert:

```tsx
<Link href="/private-label" className={buttonVariants({ variant: "ghost" })}>
  {t("privateLabel")}
</Link>
```

**Step 3.2 — Add mobile menu link**

Find the corresponding mobile menu entry for `Our Brands` (the one with `closeMobile` onClick and `justify-start` class). Immediately after it, insert a parallel entry pointing to `/private-label` with the same classes:

```tsx
<Link
  href="/private-label"
  onClick={closeMobile}
  className={buttonVariants({ variant: "ghost", className: "justify-start" })}
>
  {t("privateLabel")}
</Link>
```

**Step 3.3 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 3.4 — Manual check**

```bash
bun run dev
```
Open `http://localhost:3000/`. Verify:
- Desktop nav shows `Private Label` next to `Our Brands`.
- Mobile (resize browser ≤ md): hamburger menu opens and contains `Private Label` below `Our Brands`.
- Clicking the link navigates to `/private-label` (will 404 until Task 9 — that's expected).
- Visit `/ar` and `/fr` to confirm Arabic and French labels render.

Kill dev server.

**Step 3.5 — Commit**

```bash
git add .
git commit -m "feat(header): add Private Label top-level link (desktop + mobile)"
```

---

## Task 4 — `PrivateLabelHero` component

**Files:**
- Create: `src/components/ui/private-label-hero.tsx`

**Step 4.1 — Write the component**

`src/components/ui/private-label-hero.tsx`:

```tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

interface PrivateLabelHeroProps {
  eyebrow: string;
  heading: string;
  subhead: string;
  cta: string;
}

export default function PrivateLabelHero({
  eyebrow,
  heading,
  subhead,
  cta,
}: PrivateLabelHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.4 },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <motion.video
        src="/privatelable.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{ scale: videoScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full w-full items-center justify-center px-4"
      >
        <motion.div
          className="max-w-3xl text-center text-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.span
            variants={itemVariants}
            className="mb-4 block text-xs font-medium uppercase tracking-[0.3em] text-white/80 md:text-sm"
          >
            {eyebrow}
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mb-6 font-display text-5xl font-light leading-tight md:text-7xl"
          >
            {heading}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-xl text-base text-white/80 md:text-lg"
          >
            {subhead}
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <FlowButton href="#capabilities" text={cta} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
```

**Step 4.2 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 4.3 — Commit**

```bash
git add .
git commit -m "feat(private-label): add full-screen hero with looping video and scroll-tied scale"
```

---

## Task 5 — `PrivateLabelCapabilities` component

**Files:**
- Create: `src/components/ui/private-label-capabilities.tsx`

**Step 5.1 — Write the component**

`src/components/ui/private-label-capabilities.tsx`:

```tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Zap } from "lucide-react";

const CAPABILITY_KEYS = [
  "rnd",
  "manufacturing",
  "packaging",
  "regulatory",
  "qa",
  "logistics",
] as const;

type CapabilityKey = (typeof CAPABILITY_KEYS)[number];

const ICON_BY_KEY: Record<CapabilityKey, string> = {
  rnd:           "/pattern/wheat-lime.png",
  manufacturing: "/pattern/manufacturing-lime.png",
  packaging:     "/pattern/private-label-lime.png",
  regulatory:    "/pattern/kag-monogram-lime.png",
  qa:            "/pattern/export-globe-lime.png",
  logistics:     "/pattern/distribution-truck-lime.png",
};

interface PrivateLabelCapabilitiesProps {
  eyebrow: string;
  heading: string;
  intro: string;
  items: Record<CapabilityKey, { title: string; description: string }>;
}

export default function PrivateLabelCapabilities({
  eyebrow,
  heading,
  intro,
  items,
}: PrivateLabelCapabilitiesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative w-full overflow-hidden px-4 py-24 text-foreground"
    >
      <motion.div
        className="pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="h-4 w-4" />
            {eyebrow}
          </motion.span>
          <h2 className="mb-4 text-center font-display text-4xl md:text-5xl">{heading}</h2>
          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {intro}
        </motion.p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITY_KEYS.map((key) => (
            <motion.div
              key={key}
              className="group flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-3 flex items-center gap-3">
                <motion.div
                  className="rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20"
                  whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ICON_BY_KEY[key]} alt="" className="h-10 w-10 object-contain" />
                </motion.div>
                <h3 className="font-heading text-xl text-foreground transition-colors duration-300 group-hover:text-primary">
                  {items[key].title}
                </h3>
              </div>
              <p className="ps-16 text-sm leading-relaxed text-foreground/80">
                {items[key].description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

**Step 5.2 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 5.3 — Commit**

```bash
git add .
git commit -m "feat(private-label): add capabilities grid (6 pillars with lime pattern icons)"
```

---

## Task 6 — `PrivateLabelProcess` component (timeline)

**Files:**
- Create: `src/components/ui/private-label-process.tsx`

**Step 6.1 — Write the component**

`src/components/ui/private-label-process.tsx`:

```tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Workflow } from "lucide-react";

const STEP_KEYS = [
  "brief",
  "recipe",
  "samples",
  "pilot",
  "production",
  "shipment",
] as const;

type StepKey = (typeof STEP_KEYS)[number];

interface PrivateLabelProcessProps {
  eyebrow: string;
  heading: string;
  intro: string;
  steps: Record<StepKey, { title: string; description: string }>;
}

export default function PrivateLabelProcess({
  eyebrow,
  heading,
  intro,
  steps,
}: PrivateLabelProcessProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full overflow-hidden px-4 py-24 text-foreground"
    >
      <motion.div
        className="pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container relative z-10 mx-auto max-w-5xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Workflow className="h-4 w-4" />
            {eyebrow}
          </motion.span>
          <h2 className="mb-4 text-center font-display text-4xl md:text-5xl">{heading}</h2>
          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {intro}
        </motion.p>

        <div className="relative">
          {/* Center spine on md+; left spine on mobile */}
          <div className="pointer-events-none absolute inset-y-0 left-6 w-0.5 bg-primary/20 md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-12">
            {STEP_KEYS.map((key, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.li
                  key={key}
                  className="relative md:grid md:grid-cols-2 md:gap-12"
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Number circle */}
                  <div className="absolute left-6 top-0 z-10 -translate-x-1/2 md:left-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-display text-lg font-bold text-primary shadow-md">
                      {i + 1}
                    </div>
                  </div>

                  {/* Step card — left side on odd, right side on even (md+); always right of spine on mobile */}
                  <div
                    className={`ps-16 md:ps-0 ${
                      isLeft ? "md:col-start-1 md:pe-12 md:text-end" : "md:col-start-2 md:ps-12"
                    }`}
                  >
                    <div className="rounded-xl border border-primary/10 bg-card/60 p-6 backdrop-blur-sm">
                      <h3 className="mb-2 font-heading text-xl text-foreground">
                        {steps[key].title}
                      </h3>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {steps[key].description}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}
```

**Step 6.2 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 6.3 — Commit**

```bash
git add .
git commit -m "feat(private-label): add zig-zag process timeline (6 steps, direction-aware reveal)"
```

---

## Task 7 — `PrivateLabelPackaging` component

**Files:**
- Create: `src/components/ui/private-label-packaging.tsx`

**Step 7.1 — Write the component**

`src/components/ui/private-label-packaging.tsx`:

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Package } from "lucide-react";

const PACKAGING_KEYS = ["tin", "glass", "pet", "pouch"] as const;
type PackagingKey = (typeof PACKAGING_KEYS)[number];

const ICON_BY_KEY: Record<PackagingKey, string> = {
  tin:   "/pattern/manufacturing-lime.png",
  glass: "/pattern/private-label-lime.png",
  pet:   "/pattern/wheat-lime.png",
  pouch: "/pattern/kag-monogram-lime.png",
};

interface PrivateLabelPackagingProps {
  eyebrow: string;
  heading: string;
  intro: string;
  items: Record<PackagingKey, { title: string; moq: string; capacities: string[] }>;
}

export default function PrivateLabelPackaging({
  eyebrow,
  heading,
  intro,
  items,
}: PrivateLabelPackagingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="packaging"
      className="relative w-full overflow-hidden px-4 py-24 text-foreground"
    >
      <motion.div
        className="pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container relative z-10 mx-auto max-w-7xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Package className="h-4 w-4" />
            {eyebrow}
          </motion.span>
          <h2 className="mb-4 text-center font-display text-4xl md:text-5xl">{heading}</h2>
          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {intro}
        </motion.p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGING_KEYS.map((key, i) => (
            <motion.div
              key={key}
              className="group flex flex-col items-center rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: i * 0.1 },
                },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10"
                whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              >
                <Image
                  src={ICON_BY_KEY[key]}
                  alt=""
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
              <h3 className="font-heading text-lg font-medium text-foreground">
                {items[key].title}
              </h3>
              <p className="mt-1 text-xs text-foreground/60">{items[key].moq}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {items[key].capacities.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-secondary/20 px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <motion.div className="mt-3 h-0.5 w-10 bg-secondary transition-all duration-300 group-hover:w-16" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

**Step 7.2 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 7.3 — Commit**

```bash
git add .
git commit -m "feat(private-label): add packaging formats grid (4 cards with capacity chips and lime hover bar)"
```

---

## Task 8 — `PrivateLabelFaq` component

**Files:**
- Create: `src/components/ui/private-label-faq.tsx`

**Step 8.1 — Confirm Accordion API**

```bash
grep -n 'export' src/components/ui/accordion.tsx
```
Confirm exports include `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`. (Same as used in the home `PrivateLabelSection`.)

**Step 8.2 — Write the component**

`src/components/ui/private-label-faq.tsx`:

```tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = [
  "moq",
  "leadTime",
  "samples",
  "artwork",
  "regulatory",
  "incoterms",
] as const;
type FaqKey = (typeof FAQ_KEYS)[number];

interface PrivateLabelFaqProps {
  eyebrow: string;
  heading: string;
  items: Record<FaqKey, { question: string; answer: string }>;
}

export default function PrivateLabelFaq({
  eyebrow,
  heading,
  items,
}: PrivateLabelFaqProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative w-full overflow-hidden px-4 py-24 text-foreground"
    >
      <motion.div
        className="pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container relative z-10 mx-auto max-w-3xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HelpCircle className="h-4 w-4" />
            {eyebrow}
          </motion.span>
          <h2 className="mb-4 text-center font-display text-4xl md:text-5xl">{heading}</h2>
          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.div className="mt-10" variants={itemVariants}>
          <Accordion defaultValue={[FAQ_KEYS[0]]} className="w-full">
            {FAQ_KEYS.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-start text-base font-semibold text-foreground">
                  {items[key].question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/70">
                  {items[key].answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

> **Note:** If `Accordion` requires a `type` prop (single/multiple) in this shadcn build, mirror the prop set used by the home `PrivateLabelSection` (line 169 of `src/components/ui/private-label-section.tsx`). The reference uses `defaultValue={[...]}` with no `type` — copy that signature exactly.

**Step 8.3 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 8.4 — Commit**

```bash
git add .
git commit -m "feat(private-label): add FAQ accordion (6 items)"
```

---

## Task 9 — `/private-label` page assembly + CTA banner

**Files:**
- Create: `src/app/[locale]/private-label/page.tsx`

**Step 9.1 — Ensure the route directory exists**

```bash
mkdir -p "src/app/[locale]/private-label"
```

**Step 9.2 — Write the page**

`src/app/[locale]/private-label/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import PrivateLabelHero from "@/components/ui/private-label-hero";
import PrivateLabelCapabilities from "@/components/ui/private-label-capabilities";
import PrivateLabelProcess from "@/components/ui/private-label-process";
import PrivateLabelPackaging from "@/components/ui/private-label-packaging";
import PrivateLabelFaq from "@/components/ui/private-label-faq";
import CertificationsMarquee from "@/components/ui/certifications-marquee";
import { FlowButton } from "@/components/ui/flow-button";

const CAPABILITY_KEYS = [
  "rnd",
  "manufacturing",
  "packaging",
  "regulatory",
  "qa",
  "logistics",
] as const;

const STEP_KEYS = [
  "brief",
  "recipe",
  "samples",
  "pilot",
  "production",
  "shipment",
] as const;

const PACKAGING_KEYS = ["tin", "glass", "pet", "pouch"] as const;

const FAQ_KEYS = [
  "moq",
  "leadTime",
  "samples",
  "artwork",
  "regulatory",
  "incoterms",
] as const;

export default async function PrivateLabelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privateLabelPage");

  const capabilityItems = Object.fromEntries(
    CAPABILITY_KEYS.map((k) => [
      k,
      {
        title: t(`capabilities.items.${k}.title`),
        description: t(`capabilities.items.${k}.description`),
      },
    ]),
  ) as Record<
    (typeof CAPABILITY_KEYS)[number],
    { title: string; description: string }
  >;

  const processSteps = Object.fromEntries(
    STEP_KEYS.map((k) => [
      k,
      {
        title: t(`process.steps.${k}.title`),
        description: t(`process.steps.${k}.description`),
      },
    ]),
  ) as Record<
    (typeof STEP_KEYS)[number],
    { title: string; description: string }
  >;

  const packagingItems = Object.fromEntries(
    PACKAGING_KEYS.map((k) => [
      k,
      {
        title: t(`packaging.items.${k}.title`),
        moq: t(`packaging.items.${k}.moq`),
        capacities: t.raw(`packaging.items.${k}.capacities`) as string[],
      },
    ]),
  ) as Record<
    (typeof PACKAGING_KEYS)[number],
    { title: string; moq: string; capacities: string[] }
  >;

  const faqItems = Object.fromEntries(
    FAQ_KEYS.map((k) => [
      k,
      {
        question: t(`faq.items.${k}.question`),
        answer: t(`faq.items.${k}.answer`),
      },
    ]),
  ) as Record<
    (typeof FAQ_KEYS)[number],
    { question: string; answer: string }
  >;

  return (
    <>
      <PrivateLabelHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        subhead={t("hero.subhead")}
        cta={t("hero.cta")}
      />

      <PrivateLabelCapabilities
        eyebrow={t("capabilities.eyebrow")}
        heading={t("capabilities.heading")}
        intro={t("capabilities.intro")}
        items={capabilityItems}
      />

      <PrivateLabelProcess
        eyebrow={t("process.eyebrow")}
        heading={t("process.heading")}
        intro={t("process.intro")}
        steps={processSteps}
      />

      <PrivateLabelPackaging
        eyebrow={t("packaging.eyebrow")}
        heading={t("packaging.heading")}
        intro={t("packaging.intro")}
        items={packagingItems}
      />

      <section className="px-4 py-24">
        <div className="container mx-auto max-w-6xl">
          <CertificationsMarquee heading={t("certifications.heading")} />
        </div>
      </section>

      <PrivateLabelFaq
        eyebrow={t("faq.eyebrow")}
        heading={t("faq.heading")}
        items={faqItems}
      />

      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-primary p-8 text-primary-foreground md:flex-row">
            <div className="flex-1">
              <h3 className="mb-2 font-heading text-2xl font-medium">
                {t("cta.heading")}
              </h3>
              <p className="text-primary-foreground/80">{t("cta.sub")}</p>
            </div>
            <FlowButton href="/rfq" text={t("cta.button")} className="px-10 py-3" />
          </div>
        </div>
      </section>
    </>
  );
}
```

**Step 9.3 — Typecheck**

```bash
bun run typecheck
```
Expected: exit code 0.

**Step 9.4 — Build**

```bash
bun run build
```
Expected: exit code 0. The output's route list must include `/en/private-label`, `/ar/private-label`, `/fr/private-label` (default-locale path may appear as `/private-label`).

**Step 9.5 — Manual smoke test**

```bash
bun run dev
```

Visit each of these in a browser and verify the acceptance criteria from the spec doc:

- `http://localhost:3000/private-label`
- `http://localhost:3000/ar/private-label`
- `http://localhost:3000/fr/private-label`

Quick checklist while there:
- Hero video autoplays muted, full screen.
- Clicking the hero CTA scrolls smoothly to `#capabilities`.
- Capability tiles show the correct lime PNG icon and animate in on scroll.
- Process timeline alternates left/right on `md+`, single-column on mobile.
- Packaging cards: icon spins 360° on hover; lime bar widens.
- Certifications marquee renders identically to home `/#who-we-are`.
- FAQ items expand on click.
- CTA `FlowButton` navigates to `/rfq`.
- Header `Private Label` link is highlighted/active on the page.
- Arabic: layout mirrors, numbers and icons render correctly.

Kill dev server (`Ctrl+C`).

**Step 9.6 — Commit**

```bash
git add .
git commit -m "feat(private-label): wire /private-label page (hero + capabilities + process + packaging + certs + faq + cta)"
```

---

## Done

After Task 9 commit, run a final check:

```bash
git status            # should be clean
git log --oneline -10 # should show 9 task commits + earlier work
bun run build         # final pass (already done in 9.4 but rerun if any post-task tweaks)
```

If everything is green, the feature is shippable.
