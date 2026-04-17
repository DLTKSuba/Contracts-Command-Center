---
name: design-patterns
description: Comprehensive design pattern management system for multi-product design teams. Use this skill when (1) creating a new pattern from an existing component, (2) documenting UI/UX patterns for consistency, (3) looking up existing patterns for a specific product (PPM, CP, etc.), (4) referencing patterns when building new components for harmony, (5) searching for reusable patterns across products. Triggers on keywords like "pattern", "component pattern", "document this component", "create pattern from", "what patterns exist for [product]", "wizard pattern", "navigation pattern", "floating nav", or any request to standardize or reference design system patterns.
---

# Design Patterns Skill

A pattern management system enabling design teams to create, document, and reference UI/UX patterns across multiple products.

## Integration with Harmony Design System

**When the project uses the Harmony design system:** Implement pattern structure (anatomy, when to use, flow) from this skill and its registry, but use **Harmony components** for the actual UI. Use the **harmony** and **harmony-component** skills for component API, props, tokens, and ShellLayout. Do not invent components—use Harmony Dialog, Button, ShellLayout, etc. as specified in Harmony docs. This skill provides the *pattern*; Harmony skills provide the *components and styling*.

## Core Capabilities

1. **Pattern Creation** - Generate pattern documentation from existing components
2. **Pattern Registry** - Maintain searchable pattern catalogs per product
3. **Pattern Reference** - Look up patterns for consistency when building new components
4. **Cross-Product Discovery** - Find patterns that could be reused across products

## Workflow Decision Tree

**Creating a new pattern?** → Run `scripts/create_pattern.py` or follow "Pattern Creation Workflow"
**Looking up existing patterns?** → See `reference/registry.md` or run `scripts/search_patterns.py`
**Building a new component?** → Check registry first, then follow existing pattern structure. If the project uses Harmony, also use harmony-component and harmony for the actual components.
**Documenting manually?** → Use template from `reference/PATTERN_TEMPLATE.md`

## Pattern Creation Workflow

### Quick Create (recommended)

Run from the project that contains the component. Pass the component name; the script searches for the file, detects category from path, and asks for product/theme only if you didn't pass it:

```bash
python scripts/create_pattern.py FloatingNav
python scripts/create_pattern.py FloatingNav --product CP
python scripts/create_pattern.py src/nav/FloatingNav.tsx --product CP
```

The script will:
1. Search the project for a file matching the name — **in this kit, prefer `.tsx`** under `src/components/harmony/`; in other repositories also `.jsx`, `.vue`, etc. — or use the path you gave
2. Detect category from folder path (e.g. `wizards/` → dialogs, `nav/` → navigation)
3. Ask for product/theme once if not provided (e.g. PPM, CP, VP, cross-product)
4. Analyze the component, generate the doc, and save to `reference/<name>.md` next to the script

Optional flags: `--product` (or `--theme`), `--category`, `--output`, `--author`, `--project-root`.

### Manual / agent-guided (when not using the script)

When creating a pattern without the script, gather this information:

**1. Pattern Identity**
- Pattern name (e.g., "Wizard Dialog", "Floating Navigation")
- Product context (PPM, CP, or "cross-product")
- Category (dialogs, navigation, forms, layouts, data-display, feedback)

**2. Source Analysis**
- Which component(s) implement this pattern?
- What problem does it solve?
- What are the key design decisions?

**3. Pattern Structure**
- Visual anatomy (diagram or description)
- Required vs optional elements
- Variants and when to use each

**4. Implementation Details**
- Component dependencies
- Props/configuration options
- Integration points (where it connects to app)

**5. Usage Guidelines**
- When to use this pattern
- When NOT to use this pattern
- Accessibility considerations

### Manual Create

Copy `reference/PATTERN_TEMPLATE.md` and fill in sections.

## Pattern Registry Structure

Patterns are organized by product, then category:

```
patterns/
├── ppm/                     # Project Portfolio Management
│   ├── _index.md            # PPM pattern catalog
│   ├── dialogs/
│   │   ├── wizard-dialog.md
│   │   └── confirmation-dialog.md
│   ├── navigation/
│   ├── forms/
│   └── layouts/
├── cp/                      # CP Theme
│   ├── _index.md
│   ├── navigation/
│   │   └── floating-nav.md
│   └── layouts/
├── cross-product/           # Shared patterns
│   ├── _index.md
│   └── ...
└── registry.md               # Master index of all patterns
```

## Searching Patterns

### By Product
```bash
python scripts/search_patterns.py --product "PPM"
```

### By Category
```bash
python scripts/search_patterns.py --category "navigation"
```

### By Keyword
```bash
python scripts/search_patterns.py --query "accordion wizard"
```

### Full-Text Search
```bash
python scripts/search_patterns.py --query "sidebar completion tracking" --full-text
```

## Pattern Documentation Standards

Every pattern document must include:

### Required Sections
1. **Header** - Name, product, category, status, last updated
2. **Problem Statement** - What problem this solves
3. **Solution** - How the pattern solves it
4. **Anatomy** - Visual breakdown of components
5. **Usage Guidelines** - When to use, when not to use
6. **Implementation** - Code references, integration points

### Optional Sections
- Variants
- Accessibility
- Related Patterns
- Version History

### Status Values
- `draft` - Under development
- `review` - Ready for team review
- `approved` - Accepted for use
- `deprecated` - Being phased out

## Integration with Cursor/AI Agents

Patterns are designed to be AI-readable for consistency when building new components.

**When building a new component:**
1. Agent searches registry for relevant patterns
2. Loads pattern documentation into context
3. Follows pattern structure and guidelines
4. If the project uses Harmony, use harmony-component and harmony for the actual UI components and tokens
5. References example implementations

**Example prompt for AI:**
```
I need to create a new wizard for PPM. 
Check the design-patterns registry for wizard patterns.
Follow the existing wizard-dialog pattern structure.
If we use Harmony, use Harmony Dialog and Button.
```

## Cross-Product Pattern Adoption

When a product-specific pattern may be useful elsewhere:

1. Document it in the originating product's patterns
2. Mark with `cross-product-candidate: true` in frontmatter
3. During design reviews, evaluate for promotion
4. If promoted, copy to `cross-product/` with attribution

## Resources

- **Designer quick start**: `reference/designer-quickstart.md`
- **Pattern Template**: `reference/PATTERN_TEMPLATE.md`
- **Registry**: `reference/registry.md`
- **Example pattern**: `reference/wizard-dialog.md`
- **Creation Script**: `scripts/create_pattern.py`
- **Search Script**: `scripts/search_patterns.py`

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Create pattern | `python scripts/create_pattern.py <ComponentName>` (optional: `--product CP`) |
| Create pattern (manual) | Copy `reference/PATTERN_TEMPLATE.md` |
| Search patterns | `python scripts/search_patterns.py --query "..."` |
| List all patterns | `python scripts/search_patterns.py --list` |
| View registry | Open `reference/registry.md` |
