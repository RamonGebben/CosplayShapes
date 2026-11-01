/** A down-pointing ink chevron that turns up when its section is open. */
export const Chevron = ({
  open,
  size = 12,
}: {
  open: boolean;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="square"
    aria-hidden="true"
    style={{ flex: 'none', transform: open ? 'rotate(180deg)' : undefined }}
  >
    <path d="M2 4.25 6 8.25l4-4" />
  </svg>
);
