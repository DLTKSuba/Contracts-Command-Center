---
name: build-all-patterns
description: "Build all pattern pages: one page per pattern, independent shell per pattern, layout and fidelity verification, checkpoints every 5."
disable-model-invocation: true
---

# /build-all-patterns

Build all pattern pages: one page per pattern, each an independent shell instance with that single pattern fully implemented. Content patterns render in the content slot; shell-modifying patterns (drawers, toasts, panels, toolbars) configure the relevant shell regions. Runs dual verification (layout + fidelity) on each. Checkpoints every 5 for user review.

## Instructions

1. **User input.** The user provides:
   - A **target framework** (e.g. React, Vue, Svelte, Angular).
   - Optional: `--dry-run` — list all patterns that would be built, the components each needs, and the output file structure. Do not build anything. Stop after that output.
   - Optional: `--category [name]` — build only patterns in that category (e.g. `--category forms`). Useful for doing one category at a time.
   - Optional: `--start-from [slug]` — resume from a specific pattern (skip all patterns before it in the list). Useful after a previous run was interrupted.

2. **Read the pattern registry.**
   - Run `python .cursor/skills/design-patterns/scripts/search_patterns.py --list` to get all patterns (defaults to that skill’s `reference/`).
   - Build a list of { slug, name, category, markdown path } for every pattern. Slug comes from the markdown filename without `.md`.
   - If `--category` is provided, filter to only that category.
   - Total expected: ~45 patterns (or subset if filtered).

3. **Check what's already built.**
   - For each pattern, check whether the page component already exists in the output directory (e.g. `src/patterns/EmptyState.tsx` for React, `src/patterns/EmptyState.vue` for Vue).
   - If the file exists AND its route is in the slug→component map, mark as SKIP.
   - If ALL patterns are already built, report "All pattern pages already built for [framework]" and stop.

4. **Check prerequisites.**
   - The shell must be available for the target framework. In **Harmony Designer Starter (React)**, check `src/components/harmony/ShellLayout.tsx`. If not: "Shell not found. This kit expects ShellLayout under `src/components/harmony/`. For other stacks, add ShellLayout per your team’s process, then retry."
   - The routing must be set up (react-router-dom, vue-router, etc.) with the index page. If not: "Routing not set up. Install router and create index page first, then rerun."
   - The index page and slug→component map must exist. If not, create them as part of step 6.
   - There is NO shared PatternPage wrapper. Each pattern component imports the existing ShellLayout and renders its own instance. See step 7b for details.

5. **Dry-run (if `--dry-run`).**
   Output:
   - Total patterns found: [N]
   - Already built (SKIP): [list]
   - Patterns to build: [list with slug, name, category]
   - For each pattern to build: components needed from Component Tree, required elements from Key Elements
   - Output file structure: list of files that will be created
   - Do not build anything. Stop here.

6. **Set up routing and index (if not already present).**
   - If no router is installed, install it (`react-router-dom`, `vue-router`, etc.).
   - If no index page exists, create it: a page listing all patterns as links grouped by category. Each link goes to `/patterns/{slug}`.
   - If no slug→component map exists, create it with entries for all patterns (imports will be added as each pattern is built).
   - Each route points directly to the pattern component. There is NO shared PatternPage wrapper — each pattern component renders its own ShellLayout instance with the shell configured for that pattern's needs.
   - If these already exist, do not modify them (except to add new pattern entries to the map as patterns are built).

