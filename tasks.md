# Development Tasks for Token Trek

Below is a high-level breakdown of the work needed to deliver the Token Trek game described in the project README.

1. **Project Baseline**
   - Ensure `pnpm install` sets up all dependencies.
   - Enable TypeScript strict mode and configure ESLint + Prettier.
   - Verify the base Vite + React + TypeScript scaffold builds and lints.

2. **Initial 3D Scene**
   - Set up a basic `three` / `@react-three/fiber` scene.
   - Add a camera and minimal lighting.
   - Create a placeholder player model.

3. **Procedural Track Generation**
   - Implement a `trackChunkGenerator` that creates a 3‑lane endless track.
   - Write unit tests for the generator.

4. **Player Movement**
   - Implement A/D (or ←/→) lane switching.
   - Add jumping with the space bar.
   - Clamp the context window with `contextWindowClamp()` and test it.

5. **Obstacles**
   - Prompt‑Injection Cubes that spin and damage the player.
   - Rate‑Limit Gates that close across a lane.
   - Sequence‑Length Walls appearing after ~30 s that require jumping.

6. **Collectibles and Scoring**
   - Useful Token pickups that extend a score multiplier.
   - Display token count and tokens‑per‑second.

7. **Health and Collisions**
   - Implement context‑integrity (health) reduction on collisions.
   - End the run when health reaches zero.

8. **LLM‑Flavored Mechanics**
   - Summarization Checkpoint every 15 s that shrinks the health bar.
   - Power‑ups:
     - System Prompt – clear red cubes for 3 s.
     - RAG Portal – teleport to a bonus token lane.

9. **HUD and UI**
   - Real‑time HUD showing health, token count, and tokens‑per‑second.
   - Use CSS Modules or Tailwind for styling.

10. **Visual Polish**
    - Neon data‑lattice floor/grid shader.
    - Bloom or glitch post‑processing with `EffectComposer`.
    - Maintain 60 FPS on typical laptop GPUs.

11. **Game Over & Win State**
    - Trigger win condition upon reaching an AGI milestone.
    - Show game over screen when the player loses all health.

12. **Validation & CI**
    - Ensure `pnpm build`, `pnpm lint`, and `pnpm test` all pass.
    - Add any necessary GitHub Actions or scripts for automated checks.

