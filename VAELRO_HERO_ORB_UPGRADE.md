# Hero Upgrade: Interactive Planetary Orb Carousel

## Instructions

Do not spawn subagents. Work sequentially. Self-verify that the hero renders and all interactions work before finishing.

Replace the current `ParticleNetwork.tsx` component (and any related 3D files) with a new interactive orb carousel system. The Canvas wrapper in `Hero.tsx` stays. The rest of the site (all other pages, sections, scroll animations, routing) is NOT touched. This is a hero-only change.

## What to build

The hero background becomes an interactive planetary system: 4 glowing orbs representing Vaelro's services float among the existing particle constellation. The particles and grid connection lines stay and connect to/orbit around the orbs. One orb is active (large, centered). Clicking cycles which orb is active. Clicking the active orb splits it open to reveal a service description. Everything auto-cycles.

## Technical approach

All 3D rendering uses the existing `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing` stack already installed. The UI overlay (service description text, nav dots, arrows) uses Framer Motion + HTML positioned over the Canvas.

## The orb system

### 4 service orbs

```typescript
const services = [
  { id: 'websites', name: 'Websites', title: 'Custom websites', desc: 'Sites that load fast, convert visitors, and cost almost nothing to host. You own everything.', color: '#D4743B' },
  { id: 'automation', name: 'Automation', title: 'Workflow automation', desc: 'Follow-ups, scheduling, data entry, document processing. Your team stops doing the same work twice.', color: '#C49050' },
  { id: 'ai-systems', name: 'AI Systems', title: 'AI-powered tools', desc: 'Custom tools for your operations. Email generators, data parsers, document analysis. Built to run without ongoing AI costs.', color: '#A07050' },
  { id: 'strategy', name: 'Strategy', title: 'AI strategy', desc: 'A clear roadmap for where technology fits in your business. Audit, implementation plan, ROI analysis.', color: '#908070' },
];
```

### Orb 3D mesh

Each orb is a `<group>` containing:
- Two hemisphere meshes (top half + bottom half of a sphere) that can animate apart for the split-open effect
- Use `SphereGeometry` with `phiStart`/`phiLength` to create the two halves, or use `@react-three/drei` helpers
- Material: `MeshStandardMaterial` with emissive set to the service color, slight metallic (0.3), roughness (0.5)
- Subtle inner glow: a slightly larger transparent sphere behind each orb with the service color at low opacity

### Orbital arrangement

- Active orb: centered, larger (scale ~1.5)
- Inactive orbs: positioned around the active one at different distances and angles, smaller (scale ~0.6-0.8)
- When active changes: all orbs animate to their new positions using `useSpring` from `@react-spring/three` or lerp in `useFrame`
- The transition should feel smooth and planetary, like orbits shifting
- Subtle continuous rotation on each orb's Y axis (~0.003 rad/frame)

### Split-open mechanic (the signature interaction)

