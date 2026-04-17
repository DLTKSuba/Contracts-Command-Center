# Designer Quick Start Guide

A practical guide for designers to create and use patterns.

## Your Two Main Tasks

### 1. Creating a Pattern from an Existing Component

**When**: A developer built a new component and you need to document it as a reusable pattern.

**Simple method (recommended):** Run from your project root with just the component name. The script finds the file, detects category from the folder path, and only asks for product/theme if you don't pass it:

```bash
python scripts/create_pattern.py FloatingNav
```

If you already know the theme/product, pass it so the script doesn't ask:

```bash
python scripts/create_pattern.py FloatingNav --product CP
```

You can also pass a path instead of a name:

```bash
python scripts/create_pattern.py src/components/nav/FloatingNav.tsx --product CP
```

**What happens:** The script searches for matching source files — **in this kit, `.tsx` first** (e.g. under `src/components/harmony/`); other repos may also use `.jsx`, `.vue`, etc. It infers category from path (e.g. `nav/` → navigation, `wizards/` → dialogs), then asks once for product/theme (PPM, CP, VP, cross-product) if you didn't use `--product`. The pattern is saved to `reference/<name>.md` next to the script.

### 2. Finding an Existing Pattern to Reference

**When**: You're designing something new and want to check if a pattern exists.

```bash
# See everything
python scripts/search_patterns.py --list

# For a specific product
python scripts/search_patterns.py --product "PPM"

# For a specific category
python scripts/search_patterns.py --category "dialogs"

# Search by keyword
python scripts/search_patterns.py --query "wizard accordion"
```

## Pattern Categories

| Category | Use For |
|----------|---------|
| `dialogs` | Modals, wizards, confirmation dialogs |
| `navigation` | Menus, tabs, breadcrumbs, floating nav |
| `forms` | Input groups, form layouts, validation patterns |
| `layouts` | Page structures, grid systems, card layouts |
| `data-display` | Tables, lists, charts, stats displays |
| `feedback` | Alerts, toasts, progress indicators, loading states |

## After Creating a Pattern

1. **Review the generated file** - Fill in the TODO sections
2. **Add screenshots** - If helpful, add to `assets/images/`
3. **Update status** - Change from `draft` to `review` when ready
4. **Get approval** - Team reviews, then change to `approved`

## Pattern Status Workflow

```
draft → review → approved → (deprecated)
```

- **draft**: Your initial documentation
- **review**: Ready for team feedback
- **approved**: Ready for production use
- **deprecated**: Being phased out

## Folder Structure

```
patterns/
├── ppm/                    # PPM product patterns
│   ├── dialogs/
│   │   └── wizard-dialog.md
│   └── forms/
├── cp/                     # CP product patterns
│   └── navigation/
│       └── floating-nav.md
└── cross-product/          # Shared across products
```

## Quick Commands Cheat Sheet

| Task | Command |
|------|---------|
| Create pattern (by name) | `python scripts/create_pattern.py FloatingNav` |
| Create pattern (with theme) | `python scripts/create_pattern.py FloatingNav --product CP` |
| List all patterns | `python scripts/search_patterns.py --list` |
| Search by product | `python scripts/search_patterns.py --product "PPM"` |
| Search by keyword | `python scripts/search_patterns.py --query "sidebar"` |
| Get summary stats | `python scripts/search_patterns.py --summary` |

## Example: Document a New Wizard

A developer just built `UpdateTotalsWizard.tsx`. From the project root:

```bash
python scripts/create_pattern.py UpdateTotalsWizard --product PPM
```

The script finds the file (e.g. in `src/components/wizards/`), detects category `dialogs` from the path, uses PPM, then generates the doc and saves it to `reference/update-totals-wizard.md` (next to the script). If you omit `--product`, it will ask once for the product/theme.

Then you:
1. Open the generated file
2. Fill in the TODO sections
3. Change status to `review`
4. Share with team for feedback

## Tips

- **Start with the example**: Look at `reference/wizard-dialog.md` in this skill for a complete pattern
- **Use the template**: `reference/PATTERN_TEMPLATE.md` has all sections
- **Be specific**: The more detail you add, the more useful for AI agents and other designers
- **Cross-product candidates**: Mark patterns that might be useful for other products
- **Harmony projects**: When the app uses Harmony, implement with Harmony components (Dialog, Button, etc.); use the harmony-component skill for API details

## Need Help?

- Check existing patterns for examples
- Run `python scripts/search_patterns.py --summary` for overview
- Open `reference/registry.md` for the full pattern list
