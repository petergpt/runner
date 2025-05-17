````markdown
# **Token Trek — An AI-Themed 3-D Endless Runner**

Pilot a glowing **context-window** through an infinite torrent of tokens, dodging
prompt-injection traps, rate-limit gates, and other LLM hazards while
collecting “useful” tokens to keep your model coherent.

---

## High-level goals**

1. **Scaffold** a Vite + React + TypeScript project in `/token-trek`  
   & install the deps listed below.  
2. **Core gameplay**  
   - 3-lane endless track, generated procedurally one *track-chunk* at a time.  
   - Controls ― **A / D (or ← / →)** to strafe lanes; **Space** to jump.  
   - Obstacles  
     - **Prompt-Injection Cubes** (red, spin)  
     - **Rate-Limit Gates** (vertical bars that close)  
     - **Sequence‐Length Walls** (appear after ~30 s, force jump)  
   - Collectible **Useful Tokens** (cyan) extend score multiplier.  
   - Collision reduces **context integrity** (health bar); 0 = game over.
   - Win to reach an AGI  
3. **LLM flavor**  
   - HUD shows `token_count / 8192` and *tokens per second*.  
   - Every 15 s a **“Summarization Checkpoint”** shrinks health bar,
     simulating context truncation.  
   - Power-ups  
     - **System Prompt** — clears all red cubes for 3 s.  
     - **RAG Portal** — teleports to bonus lane full of tokens.  
4. **Visual polish**  
   - Neon data-lattice floor (grid shader).  
   - Bloom / glitch post-processing pass ok via drei’s `EffectComposer`.  
   - 60 FPS target on laptop iGPU.  
5. **Validation** (`pnpm build`, `pnpm lint`, `pnpm test` must pass)  
   - Unit tests for `trackChunkGenerator` & `contextWindowClamp()`.

> **✱**  Tight types (`"strict":true`).  Stubbing shaders or assets is fine—the
> end goal is a playable, clearly AI-themed prototype that builds
> successfully.

---

## Tech stack

| Purpose     | Package(s)                                    |
|-------------|-----------------------------------------------|
| 3-D / scene | **three**, **@react-three/fiber**, **@react-three/drei** |
| Gameplay    | Zustand for state, nanoid for ids             |
| UI / HUD    | React + CSS Modules (or Tailwind—dev’s call)  |
| Tooling     | pnpm, Vitest, ESLint + Prettier, stats.js     |

> The Codex base image already ships **Node 20** and **pnpm**.

---

## Local commands

```bash
pnpm install        # run once (setup.sh will call this)
pnpm dev            # Vite dev server with HMR
pnpm build          # production build   (must succeed)
pnpm test           # unit tests         (vitest)
pnpm lint           # code style

## Tech stack

Note that if you need some game assets that can be added by the user, e.g. images or music, please specify this, leave placeholders and instruct the user.
---
````

---
```

The game is **done** when:

* `pnpm dev` launches a playable runner at `localhost:5173`,
* token & health HUD update in real time,
* obstacles spawn and collisions work,
* build, lint, and tests all pass.

```
```
