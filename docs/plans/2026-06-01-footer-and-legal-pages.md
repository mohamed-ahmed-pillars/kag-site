# Footer + Legal Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a global site footer (snippet visual personality, KAG data) and scaffold `/terms` and `/privacy` legal pages with content lifted from the older kag-website repo.

**Architecture:** Footer is a single `"use client"` component rendered from `src/app/[locale]/layout.tsx`. Legal pages are server components that pass their section list to a small framer-motion client subcomponent (`LegalSections`). All page-rendered content comes from new i18n namespaces (`footer`, `terms`, `privacy`) added to `en/ar/fr` message files.

**Tech Stack:** Next.js 16, next-intl 4, framer-motion 12, Tailwind v4, lucide-react (already installed). No new npm dependencies. Bun is the package manager.

**Spec:** `docs/superpowers/specs/2026-06-01-footer-and-legal-pages-design.md`

**Source data:**
- Old footer (KAG): `oldWebsite/src/components/footer.tsx`
- Legal content EN/AR: `kag-website/frontend/messages/{en.json,ar.json}` (`terms.*`, `privacy.*` namespaces)

**Project conventions to honor (memory rules):**
- No `Co-Authored-By: Claude` trailer on commits
- Use `git add .` for staging
- Don't add Claude attribution to file contents
- Section roots have no `bg-*` — footer is a `<footer>`, not a `<section>`, but stays `bg-transparent` so body bg shows through
- Animated section heading underlines use `bg-secondary` (lime), not `bg-primary`
- Default CTA is `FlowButton` (no FlowButton needed in footer; legal pages have no CTA)
- Primary brand color `bg-primary` (#374c9b), secondary `bg-secondary` (#d5de24)
- Logo at `/public/navbarLogo.svg`
- Links from `@/i18n/navigation`, NOT `next/link`
- Project AGENTS.md warning: "This is NOT the Next.js you know" — read `node_modules/next/dist/docs/` if unfamiliar with a Next.js 16 API

---

### Task 1: Add `footer` i18n namespace (en/ar/fr)

**Files:**
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/ar.json`
- Modify: `src/i18n/messages/fr.json`

**Step 1:** Open `src/i18n/messages/en.json`. Find the existing `nav` block at the top of the file. Add a new top-level `footer` namespace immediately after the `nav` block (and before `whoWeAre`):

```jsonc
"footer": {
  "blurb": "KAG is an Egyptian food group producing, distributing, and exporting tomato sauces, jams, juices, and fava beans — built for local communities and global markets.",
  "quickLinks": "Quick Links",
  "services": "Services",
  "contactUs": "Contact Us",
  "company": "Company",
  "address": "10th of Ramadan City, Industrial Zone, Sharkia Governorate, Egypt",
  "phoneServiceLabel": "Service",
  "phoneSuggestionsLabel": "Suggestions",
  "terms": "Terms & Conditions",
  "privacy": "Privacy Policy",
  "rights": "All rights reserved.",
  "madeBy": "Made by",
  "scrollTop": "Scroll to top"
},
```

**Step 2:** Open `src/i18n/messages/ar.json`. Add the matching block in the same position:

```jsonc
"footer": {
  "blurb": "KAG مجموعة غذائية مصرية تنتج وتوزع وتصدّر صلصات الطماطم والمربى والعصائر والفول — مصمَّمة للمجتمعات المحلية والأسواق العالمية.",
  "quickLinks": "روابط سريعة",
  "services": "الخدمات",
  "contactUs": "تواصل معنا",
  "company": "الشركة",
  "address": "مدينة العاشر من رمضان، المنطقة الصناعية، محافظة الشرقية، مصر",
  "phoneServiceLabel": "الخدمة",
  "phoneSuggestionsLabel": "الاقتراحات",
  "terms": "الشروط والأحكام",
  "privacy": "سياسة الخصوصية",
  "rights": "جميع الحقوق محفوظة.",
  "madeBy": "من إنتاج",
  "scrollTop": "العودة إلى الأعلى"
},
```

**Step 3:** Open `src/i18n/messages/fr.json`. Add the matching block:

```jsonc
"footer": {
  "blurb": "KAG est un groupe alimentaire égyptien qui produit, distribue et exporte des sauces tomate, des confitures, des jus et des fèves — pensé pour les communautés locales et les marchés mondiaux.",
  "quickLinks": "Liens rapides",
  "services": "Services",
  "contactUs": "Contactez-nous",
  "company": "Entreprise",
  "address": "10th of Ramadan City, Zone industrielle, Gouvernorat de Charkia, Égypte",
  "phoneServiceLabel": "Service",
  "phoneSuggestionsLabel": "Suggestions",
  "terms": "Conditions générales",
  "privacy": "Politique de confidentialité",
  "rights": "Tous droits réservés.",
  "madeBy": "Réalisé par",
  "scrollTop": "Retour en haut"
},
```

**Step 4:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 5:** Commit:

```bash
git add .
git commit -m "i18n(footer): add footer namespace across en/ar/fr"
```

---

### Task 2: Add `terms` i18n namespace (en/ar/fr)

**Files:**
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/ar.json`
- Modify: `src/i18n/messages/fr.json`

The English and Arabic source come from `/Users/mohamed/MyData/Work/TechnologyPillars/Customers/KAG/kag-website/frontend/messages/en.json` (lines 566–595) and the matching `ar.json` (lines 535–564). French is translated locally.

**Step 1:** Open `src/i18n/messages/en.json`. Add a new top-level `terms` namespace as the last key in the root object (after `ourProducts`):

```jsonc
"terms": {
  "hero": {
    "badge": "Legal",
    "title": "Terms & Conditions",
    "subtitle": "Please read these terms carefully before using our website and services."
  },
  "lastUpdated": "Last updated: April 2026",
  "sections": [
    {
      "title": "Acceptance of Terms",
      "body": "By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this site."
    },
    {
      "title": "Use License",
      "body": "Permission is granted to temporarily download one copy of the materials on KAG's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, attempt to decompile or reverse engineer any software contained on the website, remove any copyright or other proprietary notations from the materials, or transfer the materials to another person."
    },
    {
      "title": "Disclaimer",
      "body": "The materials on KAG's website are provided on an 'as is' basis. KAG makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      "title": "Limitations",
      "body": "In no event shall KAG or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on KAG's website, even if KAG or a KAG authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      "title": "Contact Information",
      "body": "If you have any questions about these Terms & Conditions, please contact us at our facility: 10th of Ramadan City, Industrial Zone, Sharkia Governorate, Egypt, or via email at wecare@kagegypt.com."
    }
  ]
}
```

Note: Email changed from the old kag-website's `info@kagegypt.com` to `wecare@kagegypt.com` (which is the email actually used by the new site's footer and old `oldWebsite` footer). Keep this consistent.

