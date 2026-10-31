type Corner = readonly [number, number, number];

/** The eight corners of a box centred on the origin, by its half-sizes. */
export const boxCorners = (
  halfX: number,
  halfY: number,
  halfZ: number,
): Array<Corner> =>
  [-1, 1].flatMap(sx =>
    [-1, 1].flatMap(sy =>
      [-1, 1].map(sz => [sx * halfX, sy * halfY, sz * halfZ] as const),
    ),
  );

/** Turns a point the way the pivot does: yaw about y, then pitch about x. */
const turn = ([x, y, z]: Corner, yaw: number, pitch: number): Corner => {
  const yawX = x * Math.cos(yaw) + z * Math.sin(yaw);
  const yawZ = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return [
    yawX,
    y * Math.cos(pitch) - yawZ * Math.sin(pitch),
    y * Math.sin(pitch) + yawZ * Math.cos(pitch),
  ];
};

const YAW_SAMPLES = 16;

/**
 * How far back the camera sits so the model's box fills the view to
 * `margin` of its width and height, checked at every yaw: turning the
 * model with the mouse or keys never pushes it out of frame.
 */
export const fitDistance = (
  corners: Array<Corner>,
  pitch: number,
  tanHalfWidth: number,
  tanHalfHeight: number,
  margin = 0.88,
) =>
  Math.max(
    ...Array.from({ length: YAW_SAMPLES }, (_, index) =>
      Math.max(
        ...corners.map(corner => {
          const [x, y, z] = turn(
            corner,
            (2 * Math.PI * index) / YAW_SAMPLES,
            pitch,
          );
          return (
            z +
            Math.max(
              Math.abs(x) / (tanHalfWidth * margin),
              Math.abs(y) / (tanHalfHeight * margin),
            )
          );
        }),
      ),
    ),
  );
