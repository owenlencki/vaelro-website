import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { FrameState } from "./OrbCarousel";

export const ORB_RADIUS = 0.55;

// Split spring (tension 120, friction 14): underdamped, slight overshoot
const SPLIT_TENSION = 120;
const SPLIT_FRICTION = 14;
// Orbit/scale spring for slot transitions (tension 100, friction 16):
// settles in ~500-600ms, smooth and weighty
const MOVE_TENSION = 100;
const MOVE_FRICTION = 16;

const SPLIT_TILT = 0.28; // rad: top tilts back, bottom tilts forward
const CRACK_S = 0.3; // crack grow/shrink duration
const FRAG_COUNT = 10;
const FRAG_LIFE = 0.4;

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------

// Shell: lit sphere with a visible specular highlight, fresnel rim, and a
// hot interior that bleeds light through the gap when split open.
const shellVertexShader = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vN = normalMatrix * normal;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vV = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const shellFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBrightness; // ~0.3 inactive -> 1.0 active
  uniform float uGlow;       // 0..1 open amount
  uniform float uAlpha;      // master opacity (mobile edge-peek orbs ~0.3)
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(vV);
    vec3 l = normalize(vec3(0.5, 0.7, 0.55));

    float diff = max(dot(n, l), 0.0);
    float spec = pow(clamp(dot(reflect(-l, n), v), 0.0, 1.0), 40.0);
    // Clamp before pow: dot() can exceed 1 by float error, and
    // pow(negative, fractional) is NaN, which poisons the bloom mip chain
    float fres = pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 2.3);

    vec3 col = uColor * (0.16 + 0.9 * diff) * (0.5 + 0.5 * uBrightness);
    col += uColor * fres * (0.3 + 1.1 * uBrightness);
    col += vec3(1.0, 0.97, 0.92) * spec * (0.45 + 0.85 * uBrightness);
    if (!gl_FrontFacing) col += uColor * (0.2 + 1.5 * uGlow);

    // Halves fade to ~40% opacity as the orb opens, so the dark background
    // shows through and the description text reads clearly in the gap
    gl_FragColor = vec4(col, (1.0 - 0.6 * uGlow) * uAlpha);
  }
`;

// Halo: fresnel-weighted additive glow on an enlarged sphere
const haloVertexShader = shellVertexShader;

const haloFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(
      clamp(1.0 - abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0),
      2.6
    );
    gl_FragColor = vec4(uColor * f * uIntensity, f * uIntensity);
  }
`;

// Cracks: emissive fracture lines that grow outward from a seed point.
// aProg is each vertex's normalized distance along its crack; uCrack sweeps
// 0->1 to grow the fractures, with a hot flash at the advancing tip.
const crackVertexShader = /* glsl */ `
  attribute float aProg;
  varying float vProg;
  void main() {
    vProg = aProg;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const crackFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uCrack;
  varying float vProg;
  void main() {
    float a = 1.0 - smoothstep(uCrack - 0.1, uCrack, vProg);
    if (a <= 0.001) discard;
    float tip = 1.0 - smoothstep(0.0, 0.18, abs(vProg - uCrack));
    vec3 col = uColor * (1.5 + tip * 2.0);
    gl_FragColor = vec4(col, a * 0.9);
  }
`;

// Fragments: tiny glowing shards that fly out when the split begins
const fragVertexShader = /* glsl */ `
  uniform float uPixelRatio;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 4.5 * uPixelRatio * (6.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float strength = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(uColor * 1.6, uOpacity * strength);
  }
`;

// ---------------------------------------------------------------------------
// Crack geometry: jagged polylines walked across the sphere surface from a
// frontal seed point, split into top/bottom halves so the fracture lines
// ride along with the separating hemispheres.
// ---------------------------------------------------------------------------

