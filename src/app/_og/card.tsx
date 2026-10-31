import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { ShapeIcon } from '~/atoms/ShapeIcon';
import { SITE } from '~/utils/seo';
import type { ShapeSlug } from '~/utils/shapes';

export const OG_SIZE = { width: 1200, height: 630 };

// Literal values: ImageResponse renders outside the styled-components theme.
const INK = '#121212';
const ULTRAMARINE = '#1d2bd6';
const MAGENTA = '#ff3d7f';
const YELLOW = '#ffd23f';

const fontData = readFile(
  path.join(process.cwd(), 'public/fonts/BigShoulders-Black.ttf'),
);

/** The social card: brand, a heading, a line of detail and the shapes. */
export const renderOgCard = async ({
  heading,
  detail,
  shapes,
}: {
  heading: string;
  detail: string;
  shapes: Array<ShapeSlug>;
}) =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: ULTRAMARINE,
        color: '#ffffff',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '64px 72px 40px',
          gap: 48,
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              gap: 12,
              fontFamily: 'Big Shoulders',
              fontSize: 40,
              textTransform: 'uppercase',
            }}
          >
            <span>cosplay</span>
            <span style={{ color: YELLOW }}>shapes</span>
          </div>
          <div
            style={{
              marginTop: 'auto',
              fontFamily: 'Big Shoulders',
              fontSize: 104,
              lineHeight: 0.9,
              textTransform: 'uppercase',
            }}
          >
            {heading}
          </div>
          <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.3 }}>
            {detail}
          </div>
        </div>
        <div
          style={{
            width: 360,
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'center',
            justifyContent: 'center',
            color: YELLOW,
          }}
        >
          {shapes.map(slug => (
            <ShapeIcon
              key={slug}
              slug={slug}
              size={shapes.length > 1 ? 180 : 340}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '22px 72px',
          background: MAGENTA,
          color: INK,
          fontSize: 28,
        }}
      >
        <span>Free · No sign-up · Prints at 100%</span>
        <span>{SITE.url.replace('https://', '')}</span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        {
          name: 'Big Shoulders',
          data: await fontData,
          weight: 900,
          style: 'normal',
        },
      ],
    },
  );
