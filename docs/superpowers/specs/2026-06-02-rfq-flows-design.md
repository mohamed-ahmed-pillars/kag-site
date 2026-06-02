# RFQ Flows (Brands + Private Label) Design Spec

**Date:** 2026-06-02
**Status:** Approved by user, ready for implementation planning

---

## 1. Goal

Port the old site's 4-step quotation wizard into the new KAG site as **two distinct page-based flows** — one for finished-goods orders from our brands (Yamkers / Tasbeka), one for private-label manufacturing inquiries. Both flows share the contact / shipping / review steps but diverge on the middle "What you want" step. The trigger is a reusable button component that can be embedded anywhere (product cards, CTA banners, navbar). The existing single-screen `/rfq` form and its `/api/rfq` endpoint are retired.

## 2. Architecture overview

- **Route shape:** `/rfq` (chooser), `/rfq/brands` (wizard), `/rfq/private-label` (wizard).
- **State:** in-memory, client-side only via `react-hook-form` + `zod`. No store, no cross-page persistence. Each wizard is self-contained.
- **Submission:** two new API routes — `/api/rfq/brands` and `/api/rfq/private-label` — each validates with zod, honeypot-gates spam, and dispatches a Resend email via the existing `@/lib/email` provider. The old `/api/rfq` and `rfqSchema` are removed.
- **Entry points everywhere:** a `<RequestQuoteButton type="brands"|"privateLabel" productId?={id} />` component renders a `FlowButton` and navigates to the right wizard, optionally pre-selecting a product (brands flow).
- **Visual style:** new-site vocabulary throughout — `bg-card/60` + `border-primary/10` for cards, `bg-secondary` (lime) for accents/active step, our framer-motion variants for transitions and scroll reveals. No neumorphism (drop the `NEUO_SHADOW`/`INSET_SHADOW` styles from the old site).

## 3. Routes

### 3.1 `/rfq` — chooser

Replaces the current placeholder. Hero-light landing page with the site's standard motion vocabulary (parallax blobs, fade-in heading, lime underline) and two large cards side-by-side:

- **Order our brands** — icon (Boxes), short copy ("Buy Yamkers and Tasbeka SKUs in bulk"), `FlowButton` → `/rfq/brands`
- **Request private label** — icon (Package), short copy ("Manufacture under your own brand with our facilities"), `FlowButton` → `/rfq/private-label`

Page-level i18n via `useTranslations("rfq.chooser")`.

### 3.2 `/rfq/brands` — Brands wizard

Server component shell that hands off to `<BrandsWizard />` (client). Reads optional `?product=<id>` from `searchParams` and passes it as `preselectProductId` to the wizard, which pre-fills the first row of step 2.

### 3.3 `/rfq/private-label` — Private Label wizard

Same server shell pattern, but no preselect parameter. Hands off to `<PrivateLabelWizard />` (client).

## 4. Reusable trigger component

`src/components/ui/request-quote-button.tsx`

```ts
interface RequestQuoteButtonProps {
  type: "brands" | "privateLabel";
  productId?: number;        // brands flow only
  text?: string;             // optional override; defaults to i18n "rfq.actions.requestQuote"
  className?: string;
  variant?: "primary" | "secondary"; // mapped to FlowButton variant
}
```

- Renders a `FlowButton` from `@/components/ui/flow-button`.
- `href` resolves to `/rfq/brands?product=${productId}` (brands + id) or `/rfq/brands` (brands, no id) or `/rfq/private-label`.
- Drop-in on: `ProductCard` (`type="brands"` + `productId`), `/private-label` CTA banner (`type="privateLabel"` — replaces the current `<FlowButton href="/rfq" ...>`), homepage CTAs, navbar/footer if desired later.

## 5. Wizard architecture (shared scaffold)

Both wizards share the same skeleton component composition; only the middle step's content differs.

### 5.1 Step indicator

Top of the wizard. Four numbered circles connected by short bars. State styling:

- Pending: `bg-white/60 text-primary border border-primary/20`
- Active: `bg-secondary text-primary shadow-md font-display font-bold`
- Completed: `bg-primary text-white` with check icon (lucide `CheckCircle`)

Connecting bar fills with `bg-primary` as the user advances past each step. Step labels (Contact / Products or Brief / Shipping / Review) sit below each circle, translated. No icons inside the circles — numbers only — matching the new-site process timeline aesthetic.

### 5.2 Step transitions

`framer-motion` `AnimatePresence` with `mode="wait"`. Per-step variant:

```ts
{ initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.25, ease: "easeOut" } }
```

### 5.3 Validation gates

`Next` button calls `trigger(stepFields)` on the current step's RHF field names. If any fail, stay on the step and surface the inline errors. Only `Submit` (step 4) invokes the API call.

