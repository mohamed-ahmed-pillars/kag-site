import { setRequestLocale, getTranslations } from "next-intl/server";
import CustomProductHero from "@/components/ui/custom-product-hero";
import CustomProductCapabilities from "@/components/ui/custom-product-capabilities";
import CustomProductProcess from "@/components/ui/custom-product-process";
import CustomProductApplications from "@/components/ui/custom-product-applications";
import CustomProductFaq from "@/components/ui/custom-product-faq";
import CertificationsMarquee from "@/components/ui/certifications-marquee";
import { RequestQuoteButton } from "@/components/ui/request-quote-button";

const CAPABILITY_KEYS = [
  "flavorProfiling",
  "formulation",
  "sensoryTesting",
  "regulatoryLabel",
  "pilotBatches",
  "scaleUp",
] as const;

const STEP_KEYS = [
  "brief",
  "discovery",
  "prototype",
  "tasting",
  "pilot",
  "handoff",
] as const;

const APPLICATION_KEYS = [
  "sauces",
  "jams",
  "juices",
  "fava",
  "condiments",
  "pickles",
] as const;

const FAQ_KEYS = [
  "turnaround",
  "samples",
  "ipOwnership",
  "moq",
  "costing",
  "regulatory",
] as const;

export default async function CustomProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("customProductPage");

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

  const applicationItems = Object.fromEntries(
    APPLICATION_KEYS.map((k) => [
      k,
      {
        title: t(`applications.items.${k}.title`),
        description: t(`applications.items.${k}.description`),
      },
    ]),
  ) as Record<
    (typeof APPLICATION_KEYS)[number],
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
      <CustomProductHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        subhead={t("hero.subhead")}
        cta={t("hero.cta")}
      />

      <CustomProductCapabilities
        eyebrow={t("capabilities.eyebrow")}
        heading={t("capabilities.heading")}
        intro={t("capabilities.intro")}
        items={capabilityItems}
      />

      <CustomProductProcess
        eyebrow={t("process.eyebrow")}
        heading={t("process.heading")}
        intro={t("process.intro")}
        steps={processSteps}
      />

      <CustomProductApplications
        eyebrow={t("applications.eyebrow")}
        heading={t("applications.heading")}
        intro={t("applications.intro")}
        items={applicationItems}
      />

      <section className="px-4 py-24">
        <div className="container mx-auto max-w-6xl">
          <CertificationsMarquee heading={t("certifications.heading")} />
        </div>
      </section>

      <CustomProductFaq
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
