import type { MetadataRoute } from 'next';
import { SITE } from '~/utils/seo';

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/' },
  sitemap: `${SITE.url}/sitemap.xml`,
});

export default robots;