7. **Build each pattern page (one at a time, in order).**
   For each pattern (ordered by category, then alphabetical within category):

   **a. Pre-flight (before writing any code for this pattern):**
   Print:
   1. Pattern name and slug.
   2. Pattern markdown path being read.
   3. Components listed in the Component Tree.
   4. Required elements from Key Elements table (with descriptions).
   5. Named items that must appear (e.g. "7 view options: Board, Table, List, Calendar, Schedule, Gantt, Network graph").
   6. What the output file will contain (brief).

   If you cannot fill these in, read the pattern markdown first. No implementation code until this pre-flight is output.

   **b. Build the page component:**
   - Read the pattern markdown: Anatomy, Component Tree, Key Elements, Usage Guidelines, Implementation section, AI Agent Checklist.
   - Create the page component file (e.g. `src/patterns/ActionsRelatedContentPanel.tsx`).
   - **Each pattern component imports the existing ShellLayout and renders its own instance.** The shell is already in the repo — do not replace it or duplicate a second app shell. Each pattern page imports ShellLayout and renders it with the props and slots configured for what that pattern needs:
     - **Content patterns** (settings form, CRUD table, empty state, card grid, etc.): ShellLayout with the pattern content in the content slot, pageHeaderTitle set to the pattern name.
     - **Shell-modifying patterns** (toast notification, detail drawer, notification center, contextual toolbar, app switcher, bottom tab navigation, help panel, accessibility panel, etc.): ShellLayout with the relevant shell region configured — right panel open with panel content, footer modified, header dropdown configured, overlay/toast rendered, sidebar extended, etc.
     - The pattern's Anatomy diagram tells you which shell regions are involved. If the Anatomy shows a right-side panel alongside main content, the ShellLayout must have its right panel prop/slot configured with that panel content. If the Anatomy shows an overlay, the component must render the overlay on top of the shell.
   - Use every component listed in the Component Tree. Use every named item and label from the Component Tree and Key Elements. Reflect the structure from the Anatomy.
   - Use existing Harmony components under `src/components/harmony/` where available. If a component is missing from that folder, note it in the pre-flight and implement using the closest available component or HTML elements styled with Harmony tokens. Do NOT skip the pattern or leave that section empty.
   - Use realistic demo data that matches the pattern's domain (e.g. project names for a project filter, task names for a task table). Do NOT use "Lorem ipsum", "Item 1", or generic placeholders.
   - Wire behaviors: dismissible chips must have onRemove handlers, dialogs must open/close, filters must affect displayed data, tabs must switch content. State can be local (useState/ref/signal) — no backend needed.

   **c. Add to routing:**
   - Add the import and entry to the slug→component map.
   - Verify the route resolves. Each route points directly to the pattern component (no shared wrapper).

   **d. VERIFICATION GATE — required output before pattern N is complete:**

   A pattern is NOT complete until you have produced the following output block for that pattern. You may not create the next pattern file, add the next route, or start the next pre-flight until this output exists for the current pattern. If you have not output this block, you have not finished this pattern.

   **Required output for pattern N (copy this format exactly):**

   ```
   === VERIFICATION: [Pattern Name] ([slug]) ===

   LAYOUT VERIFIER:
   [Run layout-verifier agent on the built page component. Paste the full deviation list here, or "PASS: zero deviations." if none.]

   Round 2 (if needed): [deviation list after fixes]
   Round 3 (if needed): [deviation list after fixes]
   Layout result: [PASS | STUCK (N deviations)]

   FIDELITY VERIFIER:
   [Run pattern-fidelity-verifier agent on the pattern markdown + built page component. Paste the full deviation list here, or "PASS: zero deviations." if none.]

   Round 2 (if needed): [deviation list after fixes]
   Round 3 (if needed): [deviation list after fixes]
   Fidelity result: [PASS | STUCK (N deviations)]

   PATTERN STATUS: [PASS | STUCK (layout) | STUCK (fidelity) | STUCK (both)]
   === END VERIFICATION: [Pattern Name] ===
   ```

   **How to produce this output:**
   - Invoke the layout-verifier agent with the built page component file. Paste its output into the LAYOUT VERIFIER section. If it returns deviations, fix them in the built file and re-invoke (max 3 rounds). Paste each round's output.
   - Invoke the pattern-fidelity-verifier agent with the pattern markdown AND the built page component file. Paste its output into the FIDELITY VERIFIER section. If it returns deviations, fix them and re-invoke (max 3 rounds). Paste each round's output.
   - If you cannot invoke either agent, perform their checks yourself: read the agent definition, apply every check to the built file, and write the deviation list (or PASS) in the output block. "I can't invoke the agent" is not a reason to skip — perform the checks and write the results.

   **The verification output block is the proof that verification happened.** Without it, the pattern is not done. Do not proceed.

   **e. Log result (derived from the verification output above):**
   - PASS: both sections say "PASS: zero deviations."
   - STUCK (layout): layout section has remaining deviations after 3 rounds.
   - STUCK (fidelity): fidelity section has remaining deviations after 3 rounds.
   - STUCK (both): both sections have remaining deviations.
   - ERROR: build failed before verification could run.
   - If no verification output block exists for this pattern: the pattern is INCOMPLETE and must be reprocessed.

   **g. Checkpoint (every 5 patterns):**
   After every 5 completed patterns, stop and output a summary table:

   | # | Pattern | Category | Layout Verifier | Fidelity Verifier | Status |
   |---|---------|----------|-----------------|-------------------|--------|
   | 1 | Actions / Related Content Panel | navigation | PASS | PASS | PASS |
   | 2 | Bottom Tab Navigation | navigation | PASS | STUCK (2) | STUCK |
   | 3 | Floating Navigation | navigation | PASS | PASS | PASS |
   | 4 | Expanded Menu with Filters | navigation | STUCK (1) | PASS | STUCK |
   | 5 | Breadcrumb Trail | navigation | PASS | PASS | PASS |

   Wait for the user to say "continue" before proceeding to the next 5.
   The user may also say:
   - "Rework [pattern name]" — rebuild that pattern from scratch and re-verify.
   - "Skip [pattern name]" — mark it as SKIPPED and move on.
   - "Stop" — end the run and output the final report with what's been completed so far.

