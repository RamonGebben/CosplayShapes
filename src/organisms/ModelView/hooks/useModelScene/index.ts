import { useCallback, useEffect, useRef, type RefObject } from 'react';
import {
  createRenderer,
  createScene,
  disposeScene,
  fillContent,
  fitCamera,
  renderScene,
  type Rotation,
  type Scene,
  type SceneColors,
} from '~/utils/modelScene';
import type { ModelSpec } from '~/utils/pattern';

/**
 * Owns the live three.js scene and renders only when something changes,
 * never in a loop.
 */
export const useModelScene = ({
  container,
  model,
  highlight,
  colors,
  onUnavailable,
}: {
  container: RefObject<HTMLDivElement | null>;
  model: ModelSpec;
  highlight?: string;
  colors: SceneColors;
  onUnavailable: () => void;
}) => {
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return undefined;
    const renderer = createRenderer();
    if (!renderer) {
      onUnavailable();
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    element.appendChild(renderer.domElement);
    const current = createScene(renderer);
    sceneRef.current = current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      current.camera.aspect = width / height;
      fitCamera(current);
      renderScene(current);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      disposeScene(current);
      renderer.domElement.remove();
      sceneRef.current = null;
    };
  }, [container, onUnavailable]);

  useEffect(() => {
    const current = sceneRef.current;
    if (!current) return;
    fillContent(current, model, highlight, colors);
    renderScene(current);
  }, [model, highlight, colors]);

  const setRotation = useCallback(
    (update: (rotation: Rotation) => Rotation) => {
      const current = sceneRef.current;
      if (!current) return;
      current.rotation = update(current.rotation);
      renderScene(current);
    },
    [],
  );

  return setRotation;
};
