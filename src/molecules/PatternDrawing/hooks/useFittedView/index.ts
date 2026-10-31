import { useEffect, useState, type RefObject } from 'react';
import { fitView } from './fitView';

/** Watches the element's size and fits the content into it. */
export const useFittedView = (
  ref: RefObject<HTMLElement | null>,
  content: { width: number; height: number },
  padding: number,
) => {
  const [box, setBox] = useState<{ width: number; height: number }>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) =>
      setBox({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  if (!box || box.width === 0 || box.height === 0) return undefined;
  return fitView(content, box, padding);
};