### 5.4 Section root

The wizard page's root `<main>` element follows the project convention: `relative w-full overflow-hidden px-4 py-24 text-foreground`. No `bg-*` on the root. Parallax blobs (primary/10 and secondary/15) per the motion vocabulary.

### 5.5 Submit + success

On `Submit`:

1. `POST` JSON payload to the relevant API route.
2. Disable the button, show spinner ("rfq.actions.submitting").
3. On `200 OK`: swap the wizard out for a success card — large `CheckCircle` in a lime circle, heading ("rfq.success.heading"), message ("rfq.success.message"), reference id (`RFQ-{Date.now().toString(36).toUpperCase()}` — same convention as the old site), and a FlowButton "Back to home" → `/`.
4. On error: keep the form mounted, show an inline error banner above the buttons row, re-enable Submit so the user can retry.

The reference id is **display-only** — generated client-side, not echoed by the server. (Matches the old site; if real ticketing is needed later, it can be replaced by a server-issued id.)

## 6. Step 1 — Contact (shared)

Fields (RHF + zod):

| Field         | Type              | Required | Notes                                        |
| ------------- | ----------------- | -------- | -------------------------------------------- |
| `companyName` | string min 2      | yes      |                                              |
| `contactName` | string min 2      | yes      |                                              |
| `email`       | string email      | yes      |                                              |
| `phone`       | string min 5      | yes      |                                              |
| `country`     | string min 2      | yes      | Drives the conditional cert field in step 3 |
| `address`     | string optional   | no       |                                              |
| `hp`          | honeypot          | no       | `z.string().max(0).optional().or(z.literal(""))` per existing pattern |

Layout: two-column grid on `md+`, single-column on mobile. Each field uses our standard input class — `rounded-xl border border-primary/10 bg-white/60 px-4 py-3 focus:ring-2 focus:ring-primary/30 focus:outline-none` (or wrapped into a small shared `<TextField />` helper if the same input appears across enough steps to warrant DRY — to be decided in the plan).

Step heading: `t("rfq.contact.heading")`. Lime underline `h-1 bg-secondary` animating 0→96 like the rest of the site.

## 7. Step 2 — Brands flow ("Products")

### 7.1 Schema

```ts
const productLineSchema = z.object({
  productId: z.string().min(1),       // product.id stringified
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

const brandsStepSchema = z.object({
  products: z.array(productLineSchema).min(1, "Add at least one product"),
});
```

### 7.2 UI

- `useFieldArray({ name: "products" })`.
- Default: one empty row. If `preselectProductId` was passed via the route, the row's `productId` is pre-filled.
- Each row is a card with: product `<select>` (full catalog, locale-aware names via `product.nameEn`/`nameAr`), quantity number input, notes free-text. Trash icon to remove the row (only shown if `fields.length > 1`).
- Below the rows: "+ Add another product" outline button (`bg-card/60 border border-primary/10`).
- Card hover: same `hover:-translate-y-1` micro-lift as the new-site cards, with the lime underline bar reveal.

### 7.3 Product source

Read from `src/lib/data/products.ts` (already populated). Locale-aware label: `locale === "ar" ? product.nameAr : product.nameEn` (and `nameFr` if present — fall back to `nameEn`).

## 8. Step 2 — Private Label flow ("Brief")

### 8.1 Schema

```ts
const projectBriefSchema = z.object({
  category: z.enum([
    "tomato_paste", "jams", "juices", "fava_beans",
    "sauces", "beans_peas", "canned_vegetables", "other",
  ]),
  packagingFormat: z.enum(["tin", "glass", "pet", "pouch"]),
  targetVolume: z.string().min(2),       // free-text, e.g. "1 container/month"
  certifications: z.array(z.string()).optional(),
  brandName: z.string().optional(),
  targetRetailPrice: z.string().optional(),
  artworkLink: z.string().url().optional().or(z.literal("")),
});

const privateLabelStepSchema = z.object({
  briefs: z.array(projectBriefSchema).min(1),
});
```

### 8.2 UI

