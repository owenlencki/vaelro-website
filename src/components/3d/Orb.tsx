import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { FrameState } from "./OrbCarousel";

export const ORB_RADIUS = 0.55;

// Spring config from the spec: { tension: 120, friction: 14 }: underdamped,
// so the split lands with a slight overshoot.
const TENSION = 120;
const FRICTION = 14;
const SPLIT_TILT = 0.28; // rad: top tilts back, bottom tilts forward

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
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(vV);
    vec3 l = normalize(vec3(0.5, 0.7, 0.55));

    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(reflect(-l, n), v), 0.0), 40.0);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 2.3);

    // Strong radial falloff from the lit highlight into shadow
    vec3 col = uColor * (0.16 + 0.9 * diff) * (0.5 + 0.5 * uBrightness);
    // Rim light keeps the silhouette reading as a glowing sphere
    col += uColor * fres * (0.3 + 1.1 * uBrightness);
    // Warm-white specular highlight, bright enough to bloom on the active orb
    col += vec3(1.0, 0.97, 0.92) * spec * (0.45 + 0.85 * uBrightness);
    // Interior faces glow hot while the orb is open
    if (!gl_FrontFacing) col += uColor * (0.2 + 1.5 * uGlow);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Halo: fresnel-weighted additive glow on an enlarged sphere: the soft warm
// aura around each orb (amplified by bloom on desktop).
const haloVertexShader = shellVertexShader;

const haloFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.6);
    gl_FragColor = vec4(uColor * f * uIntensity, f * uIntensity);
  }
`;

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
  reducedMotion: boolean;
  frameState: FrameState;
  onSelect: () => void;
}

/**
 * A glowing 3D service orb. The active orb burns brighter; clicking it
 * splits the hemispheres apart on a spring: top tilting back, bottom
 * tilting forward: with warm light bleeding from the gap.
 */
export default function Orb({
  index,
  color,
  target,
  targetScale,
  isActive,
  isOpen,
  splitDistance,
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

  const spring = useRef({ x: 0, v: 0 });
  const baseScale = useRef(targetScale);
  const brightness = useRef(isActive ? 1 : 0.3);
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  const shellMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: shellVertexShader,
        fragmentShader: shellFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uBrightness: { value: 0.3 },
          uGlow: { value: 0 },
        },
        side: THREE.DoubleSide,
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
      coreMaterial.dispose();
    };
  }, [shellMaterial, haloMaterial, coreMaterial]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const core = coreRef.current;
    if (!group || !top || !bottom || !core) return;

    const dt = Math.min(delta, 1 / 30);
    const openTarget = isOpen ? 1 : 0;
    const s = spring.current;

    if (reducedMotion) {
      group.position.copy(target);
      baseScale.current = targetScale;
      s.x = openTarget;
      s.v = 0;
      brightness.current = isActive ? 1 : 0.3;
    } else {
      const ease = 1 - Math.exp(-3.5 * dt);
      group.position.lerp(target, ease);
      baseScale.current += (targetScale - baseScale.current) * ease;
      group.rotation.y += dt * 0.18;
      brightness.current +=
        ((isActive ? 1 : 0.3) - brightness.current) * ease;

      // The split spring (underdamped: lands with a slight overshoot)
      s.v += (-TENSION * (s.x - openTarget) - FRICTION * s.v) * dt;
      s.x += s.v * dt;
    }

    const open = THREE.MathUtils.clamp(s.x, 0, 1);
    group.scale.setScalar(baseScale.current * (1 + open * 0.08));

    // Hemispheres separate and tilt: top back, bottom forward
    top.position.y = splitDistance * s.x;
    top.rotation.x = -SPLIT_TILT * s.x;
    bottom.position.y = -splitDistance * s.x;
    bottom.rotation.x = SPLIT_TILT * s.x;

    shellMaterial.uniforms.uBrightness.value = brightness.current;
    shellMaterial.uniforms.uGlow.value = open;
    haloMaterial.uniforms.uIntensity.value =
      0.3 + brightness.current * 0.55 + open * 0.5;

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
      position={target}
      scale={targetScale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Top hemisphere */}
      <mesh ref={topRef} material={shellMaterial}>
        <sphereGeometry
          args={[ORB_RADIUS, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
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
      </mesh>
      {/* Emissive core: the light source inside the split */}
      <mesh ref={coreRef} material={coreMaterial}>
        <sphereGeometry args={[ORB_RADIUS * 0.5, 24, 16]} />
      </mesh>
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