8. **After all patterns are built:**
   - Update the index page to include links to all completed pattern pages, grouped by category.
   - Verify the index page renders (no broken imports, all links resolve).

9. **Final report.**

   | # | Pattern | Category | Layout | Fidelity | Status |
   |---|---------|----------|--------|----------|--------|
   | 1 | Actions / Related Content Panel | navigation | PASS | PASS | ✅ PASS |
   | 2 | ... | ... | ... | ... | ... |
   | ... | ... | ... | ... | ... | ... |
   | 45 | Accessibility Panel | forms | PASS | PASS | ✅ PASS |

   Summary:
   - Total patterns: [N]
   - Built (PASS): [N]
   - STUCK (needs review): [N] — [list with deviation summaries]
   - SKIPPED (already existed): [N]
   - SKIPPED (user skipped): [N]
   - ERRORS: [N] — [list]

## Important

- **VERIFICATION IS A HARD GATE.** You cannot start the next pattern until you have produced the verification output block for the current pattern. The block must contain the actual output from both verifiers (or manual checks). No block = pattern is incomplete. This is not a suggestion — it is a structural dependency. Pattern N+1 cannot begin until pattern N has a completed verification output block.
- **If you cannot invoke the verifier agents, perform their checks yourself.** Read the layout-verifier agent definition and check every rule against the built file. Read the pattern-fidelity-verifier agent definition, extract every requirement from the pattern markdown, and check each one against the built file. Write the results into the verification output block. "I can't invoke the verifier" is not a reason to skip — it means you do the checks yourself and write the results.
- **`npm run build` success is not verification.** Code that compiles is not code that matches the pattern spec. Only the verifier output (agent or manual) counts.
- This command builds pattern pages from pattern markdown specs. It uses the Component Tree, Key Elements, Anatomy, and AI Agent Checklist as the source of truth for what each pattern page must contain.
- The pre-flight step is mandatory before each pattern. It forces the builder to acknowledge what the pattern requires before writing code. This prevents simplification.
- Do not simplify, stub, or placeholder any pattern. If the pattern markdown says 7 view options, the built page has 7 view options. If it says 3 Dropdowns labeled Period, Project, Category, the built page has 3 Dropdowns with those labels. The fidelity verifier will catch any deviation.
- Checkpoint every 5 patterns. Do not build more than 5 without stopping for user confirmation.
- If a needed component is not in `src/components/harmony/`, do NOT skip the pattern. Implement the UI with the closest available component or native HTML elements using Harmony tokens. The goal is to see the pattern rendered, not to have perfect component coverage.
- All spacing and layout must use Harmony design tokens. No arbitrary values.
- The pattern markdowns are the source of truth. They are framework-agnostic. The target framework only affects how the page component is written (JSX, Vue template, Angular template, Svelte markup), not what it contains.
- Do not modify existing shell or shared Harmony components unless the user asked for a shell change. If a pattern needs something the shell doesn't provide, note it in the report.
- If a pattern markdown is too vague to implement (e.g. no Component Tree, no Key Elements), log it as ERROR with "Pattern markdown insufficient — no Component Tree or Key Elements to implement against" and move to the next pattern.