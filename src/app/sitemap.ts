import type { MetadataRoute } from 'next';
import { SITE, sitemapPaths } from '~/utils/seo';

const sitemap = (): MetadataRoute.Sitemap =>
  sitemapPaths().map(path => ({
    url: `${SITE.url}${path === '/' ? '' : path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));

export default sitemap;
