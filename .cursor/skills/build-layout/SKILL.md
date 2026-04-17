---
name: build-layout
description: "Compose a page layout inside the React Harmony shell using components under src/components/harmony/."
disable-model-invocation: true
---

# /build-layout

Compose a page layout inside the **Harmony Designer Starter** React shell. The shell and components are **already** in this repo (`src/components/harmony/*.tsx`). This playbook does **not** convert components from other frameworks or run `/convert-shell`.

## Instructions

1. **Parse the request.** The user provides:
   - A layout description (e.g. "settings page with form inputs and toggles")
   - Optional: shell/theme context (e.g. "VP dark") — apply via `document.documentElement` classes (`theme-vp`, `dark`, etc.) per **`HARMONY_DESIGNER_HANDBOOK.md`** and `src/App.tsx` patterns. When a theme is specified, also look up the **per-theme shell behavior table** in the layout-builder skill and wire the matching `showFooter`, `showFloatingNav`, `leftSidebarVariant`, `rightSidebarVariant`, `productName`, and `logoSrc` props on any ShellLayout instance in the page. Do NOT pass PPM props when the target theme is CP, VP, or Maconomy.
   - **Framework:** always **React** (`.tsx`) in this kit
   - Optional: `--dry-run` (output the composition plan without writing files)

2. **Check prerequisites.**
   - Confirm `src/components/harmony/ShellLayout.tsx` exists (this kit always includes it).
   - If a **specific** Harmony component is missing from `src/components/harmony/`, tell the user which file is missing; do not run a converter—this bundle has no `/convert-component` playbook.

3. **Match to a layout pattern.**
   - Read the layout-builder skill's Layout Patterns section.
   - Find the closest match to the user's description.
   - If no pattern matches, compose from the description directly using the composition constraints from the skill.
   - If the user's description is ambiguous, ask ONE clarifying question (e.g. "Single card or multi-card layout?").

4. **Check for a documented pattern in design-patterns.**
   - Search the design-patterns registry for a matching pattern (e.g. "settings page" might match a documented pattern).
   - If found, use its anatomy (and Component Tree if present) as the structural reference.
   - If not found, use the layout-builder skill's reference pattern.

5. **Resolve components.**
   - For each component in the layout, resolve `src/components/harmony/<Name>.tsx` (and `.css` if present). See **`HARMONY_DESIGNER_HANDBOOK.md`**, *Component paths in this kit*.
   - If a component does not exist in that folder, tell the user it is not in this starter; do not invent stubs.
   - Do NOT convert components as part of this command.

6. **Dry-run (if `--dry-run`).**
   Output:
   - Layout pattern used (or "custom from description")
   - Components needed and their resolved paths
   - Missing components (not present under `src/components/harmony/`)
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
   - Create a new page under `src/pages/` (e.g. `SettingsPage.tsx`) using JSX.
   - Import from `../components/harmony/...` as appropriate.
   - Compose per pattern anatomy and **layout-builder** composition constraints (nesting, spacing, grid).
   - Apply Harmony spacing tokens and classes only. Do not use arbitrary px values or non-token spacing.

8. **Wire into shell.**
   - If the shell uses a router, add a route for the new page.
   - If the shell uses a static content slot, replace the placeholder content with the new layout (or add alongside existing content).
   - Do not modify shell components unless necessary for the route. If wiring requires a shell change, report it to the user.
   - If the user specified a theme, update `DEFAULT_THEME` in `src/App.tsx` to that theme value (e.g. `'theme-cp'`) and confirm `THEME_SHELL_PROPS` in `src/App.tsx` covers it so the shell uses the correct footer/floating-nav/sidebar behavior.

9. **Verify.**
   - Delegate to the **layout-verifier** agent:
     - All components from the pattern anatomy are present in the output.
     - Nesting follows composition constraints (no Card-in-Card, etc.).
     - Spacing uses Harmony tokens only.
     - No components are imported but unused.
     - No arbitrary/non-token styles.
   - If deviations found, fix and re-verify. Loop cap: 3 rounds. If after 3 rounds deviations remain, stop and report: `STUCK: [N] deviations remain after 3 fix rounds. Manual review needed.` (Include the deviation list.)

10. **Report.**
    - Page file created: [path]
    - Components used: [list]
    - Pattern used: [name or "custom"]
    - Wiring: [route added / slot content replaced / manual wiring needed]
    - Verification: [pass / STUCK with deviation list]

## Important

- This command composes layouts from components under **`src/components/harmony/`**. It never runs multi-framework conversion from upstream sources. If a needed `.tsx` is missing, say so; this bundle does not ship `/convert-*` playbooks.
- All spacing and layout must use Harmony design tokens. No arbitrary values.
- The layout-builder skill is the guide for patterns and constraints. The design-patterns registry is the optional source for documented pattern anatomy.
- If the user includes `--dry-run`, output the full composition plan but do not write any files or invoke the verifier.
