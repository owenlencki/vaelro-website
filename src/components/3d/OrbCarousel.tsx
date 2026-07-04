import {
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Orb, { ORB_RADIUS } from "./Orb";
import ParticleField from "./ParticleField";
import PostProcessing from "./PostProcessing";
import { useMousePosition } from "./useMousePosition";
import { ORB_COUNT, SERVICES, type OverlayNodes } from "./services";

/**
 * Mutable per-frame state shared between orbs (writers), the particle field,
 * and the overlay projector (readers). Never touches React state.
 */
export interface FrameState {
  positions: Float32Array; // orb world positions, xyz per orb
  scales: Float32Array;
  open: Float32Array; // 0..1 split amount per orb
}

// Desktop slots: the active orb front and center (~110px diameter), three
// planets at generously spaced orbital distances (~40-60px each), placed
// high and right so none of them drift behind the headline.
const SLOTS: Array<{ position: [number, number, number]; scale: number }> = [
  { position: [0, 0, 0], scale: 0.8 },
  { position: [-0.6, 3.3, -1.5], scale: 0.34 },
  { position: [2.9, 1.6, -1.8], scale: 0.36 },
  { position: [2.3, -1.3, -0.7], scale: 0.44 },
];

/** How the hero lays out: full orbital arrangement or a single orb. */
export type LayoutMode = "desktop" | "portrait" | "mobile";

// Single-orb slots (mobile + portrait desktop): one centered orb; inactive
// orbs shrink away so cycling reads as one clean carousel.
const SINGLE_SLOTS: Array<{
  position: [number, number, number];
  scale: number;
}> = [
  { position: [0, 0, 0], scale: 0.8 },
  { position: [0, 0, -0.6], scale: 0.001 },
  { position: [0, 0, -0.6], scale: 0.001 },
  { position: [0, 0, -0.6], scale: 0.001 },
];

// Group-local anchor for the description text block, below the arrangement
const DESC_ANCHOR_Y = -0.85;

/**
 * Where the orb system sits: right 40-50% of the viewport on desktop
 * (aspect-aware so the active orb stays ~75% across at any window shape),
 * lower-center on mobile. Shared by the group and the overlay projector.
 */
export function getGroupLayout(
  width: number,
  height: number,
  mode: LayoutMode,
) {
  if (mode === "mobile") {
    return { position: [0, -2.0, -0.4] as const, scale: 0.75 };
  }
  const aspect = width / height;
  if (mode === "portrait") {
    // Narrow desktop windows: a single orb low on the right, clear of the
    // headline and subheadline
    return { position: [1.73 * aspect, -1.1, -0.2] as const, scale: 0.7 };
  }
  return {
    position: [1.73 * aspect, -0.4, 0] as const,
    scale: THREE.MathUtils.clamp(aspect / 1.5, 0.62, 1),
  };
}

function CarouselGroup({
  mode,
  children,
}: {
  mode: LayoutMode;
  children: ReactNode;
}) {
  const { size } = useThree();
  const layout = getGroupLayout(size.width, size.height, mode);
  return (
    <group position={layout.position} scale={layout.scale}>
      {children}
    </group>
  );
}

function CameraRig({ enabled }: { enabled: boolean }) {
  const mouse = useMousePosition(enabled);
  useFrame(({ camera }) => {
    if (!enabled || !mouse.current.active) return;
    camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.18 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Projects orb world positions to screen space each frame and positions the
 * HTML overlay nodes (labels, progress ring, description stack) directly on
 * the DOM, so the overlay tracks the 3D scene without React re-renders.
 */
function OverlayProjector({
  frameState,
  overlay,
  active,
  mode,
}: {
  frameState: FrameState;
  overlay: RefObject<OverlayNodes>;
  active: number;
  mode: LayoutMode;
}) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const nodes = overlay.current;
    if (!nodes) return;

    for (let i = 0; i < ORB_COUNT; i++) {
      const px = frameState.positions[i * 3];
      const py = frameState.positions[i * 3 + 1];
      const pz = frameState.positions[i * 3 + 2];
      const scale = frameState.scales[i] || 1;
      const worldR = ORB_RADIUS * scale;

      v.set(px, py, pz).project(camera);
      const cx = (v.x * 0.5 + 0.5) * size.width;
      const cy = (-v.y * 0.5 + 0.5) * size.height;

      v.set(px + worldR, py, pz).project(camera);
      const rPx = Math.abs((v.x * 0.5 + 0.5) * size.width - cx);

      const label = nodes.labels[i];
      if (label) {
        label.style.transform = `translate(-50%, 0) translate(${cx}px, ${
          cy + rPx + 8
        }px)`;
        label.style.visibility = "visible";
      }

      if (i === active) {
        const ring = nodes.ring;
        if (ring) {
          const d = rPx * 2 + 14;
          ring.style.width = `${d}px`;
          ring.style.height = `${d}px`;
          ring.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px)`;
          ring.style.visibility = "visible";
        }

        // Description: inside the split on desktop (centered on the orb);
        // below the orb in single-orb modes, where the gap is too small
        // for readable text.
        const desc = nodes.desc;
        if (desc) {
          desc.style.transform =
            mode === "desktop"
              ? `translate(-50%, -50%) translate(${cx}px, ${cy}px)`
              : `translate(-50%, 0) translate(${cx}px, ${cy + rPx + 28}px)`;
          desc.style.visibility = "visible";
        }

        // Portrait: the standalone dots follow below the description block
        if (mode === "portrait" && nodes.dots) {
          nodes.dots.style.transform = `translate(-50%, 0) translate(${cx}px, ${
            cy + rPx + 218
          }px)`;
          nodes.dots.style.visibility = "visible";
        }
      }
    }

    // Nav dots on desktop: anchored below the whole arrangement. On mobile
    // they live inside the description stack instead.
    const dots = nodes.dots;
    if (dots && mode === "desktop") {
      const layout = getGroupLayout(size.width, size.height, mode);
      v.set(
        layout.position[0],
        layout.position[1] + DESC_ANCHOR_Y * layout.scale,
        layout.position[2],
      ).project(camera);
      const ax = (v.x * 0.5 + 0.5) * size.width;
      const ay = (-v.y * 0.5 + 0.5) * size.height;
      dots.style.transform = `translate(-50%, 0) translate(${ax}px, ${ay}px)`;
      dots.style.visibility = "visible";
    }
  });

  return null;
}

export interface OrbCarouselProps {
  active: number;
  open: boolean;
  mode: LayoutMode;
  reducedMotion: boolean;
  /** Click on an orb (active orb toggles open, inactive becomes active). */
  onOrbClick: (index: number) => void;
  overlay: RefObject<OverlayNodes>;
}

/**
 * The hero's 3D scene: four glowing service orbs in a particle
 * constellation. Lazy-loaded so Three.js never blocks the hero text LCP.
 */
export default function OrbCarousel({
  active,
  open,
  mode,
  reducedMotion,
  onOrbClick,
  overlay,
}: OrbCarouselProps) {
  const isMobile = mode === "mobile";
  const singleOrb = mode !== "desktop";
  const particleCount = isMobile ? 60 : 150;
  const splitDistance = isMobile ? 0.32 : 0.38;
  const postprocessing = !isMobile;

  const frameState = useRef<FrameState>({
    positions: new Float32Array(ORB_COUNT * 3),
    scales: new Float32Array(ORB_COUNT),
    open: new Float32Array(ORB_COUNT),
  });

  const slots = singleOrb ? SINGLE_SLOTS : SLOTS;
  const slotTargets = useMemo(
    () => slots.map((slot) => new THREE.Vector3(...slot.position)),
    [slots],
  );

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 60, position: [0, 0, 6], near: 0.1, far: 60 }}
      aria-hidden="true"
    >
      <CarouselGroup mode={mode}>
        {SERVICES.map((service, i) => {
          const slot = (i - active + ORB_COUNT) % ORB_COUNT;
          return (
            <Orb
              key={service.id}
              index={i}
              color={service.color}
              target={slotTargets[slot]}
              targetScale={slots[slot].scale}
              isActive={slot === 0}
              isOpen={slot === 0 && open}
              splitDistance={splitDistance}
              hidden={singleOrb && slot !== 0}
              reducedMotion={reducedMotion}
              frameState={frameState.current}
              onSelect={() => onOrbClick(i)}
            />
          );
        })}
      </CarouselGroup>

      <ParticleField
        count={particleCount}
        animate={!reducedMotion}
        frameState={frameState.current}
      />

      <CameraRig enabled={!isMobile && !reducedMotion} />
      <OverlayProjector
        frameState={frameState.current}
        overlay={overlay}
        active={active}
        mode={mode}
      />

      {postprocessing && <PostProcessing />}
    </Canvas>
  );
}
