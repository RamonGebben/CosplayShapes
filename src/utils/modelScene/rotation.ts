export interface Rotation {
  yaw: number;
  pitch: number;
}

export const INITIAL_ROTATION: Rotation = { yaw: -0.6, pitch: 0.38 };

const PITCH_LIMIT = { min: -0.7, max: 1.1 };

const STEP = Math.PI / 12;

export const clampPitch = (pitch: number) =>
  Math.min(PITCH_LIMIT.max, Math.max(PITCH_LIMIT.min, pitch));

/** Drag distance in px to a turn: a full turn across ~600px. */
export const rotateByDrag = (
  rotation: Rotation,
  dx: number,
  dy: number,
): Rotation => ({
  yaw: rotation.yaw + dx * 0.0105,
  pitch: clampPitch(rotation.pitch + dy * 0.0105),
});

/** Arrow keys turn the model 15°; Home puts it back. */
export const rotateByKey = (
  rotation: Rotation,
  key: string,
): Rotation | undefined => {
  switch (key) {
    case 'ArrowLeft':
      return { ...rotation, yaw: rotation.yaw - STEP };
    case 'ArrowRight':
      return { ...rotation, yaw: rotation.yaw + STEP };
    case 'ArrowUp':
      return { ...rotation, pitch: clampPitch(rotation.pitch - STEP) };
    case 'ArrowDown':
      return { ...rotation, pitch: clampPitch(rotation.pitch + STEP) };
    case 'Home':
      return INITIAL_ROTATION;
    default:
      return undefined;
  }
};
