import { useEffect, useRef, type RefObject } from 'react';
import { isOutside } from './isOutside';

/**
 * Calls `onOutside` when the pointer goes down anywhere outside `container`,
 * while `active`: how a popup closes on a click or tap elsewhere.
 */
export const useOutsidePointerDown = (
  container: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void,
) => {
  // The latest callback, so a new one each render doesn't re-attach.
  const callback = useRef(onOutside);
  useEffect(() => {
    callback.current = onOutside;
  });
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: PointerEvent) => {
      if (isOutside(container.current, event.target)) callback.current();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [container, active]);
};
