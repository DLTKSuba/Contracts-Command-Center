---
name: command-center-shell
description: Preserves the Costpoint Command Center shell layout, chrome, and menu interactivity (left-rail hover labels, Command Center flyout, Configure Settings second shell, inset wells, window controls, application tabs). Use when editing Command Center UI, HomeShell, LeftNavPanel, left/right rails, Configure Settings, or when the user asks to keep, restore, or match this layout.
disable-model-invocation: false
---

# Command Center shell

Canonical layout and interaction for the Command Center preview in this repo. **Do not regress** these behaviors when changing `HomeShell`, rails, or shells.

**Source of truth (code):** `src/App.tsx` (`HomeShell`), `src/index.css` (`.command-center-*`), `src/components/harmony/LeftNavPanel.tsx`, `LeftSidebar.tsx` / `LeftSidebar.css`, `RightSidebar.css`, `ShellLayout.tsx`.

Compose with existing Harmony pieces (`ShellLayout`, `Card`, `TabStrip`, `LeftSidebar`, `LeftNavPanel`). Do not rebuild the shell.

## Screen modes

| Mode | When | Main card |
|------|------|-----------|
| Dashboard | Initial load (`blankCommandCenter === false`) | No panel header. Tab strip + Refresh. Expiration dashboard / detail tabs. |
| Command Center | User activates the **Command Center** rail item | Panel header **Configure Settings** + window controls. Inset well with **Enable Dela AI assistance** checkbox. No View dropdown. No tab strip. |
| Configure Settings | User selects **Configure Settings** in the flyout | Second card below the first. Header **Role Based Settings** + window controls. Same inset well, with Costpoint application tabs inside. |

Leaving Command Center (click the rail item again) restores the dashboard and closes the settings shell.

## Chrome (presentation)

- Theme: `theme-cp`. `ShellLayout` class `command-center-shell`. Page title **Command Center**. `pageHeaderShowDefaultButtons={false}`.
- Primary elevated `Card` class `command-center-home`. White panel headers (`background-color: #ffffff`), not table-header grey. Title left, `PanelWindowControls` right (`minus`, `window-plain`, `x-mark` via `card__icon-btn`). Controls are presentational.
- Inset well: `.command-center-shell-body` > `.command-center-shell-inner`. **No fixed height** — the well wraps its content, and the shell wraps the well (`flex: 0 0 auto` on body). Never leave empty space below the last field. Border `1px solid var(--border-color)`, `var(--radius-lg)`, white fill.
- The settings well keeps `overflow: visible` so an open `Dropdown` menu is not clipped.
- Well sits tight under the title bar: `.command-center-home .card__body:has(> .command-center-shell-body) { padding: var(--space-2); }` — do not use the default `var(--space-4)` top gap on these shells.
- Top Configure Settings well contains a functional, unchecked-by-default **Enable Dela AI assistance** Harmony `Checkbox`.
- Settings shell: extra class `command-center-settings-shell`, `margin-top: var(--space-5)`. Header right includes a design `Dropdown` before window controls: **Design 1** (default) and **Design 2**.
- Design 1 uses tabs inside the well: **Project Analyst**, **Accounting**, **Billing**, **Proposals**. Active tab: Harmony underline, `var(--theme-primary)`.
- Design 2 replaces the tabs with a horizontal, icon-based, non-linear `Stepper` using the same four roles. Every step is directly clickable; Project Analyst is initially selected.
- Design 2 chrome (scoped under `.command-center-settings-wizard`; never edit shared `Step`/`Stepper` styles):
  - Current step: primary fill + `0 0 0 var(--space-1-5) var(--theme-primary-border)` halo; role icon stays.
  - Completed steps (any role before the current one): omit the icon so Harmony can render the checkmark; indicator is `var(--color-success)` with a `var(--color-success-border)` halo. Upcoming steps stay grey with their role icon.
  - Current and completed labels are `var(--text-primary)` semibold; upcoming labels are `var(--text-secondary)`.
  - Connectors always stay `var(--border-color)` (never painted as travelled).
- Selected tab body (`.command-center-settings-panel`): **Organization Level** `Dropdown` with `labelVariant="inline"` (label left, control right). Gap between label and value is `var(--space-5)` (20px). Placeholder `-select-`, options Level 1–4. Trigger width is `var(--dropdown-min-width)` (do not stretch full-well). Value is kept per tab.
- Left rail: two floating section cards (workspace 4 icons, modules including Command Center). Keep cards; never flatten them for this flyout.
- Right rail: top-aligned to the refresh button (dashboard) or header actions (Command Center). `--cc-right-rail-top` measured in `HomeShell`. Hover: `--cc-nav-hover-bg: #A6C9EC` on inactive rail and flyout items. Active item keeps solid `--theme-primary`.

## Menu interactivity

### Left rail hover

Collapsed rail shows icons only. Hover expands and reveals labels (Harmony `.left-sidebar:hover .left-sidebar__label`). Command Center label is **Command Center** (`squares-2x2`). Inactive hover fill is `#A6C9EC`, not grey.

### Command Center click

`LeftSidebar` `onItemActivate` → `ShellLayout` `onLeftSidebarItemActivate` → only handle `item.label === 'Command Center'`.

Toggle:

1. `blankCommandCenter` and `navPanelOpen` become `true` together (enter Command Center + open flyout).
2. Second click sets both `false`, `settingsShellOpen` `false`, settings tab back to Project Analyst.
3. While Command Center is on, that rail item is `active` (solid blue clicked state). Dashboard mode keeps **Accounting** as the default active module.

### Flyout (`LeftNavPanel`)

- Starts **closed** on page load. Render only when `navPanelOpen`.
- Title **Command Center**. Default item **Configure Settings**.
- Mount sets `data-rail-locked="true"` on `.shell-layout__left-sidebar`. **Never** use `data-panel-open` here — that rule strips section card background/border/shadow.
- While locked: hover width stays collapsed (`52px`; compact token under 1024px); labels stay hidden so they do not overflow under the flyout.
- Close flyout on: outside pointer (not rail, not panel), Escape, or Configure Settings click. Closing the flyout does **not** by itself leave Command Center mode.

### Configure Settings click

`onItemSelect`: `navPanelOpen = false`, reset settings tab to Project Analyst, `settingsShellOpen = true`. Flyout disappears. Second shell appears below the first.

## Do not

- Restore View dropdown or dashboard tab strip on the Command Center screen.
- Grey header bars on either shell.
- Grey hover on rails / flyout (`#A6C9EC` only).
- Nested `Card` in `Card`.
- Arbitrary spacing; use `var(--space-N)` (exception: the `--cc-nav-hover-bg` hex already in `index.css`).
- Fixed heights on the wells; they size to content.
- Flatten left-rail section cards when the flyout is open.

## Files to edit

| Concern | File |
|---------|------|
| State, handlers, shells, tabs | `src/App.tsx` |
| Shell / well / header / right-rail offset | `src/index.css` |
| Flyout + `data-rail-locked` | `src/components/harmony/LeftNavPanel.tsx` (+ `.css`) |
| Rail activate + hover / lock | `src/components/harmony/LeftSidebar.tsx` (+ `.css`) |
| Right-rail hover | `src/components/harmony/RightSidebar.css` |
| Prop pass-through | `src/components/harmony/ShellLayout.tsx` |