**Step 2:** Open `src/i18n/messages/ar.json`. Add the Arabic translation in the same position:

```jsonc
"terms": {
  "hero": {
    "badge": "قانوني",
    "title": "الشروط والأحكام",
    "subtitle": "يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا وخدماتنا."
  },
  "lastUpdated": "آخر تحديث: أبريل 2026",
  "sections": [
    {
      "title": "قبول الشروط",
      "body": "بالوصول إلى هذا الموقع واستخدامه، فإنك توافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام هذا الموقع."
    },
    {
      "title": "ترخيص الاستخدام",
      "body": "يُمنح الإذن بتنزيل نسخة واحدة مؤقتة من المواد الموجودة على موقع KAG للاستخدام الشخصي غير التجاري المؤقت فقط. هذا منح ترخيص وليس نقل ملكية، ولا يجوز لك بموجب هذا الترخيص تعديل المواد أو نسخها أو استخدامها لأي غرض تجاري أو نقلها إلى شخص آخر."
    },
    {
      "title": "إخلاء المسؤولية",
      "body": "تُقدَّم المواد الموجودة على موقع KAG على أساس 'كما هي'. لا تقدم KAG أي ضمانات صريحة أو ضمنية، وتتنصل من جميع الضمانات الأخرى بما في ذلك ضمانات القابلية للتسويق أو الملاءمة لغرض معين."
    },
    {
      "title": "حدود المسؤولية",
      "body": "لن تكون KAG أو مورديها في أي حال من الأحوال مسؤولة عن أي أضرار ناجمة عن استخدام أو عدم القدرة على استخدام المواد الموجودة على موقع KAG، حتى لو تم إخطار KAG بإمكانية حدوث مثل هذه الأضرار."
    },
    {
      "title": "معلومات الاتصال",
      "body": "إذا كانت لديك أي أسئلة حول هذه الشروط والأحكام، يرجى التواصل معنا في مقرنا: مدينة العاشر من رمضان، المنطقة الصناعية، محافظة الشرقية، مصر، أو عبر البريد الإلكتروني: wecare@kagegypt.com."
    }
  ]
}
```

