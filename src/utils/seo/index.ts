import { SHAPES, getShape, type ShapeSlug } from '~/utils/shapes';

export const SITE = {
  name: 'CosplayShapes',
  url: 'https://cosplayshapes.ra-ge.net',
  title: 'CosplayShapes · Free cosplay pattern templates for basic shapes',
  description:
    'Free pattern templates for cosplay and props. Pick a cone, cylinder, dome, box or pyramid, enter your measurements and print a tiled, true-scale PDF on A4, Letter or a larger sheet, or export an SVG for your cutter. No sign-up, nothing leaves your browser.',
  keywords: [
    'cosplay pattern',
    'cosplay template',
    'eva foam template',
    'foam armour pattern',
    'prop making template',
    'worbla pattern',
    'cone pattern generator',
    'dome pattern generator',
    'printable pattern pdf',
    'tiled pdf pattern',
    'free cosplay patterns',
  ],
} as const;

interface ShapeSeo {
  /** What makers build with it, used in the title. */
  uses: string;
  keywords: Array<string>;
}

const SHAPE_SEO: Record<ShapeSlug, ShapeSeo> = {
  cylinder: {
    uses: 'arm bands, cuffs and tubes',
    keywords: ['cylinder template', 'tube pattern', 'arm band pattern'],
  },
  cone: {
    uses: 'horns, spikes and hat tips',
    keywords: ['cone template', 'cone pattern generator', 'horn pattern'],
  },
  'truncated-cone': {
    uses: 'bracers, gauntlets and greaves',
    keywords: [
      'truncated cone template',
      'frustum pattern',
      'bracer pattern',
      'gauntlet template',
    ],
  },
  dome: {
    uses: 'helmet crowns and pauldrons',
    keywords: ['dome pattern', 'gore pattern', 'helmet dome template'],
  },
  sphere: {
    uses: 'orbs and balls',
    keywords: ['sphere pattern', 'sphere gore template', 'orb pattern'],
  },
  box: {
    uses: 'pouches, plates and props',
    keywords: ['box template', 'box net pattern', 'belt pouch pattern'],
  },
  pyramid: {
    uses: 'spikes and studs',
    keywords: ['pyramid template', 'spike pattern', 'pyramid net'],
  },
  prism: {
    uses: 'crystals and gems',
    keywords: ['prism template', 'crystal pattern', 'hexagonal prism net'],
  },
};

export const shapePath = (slug: ShapeSlug) => `/${slug}`;

export const shapeSeo = (slug: ShapeSlug) => {
  const { name } = getShape(slug);
  const { uses, keywords } = SHAPE_SEO[slug];
  const lower = name.toLowerCase();
  return {
    name,
    title: `${name} pattern template for ${uses}`,
    description: `Free ${lower} pattern maker for cosplay and props: ${uses}. Enter your measurements, allow for foam thickness or seam allowance, and print a tiled, true-scale PDF on A4, Letter or a larger sheet, or export an SVG. No sign-up.`,
    keywords: [
      ...new Set([
        ...keywords,
        `${lower} pattern`,
        ...SITE.keywords.slice(0, 4),
      ]),
    ],
  };
};

const FEATURES = [
  'Patterns from your own measurements, in cm or inches',
  'True-scale PDF tiled across A4, Letter, A3, Tabloid or plotter-size pages with alignment marks',
  'SVG export for Cricut, laser and vinyl cutters',
  'Allowance for EVA foam thickness and fabric seam allowance',
  'Free, no account, everything stays in your browser',
];

/** schema.org WebApplication for the whole site or one shape's page. */
export const webApplicationSchema = (slug?: ShapeSlug) => {
  const page = slug && shapeSeo(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page ? `${page.name} pattern template · ${SITE.name}` : SITE.name,
    url: `${SITE.url}${slug ? shapePath(slug) : ''}`,
    description: page ? page.description : SITE.description,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    featureList: FEATURES,
    audience: {
      '@type': 'Audience',
      audienceType: 'Cosplayers, prop makers and crafters',
    },
  };
};

export const sitemapPaths = () => ['/', ...SHAPES.map(s => shapePath(s.slug))];
