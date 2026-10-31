import * as THREE from 'three';
import type { ModelLine, ModelSpec } from '~/utils/pattern';
import { boxCorners, fitDistance } from './fit';
import { INITIAL_ROTATION, type Rotation } from './rotation';

export { boxCorners, fitDistance } from './fit';
export {
  INITIAL_ROTATION,
  clampPitch,
  rotateByDrag,
  rotateByKey,
  type Rotation,
} from './rotation';

export interface SceneColors {
  body: string;
  ink: string;
  lit: string;
}

export interface Scene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pivot: THREE.Group;
  content: THREE.Group;
  gradient: THREE.DataTexture;
  rotation: Rotation;
  /** Points on the model, kept to refit the camera on resize. */
  corners: Array<readonly [number, number, number]>;
}

/** Three tones and hard steps between them: the cel-shading ramp. */
const celRamp = () => {
  const texture = new THREE.DataTexture(
    new Uint8Array([110, 190, 255]),
    3,
    1,
    THREE.RedFormat,
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
};

const toVector = ([x, y, z]: readonly [number, number, number]) =>
  new THREE.Vector3(x, y, z);

const bodyGeometry = (model: ModelSpec) => {
  if (model.kind === 'lathe')
    return new THREE.LatheGeometry(
      model.profile.map(
        ([radius, y]) => new THREE.Vector2(Math.max(radius, 1e-4), y),
      ),
      128,
    );
  const positions = model.faces.flatMap(face =>
    face
      .slice(1, -1)
      .flatMap((_, index) => [face[0], face[index + 1], face[index + 2]])
      .flatMap(vertex => [...model.vertices[vertex]]),
  );
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.computeVertexNormals();
  return geometry;
};

/** A seam as a thin tube, since WebGL lines are always one pixel wide. */
const tube = (line: ModelLine, radius: number, material: THREE.Material) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  line.points
    .slice(1)
    .forEach((point, index) =>
      path.add(
        new THREE.LineCurve3(toVector(line.points[index]), toVector(point)),
      ),
    );
  return new THREE.Mesh(
    new THREE.TubeGeometry(path, line.points.length * 2, radius, 8, false),
    material,
  );
};

const inkLine = (line: ModelLine, material: THREE.LineBasicMaterial) =>
  new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(line.points.map(toVector)),
    material,
  );

const disposeChildren = (group: THREE.Group) => {
  group.traverse(object => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
      object.geometry.dispose();
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      materials.forEach(material => material.dispose());
    }
  });
  group.clear();
};

/** At most this many vertices are checked when framing the model. */
const FIT_SAMPLES = 1500;

/**
 * The model's vertices, centred and thinned out. Fitting to these rather than
 * the bounding box frames round shapes tightly: a box's corners sit about 40%
 * outside a cylinder when it turns.
 */
const outlinePoints = (
  geometry: THREE.BufferGeometry,
  centre: THREE.Vector3,
) => {
  const position = geometry.getAttribute('position');
  const step = Math.max(1, Math.floor(position.count / FIT_SAMPLES));
  return Array.from(
    { length: Math.floor(position.count / step) },
    (_, index) =>
      [
        position.getX(index * step) - centre.x,
        position.getY(index * step) - centre.y,
        position.getZ(index * step) - centre.z,
      ] as const,
  );
};

/**
 * Puts the model in the scene: a cel-shaded body with an ink outline, its
 * seams in ink and the `highlight` measurement lit as a tube.
 */
