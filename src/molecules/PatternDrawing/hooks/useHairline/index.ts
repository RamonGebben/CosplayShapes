import { useEffect, useState } from 'react';
import { hairline } from './hairline';

/**
 * The width of one device pixel, kept current as the window moves between
 * screens or zooms, so pattern lines stay one device pixel wide.
 */
export const useHairline = () => {
  const [width, setWidth] = useState(1);

  useEffect(() => {
    const update = () => setWidth(hairline(window.devicePixelRatio));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return width;
};