- `useFieldArray({ name: "briefs" })`. Defaults to one empty brief.
- "+ Add another product brief" button, same styling as the brands flow's add-row button.
- Each brief block:
  - **Category** — `<select>` with the 8 enum values, labels from i18n.
  - **Target packaging format** — radio chips, large clickable pills in a 2×2 grid on mobile, 4×1 on md+. Selected chip uses `bg-secondary/20 text-primary border-secondary` background; unselected `bg-white/60 border-primary/10`. Icons reused from the `/private-label` packaging section (`/pattern/manufacturing-lime.png`, etc).
  - **Target volume / annual MOQ** — single-line text input, with placeholder "e.g. 1 container/month, or 20,000 cartons/year".
  - **Required certifications** — multi-select chips (Halal, ISO 22000, FDA, GMP, BRC, Kosher, EU organic, Other). Each chip toggles in/out of the `certifications` array. Same chip styling as the packaging chips.
  - **Customer's brand name** — text, optional. Placeholder: "Leave blank if not finalised".
  - **Target retail price** — text, optional. Placeholder: 'e.g. "$2-3 per unit" or "premium tier"'.
  - **Label artwork link** — URL field, optional. Placeholder: "Google Drive / WeTransfer / Dropbox link". Help text below the input: "If you don't have a link yet, leave this blank — we'll request the artwork in our follow-up email."

### 8.3 No file uploads

Decision rationale: avoiding file uploads keeps the system serverless and dependency-free (no Vercel Blob, no S3, no multipart handling). The vast majority of B2B clients already have artwork in a shared cloud, so a link is friction-equal to an upload. If usage data later shows clients aren't providing links, we can revisit with a real upload solution.

## 9. Step 3 — Shipping (shared, with conditional export field)

### 9.1 Schema

```ts
const shippingStepSchema = z.object({
  shippingMethod: z.enum(["fob", "cif", "exw", "dap"]),
  destinationPort: z.string().min(2),
  estimatedDate: z.string().optional(),
  specialRequirements: z.string().optional(),
  exportCertifications: z.array(z.string()).optional(),
});
```

### 9.2 UI

- **Shipping method** — radio cards, 2×2 grid, same chip style as the packaging chips in step 2 of private label.
- **Destination port / city** — text input, required.
- **Estimated date** — HTML5 `type="date"` input, optional.
- **Special requirements** — textarea, 4 rows, optional.
- **Export certifications (conditional)** — shows only when `!isEgypt(watch("country"))`, where `isEgypt` is the helper defined in 9.3. Heading: *"Which certifications does your country require for food imports from Egypt?"*. Multi-select chips (Halal, EU Organic, SFDA, FDA, JAS, Kosher, NSF, Other) plus a free-text textarea below for anything else the chips don't cover.

### 9.3 Country equality helper

`isEgypt(value: string | undefined): boolean` lives in `src/lib/i18n/country.ts` (or wherever fits, plan can decide). Normalises by lowercasing, trimming, and comparing against a small allowlist of Egypt variants: `["egypt", "eg", "egy", "مصر", "égypte"]`. Returns `false` for undefined/empty input.

## 10. Step 4 — Review (shared)

