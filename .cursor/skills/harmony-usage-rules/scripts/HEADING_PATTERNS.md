# Heading Patterns for Harmony Doc Extraction

Validated across multiple component pages, Feb 2025.

## What's Consistent

| Pattern | Selector | Notes |
|---------|----------|-------|
| Main sections | `<h2>` with class containing `section__title` | May also have `mt-8` |
| A11y subsections | `<h3 class="a11y-card__title">` | Only valid inside Accessibility h2 |
| Do/Don't | `<h3 class="guideline-card__header">` | Inside `.guideline-card--do` or `--dont` |

## What Varies

### H2 section names

| Section Name | Found In | Include? |
|--------------|----------|----------|
| Examples | Most pages | No |
| Props | Most pages | No |
| Input Props, Textarea Props | Inputs doc page | No |
| Usage Guidelines | buttons, inputs, checkboxes, tables | Yes |
| Usage | stepper, icons | Yes |
| Accessibility | Most pages | Yes |
| Layout | dialogs | Yes |
| Icon Selection Guide | icons | No (example content) |
| Basic Table, Striped Table, etc. | tables | No (example titles) |

### H3 subsection classes (inside Usage)

Classes vary by component (e.g. text-lg font-semibold text-primary mb-2/mb-3/mb-4). Do not match h3 by class; capture all h3 content.

### Pages with minimal content

**Button groups**, **Scrollbar**, and **Specialty inputs** doc pages → Examples and/or Props only; no rules output (expected).

## Edge Cases

- **Icons doc page** reuses `a11y-card__title` for non-a11y content → only extract when parent h2 is "Accessibility".
- **Tables doc page** has multiple example h2s → skip if not in TARGET_SECTIONS.
- **Inputs doc page** — "Input Props" / "Textarea Props" → skip (variant of Props).
