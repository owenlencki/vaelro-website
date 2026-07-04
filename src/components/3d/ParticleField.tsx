import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ORB_COUNT, SERVICES } from "./services";
import type { FrameState } from "./OrbCarousel";

const BOUNDS = { x: 7.5, y: 4.5, zMin: -5, zMax: 1.5 };
const PP_CONNECT = 1.6; // particle-to-particle link distance
const PO_CONNECT = 2.3; // particle-to-orb link distance
const ATTRACT_MIN = 1.1; // no pull inside this radius (don't collapse into orbs)
const ATTRACT_MAX = 4.0;

const PALETTE: Array<{ color: THREE.Color; alpha: number; weight: number }> = [
  { color: new THREE.Color("#F5F0E8"), alpha: 0.3, weight: 0.5 },
  { color: new THREE.Color("#D4743B"), alpha: 0.35, weight: 0.3 },
  { color: new THREE.Color("#FFFFFF"), alpha: 0.8, weight: 0.2 },
];

const vertexShader = /* glsl */ `
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
    gl_PointSize = aSize * uPixelRatio * (6.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float strength = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, vAlpha * strength);
  }
`;

function pickPalette(r: number) {
  let acc = 0;
  for (const entry of PALETTE) {
    acc += entry.weight;
    if (r < acc) return entry;
  }
  return PALETTE[PALETTE.length - 1];
}

interface ParticleFieldProps {
  count: number;
  animate: boolean;
  frameState: FrameState;
}

/**
 * The ambient constellation. Particles drift, get gently pulled toward the
 * orbs, scatter when an orb splits open, and connect with faint lines to
 * each other and to the nearest orb.
 */
