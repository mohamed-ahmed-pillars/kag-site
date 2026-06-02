import { setRequestLocale, getTranslations } from "next-intl/server";
import ExportHero from "@/components/ui/export-hero";
import ExportCapabilities from "@/components/ui/export-capabilities";
import ExportProcess from "@/components/ui/export-process";
import ExportIncoterms from "@/components/ui/export-incoterms";
import ExportFaq from "@/components/ui/export-faq";
import GlobalReachSection from "@/components/ui/global-reach-section";
import CertificationsMarquee from "@/components/ui/certifications-marquee";
import { RequestQuoteButton } from "@/components/ui/request-quote-button";

const CAPABILITY_KEYS = [
  "volume",
  "branded",
  "formats",
  "regulatory",
  "shelfLife",
  "documentation",
] as const;

const STEP_KEYS = [
  "rfq",
  "samples",
  "po",
  "production",
  "loading",
  "shipping",
] as const;

const TERM_KEYS = ["fob", "cif", "exw", "dap"] as const;

const FAQ_KEYS = [
  "moq",
  "leadTime",
  "samples",
  "payment",
  "incoterms",
  "documentation",
] as const;

export default async function ExportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("exportPage");

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

  const incotermTerms = Object.fromEntries(
    TERM_KEYS.map((k) => [
      k,
      {
        title: t(`incoterms.terms.${k}.title`),
        description: t(`incoterms.terms.${k}.description`),
      },
    ]),
  ) as Record<
    (typeof TERM_KEYS)[number],
    { title: string; description: string }
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
      <ExportHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        subhead={t("hero.subhead")}
        cta={t("hero.cta")}
      />

      <ExportCapabilities
        eyebrow={t("capabilities.eyebrow")}
        heading={t("capabilities.heading")}
        intro={t("capabilities.intro")}
        items={capabilityItems}
      />

      <GlobalReachSection />

      <ExportProcess
        eyebrow={t("process.eyebrow")}
        heading={t("process.heading")}
        intro={t("process.intro")}
        steps={processSteps}
      />

      <ExportIncoterms
        eyebrow={t("incoterms.eyebrow")}
        heading={t("incoterms.heading")}
        intro={t("incoterms.intro")}
        terms={incotermTerms}
        ports={{
          heading: t("incoterms.ports.heading"),
          items: t.raw("incoterms.ports.items") as string[],
        }}
        containers={{
          heading: t("incoterms.containers.heading"),
          items: t.raw("incoterms.containers.items") as string[],
        }}
      />

      <section className="px-4 py-24">
        <div className="container mx-auto max-w-6xl">
          <CertificationsMarquee heading={t("certifications.heading")} />
        </div>
      </section>

      <ExportFaq
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
            <RequestQuoteButton type="brands" text={t("cta.button")} className="px-10 py-3" />
          </div>
        </div>
      </section>
    </>
  );
}
