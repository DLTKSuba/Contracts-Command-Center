# Harmony Design System — Source of Truth (Skills)

Use this document when resolving where to read Harmony components, layouts, and tokens in the **Harmony Designer Starter**. **Do not use `mcp-data/` or any MCP tools** (e.g. get_specs, build_component) for skill behavior.

## Resolve Harmony root

1. If `.cursor/harmony.json` exists (from **harmony-setup**), use its `harmonyRoot` value.
2. Else:
   - **Harmony repo**: workspace root (this starter).
   - **Consumer project**: `node_modules/@deltek/harmony-components` or another install path only if you added a published package; this zip primarily vendors CSS under `harmony-styles/` and components under `src/components/harmony/`.

All paths below are relative to the workspace root unless noted.

## Allowed sources only (this kit)

| Category | Path | Purpose |
|----------|------|---------|
| **Components** | `src/components/harmony/*.tsx`, co-located `*.css` | React implementations: props, structure, and scoped styles. |
| **Layouts / shell** | `src/components/harmony/ShellLayout.tsx` and related shell components | App shell: header, footer, sidebars, floating nav, page header, ShellPanel, main content. |
| **Global CSS** | `harmony-styles/` | Vendored Harmony global styles (tokens, layout, components) loaded via `@deltek/harmony-components/styles/*` alias. |
| **Icon data** | `harmony-data/icon-manifest.json` | Per-theme icon maps with inline **`svg`** for the `Icon` component. |
| **Icon files** | `icons/tabler/outline/`, `icons/custom/` | On-disk SVG library for browsing and design handoff (not required for every runtime path). |
| **Gallery / demos** | `src/pages/ComponentGalleryPage.tsx`, `src/pages/ComponentDemoPage.tsx`, `src/App.tsx` | In-app previews and routing. |
| **Handbook** | `HARMONY_DESIGNER_HANDBOOK.md` | Kit profile, workflows, skills index. |

## Theme, mode, variants, props

- **Theme** (product): `cp`, `vp`, `ppm`, `maconomy`. Applied via `html` class (e.g. `theme-cp`, `theme-vp`). Dark mode via `html.dark` or theme-specific patterns in the preview app.
- **Mode** (color): `light` | `dark` — follow token usage in `harmony-styles/` and app shell patterns.
- **Variants / props**: Read from each component's props interface in `src/components/harmony/*.tsx`. Use actual prop names, types, defaults, and allowed values (e.g. variant, size, buttonType)—not a generic list.

## Optional: published Harmony package

If **`docs/RULES.md`** exists inside an installed `@deltek/harmony-components` or `@deltek-sst/harmony-design-system` package, treat it as the authoritative usage-rules companion to this kit. It does not replace the file paths above for **source code** in this repo.

## Do not use

- `mcp-data/` (any directory or files under it).
- MCP tools or generated spec JSON for skill behavior.