**Step 3:** Open `src/i18n/messages/fr.json`. Add the French translation in the same position:

```jsonc
"terms": {
  "hero": {
    "badge": "Mentions légales",
    "title": "Conditions générales",
    "subtitle": "Veuillez lire attentivement ces conditions avant d'utiliser notre site et nos services."
  },
  "lastUpdated": "Dernière mise à jour : avril 2026",
  "sections": [
    {
      "title": "Acceptation des conditions",
      "body": "En accédant à ce site et en l'utilisant, vous acceptez d'être lié par les termes et dispositions du présent accord. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site."
    },
    {
      "title": "Licence d'utilisation",
      "body": "Vous êtes autorisé à télécharger temporairement une copie des contenus du site KAG pour un usage personnel et non commercial. Il s'agit d'une concession de licence, et non d'un transfert de propriété. Dans le cadre de cette licence, vous ne pouvez pas modifier ou copier les contenus, les utiliser à des fins commerciales, tenter de décompiler ou de désosser tout logiciel présent sur le site, supprimer toute mention de droits d'auteur, ni transférer les contenus à un tiers."
    },
    {
      "title": "Avertissement",
      "body": "Les contenus du site KAG sont fournis « en l'état ». KAG ne fournit aucune garantie, explicite ou implicite, et décline toute autre garantie, notamment les garanties implicites de qualité marchande, d'adéquation à un usage particulier ou de non-violation de la propriété intellectuelle."
    },
    {
      "title": "Limitations de responsabilité",
      "body": "En aucun cas KAG ou ses fournisseurs ne pourront être tenus responsables de dommages (y compris, sans limitation, les pertes de données ou de profits, ou l'interruption d'activité) résultant de l'utilisation ou de l'incapacité d'utiliser les contenus du site KAG, même si KAG ou un représentant autorisé a été informé verbalement ou par écrit de la possibilité de tels dommages."
    },
    {
      "title": "Informations de contact",
      "body": "Pour toute question concernant ces conditions générales, contactez-nous à notre site : 10th of Ramadan City, Zone industrielle, Gouvernorat de Charkia, Égypte, ou par e-mail à wecare@kagegypt.com."
    }
  ]
}
```

**Step 4:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 5:** Commit:

```bash
git add .
git commit -m "i18n(terms): add terms namespace across en/ar/fr"
```

---

### Task 3: Add `privacy` i18n namespace (en/ar/fr)

