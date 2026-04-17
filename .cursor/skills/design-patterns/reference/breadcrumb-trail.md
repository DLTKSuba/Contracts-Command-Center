---
name: Breadcrumb Trail
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Breadcrumb Trail

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need to see where they are in a hierarchy (e.g. Project > Phase > Task) and navigate back to parent levels without using the browser back button.

## Solution

A horizontal trail of Link components (and optional Icon separators): each segment is a link to that level, with the current page as text only (no link). Example: Home > Projects > Alpha > Phase 1.

## Anatomy

```
  Home > Projects > Project Alpha > Phase 1
  ^^^^   ^^^^^^^   ^^^^^^^^^^^^^   ^^^^^^^
  link   link      link             current (no link)
```

### Component Tree

```
Breadcrumb container
├── Link (segment 1)
├── Icon (separator, optional)
├── Link (segment 2)
├── ...
├── Icon (separator)
└── Span or text (current page, not link)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Links | Yes | One per ancestor level; href to that level |
| Current level | Yes | Last segment; not a link |
| Separator | No | Icon or character between segments |

## Usage Guidelines

### When to Use

- Hierarchical content (folder > document; project > phase > task)
- When users need to move up the hierarchy
- Below header or above main content

### When NOT to Use

- Flat structure → No breadcrumb
- Single level → Use page title only
- Primary nav is sufficient → Breadcrumb optional

## Implementation

### Component Dependencies

```typescript
import { Link } from '@/components/ui/link';
import { Icon } from '@/components/ui/icon';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Link, Icon when Harmony root is available.*

| Area | Notes |
|------|--------|
| Segments | Array of { label, href? }; last item no href. |
| Separator | Icon or text between items; aria-hidden for decorative. |

## Accessibility

- [ ] nav with aria-label="Breadcrumb"; current page with aria-current="page".
- [ ] Links focusable; separator not focusable.

## Related Patterns

- **Tree Menu** — Sidebar hierarchy; breadcrumb is linear path.
- **ShellPageHeader** — Breadcrumb often placed near page header.

## Design Decisions

**Decision**: Link per ancestor; current as text. **Rationale**: Standard breadcrumb behavior. **Alternatives**: Dropdown for long paths.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Render segments as Links except current; optional separator Icon.
- [ ] Bind segments from route or hierarchy data.
- [ ] Update registry if adding new instance.
