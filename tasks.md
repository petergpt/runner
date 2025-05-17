# Development Tasks for Token Trek

Below is a high-level breakdown of the work needed to deliver the Token Trek game described in the project README.

1. **Project Baseline** ✅ *Complete*
   - Ensure `pnpm install` sets up all dependencies.
   - Enable TypeScript strict mode and configure ESLint + Prettier.
   - Verify the base Vite + React + TypeScript scaffold builds and lints.

2. **Initial 3D Scene** ✅ *Complete*
   - Set up a basic `three` / `@react-three/fiber` scene.
   - Add a camera and minimal lighting.
   - Create a placeholder player model.

3. **Procedural Track Generation** ✅ *Complete*
   - Implement a `trackChunkGenerator` that creates a 3‑lane endless track.
   - Write unit tests for the generator.

4. **Player Movement** ✅ *Complete*
   - Implement A/D (or ←/→) lane switching.
   - Add jumping with the space bar.
   - Clamp the context window with `contextWindowClamp()` and test it.

5. **Obstacles** ✅ *Complete*
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

12. **Validation & CI** ✅ *Complete*
    - Ensure `pnpm build`, `pnpm lint`, and `pnpm test` all pass.
    - Add any necessary GitHub Actions or scripts for automated checks.

## Suggested Parallelization Groups

Tasks marked **✅ Complete** are finished. The remaining work can be assigned in
the groups below. Within each group, tasks should merge sequentially to avoid
conflicts, but different groups may proceed in parallel once their dependencies
are met.

**Completed Setup**
  - 1. Project Baseline ✅
  - 12. Validation & CI ✅
  *The repository and CI pipeline are ready for feature development.*

**Group 1 – Scene Foundation**
  - 2. Initial 3D Scene
  - 3. Procedural Track Generation
  *Implement the basic scene first, then add track generation. Subsequent groups
  depend on this foundation.*

**Group 2 – Player Controls**
  - 4. Player Movement
  *Requires the scene and track. Once merged, Groups 3 and 5 can run in parallel.*

**Group 3 – Obstacles and Scoring**
  - 5. Obstacles ✅
  - 6. Collectibles and Scoring
  - 7. Health and Collisions
  *These features share game state. Work on them sequentially or with close
  coordination after Group 2.*

**Group 4 – Advanced Mechanics**
  - 8. LLM‑Flavored Mechanics
  *Starts after Group 3. Can be developed alongside Group 6.*

**Group 5 – Visual Polish**
  - 10. Visual Polish
  *Mostly affects shaders and post‑processing. Can begin once the basic scene is
  in place (after Group 1).*

**Group 6 – UI and Endgame**
  - 9. HUD and UI
  - 11. Game Over & Win State
  *Depends on scoring and health from Group 3. Can proceed in parallel with
  Group 4 and merge once both are complete.*

Tasks from different groups can be assigned to separate agents to minimize pull
request conflicts.