**Files:**
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/ar.json`
- Modify: `src/i18n/messages/fr.json`

**Step 1:** In `src/i18n/messages/en.json`, add `privacy` as the last top-level key (after `terms` from the previous task):

```jsonc
"privacy": {
  "hero": {
    "badge": "Legal",
    "title": "Privacy Policy",
    "subtitle": "Your privacy matters to us. Learn how we collect, use, and protect your personal information."
  },
  "lastUpdated": "Last updated: April 2026",
  "sections": [
    {
      "title": "Information We Collect",
      "body": "We collect information you provide directly to us, including your name, email address, phone number, company information, and any messages you send us when contacting us or requesting a quotation."
    },
    {
      "title": "How We Use Your Information",
      "body": "We use the information we collect to respond to your inquiries, process quotation requests, send newsletters and updates (with your permission), improve our website and services, and comply with legal obligations."
    },
    {
      "title": "Information Sharing",
      "body": "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except when required by law or to protect our rights and the safety of others."
    },
    {
      "title": "Data Security",
      "body": "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
    },
    {
      "title": "Cookies",
      "body": "Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of the site."
    },
    {
      "title": "Your Rights",
      "body": "You have the right to access, correct, or delete your personal data at any time. You may also unsubscribe from our communications at any time by contacting us directly or using the unsubscribe link in our emails."
    },
    {
      "title": "Contact Information",
      "body": "For any privacy-related requests or questions, please contact us at: 10th of Ramadan City, Industrial Zone, Sharkia Governorate, Egypt, or via email at wecare@kagegypt.com."
    },
    {
      "title": "Policy Updates",
      "body": "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically."
    }
  ]
}
```

**Step 2:** In `src/i18n/messages/ar.json`, add the Arabic translation:

```jsonc
"privacy": {
  "hero": {
    "badge": "قانوني",
    "title": "سياسة الخصوصية",
    "subtitle": "خصوصيتك تهمنا. تعرف على كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها."
  },
  "lastUpdated": "آخر تحديث: أبريل 2026",
  "sections": [
    {
      "title": "المعلومات التي نجمعها",
      "body": "نجمع المعلومات التي تقدمها لنا مباشرة، بما في ذلك اسمك وعنوان بريدك الإلكتروني ورقم هاتفك ومعلومات شركتك وأي رسائل ترسلها إلينا عند التواصل معنا أو طلب عرض سعر."
    },
    {
      "title": "كيفية استخدام معلوماتك",
      "body": "نستخدم المعلومات التي نجمعها للرد على استفساراتك، ومعالجة طلبات عروض الأسعار، وإرسال النشرات الإخبارية والتحديثات (بإذنك)، وتحسين موقعنا وخدماتنا، والامتثال للالتزامات القانونية."
    },
    {
      "title": "مشاركة المعلومات",
      "body": "نحن لا نبيع أو نتاجر أو ننقل معلوماتك الشخصية إلى أطراف ثالثة دون موافقتك، إلا عندما يقتضي ذلك القانون أو لحماية حقوقنا وسلامة الآخرين."
    },
    {
      "title": "أمان البيانات",
      "body": "نطبق تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة بنسبة 100٪."
    },
    {
      "title": "ملفات الارتباط (Cookies)",
      "body": "قد يستخدم موقعنا ملفات الارتباط لتحسين تجربة التصفح. يمكنك اختيار تعطيل ملفات الارتباط من خلال إعدادات المتصفح، وإن كان ذلك قد يؤثر على بعض وظائف الموقع."
    },
    {
      "title": "حقوقك",
      "body": "يحق لك الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها في أي وقت. يمكنك أيضاً إلغاء الاشتراك في مراسلاتنا في أي وقت عن طريق التواصل معنا مباشرة أو استخدام رابط إلغاء الاشتراك في رسائلنا الإلكترونية."
    },
    {
      "title": "معلومات الاتصال",
      "body": "لأي طلبات أو أسئلة تتعلق بالخصوصية، يرجى التواصل معنا على: مدينة العاشر من رمضان، المنطقة الصناعية، محافظة الشرقية، مصر، أو عبر البريد الإلكتروني: wecare@kagegypt.com."
    },
    {
      "title": "تحديثات السياسة",
      "body": "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ المراجعة المحدث. نشجعك على مراجعة هذه السياسة بشكل دوري."
    }
  ]
}
```

**Step 3:** In `src/i18n/messages/fr.json`, add the French translation:

```jsonc
"privacy": {
  "hero": {
    "badge": "Mentions légales",
    "title": "Politique de confidentialité",
    "subtitle": "Votre vie privée nous tient à cœur. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles."
  },
  "lastUpdated": "Dernière mise à jour : avril 2026",
  "sections": [
    {
      "title": "Informations que nous collectons",
      "body": "Nous collectons les informations que vous nous fournissez directement, notamment vos nom, adresse e-mail, numéro de téléphone, informations sur votre entreprise et tout message envoyé lors de votre prise de contact ou d'une demande de devis."
    },
    {
      "title": "Comment nous utilisons vos informations",
      "body": "Nous utilisons les informations collectées pour répondre à vos demandes, traiter les devis, envoyer des bulletins et des mises à jour (avec votre accord), améliorer notre site et nos services, et nous conformer à nos obligations légales."
    },
    {
      "title": "Partage des informations",
      "body": "Nous ne vendons, n'échangeons ni ne transférons vos données personnelles à des tiers sans votre consentement, sauf lorsque la loi l'exige ou pour protéger nos droits et la sécurité d'autrui."
    },
    {
      "title": "Sécurité des données",
      "body": "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, altération, divulgation ou destruction non autorisés. Aucune méthode de transmission sur Internet n'étant sûre à 100 %, nous ne pouvons toutefois garantir une sécurité absolue."
    },
    {
      "title": "Cookies",
      "body": "Notre site peut utiliser des cookies pour améliorer votre expérience de navigation. Vous pouvez choisir de désactiver les cookies via les paramètres de votre navigateur, ce qui peut toutefois affecter certaines fonctionnalités du site."
    },
    {
      "title": "Vos droits",
      "body": "Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles à tout moment. Vous pouvez également vous désabonner de nos communications à tout moment en nous contactant directement ou via le lien de désabonnement présent dans nos e-mails."
    },
    {
      "title": "Informations de contact",
      "body": "Pour toute demande ou question relative à la confidentialité, contactez-nous à : 10th of Ramadan City, Zone industrielle, Gouvernorat de Charkia, Égypte, ou par e-mail à wecare@kagegypt.com."
    },
    {
      "title": "Mises à jour de la politique",
      "body": "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page avec une nouvelle date de révision. Nous vous encourageons à consulter cette politique périodiquement."
    }
  ]
}
```

**Step 4:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 5:** Commit:

```bash
git add .
git commit -m "i18n(privacy): add privacy namespace across en/ar/fr"
```

---

### Task 4: Create `LegalSections` client subcomponent

**Files:**
- Create: `src/components/ui/legal-sections.tsx`

**Step 1:** Create `src/components/ui/legal-sections.tsx` with this content (exact):

```tsx
'use client';

