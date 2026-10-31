export interface FittedView {
  /** Pixels per millimetre. */
  scale: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Fits content of this size (mm) into a box (px) with padding (px) on every
 * side, centred, and returns the viewBox that covers the whole box so a grid
 * drawn in the same units fills it edge to edge.
 */
export const fitView = (
  content: { width: number; height: number },
  box: { width: number; height: number },
  padding: number,
): FittedView => {
  const innerWidth = Math.max(1, box.width - padding * 2);
  const innerHeight = Math.max(1, box.height - padding * 2);
  const scale = Math.min(
    innerWidth / Math.max(content.width, 1),
    innerHeight / Math.max(content.height, 1),
  );
  const width = box.width / scale;
  const height = box.height / scale;
  return {
    scale,
    x: (content.width - width) / 2,
    y: (content.height - height) / 2,
    width,
    height,
  };
};
