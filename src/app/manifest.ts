import type { MetadataRoute } from 'next';
import { SITE } from '~/utils/seo';

const manifest = (): MetadataRoute.Manifest => ({
  name: SITE.name,
  short_name: SITE.name,
  description: SITE.description,
  start_url: '/',
  display: 'standalone',
  background_color: '#f7f7f2',
  theme_color: '#1d2bd6',
  categories: ['design', 'productivity', 'utilities'],
  icons: [
    { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
  ],
});

export default manifest;
