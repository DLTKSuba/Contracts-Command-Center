---
name: Floating Navigation
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Floating Navigation

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

On long pages, users need quick access to section anchors or actions without scrolling back to the top. A sticky floating nav keeps key links or actions visible.

## Solution

A FloatingNav component (with Icon for each item) that stays visible (sticky) as the user scrolls. It typically lists section links or key actions; can be vertical or horizontal bar.

## Anatomy

```
                    ┌─────┐
                    │ 🎯  │  Section 1
                    │ 📋  │  Section 2
  (page content)    │ 📊  │  Section 3
                    │ ⬆   │  Back to top
                    └─────┘
```

### Component Tree

```
FloatingNav (sticky)
├── Icon + Link or Button (per item)
└── ...
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| FloatingNav | Yes | Sticky container; position (e.g. right) |
| Items | Yes | Icon + link or button per section/action |
| Icons | Yes | Visual cue per item |

## Usage Guidelines

### When to Use

- Long pages with named sections (e.g. docs, long forms)
- "Back to top" or "Jump to section"
- When primary nav scrolls away and secondary nav is needed

### When NOT to Use

- Short pages → No need
- Primary nav already sticky → Redundant
- Too many items → Consider dropdown or collapse

## Implementation

### Component Dependencies

```typescript
import { FloatingNav } from '@/components/ui/floating-nav';
import { Icon } from '@/components/ui/icon';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony FloatingNav, Icon when Harmony root is available.*

| Area | Notes |
|------|--------|
| FloatingNav | items[{ icon, label, href or onClick }]; position. |
| Sticky | CSS position sticky or fixed; ensure no overlap with content. |

## Accessibility

- [ ] Links/buttons focusable; labels for screen reader.
- [ ] Visible focus style.

## Related Patterns

- **Contextual Toolbar** — Right-side toolbar; different purpose (actions).
- **Breadcrumb Trail** — Hierarchy; not floating.

## Design Decisions

**Decision**: Sticky floating nav with icons. **Rationale**: Harmony FloatingNav; keeps nav visible on scroll. **Alternatives**: Inline "Jump to" links; collapsible TOC.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] FloatingNav with items (Icon + link/button).
- [ ] Sticky positioning; avoid overlapping main content.
- [ ] Update registry if adding new instance.
