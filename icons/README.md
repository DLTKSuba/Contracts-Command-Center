# Vendored icon SVGs

This folder ships **with the Harmony Designer Starter** so you can browse, search, or reference icons **without** installing npm packages such as `@tabler/icons` or `@heroicons/react`.

## Contents

| Path | Description |
|------|-------------|
| **`tabler/outline/`** | Tabler Icons (outline), one `.svg` per icon name. |
| **`custom/`** | Project-specific SVGs (e.g. Dela, shell assets). |

## How the app uses icons

The React **`Icon`** component (`src/components/harmony/Icon.tsx`) resolves icon names using the **`svg`** strings in **`harmony-data/icon-manifest.json`** (per theme) plus built-in fallbacks. The **`icons/`** tree is the on-disk library for browsing, search, and tooling; it is **not** required for every icon at runtime via manifest paths.

## Zip / distribution

The **`icons/`** directory is included when you package the kit (e.g. `./scripts/package-designer-kit.sh`). It adds size to the archive but removes the need to pull icon libraries from a registry for offline work.