import { motion } from 'framer-motion';

type Section = { title: string; body: string };

interface LegalSectionsProps {
  sections: Section[];
  lastUpdated: string;
}

export default function LegalSections({ sections, lastUpdated }: LegalSectionsProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="rounded-2xl border border-foreground/10 bg-background/60 p-6 backdrop-blur-sm md:p-8"
        >
          <h2 className="mb-3 font-heading text-lg font-bold text-primary md:text-xl">
            {i + 1}. {section.title}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            {section.body}
          </p>
        </motion.div>
      ))}
      <p className="pt-4 text-center text-xs text-foreground/50">
        {lastUpdated}
      </p>
    </div>
  );
}
```

**Step 2:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 3:** Run lint on the new file:

```bash
bun run lint 2>&1 | grep -A1 "legal-sections" || echo "no new errors"
```

Expected: "no new errors" (pre-existing errors in other files are out of scope).

**Step 4:** Commit:

```bash
git add .
git commit -m "feat(legal): add LegalSections client subcomponent"
```

---

### Task 5: Create `/terms` page

**Files:**
- Create: `src/app/[locale]/terms/page.tsx`

**Step 1:** Create the directory and file. The page is a server component that reads the `terms.*` namespace and passes the section list to `LegalSections`.

```tsx
import type { Metadata } from 'next';
import { Scale } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalSections from '@/components/ui/legal-sections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });
  const sections = t.raw('sections') as { title: string; body: string }[];

  return (
    <section className="relative w-full overflow-hidden px-4 py-24 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Scale className="h-4 w-4" />
            {t('hero.badge')}
          </div>
          <h1 className="mb-3 font-heading text-4xl md:text-5xl">
            {t('hero.title')}
          </h1>
          <div className="mx-auto mb-4 h-1 w-24 bg-secondary" />
          <p className="mx-auto max-w-2xl text-foreground/80">
            {t('hero.subtitle')}
          </p>
        </div>
        <LegalSections sections={sections} lastUpdated={t('lastUpdated')} />
      </div>
    </section>
  );
}
```

**Step 2:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 3:** Commit:

```bash
git add .
git commit -m "feat(legal): add /terms page"
```

---

### Task 6: Create `/privacy` page

**Files:**
- Create: `src/app/[locale]/privacy/page.tsx`

**Step 1:** Create the directory and file. Same structure as `/terms` but with the `privacy` namespace and a `ShieldCheck` icon:

```tsx
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalSections from '@/components/ui/legal-sections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const sections = t.raw('sections') as { title: string; body: string }[];

  return (
    <section className="relative w-full overflow-hidden px-4 py-24 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            {t('hero.badge')}
          </div>
          <h1 className="mb-3 font-heading text-4xl md:text-5xl">
            {t('hero.title')}
          </h1>
          <div className="mx-auto mb-4 h-1 w-24 bg-secondary" />
          <p className="mx-auto max-w-2xl text-foreground/80">
            {t('hero.subtitle')}
          </p>
        </div>
        <LegalSections sections={sections} lastUpdated={t('lastUpdated')} />
      </div>
    </section>
  );
}
```

**Step 2:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 3:** Commit:

```bash
git add .
git commit -m "feat(legal): add /privacy page"
```

---

### Task 7: Create `Footer` component

**Files:**
- Create: `src/components/ui/footer.tsx`

**Step 1:** Create the file with this exact content. Note: this is a single `"use client"` component because it uses `onClick` for the scroll-to-top button and `useTranslations` hooks. Logo and social icons use `next/image`. Internal links use `Link` from `@/i18n/navigation`. External social links use plain `<a>` (next-intl Link is for internal route navigation only).

```tsx
'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowUp, Heart, Mail as MailIcon, MapPin, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Href = React.ComponentProps<typeof Link>['href'];