Read-only summary of every field captured so far, grouped into three cards (Contact / What / Shipping). Card style: `rounded-2xl border border-primary/10 bg-card/60 p-6`. Each row shows `label / value` in two columns. Empty optional fields are hidden (don't render a blank row).

The Submit button is a `FlowButton` styled in the primary variant. Disabled state shown while `isSubmitting` is true; spinner + "rfq.actions.submitting" text inside.

## 11. Backend

### 11.1 API routes

- `src/app/api/rfq/brands/route.ts` — `POST` handler. Validates with `brandsRfqSchema`, gates honeypot, calls `sendBrandsRfqEmail(parsed.data)`. Same response shape as the existing `/api/rfq` (`{ ok: true }` / `{ ok: false, error }`).
- `src/app/api/rfq/private-label/route.ts` — `POST` handler. Same pattern with `privateLabelRfqSchema` and `sendPrivateLabelRfqEmail`.

### 11.2 Schemas (`src/lib/schemas.ts`)

```ts
const contactStepSchema = z.object({ ... });   // section 6
const shippingStepSchema = z.object({ ... });  // section 9
const brandsRfqSchema = contactStepSchema
  .merge(shippingStepSchema)
  .merge(brandsStepSchema)
  .extend({ hp: honeypot });
const privateLabelRfqSchema = contactStepSchema
  .merge(shippingStepSchema)
  .merge(privateLabelStepSchema)
  .extend({ hp: honeypot });
```

The old `rfqSchema` is removed.

### 11.3 Email senders (`src/lib/email.ts`)

Two new functions:

- `sendBrandsRfqEmail(data: BrandsRfqInput): Promise<void>` — subject `[Brands RFQ] {companyName} - {N products}`, body lists contact, line items (resolved product names from the catalog), shipping, export certs, special requirements.
- `sendPrivateLabelRfqEmail(data: PrivateLabelRfqInput): Promise<void>` — subject `[Private Label RFQ] {companyName} - {category list}`, body lists contact, each brief block (category, packaging, volume, certs, brand name, retail price, artwork link), shipping, export certs.

Both reuse the existing `getClient()` and `getAddresses()` helpers. `replyTo` set to the customer's `email`.

The old `sendRfqEmail` is removed alongside `rfqSchema`.

## 12. i18n schema

New top-level `rfq` namespace in `src/i18n/messages/{en,ar,fr}.json`:

```
rfq:
  chooser:
    eyebrow, heading, intro
    brands: { heading, description, cta }
    privateLabel: { heading, description, cta }
  contact:
    heading, fields:
      companyName, contactName, email, phone, country, address
      (each with label + placeholder)
  brands:
    step: { heading, intro }
    fields:
      product, productPlaceholder
      quantity, quantityPlaceholder
      notes, notesPlaceholder
      addAnother
  privateLabel:
    step: { heading, intro }
    categories: { tomato_paste, jams, juices, fava_beans, sauces, beans_peas, canned_vegetables, other }
    packagingFormats: { tin, glass, pet, pouch }   # labels only; icons reused from /private-label
    fields:
      category
      packagingFormat
      targetVolume, targetVolumePlaceholder
      certifications
      brandName, brandNamePlaceholder
      targetRetailPrice, targetRetailPricePlaceholder
      artworkLink, artworkLinkPlaceholder, artworkLinkHelp
      addAnother
  shipping:
    heading, intro
    methods: { fob, cif, exw, dap }
    fields:
      method
      destinationPort, destinationPortPlaceholder
      estimatedDate
      specialRequirements, specialRequirementsPlaceholder
    exportCerts:
      heading, intro, free
      chips: { halal, euOrganic, sfda, fda, jas, kosher, nsf, other }
  certifications:
    halal, iso22000, fda, gmp, brc, kosher, euOrganic, other   # used by private-label step 2
  review:
    heading
    sections: { contact, what, shipping }
  success:
    heading, message, reference, backHome
  actions:
    next, prev, submit, submitting, requestQuote   # requestQuote is the default <RequestQuoteButton> label
  errors:
    submitFailed, networkError
```

All three locales (en/ar/fr) populated in full. EN copy drafted in the implementation plan (will read like the rest of the new site — concise, professional, no jargon).

## 13. Step indicator + scroll-into-view

When the user advances or retreats a step, `window.scrollTo(0, 0)` (smooth) so the new step's heading is visible. Step indicator stays sticky-ish *only* if it would otherwise scroll out of view — implement as a simple `<div className="sticky top-20 z-10 bg-background/80 backdrop-blur">` wrapper around the indicator. If sticky introduces layout issues, fall back to a static indicator + the scroll-to-top behaviour alone.

## 14. Acceptance criteria

A buyer in the UK visits `/products`, finds a Yamkers tomato paste card, taps "Request a quote". They land on `/rfq/brands?product=yamkers-tomato-paste-400g` with that product pre-filled in step 2 row 1. They fill in their contact info (country = United Kingdom), add a second product, set FOB Felixstowe and target date, see the export-certifications field appear in step 3, tick "EU Organic" and "Other (free text)" with a note, review, and submit. The KAG team receives a single Resend email at `MAIL_TO` with subject `[Brands RFQ] Acme Foods Ltd - 2 products` containing the full structured payload.

A private-label client in Saudi Arabia visits `/private-label`, scrolls to the CTA, clicks the button (now a `<RequestQuoteButton type="privateLabel" />`), lands on `/rfq/private-label`. They fill contact, brief one product (tomato paste / tin / "1 container/month" / SFDA + Halal certs / their brand "Al-Falah" / "$1.5/unit" / no artwork link), shipping (CIF Jeddah), see the export-certs field appear (country = Saudi Arabia → not Egypt), pick SFDA + Halal + Kosher, review and submit. KAG receives `[Private Label RFQ] Al-Falah Foods - tomato_paste`.

In both cases:

- `bun run typecheck` and `bun run build` pass clean.
- All three locales (en/ar/fr) render the full flow without missing keys.
- Refreshing the page mid-wizard resets state (acceptable — no persistence by design).
- Submitting twice in quick succession is debounced via `isSubmitting` (no double-fire).
- The old `/api/rfq` route and the old `RfqForm`/`rfqSchema`/`sendRfqEmail` symbols are deleted, not left dangling.

## 15. Out of scope (deferred)

- Real file upload for label artwork — deferred to a future iteration if usage data shows clients struggle with the link approach.
- Server-issued, persistent RFQ reference numbers (currently client-side `Date.now().toString(36)`).
- Storing RFQs in a database for follow-up tracking (currently email-only).
- Admin dashboard for browsing past RFQs.
- Rate-limiting beyond the honeypot — Resend bills per email, so a budget cap there is the simplest defense.
- "Save and resume later" (would require auth + persistence — premature).
