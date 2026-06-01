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
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
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
    id: 1, slug: "tomato-paste-400g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 400 g Tin", nameAr: "صلصة طماطم 400 جرام",
    descriptionEn: "Rich 28–30 % tomato paste in a 400 g tin — base for sauces, soups, and stews.",
    descriptionAr: "صلصة طماطم 400 جرام بتركيز 28-30٪ — أساس للصلصات والشوربات والطواجن.",
    image: "/Products/400 g.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 2, slug: "tomato-paste-800g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 800 g Tin", nameAr: "صلصة طماطم 800 جرام",
    descriptionEn: "Family-size 800 g tin of 28–30 % concentrated tomato paste.",
    descriptionAr: "عبوة عائلية 800 جرام بتركيز 28-30٪.",
    image: "/Products/800g.png",
    specs: { netWeight: "800 g", netWeightAr: "800 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 6, shipping: "shrink_wrap" },
  },
  {
    id: 3, slug: "tomato-paste-2800g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 2.8 kg Tin", nameAr: "صلصة طماطم 2.8 كجم",
    descriptionEn: "Catering-size 2.8 kg tin, 20–22 % concentration.",
    descriptionAr: "حجم مطاعم 2.8 كجم بتركيز 20-22٪.",
    image: "/Products/2800 g.png",
    specs: { netWeight: "2800 g", netWeightAr: "2800 جرام", concentration: "20–22 %" },
    packaging: { type: "tin", unitsPerCarton: 4, shipping: "carton" },
  },
  {
    id: 4, slug: "tomato-paste-4200g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 4.2 kg Tin", nameAr: "صلصة طماطم 4.2 كجم",
    descriptionEn: "Wholesale 4.2 kg tin of 28–30 % tomato paste for HORECA use.",
    descriptionAr: "حجم جملة 4.2 كجم بتركيز 28-30٪ للفنادق والمطاعم.",
    image: null,
    specs: { netWeight: "4200 g", netWeightAr: "4200 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 2, shipping: "shrink_wrap" },
  },
  {
    id: 5, slug: "tomato-paste-360g-jar", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 360 g Glass Jar", nameAr: "صلصة طماطم 360 جرام برطمان زجاج",
    descriptionEn: "Tomato paste in a reclosable 360 g glass jar, 22–24 % concentration.",
    descriptionAr: "صلصة طماطم في برطمان زجاج 360 جرام بتركيز 22-24٪.",
    image: "/Products/jar.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام", concentration: "22–24 %" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 6, slug: "tomato-paste-120g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 120 g Tin", nameAr: "صلصة طماطم 120 جرام",
    descriptionEn: "Single-meal 120 g tin of 28–30 % tomato paste.",
    descriptionAr: "علبة 120 جرام لوجبة واحدة بتركيز 28-30٪.",
    image: "/Products/120 g.png",
    specs: { netWeight: "120 g", netWeightAr: "120 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 25, shipping: "carton" },
  },
  {
    id: 7, slug: "tomato-paste-60g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 60 g Tin", nameAr: "صلصة طماطم 60 جرام",
    descriptionEn: "Compact 60 g tin — perfect for single recipes or lunchboxes.",
    descriptionAr: "علبة صغيرة 60 جرام مناسبة لوصفة واحدة.",
    image: "/Products/Yam tomato paste 60g.png",
    specs: { netWeight: "60 g", netWeightAr: "60 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 50, shipping: "carton" },
  },
  {
    id: 8, slug: "tomato-paste-50g-sachet", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 50 g Sachet", nameAr: "صلصة طماطم 50 جرام ظرف",
    descriptionEn: "50 g tear-open sachet, 28–30 % paste — pantry- and travel-friendly.",
    descriptionAr: "ظرف 50 جرام بتركيز 28-30٪ مناسب للسفر.",
    image: "/Products/sachet.png",
    specs: { netWeight: "50 g", netWeightAr: "50 جرام", concentration: "28–30 %" },
    packaging: { type: "sachet", unitsPerCarton: 96, shipping: "carton" },
  },
  {
    id: 9, slug: "tomato-paste-70g-sachet", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 70 g Sachet", nameAr: "صلصة طماطم 70 جرام ظرف",
    descriptionEn: "70 g tear-open sachet of 28–30 % tomato paste.",
    descriptionAr: "ظرف 70 جرام بتركيز 28-30٪.",
    image: "/Products/sachet.png",
    specs: { netWeight: "70 g", netWeightAr: "70 جرام", concentration: "28–30 %" },
    packaging: { type: "sachet", unitsPerCarton: 96, shipping: "carton" },
  },

  // ── Fava Beans ───────────────────────────────────────────────────
  {
    id: 10, slug: "fava-beans-plain-3kg", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans Plain — 3 kg", nameAr: "فول مدمس سادة 3 كجم",
    descriptionEn: "Yamkers fava beans, plain, in a 3 kg foodservice tin (1.95 kg drained).",
    descriptionAr: "فول مدمس سادة 3 كجم (المصفى 1.95 كجم).",
    image: "/Products/3 kg.png",
    specs: { netWeight: "3 kg", netWeightAr: "3 كجم", drainedWeight: "1950 g", drainedWeightAr: "1950 جرام" },
    packaging: { type: "tin", unitsPerCarton: 4, shipping: "carton" },
  },
  {
    id: 11, slug: "fava-beans-plain-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans Plain — 400 g", nameAr: "فول مدمس سادة 400 جرام",
    descriptionEn: "Classic plain fava beans, 400 g tin (260 g drained) — ready to heat and serve.",
    descriptionAr: "فول مدمس سادة 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Plain copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 12, slug: "fava-beans-hot-chili-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Hot Chili — 400 g", nameAr: "فول مدمس بالشطة الحارة 400 جرام",
    descriptionEn: "Fava beans simmered with red hot chili, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بالشطة الحمراء 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Hot Chili copy - Copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 13, slug: "fava-beans-tahini-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Tahini — 400 g", nameAr: "فول مدمس بالطحينة 400 جرام",
    descriptionEn: "Creamy fava beans blended with tahini, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بالطحينة 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Tahini copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 14, slug: "fava-beans-sunflower-oil-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Sunflower Oil — 400 g", nameAr: "فول مدمس بزيت عباد الشمس 400 جرام",
    descriptionEn: "Plain fava beans finished with sunflower oil, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بزيت عباد الشمس 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Oil copy - Copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 15, slug: "fava-beans-olive-oil-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Olive Oil — 400 g", nameAr: "فول مدمس بزيت الزيتون 400 جرام",
    descriptionEn: "Fava beans finished with olive oil, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بزيت الزيتون 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Olive Oil copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 16, slug: "fava-beans-tomato-sauce-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans in Tomato Sauce — 400 g", nameAr: "فول مدمس بالصلصة 400 جرام",
    descriptionEn: "Fava beans in tomato sauce, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بالصلصة 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-tomato copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Beans & Peas ─────────────────────────────────────────────────
  {
    id: 17, slug: "white-beans-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "White Beans — 400 g", nameAr: "فاصولياء بيضاء 400 جرام",
    descriptionEn: "Plain white beans, 400 g tin (260 g drained).",
    descriptionAr: "فاصولياء بيضاء 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 18, slug: "white-beans-tomato-sauce-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "White Beans in Tomato Sauce — 400 g", nameAr: "فاصولياء بيضاء بالصلصة 400 جرام",
    descriptionEn: "White beans in tomato sauce, 400 g tin (260 g drained).",
    descriptionAr: "فاصولياء بيضاء بالصلصة 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 19, slug: "red-beans-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "Red Beans — 400 g", nameAr: "فاصولياء حمراء 400 جرام",
    descriptionEn: "Red kidney beans, 400 g tin (260 g drained).",
    descriptionAr: "فاصولياء حمراء 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 20, slug: "green-peas-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "Green Peas — 400 g", nameAr: "بازلاء خضراء 400 جرام",
    descriptionEn: "Tender garden peas, 400 g tin (240 g drained).",
    descriptionAr: "بازلاء خضراء 400 جرام (المصفى 240 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 21, slug: "peas-tomato-sauce-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "Peas in Tomato Sauce — 400 g", nameAr: "بازلاء بالصلصة 400 جرام",
    descriptionEn: "Green peas simmered in tomato sauce, 400 g tin (240 g drained).",
    descriptionAr: "بازلاء بالصلصة 400 جرام (المصفى 240 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Canned Vegetables ────────────────────────────────────────────
  {
    id: 22, slug: "sweet-corn-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Sweet Corn — 400 g", nameAr: "ذرة حلوة 400 جرام",
    descriptionEn: "Whole-kernel sweet corn, 400 g tin (244 g drained).",
    descriptionAr: "ذرة حلوة 400 جرام (المصفى 244 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "244 g", drainedWeightAr: "244 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 23, slug: "chickpeas-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Chickpeas — 400 g", nameAr: "حمص 400 جرام",
    descriptionEn: "Cooked chickpeas, 400 g tin (260 g drained) — ready for hummus or salad.",
    descriptionAr: "حمص 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 24, slug: "chickpeas-tahini-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Chickpeas with Tahini — 400 g", nameAr: "حمص بالطحينة 400 جرام",
    descriptionEn: "Chickpeas blended with tahini, 400 g tin (260 g drained).",
    descriptionAr: "حمص بالطحينة 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 25, slug: "green-okra-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Green Okra — 400 g", nameAr: "بامية خضراء 400 جرام",
    descriptionEn: "Tender green okra, 400 g tin (240 g drained).",
    descriptionAr: "بامية خضراء 400 جرام (المصفى 240 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Jams — 30 g plastic portion cups ─────────────────────────────
  {
    id: 26, slug: "fig-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Fig Jam 30 g Cup", nameAr: "مربى تين 30 جرام كأس",
    descriptionEn: "Single-portion fig jam, 30 g cup — hotel and HORECA breakfast staple.",
    descriptionAr: "مربى تين 30 جرام كأس بلاستيك.",
    image: "/Products/fig Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 27, slug: "strawberry-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Strawberry Jam 30 g Cup", nameAr: "مربى فراولة 30 جرام كأس",
    descriptionEn: "Single-portion strawberry jam, 30 g cup.",
    descriptionAr: "مربى فراولة 30 جرام كأس بلاستيك.",
    image: "/Products/Strawberry Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 28, slug: "guava-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Guava Jam 30 g Cup", nameAr: "مربى جوافة 30 جرام كأس",
    descriptionEn: "Single-portion guava jam, 30 g cup.",
    descriptionAr: "مربى جوافة 30 جرام كأس بلاستيك.",
    image: "/Products/guava Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 29, slug: "apricot-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Apricot Jam 30 g Cup", nameAr: "مربى مشمش 30 جرام كأس",
    descriptionEn: "Single-portion apricot jam, 30 g cup.",
    descriptionAr: "مربى مشمش 30 جرام كأس بلاستيك.",
    image: "/Products/apricots Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 30, slug: "apple-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Apple Jam 30 g Cup", nameAr: "مربى تفاح 30 جرام كأس",
    descriptionEn: "Single-portion apple jam, 30 g cup.",
    descriptionAr: "مربى تفاح 30 جرام كأس بلاستيك.",
    image: "/Products/Apple Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 31, slug: "peach-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Peach Jam 30 g Cup", nameAr: "مربى خوخ 30 جرام كأس",
    descriptionEn: "Single-portion peach jam, 30 g cup.",
    descriptionAr: "مربى خوخ 30 جرام كأس بلاستيك.",
    image: "/Products/Peach Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 32, slug: "mango-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Mango Jam 30 g Cup", nameAr: "مربى مانجو 30 جرام كأس",
    descriptionEn: "Single-portion mango jam, 30 g cup.",
    descriptionAr: "مربى مانجو 30 جرام كأس بلاستيك.",
    image: "/Products/mango Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 33, slug: "orange-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Orange Jam 30 g Cup", nameAr: "مربى برتقال 30 جرام كأس",
    descriptionEn: "Single-portion orange jam, 30 g cup.",
    descriptionAr: "مربى برتقال 30 جرام كأس بلاستيك.",
    image: "/Products/orange Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 34, slug: "mixed-fruit-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Mixed Fruit Jam 30 g Cup", nameAr: "مربى فواكه مشكلة 30 جرام كأس",
    descriptionEn: "Single-portion mixed-fruit jam, 30 g cup.",
    descriptionAr: "مربى فواكه مشكلة 30 جرام كأس بلاستيك.",
    image: "/Products/mixed fruits Jam Portion.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },

  // ── Jams — 360 g glass jars ──────────────────────────────────────
  {
    id: 35, slug: "fig-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Fig Jam 360 g Jar", nameAr: "مربى تين 360 جرام برطمان",
    descriptionEn: "Whole-fig jam in a reclosable 360 g glass jar.",
    descriptionAr: "مربى تين 360 جرام في برطمان زجاج.",
    image: "/Products/Fig Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 36, slug: "strawberry-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Strawberry Jam 360 g Jar", nameAr: "مربى فراولة 360 جرام برطمان",
    descriptionEn: "Whole-strawberry jam in a 360 g glass jar.",
    descriptionAr: "مربى فراولة 360 جرام في برطمان زجاج.",
    image: "/Products/Strawberry Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 37, slug: "guava-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Guava Jam 360 g Jar", nameAr: "مربى جوافة 360 جرام برطمان",
    descriptionEn: "Guava jam in a 360 g glass jar.",
    descriptionAr: "مربى جوافة 360 جرام في برطمان زجاج.",
    image: "/Products/Guava Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 38, slug: "apricot-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Apricot Jam 360 g Jar", nameAr: "مربى مشمش 360 جرام برطمان",
    descriptionEn: "Apricot jam in a 360 g glass jar.",
    descriptionAr: "مربى مشمش 360 جرام في برطمان زجاج.",
    image: "/Products/Apricot Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 39, slug: "apple-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Apple Jam 360 g Jar", nameAr: "مربى تفاح 360 جرام برطمان",
    descriptionEn: "Apple jam in a 360 g glass jar.",
    descriptionAr: "مربى تفاح 360 جرام في برطمان زجاج.",
    image: "/Products/Apple Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 40, slug: "peach-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Peach Jam 360 g Jar", nameAr: "مربى خوخ 360 جرام برطمان",
    descriptionEn: "Peach jam in a 360 g glass jar.",
    descriptionAr: "مربى خوخ 360 جرام في برطمان زجاج.",
    image: "/Products/Peach Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 41, slug: "mango-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Mango Jam 360 g Jar", nameAr: "مربى مانجو 360 جرام برطمان",
    descriptionEn: "Mango jam in a 360 g glass jar.",
    descriptionAr: "مربى مانجو 360 جرام في برطمان زجاج.",
    image: "/Products/Mango Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 42, slug: "orange-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Orange Jam 360 g Jar", nameAr: "مربى برتقال 360 جرام برطمان",
    descriptionEn: "Orange jam in a 360 g glass jar.",
    descriptionAr: "مربى برتقال 360 جرام في برطمان زجاج.",
    image: null,
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 43, slug: "mixed-fruit-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Mixed Fruit Jam 360 g Jar", nameAr: "مربى فواكه مشكلة 360 جرام برطمان",
    descriptionEn: "Mixed-fruit jam in a 360 g glass jar.",
    descriptionAr: "مربى فواكه مشكلة 360 جرام في برطمان زجاج.",
    image: "/Products/Mixed Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },

  // ── Juices ───────────────────────────────────────────────────────
  {
    id: 44, slug: "orange-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Orange Juice 235 ml", nameAr: "عصير برتقال 235 مل",
    descriptionEn: "Yamkers orange juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير برتقال 235 مل في عبوة تتراباك.",
    image: "/Products/Orange Juice.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 45, slug: "guava-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Guava Juice 235 ml", nameAr: "عصير جوافة 235 مل",
    descriptionEn: "Yamkers guava juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير جوافة 235 مل في عبوة تتراباك.",
    image: "/Products/Guava Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 46, slug: "mango-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Mango Juice 235 ml", nameAr: "عصير مانجو 235 مل",
    descriptionEn: "Yamkers mango juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير مانجو 235 مل في عبوة تتراباك.",
    image: "/Products/Mango Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 47, slug: "apple-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Apple Juice 235 ml", nameAr: "عصير تفاح 235 مل",
    descriptionEn: "Yamkers apple juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير تفاح 235 مل في عبوة تتراباك.",
    image: "/Products/Apple Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 48, slug: "cocktail-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Cocktail Juice 235 ml", nameAr: "عصير كوكتيل 235 مل",
    descriptionEn: "Mixed-fruit cocktail juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير كوكتيل 235 مل في عبوة تتراباك.",
    image: "/Products/coktail Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
];
