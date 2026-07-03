import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PostProcessing from "./PostProcessing";
import { useMousePosition } from "./useMousePosition";

// Scene volume (world units)
const BOUNDS = { x: 8, y: 5, zMin: -6, zMax: 2 };
const CONNECT_DIST = 1.7;
const REPULSE_RADIUS = 2;
const REPULSE_STRENGTH = 0.045;

// Warm palette: cream, soft orange, white
const PALETTE: Array<{ color: THREE.Color; alpha: number; weight: number }> = [
  { color: new THREE.Color("#F5F0E8"), alpha: 0.32, weight: 0.45 },
  { color: new THREE.Color("#D4743B"), alpha: 0.38, weight: 0.35 },
  { color: new THREE.Color("#FFFFFF"), alpha: 0.85, weight: 0.2 },
];

const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (5.5 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float strength = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, vAlpha * strength);
  }
`;

interface SceneProps {
  count: number;
  interactive: boolean;
  animate: boolean;
}

function pickPaletteIndex(r: number) {
  let acc = 0;
  for (let i = 0; i < PALETTE.length; i++) {
    acc += PALETTE[i].weight;
    if (r < acc) return i;
  }
  return PALETTE.length - 1;
}

function ConstellationScene({ count, interactive, animate }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMousePosition(interactive);
  const { viewport, camera, gl } = useThree();
  const frame = useRef(0);
  const linesInitialized = useRef(false);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);

  // ---- Particle buffers -----------------------------------------------
  const data = useMemo(() => {
    const base = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const repulse = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    // Per-particle drift: amplitude, angular speed, phase (x/y/z each)
    const driftAmp = new Float32Array(count * 3);
    const driftSpeed = new Float32Array(count * 3);
    const driftPhase = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x;
      base[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
      base[i * 3 + 2] =
        BOUNDS.zMin + Math.random() * (BOUNDS.zMax - BOUNDS.zMin);

      const isAnchor = i % 24 === 0; // a few larger "anchor" nodes
      const p = PALETTE[isAnchor ? 2 : pickPaletteIndex(Math.random())];
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;
      alphas[i] = isAnchor ? 0.9 : p.alpha;
      sizes[i] = isAnchor ? 6.5 + Math.random() * 1.5 : 2 + Math.random() * 2.5;

      for (let a = 0; a < 3; a++) {
        driftAmp[i * 3 + a] = 0.25 + Math.random() * 0.4;
        driftSpeed[i * 3 + a] = 0.06 + Math.random() * 0.12;
        driftPhase[i * 3 + a] = Math.random() * Math.PI * 2;
      }
    }
    positions.set(base);
    return {
      base,
      positions,
      repulse,
      colors,
      alphas,
      sizes,
      driftAmp,
      driftSpeed,
      driftPhase,
    };
  }, [count]);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(data.positions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    geo.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(data.alphas, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(data.sizes, 1));
    return geo;
  }, [data]);

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms: {
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [gl],
  );

  // ---- Connection line buffers ----------------------------------------
  const maxSegments = count * 5;
  const lineBuffers = useMemo(
    () => ({
      positions: new Float32Array(maxSegments * 6),
      colors: new Float32Array(maxSegments * 6),
    }),
    [maxSegments],
  );

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(lineBuffers.positions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    geo.setAttribute(
      "color",
      new THREE.BufferAttribute(lineBuffers.colors, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    geo.setDrawRange(0, 0);
    return geo;
  }, [lineBuffers]);

  const linesMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  // Cream line color, brightness encodes proximity (additive blending)
  const LINE_R = 0.96;
  const LINE_G = 0.93;
  const LINE_B = 0.89;

  function recomputeLines() {
    const pos = data.positions;
    const lp = lineBuffers.positions;
    const lc = lineBuffers.colors;
    const threshSq = CONNECT_DIST * CONNECT_DIST;
    let seg = 0;

    outer: for (let i = 0; i < count; i++) {
      const ix = pos[i * 3];
      const iy = pos[i * 3 + 1];
      const iz = pos[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const dx = ix - pos[j * 3];
        const dy = iy - pos[j * 3 + 1];
        const dz = iz - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq > threshSq) continue;
        const fade = (1 - Math.sqrt(distSq) / CONNECT_DIST) * 0.2;
        const o = seg * 6;
        lp[o] = ix;
        lp[o + 1] = iy;
        lp[o + 2] = iz;
        lp[o + 3] = pos[j * 3];
        lp[o + 4] = pos[j * 3 + 1];
        lp[o + 5] = pos[j * 3 + 2];
        lc[o] = LINE_R * fade;
        lc[o + 1] = LINE_G * fade;
        lc[o + 2] = LINE_B * fade;
        lc[o + 3] = LINE_R * fade;
        lc[o + 4] = LINE_G * fade;
        lc[o + 5] = LINE_B * fade;
        seg++;
        if (seg >= maxSegments) break outer;
      }
    }

    linesGeometry.setDrawRange(0, seg * 2);
    linesGeometry.attributes.position.needsUpdate = true;
    linesGeometry.attributes.color.needsUpdate = true;
  }

  useFrame((state, delta) => {
    // Static render for reduced motion: draw connections once, then hold.
    if (!animate) {
      if (!linesInitialized.current) {
        recomputeLines();
        linesInitialized.current = true;
      }
      return;
    }

    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;

    // Gentle auto-rotation (~0.001 rad/frame at 60fps)
    group.rotation.y += delta * 0.055;

    // Mouse → world point on the z=0 plane, then into the rotating group's
    // local space so repulsion matches what the viewer sees.
    let hasMouse = false;
    if (interactive && mouse.current.active) {
      mouseWorld.set(
        (mouse.current.x * viewport.width) / 2,
        (mouse.current.y * viewport.height) / 2,
        0,
      );
      group.worldToLocal(mouseWorld);
      hasMouse = true;

      // Subtle camera drift toward the pointer (parallax depth)
      camera.position.x +=
        (mouse.current.x * 0.35 - camera.position.x) * 0.04;
      camera.position.y +=
        (mouse.current.y * 0.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
    }

    const {
      base,
      positions,
      repulse,
      driftAmp,
      driftSpeed,
      driftPhase,
    } = data;

    for (let i = 0; i < count; i++) {
      const o = i * 3;
      // Slow continuous drift, unique per particle
      const dxDrift = Math.sin(t * driftSpeed[o] + driftPhase[o]) * driftAmp[o];
      const dyDrift =
        Math.sin(t * driftSpeed[o + 1] + driftPhase[o + 1]) * driftAmp[o + 1];
      const dzDrift =
        Math.sin(t * driftSpeed[o + 2] + driftPhase[o + 2]) * driftAmp[o + 2];

      // Spring-like decay pulls displaced particles back
      repulse[o] *= 0.94;
      repulse[o + 1] *= 0.94;
      repulse[o + 2] *= 0.94;

      if (hasMouse) {
        const px = base[o] + dxDrift + repulse[o];
        const py = base[o + 1] + dyDrift + repulse[o + 1];
        const pz = base[o + 2] + dzDrift + repulse[o + 2];
        const dx = px - mouseWorld.x;
        const dy = py - mouseWorld.y;
        const dz = pz - mouseWorld.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < REPULSE_RADIUS * REPULSE_RADIUS && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const force =
            ((REPULSE_RADIUS - dist) / REPULSE_RADIUS) * REPULSE_STRENGTH;
          repulse[o] += (dx / dist) * force;
          repulse[o + 1] += (dy / dist) * force;
          repulse[o + 2] += (dz / dist) * force;
        }
      }

      positions[o] = base[o] + dxDrift + repulse[o];
      positions[o + 1] = base[o + 1] + dyDrift + repulse[o + 1];
      positions[o + 2] = base[o + 2] + dzDrift + repulse[o + 2];
    }

    pointsGeometry.attributes.position.needsUpdate = true;

    // Recalculate connections every other frame
    frame.current++;
    if (frame.current % 2 === 0) recomputeLines();
  });

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeometry} material={pointsMaterial} />
      <lineSegments geometry={linesGeometry} material={linesMaterial} />
    </group>
  );
}

interface ParticleNetworkProps {
  /** Mobile: fewer particles, no postprocessing, no mouse interaction. */
  isMobile: boolean;
  /** prefers-reduced-motion: static constellation, no drift. */
  reducedMotion: boolean;
}

/**
 * The hero's full-viewport 3D canvas. Lazy-loaded so Three.js never blocks
 * the hero text LCP.
 */
export default function ParticleNetwork({
  isMobile,
  reducedMotion,
}: ParticleNetworkProps) {
  const count = isMobile ? 120 : 300;
  const animate = !reducedMotion;
  const interactive = !isMobile && !reducedMotion;
  const postprocessing = !isMobile;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 60, position: [0, 0, 5.5], near: 0.1, far: 60 }}
      frameloop={animate ? "always" : "demand"}
      aria-hidden="true"
    >
      <ConstellationScene
        count={count}
        interactive={interactive}
        animate={animate}
      />
      {postprocessing && <PostProcessing />}
    </Canvas>
  );
}
