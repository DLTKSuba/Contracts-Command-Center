---
name: harmony
description: Hub and source-of-truth for the Harmony design system. Explains when to use Harmony, where to find components and layouts (including ShellLayout), docs and previews, theme/mode (theme-* and .dark), Harmony root resolution, allowed sources, and lists all Harmony slash commands. Use when the user mentions Harmony design system, Harmony components, or asks how to use Harmony in Cursor.
disable-model-invocation: false
---

# Harmony Design System (hub)

When the user is working with or asking about the **Harmony design system**, use this skill to orient them.

**First:** Use the **harmony-usage-rules** skill for design rules (accessibility, component usage, layout). Use the **harmony-ux-principles** skill for cognitive load analysis, progressive disclosure guidance, and general usability principles.

## This project: Harmony designer starter (React)

Use these paths when answering questions in **this** repository (self-contained preview):

| Area | Location |
|------|----------|
| **React components** | `src/components/harmony/<Name>.tsx` (and co-located `<Name>.css`). **ShellLayout:** `src/components/harmony/ShellLayout.tsx`. |
| **Global Harmony CSS** | `harmony-styles/` (resolved via Vite alias `@deltek/harmony-components/styles/*`; see `vite.config.ts` and `src/main.tsx`). |
| **Icon manifest** | `harmony-data/icon-manifest.json` (alias `@harmony-data`). Per-theme maps with inline **`svg`** strings used by `Icon`. |
| **Icon SVG library (on disk)** | `icons/` — Tabler outline + custom SVGs for browsing and reference without npm icon packs. |
| **Preview / gallery** | `src/pages/ComponentGalleryPage.tsx`, `src/pages/ComponentDemoPage.tsx`, routes in `src/App.tsx`. |
| **Slash commands** | Listed in [`.cursor/DESIGNER_GUIDE.md`](../DESIGNER_GUIDE.md) (e.g. `/build-layout`, `/harmony-critique`, `/ux-review`). Generic `/harmony-*` names below are conceptual unless a matching command file exists. |

### When a Harmony npm package is installed

If you install a published Harmony package (for example `@deltek/harmony-components` or `@deltek-sst/harmony-design-system`), read **`docs/RULES.md`** inside that package for official usage rules. This starter does not mirror an upstream documentation site file tree—use the paths in the table above for code in this repo.

## Slash commands

Point the user to these when they want a specific action:

| Command | Use when |
|--------|----------|
| `/harmony-setup` | First-time or new project: discover and save Harmony root (and optional theme/mode). |
| `/harmony-component` | Look up a component or layout (props, variants, usage). |
| `/harmony-tokens` | Look up colors, spacing, typography, elevation and theme/mode usage. |
| `/harmony-audit` | Audit current file for Harmony compliance (components, props, variants, tokens). |
| `/harmony-normalize` | Suggest or apply edits to use Harmony components and tokens. |
| `/harmony-accessibility` | Check a11y (semantics, ARIA, contrast, touch targets) vs Harmony patterns. |
| `/harmony-critique` | Critique design/implementation against Harmony patterns. |
| `/harmony-extract` | Find repeated or ad-hoc UI that could use Harmony components or ShellLayout. |
| `/harmony-onboard` | Design onboarding, empty states, or first-time UX with Harmony components. |

Commands live in this package's **commands/** folder.

---

# Source of truth

This section defines where to read Harmony components, layouts, and tokens in **this** kit. All Harmony commands should use these rules.

## Resolve Harmony root

1. If `.cursor/harmony.json` exists (from **harmony-setup**), use its `harmonyRoot` value.
2. Else: **Harmony repo** = workspace root (this starter); **Consumer project** = wherever Harmony components are vendored or installed.

All paths below are relative to the workspace root of this starter unless noted.

## Allowed sources only (this repo)

- **Components:** `src/components/harmony/*.tsx` and co-located `*.css`
- **Layouts:** `src/components/harmony/ShellLayout.tsx` and shell subcomponents in the same folder
- **Global styles:** `harmony-styles/` (tokens, reset, layout, components, utilities as chained in `global.css`)
- **Data:** `harmony-data/` (e.g. `icon-manifest.json`)
- **Icons on disk:** `icons/` (browsing and assets; runtime resolution uses manifest **`svg`** + `Icon` fallbacks)
- **Demo routes:** `src/pages/*.tsx`, `src/App.tsx`

## Theme, mode, variants, props

- **Theme:** `cp`, `vp`, `ppm`, `maconomy`. Applied via `html` classes (e.g. `theme-cp`, `theme-vp`, `dark`). See `HARMONY_DESIGNER_HANDBOOK.md` and `src/App.tsx`.
- **Mode:** `light` | `dark` — typically `html.dark` for dark mode.
- **Variants / props:** From each component's TypeScript props in `src/components/harmony/*.tsx` and patterns in the handbook. Use actual prop names, types, defaults, and allowed values.

## Do not use

- `mcp-data/` (any directory or files under it)
- MCP tools or generated spec JSON for skill behavior

## Reference docs

- **Full source-of-truth rules:** [reference/SOURCES.md](reference/SOURCES.md)
- **Component and layout list:** [reference/COMPONENT_LIST.md](reference/COMPONENT_LIST.md)