function buildCrackGeometries(radius: number) {
  const top: { pos: number[]; prog: number[] } = { pos: [], prog: [] };
  const bottom: { pos: number[]; prog: number[] } = { pos: [], prog: [] };

  const seed = new THREE.Vector3(0.2, 0.1, 1).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const surface = radius * 1.012;
  const CRACKS = 7;

  const axis = new THREE.Vector3();
  for (let c = 0; c < CRACKS; c++) {
    const angle = (c / CRACKS) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    // Initial tangent direction at the seed
    let dir = new THREE.Vector3()
      .crossVectors(seed, up)
      .normalize()
      .applyAxisAngle(seed, angle);

    let p = seed.clone();
    const steps = 7 + Math.floor(Math.random() * 4);
    for (let s = 0; s < steps; s++) {
      const stepLen = 0.15 + Math.random() * 0.11; // radians of arc
      axis.crossVectors(p, dir).normalize();
      const q = p.clone().applyAxisAngle(axis, stepLen);

      const p0 = s / steps;
      const p1 = (s + 1) / steps;
      const a = p.clone().multiplyScalar(surface);
      const b = q.clone().multiplyScalar(surface);
      // Assign the segment to the hemisphere its midpoint lives in
      const bucket = (a.y + b.y) / 2 >= 0 ? top : bottom;
      bucket.pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
      bucket.prog.push(p0, p1);

      // Continue roughly onward with a jagged turn
      dir = q
        .clone()
        .sub(p)
        .normalize()
        .applyAxisAngle(q.clone().normalize(), (Math.random() - 0.5) * 0.9);
      p = q;
    }
  }

  const make = (data: { pos: number[]; prog: number[] }) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(data.pos, 3),
    );
    geo.setAttribute("aProg", new THREE.Float32BufferAttribute(data.prog, 1));
    return geo;
  };
  return { topGeo: make(top), bottomGeo: make(bottom) };
}

// ---------------------------------------------------------------------------

interface OrbProps {
  index: number;
  color: string;
  /** Group-local target position for the orb's current carousel slot. */
  target: THREE.Vector3;
  targetScale: number;
  isActive: boolean;
  isOpen: boolean;
  /** Half-separation of the hemispheres when fully open. */
  splitDistance: number;
  /** Single-orb layouts: inactive orbs are fully hidden and non-interactive. */
  hidden: boolean;
  /** Mobile carousel cue: orb peeks in from a screen edge at ~30% opacity. */
  peek: boolean;
  reducedMotion: boolean;
  frameState: FrameState;
  onSelect: () => void;
}

/**
 * A glowing 3D service orb. Opening runs in two phases: fracture lines
 * crack across the surface for 300ms, then the hemispheres spring apart
 * (top tilting back, bottom forward) while glowing shards burst out.
 * Closing reverses it: halves rejoin, then the cracks seal shut.
 * Slot transitions ride a softer spring so orbits shift smoothly.
 */
