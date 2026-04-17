# Harmony Designer Starter — agent context

This repository is the **Harmony Designer Starter (React)**: a Vite app with bundled Harmony components under `src/components/harmony/`, vendored CSS (`harmony-styles/`), a full **downloaded icon SVG tree** at **`icons/`** (Tabler outline + custom; no npm icon library required to browse assets), and Cursor configuration under `.cursor/`.

## First steps for the human

1. `npm install` then `npm run dev` (port **5175** by default).
2. Read **[HARMONY_DESIGNER_HANDBOOK.md](HARMONY_DESIGNER_HANDBOOK.md)** for the full kit: skills, rules, agents, slash commands, and project layout.
3. Slash commands and a short skills index: **[.cursor/DESIGNER_GUIDE.md](.cursor/DESIGNER_GUIDE.md)**.

## Scope (do not assume)

- **React only** — Compose with `.tsx` under `src/components/harmony/`. There is **no** `harmony-converter` and no `/convert-shell` or `/convert-component` in this bundle.
- **`layout-builder`** is the domain skill (patterns, constraints). **`build-layout`** is the **`/build-layout`** playbook skill; they work together.

## Where things live

| Area | Path |
|------|------|
| Handbook | `HARMONY_DESIGNER_HANDBOOK.md` |
| Cursor skills | `.cursor/skills/` |
| Rules | `.cursor/rules/` |
| Verifier agents | `.cursor/agents/` |
| Kit version | `KIT_VERSION`, `CHANGELOG.md` |
