'use client';

import { useMemo, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { useTheme } from 'styled-components';
import type { ModelSpec } from '~/utils/pattern';
import { Viewport } from './components/Viewport';
import { useModelScene } from './hooks/useModelScene';
import { rotateByDrag, rotateByKey } from '~/utils/modelScene';

export interface ModelViewProps {
  model: ModelSpec;
  /** The measurement whose edges are lit. */
  highlight?: string;
  label: string;
  /** Called once when the browser can't draw WebGL. */
  onUnavailable: () => void;
}

/** The finished form, cel-shaded; drag or use the arrow keys to turn it. */
export const ModelView = ({
  model,
  highlight,
  label,
  onUnavailable,
}: ModelViewProps) => {
  const theme = useTheme();
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const colors = useMemo(
    () => ({
      body: theme.rawColor('tertiary'),
      ink: theme.rawColor('quaternary'),
      lit: theme.rawColor('secondary'),
    }),
    [theme],
  );
  const setRotation = useModelScene({
    container,
    model,
    highlight,
    colors,
    onUnavailable,
  });

  const onKeyDown = (event: KeyboardEvent) => {
    const turned = (rotation: Parameters<typeof rotateByKey>[0]) =>
      rotateByKey(rotation, event.key) ?? rotation;
    if (rotateByKey({ yaw: 0, pitch: 0 }, event.key) === undefined) return;
    event.preventDefault();
    setRotation(turned);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start) return;
    drag.current = { x: event.clientX, y: event.clientY };
    setRotation(rotation =>
      rotateByDrag(rotation, event.clientX - start.x, event.clientY - start.y),
    );
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <Viewport
      ref={container}
      tabIndex={0}
      role="img"
      aria-roledescription="3D model"
      aria-label={`${label}. Use the arrow keys to turn it, Home to reset.`}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    />
  );
};
