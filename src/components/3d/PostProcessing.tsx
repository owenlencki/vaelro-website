import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";

/** Soft warm glow over the constellation. Desktop only. */
export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.3}
        intensity={0.75}
        radius={0.8}
        mipmapBlur
      />
      <ToneMapping />
    </EffectComposer>
  );
}
