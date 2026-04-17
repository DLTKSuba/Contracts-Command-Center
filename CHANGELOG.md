# Changelog

All notable changes to the Harmony Designer Starter kit (handbook, `.cursor/` bundle, preview app) are documented here. Version matches `KIT_VERSION` at the repository root.

## 1.0.3 — 2026-03-23

- **Designer guide:** **Typical workflows** now includes one example prompt per shipped skill (table). Handbook **Skills reference** links to `#typical-workflows` in the guide (single source of truth for those examples).

## 1.0.2 — 2026-03-23

- **React-only narrative:** Neutralized leftover upstream-framework references in source comments, handbook, designer guide, **AGENTS.md**, and skills (harmony hub, layout-builder, build-layout, build-all-patterns, design-patterns, harmony-usage-rules helpers). Kept explicit notice that `harmony-converter` and multi-framework conversion playbooks are **not** in this zip, without naming unrelated frameworks.
- **Icon manifest:** Removed legacy `path` fields from `harmony-data/icon-manifest.json`; aligned `src/vite-env.d.ts` types. Documented that runtime uses manifest **`svg`** plus `Icon` fallbacks and that **`icons/`** is the on-disk library.
- **harmony-usage-rules:** Added `scripts/README.md` clarifying extraction helpers target full Harmony documentation sources, not this starter tree.

## 1.0.1 — 2026-03-23

- Bundled **`icons/`** at the kit root: downloaded **Tabler outline** SVG set plus **custom** SVGs, so the zip includes a full on-disk icon library without requiring npm icon packages. Documented in the handbook and `icons/README.md`.

## 1.0.0 — 2026-03-23

- Shipped **HARMONY_DESIGNER_HANDBOOK.md** at kit root: React-only profile; skills, rules, and agents tables match files under `.cursor/` only; removed conversion/harmony-verifier documentation that did not apply to this zip.
- Added **AGENTS.md**, **KIT_VERSION**, and this **CHANGELOG**.
- Added in-repo **scripts/package-designer-kit.sh** to zip the kit (excludes `node_modules`, `dist`, `.git`).
- Updated **README** and **[.cursor/DESIGNER_GUIDE.md](.cursor/DESIGNER_GUIDE.md)** with cross-links; expanded slash and skills coverage (including `/build-all-patterns`).
- Updated **`build-layout`** skill playbook for React-only paths (`src/components/harmony/`) and **layout-verifier** (no harmony-verifier reference).
