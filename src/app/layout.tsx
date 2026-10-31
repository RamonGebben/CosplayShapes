import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Atkinson_Hyperlegible, Big_Shoulders } from 'next/font/google';
import { colorModeScript } from '@pindakaasman/design-system';
import { StyledComponentsRegistry } from '~/providers/StyledComponentsRegistry';
import { ThemeProvider } from '~/providers/ThemeProvider';
import { SITE } from '~/utils/seo';

const atkinson = Atkinson_Hyperlegible({
  variable: '--font-atkinson',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const bigShoulders = Big_Shoulders({
  variable: '--font-big-shoulders',
  weight: ['800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  category: 'crafts',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: '/',
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1d2bd6',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="en" className={`${atkinson.variable} ${bigShoulders.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript() }} />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
