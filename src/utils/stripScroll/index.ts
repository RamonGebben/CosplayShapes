/**
 * The scroll position that centres an item in a horizontally scrolling strip, clamped so the strip
 * never scrolls past either end. `itemLeft` is the item's offset from the start of the content.
 */
export const centredScrollLeft = ({
  itemLeft,
  itemWidth,
  viewWidth,
  scrollWidth,
}: {
  itemLeft: number;
  itemWidth: number;
  viewWidth: number;
  scrollWidth: number;
}) =>
  Math.min(
    Math.max(itemLeft - (viewWidth - itemWidth) / 2, 0),
    Math.max(scrollWidth - viewWidth, 0),
  );