When the active orb is clicked:
1. The two hemisphere meshes separate vertically (top moves up, bottom moves down) with a spring animation
2. The gap between them glows (an emissive plane or point light in the gap, service color, fading in)
3. The orb scales up slightly during the split (~1.1x)
4. The HTML overlay description fades in (positioned over the canvas, centered on the orb's screen position)

When closing (another orb clicked or same orb clicked again):
1. Description fades out
2. Hemispheres spring back together
3. Glow fades
4. Scale returns to normal

Use `useSpring` for the hemisphere separation — spring config: `{ tension: 120, friction: 14 }` for a satisfying snap.

### Particle field (keep and enhance)

The existing particle constellation stays. Enhance it:
- Particles should be subtly attracted toward the orbs (gravitational pull effect)
- Particles near an orb drift toward it slowly
- Connection lines (the grid lines) draw between nearby particles AND between particles and the nearest orb
- When an orb splits open, nearby particles scatter outward briefly, then drift back
- Particle count: 200 desktop, 80 mobile
- Connection line opacity: very subtle (0.04-0.08)

### Carousel behavior

- Auto-cycle: every 5 seconds, advance to the next orb and open it
- Auto-cycle pauses when user interacts, resumes after 8 seconds of inactivity
- Progress indicator: a subtle ring around the active orb that fills over the 5-second cycle (use a `<Ring>` geometry from drei or a custom shader)

### Camera

- Perspective camera, fov 60, z: 6
- No OrbitControls
- Subtle camera drift following mouse position (lerp 0.1-0.2 units toward cursor for parallax depth)
- On mobile: disable camera drift

## HTML overlay (on top of the Canvas)

This is NOT inside the R3F scene. It's HTML positioned over the Canvas using CSS.

### Service description (shown when active orb is open)

Use Framer Motion `AnimatePresence` for enter/exit:
- Title: Fraunces serif, ~18px, white
- Description: Sora, ~13px, white at 60% opacity, 2-3 lines
- "Learn more" link: IBM Plex Mono, ~11px, accent orange, scrolls to the services section on the home page
- Position: centered below the orb's screen position (use `useThree` to project 3D position to screen coords, or just center it in the lower portion of the hero)

### Navigation

- Dot indicators below the orb area (4 dots, active one is accent orange, filled)
- Left/right arrow buttons on the sides (subtle, appear on hover on desktop)
- On mobile: support swipe left/right to cycle (use touch event listeners or a swipe hook)

### Labels

Each orb has a label below it (the service name). Use HTML positioned based on the orb's projected screen position. Active orb label is slightly larger and brighter. Inactive labels are smaller and more muted.

## Mobile handling

- Reduce particle count to 80
- Disable postprocessing bloom
- Disable mouse-follow camera drift
- Orbs still cycle and split, but the split distance is smaller
- Swipe to cycle instead of arrows
- Labels and descriptions scale down appropriately

## Performance

- The Canvas must NOT block LCP. Hero text (HTML) renders before the Canvas hydrates.
- `<Suspense>` with dark background fallback
- DPR capped at [1, 1.5]
- Target 60fps on iPhone 12
- Only animate `transform` properties in the HTML overlay

## Reduced motion

If `prefers-reduced-motion` is set:
- Orbs are static (no rotation, no drift)
- No particle animation
- Split-open is replaced with a simple opacity fade of the description
- Auto-cycle still works but transitions are instant cuts, not animated

## Postprocessing

Keep the existing bloom setup:
- `<Bloom>` luminanceThreshold ~0.4, intensity ~0.5, radius ~0.8
- This gives the orbs and bright particles their warm glow
- Disable on mobile

## What NOT to change

- The hero headline, subheadline, CTAs, and eyebrow text stay exactly as they are
- The Navbar stays exactly as it is
- All other sections on all pages stay exactly as they are
- No changes to routing, fonts, colors, or any other component
- This is ONLY a hero 3D scene replacement

## File changes

- Delete or replace: `src/components/3d/ParticleNetwork.tsx`
- Create: `src/components/3d/OrbCarousel.tsx` (the main 3D scene)
- Create: `src/components/3d/Orb.tsx` (individual orb with split mechanic)
- Create: `src/components/3d/ParticleField.tsx` (the particle system, extracted)
- Update: `src/components/sections/Hero.tsx` (swap ParticleNetwork for OrbCarousel, add the HTML overlay for descriptions/nav)
- Update: any imports that referenced the old ParticleNetwork

## Success criteria

1. Four orbs floating in a particle field with connection lines
2. One orb is active and visually prominent
3. Clicking cycles between orbs with smooth spring transitions
4. Clicking the active orb splits it open and reveals the description
5. Auto-cycles every 5 seconds with a visible progress indicator
6. Particle grid lines connect to the orbs
7. Bloom postprocessing gives warm glow
8. Works on mobile (simplified)
9. 60fps
10. The rest of the site is completely untouched
