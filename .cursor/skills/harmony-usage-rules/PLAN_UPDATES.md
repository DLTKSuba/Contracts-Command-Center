# Plan updates — resilient parsing + HEADING_PATTERNS + command wiring

Apply these when executing the harmony-usage-rules plan. **Plan ID:** `harmony_usage_rules_skill_f9b0478c`.

---

## 1. Extract script: resilient parsing strategy

**Principle:** Match by **class substring** and **text content** (case-insensitive). Do not rely on exact classes; h3 classes vary.

### Config (top of script)

```javascript
// ============================================================
// HEADING PATTERNS - Validated across multiple components, Feb 2025
// ============================================================

// CONSISTENT PATTERNS (match class contains)
const H2_SELECTOR = 'section__title';           // <h2 class="section__title"> or section__title mt-8
const A11Y_SELECTOR = 'a11y-card__title';      // <h3> inside Accessibility section only (Icons doc page reuses elsewhere)
const GUIDELINE_SELECTOR = 'guideline-card__header';  // Do/Don't inside .guideline-card--do / --dont

// Include these h2 sections (case-insensitive match on extracted text)
const TARGET_SECTIONS = [
  'usage guidelines',
  'usage',
  'accessibility',
  'layout',
  'implementation notes',
  'best practices',
  'behavior'
];

// Skip these h2 sections
const SKIP_SECTIONS = [
  'examples',
  'props',
  'input props',
  'textarea props'
];
// Also skip h2s that look like example titles (e.g. "Basic Table", "Striped Table", "Icon Selection Guide")
```

### Parsing logic

1. **Find h2 sections:** Match class attribute **contains** `section__title`. Extract text content; normalize (lowercase, trim). If text in TARGET_SECTIONS → process. If in SKIP_SECTIONS or looks like example title → skip.

2. **Within Usage / Usage Guidelines:** Capture ALL content until next h2. Look for `guideline-card__header` for Do/Don't blocks. Capture any h3 as subsections; do not match h3 by exact class (classes vary: mb-2, mb-3, mb-4, text-lg, etc.).

3. **Within Accessibility:** Look for `a11y-card__title` on h3. Capture until next h3 or end of section. **Only** extract when parent h2 is "Accessibility" (Icons doc page reuses a11y-card__title elsewhere).

4. **Edge cases:** Pages with no Usage or Accessibility (e.g. Button groups, Scrollbar, Specialty inputs doc pages) → skip gracefully. Custom h2 like "Layout" (dialogs) → include if in TARGET_SECTIONS. Tables doc page: multiple example h2s → skip if not in TARGET_SECTIONS. Inputs doc page: "Input Props" / "Textarea Props" → skip.

5. **Component name:** Derive from the doc page slug or title (e.g. "Buttons", "Specialty Inputs"). Use to group rules in output and note source per rule.

### Output

Group by section type; note component (or shell page) for each rule. Write to `__dirname/../reference/RULES.md`.

---

## 2. HEADING_PATTERNS.md — full content

Create `scripts/HEADING_PATTERNS.md` with this content:

```markdown
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

- **Icons doc page** reuses a11y-card__title for non-a11y content → only extract when parent h2 is "Accessibility".
- **Tables doc page** has multiple example h2s → skip if not in TARGET_SECTIONS.
- **Inputs doc page** — "Input Props" / "Textarea Props" → skip (variant of Props).
```

---

## 3. Command files — revised wiring

| Command | Inline rules? | Reference RULES.md? |
|---------|----------------|----------------------|
| **harmony-audit** | No | Yes — "Use the harmony-usage-rules skill for rule checks." |
| **harmony-critique** | No | Yes — same line. |
| **harmony-accessibility** | Yes — Critical Violations only | Yes — for comprehensive checks. |

### harmony-audit.md and harmony-critique.md

- Add at the top only: **"Use the harmony-usage-rules skill for rule checks."**
- No inline duplication. Claude reads RULES.md when needed.

### harmony-accessibility.md

Add this section **after the description, before "Resolve Harmony root"**:

```markdown
## Critical Violations (Catch Immediately)

These are blocking issues. Flag them without needing to read external files.

### Color-only information
- Status/state conveyed only by color = WCAG 1.4.1 violation
- Fix: Add icon + text (e.g., ✓ "Success" not just green)

### Missing form labels
- Input without `<label>` or `aria-label` = violation
- Placeholder text alone is not a label

### Touch targets too small
- Interactive elements < 44×44px = violation
- Use padding to increase hit area if needed

### Missing focus visibility
- Interactive elements without `:focus-visible` style = violation
- Use Harmony focus tokens (`--focus-ring-primary`)

### Keyboard inaccessible
- Custom interactive elements not focusable via Tab = violation
- Add `tabindex="0"` + keyboard event handlers

### Images missing alt
- Informative images need descriptive `alt`
- Decorative images need `alt=""`

For comprehensive accessibility rules, also use the `harmony-usage-rules` skill.
```

Then keep the existing "Resolve Harmony root" and following steps for deeper checks.