const quickLinks: { key: string; href: Href }[] = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/#our-products' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
];

const serviceLinks: { key: string; href: Href }[] = [
  { key: 'privateLabel', href: '/#private-label' },
  { key: 'customProduct', href: '/#what-we-offer' },
  { key: 'export', href: '/#export' },
];

const companyLinks: { key: 'terms' | 'privacy'; href: Href }[] = [
  { key: 'terms', href: '/terms' },
  { key: 'privacy', href: '/privacy' },
];

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect width="22" height="22" x="1" y="1" rx="3" fill="#0A66C2" />
    <path
      fill="#fff"
      d="M8.05 18.5H5.4V9.95h2.65v8.55zM6.72 8.77a1.54 1.54 0 1 1 0-3.08 1.54 1.54 0 0 1 0 3.08zM18.6 18.5h-2.65v-4.16c0-.99-.02-2.27-1.38-2.27-1.39 0-1.6 1.08-1.6 2.2v4.23H10.3V9.95h2.55v1.17h.04c.35-.67 1.22-1.38 2.51-1.38 2.69 0 3.19 1.77 3.19 4.07v4.69z"
    />
  </svg>
);

type Social =
  | { src: string; label: string; href: string }
  | { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; href: string };

const socials: Social[] = [
  {
    src: '/icons/facebook.svg',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1DNJqy7Bou/?mibextid=wwXIfr',
  },
  {
    src: '/icons/instagram.svg',
    label: 'Instagram',
    href: 'https://www.instagram.com/kag.egypt',
  },
  {
    Icon: LinkedinIcon,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/kagegypt/',
  },
  {
    src: '/icons/whatsapp.svg',
    label: 'WhatsApp',
    href: 'https://wa.me/201080843334',
  },
  {
    src: '/icons/maildotru.svg',
    label: 'Email',
    href: 'mailto:wecare@kagegypt.com',
  },
];

