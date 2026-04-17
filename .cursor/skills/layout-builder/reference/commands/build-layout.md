# /build-layout

Compose a page layout inside the **Harmony React shell** for this project using components from `src/components/harmony/`. This starter already includes `ShellLayout` and the bundled Harmony component set—**no conversion step**.

## Instructions

1. **Parse the request.** The user provides:
   - A layout description (e.g. "settings page with form inputs and toggles")
   - Optional: theme/mode notes (e.g. "PPM light")—apply via `document.documentElement` classes if they ask (`theme-ppm`, `theme-cp`, etc., and `.dark` for dark mode)
   - Optional: `--dry-run` (output the composition plan without writing files)

2. **Check prerequisites.**
   - **Shell:** `src/components/harmony/ShellLayout.tsx` must exist (it ships with this kit).
   - **Components:** Resolve each Harmony UI piece from `src/components/harmony/<Name>.tsx` (and co-located CSS). All library components are already present—do not tell the user to run any `/convert-*` command.

3. **Match to a layout pattern.**
   - Read the layout-builder skill's Layout Patterns section.
   - Find the closest match to the user's description.
   - If no pattern matches, compose from the description directly using the composition constraints from the skill.
   - If the user's description is ambiguous, ask ONE clarifying question (e.g. "Single card or multi-card layout?").

4. **Check for a documented pattern in design-patterns.**
   - Search the design-patterns registry (`.cursor/skills/design-patterns/reference/registry.md` and related `.md` files) for a matching pattern (e.g. "wizard" → `wizard-dialog.md`).
   - If found, use its anatomy (and Component Tree if present) as the structural reference.
   - If not found, use the layout-builder skill's reference pattern.

5. **Resolve components.**
   - For each component in the layout, use **React** imports from `@/components/harmony/<ComponentName>` (path alias `@` → `src`).
   - Component file names match the exported component (e.g. `Button.tsx` → `Button`).

6. **Dry-run (if `--dry-run`).**  
   Output:
   - Layout pattern used (or "custom from description")
   - Components needed and their import paths under `src/components/harmony/`
   - Composition structure (indented tree):
     ```
     ShellLayout
       └── content slot
           ├── ShellPageHeader (title: "Settings")
           ├── Card (primary, elevated)
           │   ├── Label + Input (name)
           │   ├── Label + Toggle (notifications)
           │   └── Label + Toggle (dark mode)
           └── div.button-bar
               ├── Button (outline) "Cancel"
               └── Button (primary) "Save"
     ```
   - Do not write any files. Stop here.

7. **Compose the layout.**
   - Create a new page under `src/pages/` (e.g. `SettingsPage.tsx`) or extend an existing page pattern used in this app.
   - Import components from `@/components/harmony/...`.
   - Compose with **React + JSX** per the pattern anatomy and composition constraints (nesting, spacing, grid) from the layout-builder skill.
   - Apply Harmony spacing tokens and classes only. Do not use arbitrary px values or non-token spacing.

8. **Wire into the app.**
   - Add a `<Route>` in `src/App.tsx` (or the app's router entry) for the new page.
   - Prefer a path like `/settings` under the existing `HashRouter`.
   - Do not modify `ShellLayout.tsx` unless the user explicitly asks for a shell change.

9. **Verify.**
   - Delegate to the **layout-verifier** agent (layout-only checks):
     - All components from the pattern anatomy are present in the output.
     - Nesting follows composition constraints (no Card-in-Card, etc.).
     - Spacing uses Harmony tokens only.
     - No components are imported but unused.
     - No arbitrary/non-token styles.
   - Run `npm run build` to confirm TypeScript and Vite build succeed (do not start a long-running dev server).
   - If deviations found, fix and re-verify. Loop cap: 3 rounds.

10. **Report.**
    - Page file created: [path]
    - Components used: [list]
    - Pattern used: [name or "custom"]
    - Wiring: [route added]
    - Verification: [pass / STUCK with deviation list]

## Important

- **React only** in this starter. Do not reference upstream framework source trees or `/convert-component`, `/convert-shell`, or `/convert-all`.
- All spacing and layout must use Harmony design tokens.
- The layout-builder skill is the guide for patterns and constraints. The design-patterns `reference/` docs are the optional source for documented pattern anatomy.