export default function ParticleField({
  count,
  animate,
  frameState,
}: ParticleFieldProps) {
  const frame = useRef(0);
  const initialized = useRef(false);
  const prevOpen = useRef(new Float32Array(ORB_COUNT));

  const orbColors = useMemo(
    () => SERVICES.map((s) => new THREE.Color(s.color)),
    [],
  );

  const data = useMemo(() => {
    const base = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const attract = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);
    const driftAmp = new Float32Array(count * 3);
    const driftSpeed = new Float32Array(count * 3);
    const driftPhase = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x;
      base[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
      base[i * 3 + 2] =
        BOUNDS.zMin + Math.random() * (BOUNDS.zMax - BOUNDS.zMin);

      const p = pickPalette(Math.random());
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;
      alphas[i] = p.alpha;
      sizes[i] = 1.5 + Math.random() * 2.5;

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
      attract,
      scatter,
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
        vertexShader,
        fragmentShader,
        uniforms: {
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const maxSegments = count * 4 + count; // particle pairs + orb links
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

  useEffect(() => {
    return () => {
      pointsGeometry.dispose();
      linesGeometry.dispose();
      pointsMaterial.dispose();
      linesMaterial.dispose();
    };
  }, [pointsGeometry, linesGeometry, pointsMaterial, linesMaterial]);

  function recomputeLines() {
    const pos = data.positions;
    const orbs = frameState.positions;
    const lp = lineBuffers.positions;
    const lc = lineBuffers.colors;
    let seg = 0;

    // Particle-to-particle links (cream, very subtle: ~0.06)
    const ppSq = PP_CONNECT * PP_CONNECT;
    outer: for (let i = 0; i < count; i++) {
      const ix = pos[i * 3];
      const iy = pos[i * 3 + 1];
      const iz = pos[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const dx = ix - pos[j * 3];
        const dy = iy - pos[j * 3 + 1];
        const dz = iz - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq > ppSq) continue;
        const fade = (1 - Math.sqrt(distSq) / PP_CONNECT) * 0.06;
        const o = seg * 6;
        lp[o] = ix;
        lp[o + 1] = iy;
        lp[o + 2] = iz;
        lp[o + 3] = pos[j * 3];
        lp[o + 4] = pos[j * 3 + 1];
        lp[o + 5] = pos[j * 3 + 2];
        for (let c = 0; c < 2; c++) {
          lc[o + c * 3] = 0.96 * fade;
          lc[o + c * 3 + 1] = 0.93 * fade;
          lc[o + c * 3 + 2] = 0.89 * fade;
        }
        seg++;
        if (seg >= maxSegments - count) break outer;
      }
    }

    // Particle-to-nearest-orb links (tinted with the orb's service color)
    const poSq = PO_CONNECT * PO_CONNECT;
    for (let i = 0; i < count && seg < maxSegments; i++) {
      const ix = pos[i * 3];
      const iy = pos[i * 3 + 1];
      const iz = pos[i * 3 + 2];
      let best = -1;
      let bestSq = poSq;
      for (let k = 0; k < ORB_COUNT; k++) {
        const dx = ix - orbs[k * 3];
        const dy = iy - orbs[k * 3 + 1];
        const dz = iz - orbs[k * 3 + 2];
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < bestSq) {
          bestSq = dSq;
          best = k;
        }
      }
      if (best === -1) continue;
      const fade = (1 - Math.sqrt(bestSq) / PO_CONNECT) * 0.06;
      const color = orbColors[best];
      const o = seg * 6;
      lp[o] = ix;
      lp[o + 1] = iy;
      lp[o + 2] = iz;
      lp[o + 3] = orbs[best * 3];
      lp[o + 4] = orbs[best * 3 + 1];
      lp[o + 5] = orbs[best * 3 + 2];
      for (let c = 0; c < 2; c++) {
        lc[o + c * 3] = color.r * fade;
        lc[o + c * 3 + 1] = color.g * fade;
        lc[o + c * 3 + 2] = color.b * fade;
      }
      seg++;
    }

    linesGeometry.setDrawRange(0, seg * 2);
    linesGeometry.attributes.position.needsUpdate = true;
    linesGeometry.attributes.color.needsUpdate = true;
  }

  useFrame((state, delta) => {
    if (!animate) {
      // Reduced motion: a single static layout with connection lines
      if (!initialized.current) {
        recomputeLines();
        initialized.current = true;
      }
      return;
    }

    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const { base, positions, attract, scatter, driftAmp, driftSpeed, driftPhase } =
      data;
    const orbs = frameState.positions;

    // Scatter impulse on the rising edge of an orb split
    for (let k = 0; k < ORB_COUNT; k++) {
      const rising = frameState.open[k] > 0.5 && prevOpen.current[k] <= 0.5;
      prevOpen.current[k] = frameState.open[k];
      if (!rising) continue;
      for (let i = 0; i < count; i++) {
        const dx = positions[i * 3] - orbs[k * 3];
        const dy = positions[i * 3 + 1] - orbs[k * 3 + 1];
        const dz = positions[i * 3 + 2] - orbs[k * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 2.4 || dist < 0.001) continue;
        const push = (1 - dist / 2.4) * (1.6 + Math.random() * 0.8);
        scatter[i * 3] += (dx / dist) * push;
        scatter[i * 3 + 1] += (dy / dist) * push;
        scatter[i * 3 + 2] += (dz / dist) * push;
      }
    }

    for (let i = 0; i < count; i++) {
      const o = i * 3;
      const bx = base[o] + Math.sin(t * driftSpeed[o] + driftPhase[o]) * driftAmp[o];
      const by =
        base[o + 1] +
        Math.sin(t * driftSpeed[o + 1] + driftPhase[o + 1]) * driftAmp[o + 1];
      const bz =
        base[o + 2] +
        Math.sin(t * driftSpeed[o + 2] + driftPhase[o + 2]) * driftAmp[o + 2];

      // Gravitational pull toward the nearest orb
      let best = -1;
      let bestDist = ATTRACT_MAX;
      for (let k = 0; k < ORB_COUNT; k++) {
        const dx = orbs[k * 3] - (bx + attract[o]);
        const dy = orbs[k * 3 + 1] - (by + attract[o + 1]);
        const dz = orbs[k * 3 + 2] - (bz + attract[o + 2]);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < bestDist) {
          bestDist = dist;
          best = k;
        }
      }
      if (best !== -1 && bestDist > ATTRACT_MIN) {
        const strength = (1 - bestDist / ATTRACT_MAX) * 0.55 * dt;
        attract[o] += ((orbs[best * 3] - (bx + attract[o])) / bestDist) * strength;
        attract[o + 1] +=
          ((orbs[best * 3 + 1] - (by + attract[o + 1])) / bestDist) * strength;
        attract[o + 2] +=
          ((orbs[best * 3 + 2] - (bz + attract[o + 2])) / bestDist) * strength;
      }
      // Slow decay keeps the field from permanently collapsing onto orbs
      const decay = 1 - 0.12 * dt;
      attract[o] *= decay;
      attract[o + 1] *= decay;
      attract[o + 2] *= decay;

      // Scatter velocity integration with damping
      scatter[o] *= 1 - 2.4 * dt;
      scatter[o + 1] *= 1 - 2.4 * dt;
      scatter[o + 2] *= 1 - 2.4 * dt;

      positions[o] = bx + attract[o] + scatter[o] * 0.4;
      positions[o + 1] = by + attract[o + 1] + scatter[o + 1] * 0.4;
      positions[o + 2] = bz + attract[o + 2] + scatter[o + 2] * 0.4;
    }

    pointsGeometry.attributes.position.needsUpdate = true;

    frame.current++;
    if (frame.current % 2 === 0) recomputeLines();
  });

  return (
    <group>
      <points geometry={pointsGeometry} material={pointsMaterial} />
      <lineSegments geometry={linesGeometry} material={linesMaterial} />
    </group>
  );
}
