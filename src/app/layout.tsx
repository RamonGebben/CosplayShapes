import type { Metadata } from 'next';
import { Atkinson_Hyperlegible, Big_Shoulders } from 'next/font/google';
import { colorModeScript } from '@pindakaasman/design-system';
import { StyledComponentsRegistry } from '~/providers/StyledComponentsRegistry';
import { ThemeProvider } from '~/providers/ThemeProvider';

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
  title: {
    default: 'basic-shape-patterns',
    template: '%s · basic-shape-patterns',
  },
  description:
    'Free flat patterns for basic shapes. Pick a shape, enter your measurements, print a true-scale PDF or export an SVG for your cutter.',
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
      </body>
    </html>
  );
};

export default RootLayout;