const iconButton =
  'hover:-translate-y-1 rounded-xl border border-dotted border-foreground/30 p-2.5 transition-transform';

function handleScrollTop() {
  window.scroll({ top: 0, behavior: 'smooth' });
}

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full border-b border-t border-foreground/10 bg-transparent px-2 md:px-4">
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
        <Link href="/" aria-label="KAG">
          <Image
            src="/navbarLogo.svg"
            alt="KAG"
            width={120}
            height={40}
            className="h-auto w-32 md:w-48"
          />
        </Link>
        <p className="bg-transparent text-center text-xs leading-5 text-foreground/70 md:text-left">
          {t('blurb')}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted border-foreground/20" />
        <div className="py-10">
          <div className="grid grid-cols-2 gap-8 leading-6 md:flex md:flex-row md:justify-between">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('quickLinks')}
              </h4>
              <ul className="flex flex-col space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.key} className="flow-root">
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-xs"
                    >
                      {tNav(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('services')}
              </h4>
              <ul className="flex flex-col space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.key} className="flow-root">
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-xs"
                    >
                      {tNav(`services.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('contactUs')}
              </h4>
              <ul className="flex flex-col space-y-3">
                <li className="flex items-start gap-2 text-sm text-foreground/70 md:text-xs">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" />
                  <span>{t('address')}</span>
                </li>
                <li className="flex items-start gap-2 text-sm md:text-xs">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" />
                  <div className="flex flex-col gap-0.5">
                    <a
                      href="tel:+201080838555"
                      className="text-foreground/70 transition-colors duration-200 hover:text-foreground"
                    >
                      {t('phoneServiceLabel')}: <span dir="ltr">+20 108 083 8555</span>
                    </a>
                    <a
                      href="tel:+201080843334"
                      className="text-foreground/70 transition-colors duration-200 hover:text-foreground"
                    >
                      {t('phoneSuggestionsLabel')}: <span dir="ltr">+20 108 084 3334</span>
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-2 text-sm md:text-xs">
                  <MailIcon className="h-4 w-4 shrink-0 text-foreground/50" />
                  <a
                    href="mailto:wecare@kagegypt.com"
                    dir="ltr"
                    className="text-foreground/70 transition-colors duration-200 hover:text-foreground"
                  >
                    wecare@kagegypt.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('company')}
              </h4>
              <ul className="flex flex-col space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.key} className="flow-root">
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-xs"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-b border-dotted border-foreground/20" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 gap-y-6 px-6">
        {socials.map((social) => (
          <a
            key={social.label}
            aria-label={social.label}
            href={social.href}
            rel="noreferrer"
            target="_blank"
            className={iconButton}
          >
            {'src' in social ? (
              <Image src={social.src} alt={social.label} width={20} height={20} className="h-5 w-5" />
            ) : (
              <social.Icon className="h-5 w-5" />
            )}
          </a>
        ))}
        <button
          type="button"
          onClick={handleScrollTop}
          aria-label={t('scrollTop')}
          className={iconButton}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row flex-wrap items-center justify-center gap-1 text-foreground/60">
          <span>©</span>
          <span>{currentYear}</span>
          <span className="font-bold text-primary">KAG.</span>
          <span>{t('rights')}</span>
          <span className="mx-1">·</span>
          <span>{t('madeBy')}</span>
          <a
            href="https://technologypillars.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground transition-colors duration-200 hover:text-primary"
          >
            Technology Pillars
          </a>
          <Heart className="mx-1 h-4 w-4 animate-pulse text-red-600" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
```

**Step 2:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 3:** Run lint on the new file:

```bash
bun run lint 2>&1 | grep -A2 "footer.tsx" || echo "no new errors"
```

Expected: "no new errors" or only pre-existing errors in OTHER files. The new `footer.tsx` should not introduce errors.

**Step 4:** Commit:

```bash
git add .
git commit -m "feat(footer): add global Footer component"
```

---

### Task 8: Mount Footer in layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

**Step 1:** Open `src/app/[locale]/layout.tsx`. Add the import alongside the existing `Header` import:

```tsx
import { Footer } from '@/components/ui/footer';
```

**Step 2:** In the JSX, render `<Footer />` immediately after `{children}` inside the `NextIntlClientProvider`. The final return should look like:

```tsx
return (
  <html lang={locale} dir={dir} className={`${fontVariables} h-full antialiased`}>
    <body className="min-h-full flex flex-col">
      <NextIntlClientProvider messages={messages} locale={locale as Locale}>
        <Header />
        {children}
        <Footer />
      </NextIntlClientProvider>
    </body>
  </html>
);
```

**Step 3:** Run typecheck:

```bash
bun run typecheck
```

Expected: exit 0.

**Step 4:** Commit:

```bash
git add .
git commit -m "feat(layout): mount Footer site-wide"
```

---

### Task 9: Final verification

No file changes — just verify the work end-to-end.

**Step 1:** Production build:

```bash
bun run build
```

Expected: build succeeds; route table includes:
- `/[locale]/terms` (prerendered for en/fr/ar)
- `/[locale]/privacy` (prerendered for en/fr/ar)

**Step 2:** Start dev server in the background:

```bash
bun run dev
```

(or however the project starts — `bun run dev` is the convention.)

**Step 3:** Smoke-test each locale's footer rendering:

```bash
curl -s http://localhost:3000/en      | grep -E "Made by|All rights reserved" | head -3
curl -s http://localhost:3000/fr      | grep -E "Réalisé par|Tous droits"     | head -3
curl -s http://localhost:3000/ar      | grep -E "من إنتاج|محفوظة"             | head -3
```

Expected: each grep returns at least one match (the copyright line rendered in the correct locale).

**Step 4:** Smoke-test legal pages:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/en/terms
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/en/privacy
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/fr/terms
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/ar/privacy
```

Expected: all return `200`.

**Step 5:** Confirm the legal hero title renders (English Terms shown; repeat the spot-check pattern for whichever locales you sample):

```bash
curl -s http://localhost:3000/en/terms | grep "Terms & Conditions" | head -1
```

Expected: at least one match.

**Step 6:** Stale-reference grep — confirm none of the demo snippet's identifiers leaked into the repo:

```bash
grep -rn "designali\|dicons\|next-themes" src/ 2>/dev/null || echo "clean"
```

Expected: `clean` (no matches).

**Step 7:** Kill the dev server.

**Step 8:** No commit needed if everything passes. If any verification step fails, fix it and commit the fix with a descriptive message (e.g. `fix(footer): correct address direction in RTL`).

---

## Done state

After all tasks complete:

- 8 commits land on `main` (one per task, Task 9 has no code changes unless a fix is needed).
- `bun run typecheck` passes.
- `bun run lint` introduces no new errors for any file touched in this plan.
- `bun run build` succeeds and emits prerendered HTML for `/{en,fr,ar}/{terms,privacy}`.
- Every page on the site now renders the global footer.
- The footer's social icons, contact lines, and copyright credit reflect KAG's real data.
- `/terms` and `/privacy` render in all three locales with the KAG framer-motion vocabulary.
