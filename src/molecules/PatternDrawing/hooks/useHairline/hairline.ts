/** One device pixel, in CSS pixels, at this pixel ratio. */
export const hairline = (devicePixelRatio: number) =>
  1 / Math.max(1, devicePixelRatio || 1);
