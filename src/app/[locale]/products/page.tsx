import { getTranslations, setRequestLocale } from "next-intl/server";
import ProductsHero from "@/components/ui/products-hero";
import ProductsTabs from "@/components/ui/products-tabs";
import { products } from "@/lib/data/products";
import type {
  PackagingType,
  ProductBrand,
  ProductCategory,
} from "@/lib/data/products";

type TabKey = "all" | ProductCategory;

const TAB_KEYS: TabKey[] = [
  "all",
  "tomato_paste",
  "fava_beans",
  "beans_peas",
  "canned_vegetables",
  "jams",
  "juices",
];

const BRAND_KEYS: ProductBrand[] = ["yamkers", "tasbeka", "weekday"];

const PACKAGING_KEYS: PackagingType[] = [
  "tin",
  "glass_jar",
  "plastic_cup",
  "sachet",
  "tetra_pak",
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  const tabs = Object.fromEntries(
    TAB_KEYS.map((k) => [k, t(`tabs.${k}`)])
  ) as Record<TabKey, string>;
  const brand = Object.fromEntries(
    BRAND_KEYS.map((k) => [k, t(`card.brand.${k}`)])
  ) as Record<ProductBrand, string>;
  const packaging = Object.fromEntries(
    PACKAGING_KEYS.map((k) => [k, t(`card.packaging.${k}`)])
  ) as Record<PackagingType, string>;

  return (
    <>
      <ProductsHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        subhead={t("hero.subhead")}
        cta={t("cta")}
      />
      <ProductsTabs
        products={products}
        locale={locale}
        labels={{
          catalog: {
            eyebrow: t("catalog.eyebrow"),
            heading: t("catalog.heading"),
            intro: t("catalog.intro"),
          },
          tabs,
          card: {
            brand,
            packaging,
            perCarton: t("card.perCarton"),
            net: t("card.net"),
            drained: t("card.drained"),
          },
        }}
      />
    </>
  );
}
