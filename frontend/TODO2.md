# Particle Animation Fixes - Speed Stabilization on Mouse Stop

## Plan Steps (Approved by User)
1. [ ] Update CONFIG in ThreeAnimation.tsx: FORCE_STRENGTH=0.003, PARTICLE_FRICTION=0.985, RESET_DISTANCE=0.3
2. [ ] Add velocity clamping and min-distance force scaling in animate() loop of ThreeAnimation.tsx
3. [ ] Apply same changes to ParticleAnimation.tsx
4. [ ] Test: cd frontend && npm run dev, check mouse-stop behavior
5. [ ] [Complete]
