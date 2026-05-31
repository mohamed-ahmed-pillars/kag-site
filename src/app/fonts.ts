import localFont from 'next/font/local';

export const outfit = localFont({
  variable: '--font-body-en',
  display: 'swap',
  src: [
    { path: '../../public/fonts/Body Text_Eng/Outfit/Outfit-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Body Text_Eng/Outfit/Outfit-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Body Text_Eng/Outfit/Outfit-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Body Text_Eng/Outfit/Outfit-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Body Text_Eng/Outfit/Outfit-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Body Text_Eng/Outfit/Outfit-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../../public/fonts/Body Text_Eng/Outfit/Outfit-Black.ttf', weight: '900', style: 'normal' },
  ],
});

export const poppins = localFont({
  variable: '--font-heading-en',
  display: 'swap',
  src: [
    { path: '../../public/fonts/Headline English/Poppins-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Headline English/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Headline English/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Headline English/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Headline English/Poppins-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Headline English/Poppins-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../../public/fonts/Headline English/Poppins-Black.ttf', weight: '900', style: 'normal' },
  ],
});

export const altair = localFont({
  variable: '--font-display-en',
  display: 'swap',
  src: '../../public/fonts/Headline 2 English/Altair-ExtraBold.otf',
});

export const notoSansArabic = localFont({
  variable: '--font-body-ar',
  display: 'swap',
  src: [
    { path: '../../public/fonts/Noto Sans/NotoSansArabic-Light.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Noto Sans/NotoSansArabic-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Noto Sans/NotoSansArabic-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Noto Sans/NotoSansArabic-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Noto Sans/NotoSansArabic-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Noto Sans/NotoSansArabic-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../../public/fonts/Noto Sans/NotoSansArabic-Black.ttf', weight: '900', style: 'normal' },
  ],
});

export const handicrafts = localFont({
  variable: '--font-heading-ar',
  display: 'swap',
  src: [
    { path: '../../public/fonts/Headline Arabic/TheYearofHandicrafts-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Headline Arabic/TheYearofHandicrafts-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Headline Arabic/TheYearofHandicrafts-SemiBold.otf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Headline Arabic/TheYearofHandicrafts-Bold.otf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Headline Arabic/TheYearofHandicrafts-Black.otf', weight: '900', style: 'normal' },
  ],
});

export const sahel = localFont({
  variable: '--font-display-ar',
  display: 'swap',
  src: '../../public/fonts/Headline 2 Arabic/sahel-bold.ttf',
});

export const fontVariables = [
  outfit.variable,
  poppins.variable,
  altair.variable,
  notoSansArabic.variable,
  handicrafts.variable,
  sahel.variable,
].join(' ');
