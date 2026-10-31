'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTheme } from 'styled-components';
import { renderStill } from '~/utils/modelScene';
import type { ModelSpec } from '~/utils/pattern';
import { Still } from './components/Still';

export interface ModelStillProps {
  model: ModelSpec;
  /** Size of the rendered image in CSS pixels; it scales to fit its box. */
  width: number;
  height: number;
  /** Shown until the still is drawn, and instead of it without WebGL. */
  fallback?: ReactNode;
}

/**
 * The finished form, cel-shaded at its resting angle, as a still image.
 * Every still on a page shares one offscreen WebGL context.
 */
export const ModelStill = ({
  model,
  width,
  height,
  fallback = null,
}: ModelStillProps) => {
  const theme = useTheme();
  const [src, setSrc] = useState<string>();
  const colors = useMemo(
    () => ({
      body: theme.rawColor('tertiary'),
      ink: theme.rawColor('quaternary'),
      lit: theme.rawColor('secondary'),
    }),
    [theme],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setSrc(
        renderStill(model, colors, {
          width,
          height,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }),
      ),
    );
    return () => cancelAnimationFrame(frame);
  }, [model, colors, width, height]);

  if (!src) return fallback;
  return <Still src={src} alt="" width={width} height={height} />;
};
