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