export default function Orb({
  index,
  color,
  target,
  targetScale,
  isActive,
  isOpen,
  splitDistance,
  hidden,
  peek,
  reducedMotion,
  frameState,
  onSelect,
}: OrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const bottomRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const split = useRef({ x: 0, v: 0 });
  const scaleSpring = useRef({ x: targetScale, v: 0 });
  const initialized = useRef(false);
  const posVel = useMemo(() => new THREE.Vector3(), []);
  const accel = useMemo(() => new THREE.Vector3(), []);
  const crack = useRef(0);
  const wasSplitting = useRef(false);
  const brightness = useRef(isActive ? 1 : 0.3);
  const masterAlpha = useRef(peek ? 0.3 : 1);
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  // Fragment burst state
  const fragLife = useRef(FRAG_LIFE * 2);
  const fragVel = useMemo(() => new Float32Array(FRAG_COUNT * 3), []);
  const fragPositions = useMemo(() => new Float32Array(FRAG_COUNT * 3), []);

  const threeColor = useMemo(() => new THREE.Color(color), [color]);
  const { topGeo, bottomGeo } = useMemo(
    () => buildCrackGeometries(ORB_RADIUS),
    [],
  );

  const shellMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: shellVertexShader,
        fragmentShader: shellFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uBrightness: { value: 0.3 },
          uGlow: { value: 0 },
          uAlpha: { value: 1 },
        },
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [color],
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: haloVertexShader,
        fragmentShader: haloFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: 0.35 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color],
  );

  const crackMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: crackVertexShader,
        fragmentShader: crackFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uCrack: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color],
  );

  const fragGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(fragPositions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    return geo;
  }, [fragPositions]);

  const fragMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fragVertexShader,
        fragmentShader: fragFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0 },
          uPixelRatio: {
            value: Math.min(window.devicePixelRatio, 1.5),
          },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color],
  );

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: threeColor,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [threeColor],
  );

  useEffect(() => {
    return () => {
      shellMaterial.dispose();
      haloMaterial.dispose();
      crackMaterial.dispose();
      fragMaterial.dispose();
      coreMaterial.dispose();
      topGeo.dispose();
      bottomGeo.dispose();
      fragGeometry.dispose();
    };
  }, [
    shellMaterial,
    haloMaterial,
    crackMaterial,
    fragMaterial,
    coreMaterial,
    topGeo,
    bottomGeo,
    fragGeometry,
  ]);

  function spawnFragments() {
    for (let i = 0; i < FRAG_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = ORB_RADIUS * (0.9 + Math.random() * 0.2);
      fragPositions[i * 3] = Math.cos(theta) * r;
      fragPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      fragPositions[i * 3 + 2] = Math.sin(theta) * r;
      const speed = 1.4 + Math.random() * 1.2;
      fragVel[i * 3] = Math.cos(theta) * speed;
      fragVel[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      fragVel[i * 3 + 2] = Math.sin(theta) * speed;
    }
    fragLife.current = 0;
  }

  useFrame((_, delta) => {
    const group = groupRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const core = coreRef.current;
    if (!group || !top || !bottom || !core) return;

    const dt = Math.min(delta, 1 / 30);
    const s = split.current;

    // The group transform is owned by the springs, never by JSX props:
    // prop-driven position/scale would snap orbs to their new slots the
    // moment `active` changes, killing the transition animation.
    if (!initialized.current) {
      group.position.copy(target);
      group.scale.setScalar(targetScale);
      scaleSpring.current.x = targetScale;
      initialized.current = true;
    }

    // ---- Phase logic: crack first, then split; rejoin, then seal ------
    if (isOpen) {
      crack.current = Math.min(1, crack.current + dt / CRACK_S);
    } else if (s.x < 0.04 && Math.abs(s.v) < 0.25) {
      crack.current = Math.max(0, crack.current - dt / CRACK_S);
    }
    const splitTarget = isOpen && crack.current >= 0.999 ? 1 : 0;

    // Fragment burst on the rising edge of the split
    if (splitTarget === 1 && !wasSplitting.current && !reducedMotion) {
      spawnFragments();
    }
    wasSplitting.current = splitTarget === 1;

    if (reducedMotion) {
      group.position.copy(target);
      scaleSpring.current.x = targetScale;
      scaleSpring.current.v = 0;
      crack.current = isOpen ? 1 : 0;
      s.x = isOpen ? 1 : 0;
      s.v = 0;
      brightness.current = isActive ? 1 : 0.3;
      masterAlpha.current = peek ? 0.3 : 1;
    } else {
      // Orbit transition spring (tension 100, friction 16)
      accel
        .copy(group.position)
        .sub(target)
        .multiplyScalar(-MOVE_TENSION)
        .addScaledVector(posVel, -MOVE_FRICTION);
      posVel.addScaledVector(accel, dt);
      group.position.addScaledVector(posVel, dt);

      const sc = scaleSpring.current;
      sc.v +=
        (-MOVE_TENSION * (sc.x - targetScale) - MOVE_FRICTION * sc.v) * dt;
      sc.x += sc.v * dt;

      group.rotation.y += dt * 0.18;
      brightness.current +=
        ((isActive ? 1 : 0.3) - brightness.current) * (1 - Math.exp(-3.5 * dt));
      masterAlpha.current +=
        ((peek ? 0.3 : 1) - masterAlpha.current) * (1 - Math.exp(-3.5 * dt));

      // Split spring (tension 120, friction 14: slight overshoot)
      s.v += (-SPLIT_TENSION * (s.x - splitTarget) - SPLIT_FRICTION * s.v) * dt;
      s.x += s.v * dt;
    }

    const open = THREE.MathUtils.clamp(s.x, 0, 1);
    group.scale.setScalar(
      Math.max(0.001, scaleSpring.current.x) * (1 + open * 0.08),
    );
    // Orbs shrunk away by the single-orb layout are fully hidden once the
    // shrink-out settles (the brief shrink itself stays visible so
    // transitions read as one orb leaving while the next arrives)
    group.visible = group.scale.x > 0.015 && (!hidden || group.scale.x > 0.02);

    // Hemispheres separate and tilt: top back, bottom forward
    top.position.y = splitDistance * s.x;
    top.rotation.x = -SPLIT_TILT * s.x;
    bottom.position.y = -splitDistance * s.x;
    bottom.rotation.x = SPLIT_TILT * s.x;

    shellMaterial.uniforms.uBrightness.value = brightness.current;
    shellMaterial.uniforms.uGlow.value = open;
    shellMaterial.uniforms.uAlpha.value = masterAlpha.current;
    haloMaterial.uniforms.uIntensity.value =
      (0.3 + brightness.current * 0.55 + open * 0.5) * masterAlpha.current;
    crackMaterial.uniforms.uCrack.value = crack.current;

    // Fragment shards: fly out, decelerate, fade over 400ms
    if (fragLife.current < FRAG_LIFE) {
      fragLife.current += dt;
      const damp = 1 - 1.6 * dt;
      for (let i = 0; i < FRAG_COUNT * 3; i++) {
        fragVel[i] *= damp;
        fragPositions[i] += fragVel[i] * dt;
      }
      fragGeometry.attributes.position.needsUpdate = true;
      fragMaterial.uniforms.uOpacity.value = Math.max(
        0,
        (1 - fragLife.current / FRAG_LIFE) * 0.95,
      );
    } else if (fragMaterial.uniforms.uOpacity.value > 0) {
      fragMaterial.uniforms.uOpacity.value = 0;
    }

    // The warm glow bleeding from the gap
    coreMaterial.opacity = open * 0.95;
    core.scale.setScalar(1 + open * 0.3);

    // Publish world position + state for the particle field and projector
    group.getWorldPosition(worldPos);
    frameState.positions[index * 3] = worldPos.x;
    frameState.positions[index * 3 + 1] = worldPos.y;
    frameState.positions[index * 3 + 2] = worldPos.z;
    frameState.scales[index] = group.scale.x;
    frameState.open[index] = open;
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        if (hidden) return;
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        if (hidden) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Top hemisphere, with its share of the fracture lines */}
      <mesh ref={topRef} material={shellMaterial}>
        <sphereGeometry
          args={[ORB_RADIUS, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <lineSegments geometry={topGeo} material={crackMaterial} />
      </mesh>
      {/* Bottom hemisphere */}
      <mesh ref={bottomRef} material={shellMaterial}>
        <sphereGeometry
          args={[
            ORB_RADIUS,
            48,
            24,
            0,
            Math.PI * 2,
            Math.PI / 2,
            Math.PI / 2,
          ]}
        />
        <lineSegments geometry={bottomGeo} material={crackMaterial} />
      </mesh>
      {/* Emissive core: the light source inside the split. Rendered after
          the now-transparent shells so it stays bright in the gap. */}
      <mesh ref={coreRef} material={coreMaterial} renderOrder={1}>
        <sphereGeometry args={[ORB_RADIUS * 0.5, 24, 16]} />
      </mesh>
      {/* Fragment shards that burst out as the split begins */}
      <points geometry={fragGeometry} material={fragMaterial} />
      {/* Soft warm halo */}
      <mesh material={haloMaterial} scale={1.45}>
        <sphereGeometry args={[ORB_RADIUS, 32, 24]} />
      </mesh>
      {/* Invisible hit target a bit larger than the orb for easier taps */}
      <mesh visible={false}>
        <sphereGeometry args={[ORB_RADIUS * 1.4, 12, 8]} />
      </mesh>
    </group>
  );
}
