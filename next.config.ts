import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-frontmatter', { type: 'yaml', marker: '-' }], ['remark-gfm', {}]],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  allowedDevOrigins: ['192.168.1.101', '192.168.1.*'],
};

export default withNextIntl(withMDX(nextConfig));
