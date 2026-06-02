export type ProductCategory =
  | "tomato_paste"
  | "fava_beans"
  | "beans_peas"
  | "canned_vegetables"
  | "jams"
  | "juices";

export type ProductBrand = "yamkers" | "tasbeka";

export type PackagingType =
  | "tin"
  | "glass_jar"
  | "plastic_cup"
  | "sachet"
  | "tetra_pak";

export type ShippingType = "carton" | "shrink_wrap";

export interface Product {
  id: number;
  slug: string;
  brand: ProductBrand;
  category: ProductCategory;
  image: string | null;
  specs: {
    netWeight: string;
    netWeightAr: string;
    drainedWeight?: string;
    drainedWeightAr?: string;
    concentration?: string;
  };
  packaging: {
    type: PackagingType;
    unitsPerCarton: number;
    shipping: ShippingType;
  };
}

export const products: Product[] = [
  // ── Tomato Paste ──────────────────────────────────────────────────
  {
    id: 4, slug: "tomato-paste-4200g-tin", brand: "yamkers", category: "tomato_paste",
    image: "/Products/4200 g.png",
    specs: { netWeight: "4200 g", netWeightAr: "4200 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 2, shipping: "shrink_wrap" },
  },
  {
    id: 3, slug: "tomato-paste-2800g-tin", brand: "yamkers", category: "tomato_paste",
    image: "/Products/2800 g.png",
    specs: { netWeight: "2800 g", netWeightAr: "2800 جرام", concentration: "20–22 %" },
    packaging: { type: "tin", unitsPerCarton: 4, shipping: "carton" },
  },
  {
    id: 2, slug: "tomato-paste-800g-tin", brand: "yamkers", category: "tomato_paste",
    image: "/Products/800g.png",
    specs: { netWeight: "800 g", netWeightAr: "800 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 6, shipping: "shrink_wrap" },
  },
  {
    id: 1, slug: "tomato-paste-400g-tin", brand: "yamkers", category: "tomato_paste",
    image: "/Products/400 g.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 5, slug: "tomato-paste-360g-jar", brand: "yamkers", category: "tomato_paste",
    image: "/Products/jar.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام", concentration: "22–24 %" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 6, slug: "tomato-paste-120g-tin", brand: "yamkers", category: "tomato_paste",
    image: "/Products/120 g.png",
    specs: { netWeight: "120 g", netWeightAr: "120 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 25, shipping: "carton" },
  },
  {
    id: 9, slug: "tomato-paste-70g-sachet", brand: "yamkers", category: "tomato_paste",
    image: "/Products/70 g.png",
    specs: { netWeight: "70 g", netWeightAr: "70 جرام", concentration: "28–30 %" },
    packaging: { type: "sachet", unitsPerCarton: 96, shipping: "carton" },
  },
  {
    id: 7, slug: "tomato-paste-60g-tin", brand: "yamkers", category: "tomato_paste",
    image: "/Products/Yam tomato paste 60g.png",
    specs: { netWeight: "60 g", netWeightAr: "60 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 50, shipping: "carton" },
  },
  {
    id: 8, slug: "tomato-paste-50g-sachet", brand: "yamkers", category: "tomato_paste",
    image: "/Products/50 g.png",
    specs: { netWeight: "50 g", netWeightAr: "50 جرام", concentration: "28–30 %" },
    packaging: { type: "sachet", unitsPerCarton: 96, shipping: "carton" },
  },

  // ── Jams - 360 g glass jars ──────────────────────────────────────
  {
    id: 35, slug: "fig-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Fig Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 36, slug: "strawberry-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Strawberry Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 37, slug: "guava-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Guava Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 38, slug: "apricot-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Apricot Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 39, slug: "apple-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Apple Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 40, slug: "peach-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Peach Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 41, slug: "mango-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Mango Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 42, slug: "orange-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Orange Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 43, slug: "mixed-fruit-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Mixed Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 50, slug: "carrot-jam-360g-jar", brand: "yamkers", category: "jams",
    image: "/Products/Carrot Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },

  // ── Jams - 30 g plastic portion cups ─────────────────────────────
  {
    id: 26, slug: "fig-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/fig Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 27, slug: "strawberry-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/Strawberry Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 28, slug: "guava-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/guava Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 29, slug: "apricot-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/apricots Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 30, slug: "apple-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/Apple Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 31, slug: "peach-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/Peach Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 32, slug: "mango-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/mango Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 33, slug: "orange-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/orange Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 34, slug: "mixed-fruit-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/mixed fruits Jam Portion.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 49, slug: "carrot-jam-30g-cup", brand: "yamkers", category: "jams",
    image: "/Products/Carrot Jam Portion.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },

  // ── Fava Beans ───────────────────────────────────────────────────
  {
    id: 10, slug: "fava-beans-plain-3kg", brand: "yamkers", category: "fava_beans",
    image: "/Products/3 kg.png",
    specs: { netWeight: "3 kg", netWeightAr: "3 كجم", drainedWeight: "1950 g", drainedWeightAr: "1950 جرام" },
    packaging: { type: "tin", unitsPerCarton: 4, shipping: "carton" },
  },
  {
    id: 11, slug: "fava-beans-plain-400g", brand: "yamkers", category: "fava_beans",
    image: "/Products/Tin Can-Plain copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 12, slug: "fava-beans-hot-chili-400g", brand: "yamkers", category: "fava_beans",
    image: "/Products/Tin Can-Hot Chili copy - Copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 13, slug: "fava-beans-tahini-400g", brand: "yamkers", category: "fava_beans",
    image: "/Products/Tin Can-Tahini copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 14, slug: "fava-beans-sunflower-oil-400g", brand: "yamkers", category: "fava_beans",
    image: "/Products/Tin Can-Oil copy - Copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 15, slug: "fava-beans-olive-oil-400g", brand: "yamkers", category: "fava_beans",
    image: "/Products/Tin Can-Olive Oil copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 16, slug: "fava-beans-tomato-sauce-400g", brand: "yamkers", category: "fava_beans",
    image: "/Products/Tin Can-tomato copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Beans & Peas ─────────────────────────────────────────────────
  {
    id: 17, slug: "white-beans-400g", brand: "yamkers", category: "beans_peas",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 18, slug: "white-beans-tomato-sauce-400g", brand: "yamkers", category: "beans_peas",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 19, slug: "red-beans-400g", brand: "yamkers", category: "beans_peas",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 20, slug: "green-peas-400g", brand: "yamkers", category: "beans_peas",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 21, slug: "peas-tomato-sauce-400g", brand: "yamkers", category: "beans_peas",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Canned Vegetables ────────────────────────────────────────────
  {
    id: 22, slug: "sweet-corn-400g", brand: "yamkers", category: "canned_vegetables",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "244 g", drainedWeightAr: "244 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 23, slug: "chickpeas-400g", brand: "yamkers", category: "canned_vegetables",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 24, slug: "chickpeas-tahini-400g", brand: "yamkers", category: "canned_vegetables",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 25, slug: "green-okra-400g", brand: "yamkers", category: "canned_vegetables",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Juices ───────────────────────────────────────────────────────
  {
    id: 44, slug: "orange-juice-235ml", brand: "yamkers", category: "juices",
    image: "/Products/Orange Juice.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 45, slug: "guava-juice-235ml", brand: "yamkers", category: "juices",
    image: "/Products/Guava Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 46, slug: "mango-juice-235ml", brand: "yamkers", category: "juices",
    image: "/Products/Mango Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 47, slug: "apple-juice-235ml", brand: "yamkers", category: "juices",
    image: "/Products/Apple Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 48, slug: "cocktail-juice-235ml", brand: "yamkers", category: "juices",
    image: "/Products/coktail Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
];