export const fillContent = (
  current: Scene,
  model: ModelSpec,
  highlight: string | undefined,
  colors: SceneColors,
) => {
  disposeChildren(current.content);
  const geometry = bodyGeometry(model);
  geometry.computeBoundingBox();
  const box = geometry.boundingBox ?? new THREE.Box3();
  const centre = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3()).length();
  const body = new THREE.Mesh(
    geometry,
    new THREE.MeshToonMaterial({
      color: colors.body,
      gradientMap: current.gradient,
      side: THREE.DoubleSide,
    }),
  );
  const hull = new THREE.Mesh(
    geometry.clone(),
    new THREE.MeshBasicMaterial({ color: colors.ink, side: THREE.BackSide }),
  );
  hull.scale.setScalar(1.035);
  hull.position.copy(centre).multiplyScalar(-0.035);
  const ink = new THREE.LineBasicMaterial({ color: colors.ink });
  const litMaterial = new THREE.MeshBasicMaterial({ color: colors.lit });
  const lines = model.lines.map(line =>
    highlight && line.keys.includes(highlight)
      ? tube(line, size * 0.009, litMaterial)
      : model.kind === 'solid'
        ? tube(
            line,
            size * 0.004,
            new THREE.MeshBasicMaterial({ color: colors.ink }),
          )
        : inkLine(line, ink),
  );
  current.content.add(hull, body, ...lines);
  current.content.position.copy(centre).multiplyScalar(-1);
  current.corners = outlinePoints(geometry, centre);
  fitCamera(current);
};

/** Backs the camera off until the model's box fills the view. */
export const fitCamera = (current: Scene) => {
  const { camera } = current;
  const tanHalfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  const distance = fitDistance(
    current.corners,
    current.rotation.pitch,
    tanHalfHeight * camera.aspect,
    tanHalfHeight,
  );
  camera.position.set(0, 0, distance);
  camera.near = distance / 50;
  camera.far = distance * 4;
  camera.updateProjectionMatrix();
};

export const renderScene = (current: Scene) => {
  current.pivot.rotation.set(current.rotation.pitch, current.rotation.yaw, 0);
  current.renderer.render(current.scene, current.camera);
};

/** Lights, camera and an empty pivot around the given renderer. */
export const createScene = (renderer: THREE.WebGLRenderer): Scene => {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(18, 1, 1, 1000);
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(-1.2, 1.6, 1.4);
  scene.add(new THREE.AmbientLight(0xffffff, 1.1), key);
  const pivot = new THREE.Group();
  const content = new THREE.Group();
  pivot.add(content);
  scene.add(pivot);
  return {
    renderer,
    scene,
    camera,
    pivot,
    content,
    gradient: celRamp(),
    rotation: INITIAL_ROTATION,
    corners: boxCorners(1, 1, 1),
  };
};

export const disposeScene = (current: Scene) => {
  disposeChildren(current.content);
  current.gradient.dispose();
  current.renderer.dispose();
};

/** A WebGL renderer, or undefined when the browser can't draw WebGL. */
export const createRenderer = () => {
  try {
    return new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return undefined;
  }
};

/**
 * One offscreen scene shared by every still, so a page of thumbnails holds a
 * single WebGL context instead of one per model.
 */
let stillScene: Scene | null | undefined;

const sharedStillScene = () => {
  if (stillScene === undefined) {
    const renderer = createRenderer();
    stillScene = renderer ? createScene(renderer) : null;
  }
  return stillScene;
};

/**
 * The model at its resting angle as a PNG data URL, `width` by `height` CSS
 * pixels at the given pixel ratio. Undefined when WebGL is unavailable.
 */
export const renderStill = (
  model: ModelSpec,
  colors: SceneColors,
  {
    width,
    height,
    pixelRatio,
  }: { width: number; height: number; pixelRatio: number },
) => {
  const current = sharedStillScene();
  if (!current) return undefined;
  current.renderer.setPixelRatio(pixelRatio);
  current.renderer.setSize(width, height, false);
  current.camera.aspect = width / height;
  current.rotation = INITIAL_ROTATION;
  fillContent(current, model, undefined, colors);
  renderScene(current);
  // Read back before anything else draws: the buffer isn't preserved.
  const url = current.renderer.domElement.toDataURL('image/png');
  disposeChildren(current.content);
  return url;
};
