# Designer guide (Harmony designer starter)

Quick reference for Cursor slash commands and skills **included in this kit**. This project is a **self-contained React** preview: `ShellLayout` and Harmony components live under `src/components/harmony/`. There is **no** multi-framework conversion workflow from the full Harmony toolchain in this package.

Full narrative: **[HARMONY_DESIGNER_HANDBOOK.md](../HARMONY_DESIGNER_HANDBOOK.md)** · Agent context: **[AGENTS.md](../AGENTS.md)**

---

## layout-builder and build-layout

| Piece | What it is |
|-------|------------|
| **layout-builder** | Know-how for composing real screens: layout patterns (settings, dashboard, list/detail), nesting rules, spacing tokens, and which Harmony pieces live under `src/components/harmony/`. |
| **build-layout** | The workflow the agent runs when you use **`/build-layout`**: turn your description into a page under `src/pages/`, wired to the shell. It applies **layout-builder** (and **design-patterns** when a matching pattern exists). |

The React shell is **already** in this repo—you do not run `/convert-shell` here.

---

## Slash commands

Invoke these in Cursor chat to run a workflow.

| Command | What it does |
|--------|----------------|
| **/build-layout** | Compose a page layout inside the existing React `ShellLayout`. Describe the page (e.g. "settings page with form inputs and toggles"). Optional theme (e.g. VP dark) via `document.documentElement` classes. The agent uses components from `src/components/harmony/` and optional anatomy from **design-patterns** `reference/`. |
| **/build-all-patterns** | Build pattern demo pages from the registry with layout + fidelity verification checkpoints (see **build-all-patterns** skill). |
| **/create-pattern** | Create a new design pattern doc from a component. Uses `python3 .cursor/skills/design-patterns/scripts/create_pattern.py` (run from project root; see design-patterns skill). |
| **/search-patterns** | Search the design-patterns registry. Use `python3 .cursor/skills/design-patterns/scripts/search_patterns.py` with optional `--query`, `--product`, `--category`, or `--list` (defaults to `.cursor/skills/design-patterns/reference`). |
| **/harmony-critique** | Critique the current design or implementation against Harmony. Uses **harmony-usage-rules** and **harmony-ux-principles**. |
| **/ux-review** | Standalone UX review using **harmony-ux-principles** (works on any UI description or file). |

### Other Harmony actions (no slash command)

Ask in natural language (e.g. "audit this file for Harmony"). The **harmony** skill covers setup, component lookup, tokens, audit, normalize, accessibility, extract, and onboarding flows.

---

## Skills (what they do)

Skills are packaged instructions the agent can use. Some are **reference** (how Harmony works in this repo); others pair with a **slash command** so you can start a workflow by name.

| Skill | What it’s for | Slash command (if any) |
|-------|----------------|-------------------------|
| **harmony** | Where components, `ShellLayout`, tokens, and theme/mode live; how to find and use Harmony in this project. | — (ask in chat, e.g. “how do I set VP dark?”) |
| **harmony-usage-rules** | Check UI against Harmony usage and accessibility expectations; may read `RULES.md` from a Harmony npm install. | — |
| **harmony-ux-principles** | Critique usability, cognitive load, and flow—works with or without Harmony. | — |
| **design-patterns** | Pattern library, registry, and scripts to **create** or **search** pattern docs. | — |
| **layout-builder** | Rules for composing pages inside the shell (patterns, constraints, `src/components/harmony/`). | — |
| **build-layout** | End-to-end: from your description to a new page + route using the shell. | **`/build-layout`** |
| **build-all-patterns** | Build demo pages from the full pattern registry, with layout and fidelity checks. | **`/build-all-patterns`** |
| **create-pattern** | Generate a new pattern markdown file from an existing component. | **`/create-pattern`** |
| **search-patterns** | Search or list entries in the pattern registry. | **`/search-patterns`** |
| **harmony-critique** | Review a design or implementation against Harmony. | **`/harmony-critique`** |
| **ux-review** | UX-focused review (not limited to Harmony-only framing). | **`/ux-review`** |

**Not included:** harmony-converter (multi-framework conversion)—this kit is React-only.

---

## Typical workflows

Concrete prompts for each skill in this kit (natural language unless a slash command is listed):

| Skill | Example |
|-------|---------|
| **harmony** | “Where do `ShellLayout` and theme classes live, and how do I preview **theme-vp** with **dark** on `document.documentElement`?” |
| **harmony-usage-rules** | “Audit `src/pages/ComponentDemoPage.tsx` for Harmony usage and accessibility expectations.” |
| **harmony-ux-principles** | “Critique this screen for cognitive load, progressive disclosure, and whether the primary task is obvious.” |
| **design-patterns** | `python3 .cursor/skills/design-patterns/scripts/search_patterns.py --query wizard` (or `--list` to browse the registry). |
| **layout-builder** | “I need a list/detail page: table in a card, detail panel beside it—what’s the recommended composition using `ShellLayout` and `src/components/harmony/`?” |
| **build-layout** | **`/build-layout`** — “Settings page: profile fields, notification toggles, Save/Cancel in a card; optional VP dark.” |
| **build-all-patterns** | **`/build-all-patterns`** — “Dry-run first, then build the next batch of pattern pages and stop at verification checkpoints.” |
| **create-pattern** | **`/create-pattern`** — or run `python3 .cursor/skills/design-patterns/scripts/create_pattern.py FloatingNav` from the project root. |
| **search-patterns** | **`/search-patterns`** — or `python3 .cursor/skills/design-patterns/scripts/search_patterns.py --product PPM`. |
| **harmony-critique** | **`/harmony-critique`** — “Review `src/components/harmony/Card.tsx` (or the current file) against Harmony patterns.” |
| **ux-review** | **`/ux-review`** — “UX-only review of this flow; Harmony optional.” |

---

## Theme and mode

The app defaults to **`theme-ppm`** and light mode (see `src/App.tsx`). To preview another brand, change `DEFAULT_THEME` in `src/App.tsx` — the `THEME_SHELL_PROPS` map automatically sets the correct ShellLayout props (footer, floating nav, sidebar variant, product name, and logo) for that theme. To toggle dark mode, add or remove the `dark` class on `document.documentElement`.

### Per-theme shell behavior

Each theme requires different ShellLayout props. `THEME_SHELL_PROPS` in `src/App.tsx` encodes these. When building a layout page for a specific theme, use these same values on any ShellLayout instance you create:

| Theme | `showFooter` | `showFloatingNav` | `leftSidebarVariant` | `rightSidebarVariant` | `productName` | Logo |
|-------|-------------|-------------------|---------------------|-----------------------|--------------|------|
| `theme-cp` | `false` | `true` | `"cp"` | `"cp"` | `"CP"` | `CPVPLogo.svg` |
| `theme-vp` | `true` | `false` | `"vp"` | `"vp"` | `"VP"` | `CPVPLogo.svg` |
| `theme-ppm` | `true` | `false` | `"ppm"` | `"ppm"` | `"PPM"` | `PPMLogo.svg` |
| `theme-maconomy` | `true` | `false` | `"maconomy"` | `"maconomy"` | `"Maconomy"` | `MacLogo.svg` |

Key CP differences: CP has no footer (`showFooter={false}`) and uses a floating nav bar (`showFloatingNav={true}`) with Execute/Actions/Refresh/Save buttons above the header.
